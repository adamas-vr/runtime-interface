/**
 * APIs for creating and launching projects.
 *
 * @module project
 */
import { ProjectBundle, ProjectMetadata, Version } from "./asset";
import { LoadProject, SceneGraph } from "./project-loader";
import { RpcClient } from "./rpc";
import { User } from "./user";
import { generateId, isVersion } from "./utilities/rpc-utils";
import packageJson from "../package.json";

/** Adamas Runtime API Version */
export const API_VERSION = packageJson.version as Version;

/**
 * Project lifecycle callbacks.
 */
export interface ProjectCallbacks {
	/**
	 * Called during project setup.
	 *
	 * @param project - The launched {@link Project}.
	 * @param sceneGraph - The loaded scene graph, if one is available.
	 */
	OnSetup?: (project: Project, sceneGraph?: SceneGraph) => void;
	/**
	 * Called on each tick.
	 *
	 * @param project - The launched {@link Project}.
	 * @param timestep - The elapsed time since the previous tick, in milliseconds.
	 */
	OnTick?: (project: Project, timestep: number) => void;
}

/**
 * Represents a project.
 */
export class Project {
	private static projectId: string;

	private readonly bundle?: ProjectBundle;
	private readonly metadata: ProjectMetadata;

	private lastTimeStamp = Date.now();

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
	 * Launches the project.
	 *
	 * @param callbacks - The project lifecycle callbacks.
	 * @returns A promise that resolves when project launch has completed.
	 */
	async Launch(callbacks: ProjectCallbacks = {}): Promise<void> {
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
			version,
			previewImagePath,
		);

		let sceneGraph: SceneGraph | undefined;

		if (this.bundle) {
			const world = this.bundle.project.world;
			if (world.worldEntrance) {
				const user = await User.GetLocalUser();
				await user.TeleportTo(world.spawnPosition, world.spawnRotation);
			}

			sceneGraph = await LoadProject(this.bundle.assets, this.bundle.project);
		}

		callbacks.OnSetup?.(this, sceneGraph);

		await RpcClient.Call<void>("Project::ProjectBootupEnd", Project.projectId);

		this.lastTimeStamp = Date.now();

		setInterval(() => {
			const currentTimeStamp = Date.now();
			const timestep = currentTimeStamp - this.lastTimeStamp;
			this.lastTimeStamp = currentTimeStamp;
			callbacks.OnTick?.(this, timestep);
		}, 50);
	}
}
