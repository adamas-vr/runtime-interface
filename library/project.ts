/**
 * APIs for creating and launching projects.
 *
 * @module project
 */
import { ProjectBundle, ProjectMetadata, Version } from "./asset";
import { LoadProject, SceneGraph } from "./project-loader";
import { RpcClient } from "./rpc";
import { User } from "./user";
import { quat } from "gl-matrix";
import { generateId, isVersion, RAD2DEG } from "./utilities/rpc-utils";
import packageJson from "../package.json";

/** Adamas Runtime API Version */
export const API_VERSION = packageJson.version as Version;

/**
 * Represents a project.
 */
export class Project {
	private static projectId: string;

	private readonly bundle?: ProjectBundle;
	private readonly metadata: ProjectMetadata;

	private constructor(metadata: ProjectMetadata, bundle?: ProjectBundle) {
		this.metadata = metadata;
		this.bundle = bundle;
	}

	/**
	 * Gets the current project ID assigned by the runtime.
	 *
	 * This ID corresponds to the project identifier assigned after the project is
	 * uploaded to the cloud. If the project has not been uploaded, the runtime
	 * generates a local identifier instead.
	 *
	 * @returns The current project ID.
	 * @throws If the project ID has not been initialized by the runtime.
	 */
	static GetProjectId(): string {
		if (!Project.projectId) {
			throw new Error("Project has not been initialized.");
		}

		return Project.projectId;
	}

	/**
	 * Creates a project from a project bundle.
	 *
	 * @param bundle - The project bundle.
	 * @returns The created {@link Project}.
	 */
	static FromBundle(bundle: ProjectBundle): Project {
		return new Project(bundle.project.metadata, bundle);
	}

	/**
	 * Creates a new project from project metadata. This is intended for projects distributed outside the platform.
	 *
	 * @param metadata - The project metadata, excluding the project identifier, which is generated at runtime.
	 * @returns The created {@link Project}.
	 */
	static New(metadata: ProjectMetadata): Project {
		return new Project({
			name: metadata.name,
			author: metadata.author,
			version: metadata.version,
			previewImagePath: metadata.previewImagePath,
		});
	}

	/**
	 * Registers an update callback for runtime render-frame ticks.
	 *
	 * The callback is invoked once per render-frame tick while no previous update
	 * is still running. If an earlier update has not completed, the current tick is
	 * skipped.
	 *
	 * The `timestep` parameter is the elapsed time, in milliseconds, since the
	 * previous update callback started.
	 *
	 * @param onUpdate - The callback invoked on each scheduled render-frame tick.
	 */
	ScheduleUpdate(
		onUpdate: (timestep: number, project: Project) => void | Promise<void>,
	) {
		let lastTimeStamp = Date.now();
		let updateInProgress = false;

		RpcClient.Call<number>("Project::ScheduleUpdate", Project.projectId, () => {
			if (updateInProgress) return;

			updateInProgress = true;
			const currentTimeStamp = Date.now();
			const timestep = currentTimeStamp - lastTimeStamp;
			lastTimeStamp = currentTimeStamp;
			try {
				const updatePromise = onUpdate(timestep, this);
				if (updatePromise == null) {
					updateInProgress = false;
					return;
				}

				void updatePromise
					.catch((error) => {
						console.error("Error in scheduled project update:", error);
					})
					.finally(() => {
						updateInProgress = false;
					});
			} catch (error) {
				updateInProgress = false;
				throw error;
			}
		});
	}

	/**
	 * Launches the project.
	 *
	 * Adamas API calls are not available until internal initialization has
	 * completed. The `onSetup` callback is invoked after initialization, and
	 * application code may safely call Adamas APIs from within `onSetup` and any
	 * functions executed after it.
	 *
	 * @param onSetup - Called after project initialization to configure the scene
	 * and register project logic.
	 * @returns A promise that resolves when the project launch has completed.
	 */
	async Launch(
		onSetup: (sceneGraph: SceneGraph, project: Project) => Promise<void>,
	): Promise<void> {
		const { name, author, version, previewImagePath } = this.metadata;

		if (!isVersion(version)) {
			throw "Version format is incorrect.";
		}

		await RpcClient.Connect();
		/**
		 * This is a fallback option of providing project metadata to the runtime for outside-platform distribution
		 * If the project is loaded from the cloud, cloud project information is used and the info provided here is ignored.
		 */
		Project.projectId = await RpcClient.Call<string>(
			"Project::ProjectBootupBegin",
			process.pid,
			name,
			author,
			previewImagePath,
			version,
		);

		let sceneGraph: SceneGraph = {};

		if (this.bundle) {
			const world = this.bundle.project.world;
			if (world.worldEntrance) {
				const user = await User.GetLocalUser();
				await user.TeleportTo(
					world.spawnPosition,
					quat.fromEuler(
						[0, 0, 0, 0],
						world.spawnRotation[0] * RAD2DEG,
						world.spawnRotation[1] * RAD2DEG,
						world.spawnRotation[2] * RAD2DEG,
						"xyz",
					),
				);
			}

			sceneGraph = await LoadProject(this.bundle.assets, this.bundle.project);
		}

		await onSetup(sceneGraph, this);

		await RpcClient.Call<void>("Project::ProjectBootupEnd", Project.projectId);
	}
}
