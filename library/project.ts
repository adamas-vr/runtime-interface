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
	 * Gets the current project ID.
	 *
	 * @returns The project ID.
	 */
	static GetProjectId(): string {
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
	static New(metadata: Omit<ProjectMetadata, "projectId">): Project {
		return new Project({
			name: metadata.name,
			author: metadata.author,
			version: metadata.version,
			previewImagePath: metadata.previewImagePath,
			projectId: "",
		});
	}

	/**
	 * Schedules an update callback to run at the requested interval.
	 *
	 * @param onUpdate - The update callback called on each scheduled project update
	 * @param intervalMilliseconds - The update interval, in milliseconds.
	 * @returns The interval handle, which can be passed to `clearInterval`.
	 */
	ScheduleUpdate(
		onUpdate: (timestep: number, project: Project) => void,
		intervalMilliseconds = 50,
	): ReturnType<typeof setInterval> {
		if (intervalMilliseconds <= 0) {
			throw new Error("Update loop interval must be greater than zero.");
		}

		let lastTimeStamp = Date.now();

		return setInterval(() => {
			const currentTimeStamp = Date.now();
			const timestep = currentTimeStamp - lastTimeStamp;
			lastTimeStamp = currentTimeStamp;
			onUpdate(timestep, this);
		}, intervalMilliseconds);
	}

	/**
	 * Launches the project.
	 *
	 * @param onSetup - Called during project setup.
	 * @returns A promise that resolves when project launch has completed.
	 */
	async Launch(
		onSetup: (sceneGraph: SceneGraph, project: Project) => Promise<void>,
	): Promise<void> {
		const { name, author, version, previewImagePath } = this.metadata;

		if (!isVersion(version)) {
			throw "Version format is incorrect.";
		}

		Project.projectId = this.bundle
			? this.metadata.projectId
			: await generateId(name, author);

		await RpcClient.Connect(Project.projectId);

		await RpcClient.Call<void>(
			"Project::ProjectBootupBegin",
			Project.projectId,
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
