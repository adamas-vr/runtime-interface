import { UUID } from "crypto";
import { Asset, ProjectDescription } from "./asset";
import { LoadProject, SceneGraph } from "./project-loader";
import { RpcClient } from "./rpc";
import { User } from "./user";

export interface ProjectCallbacks {
	OnSetup?: (project: Project, sceneGraph: SceneGraph) => void;
	OnTick?: (project: Project, timestep: number) => void;
}

export class Project {
	lastTimeStamp = Date.now();
	constructor(private callbacks: ProjectCallbacks) {}

	private static projectId: string;
	static GetProjectId(): string {
		return Project.projectId;
	}

	static async Launch(
		assetRecord: Map<UUID, Asset>,
		projectFile: ProjectDescription,
		callbacks: ProjectCallbacks,
	) {
		Project.projectId = projectFile.metadata.projectId;
		await RpcClient.Call<void>(
			"Project::ProjectBootupBegin",
			Project.projectId,
			process.pid,
		);

		if (projectFile.world.worldEntrance) {
			const user = await User.GetLocalUser();
			await user.TeleportTo(
				projectFile.world.spawnPosition,
				projectFile.world.spawnRotation,
			);
		}

		let sceneGraph = await LoadProject(assetRecord, projectFile);

		const project = new Project(callbacks);
		project.callbacks.OnSetup?.(project, sceneGraph);

		await RpcClient.Call<void>("Project::ProjectBootupEnd", Project.projectId);

		setInterval(() => {
			const currentTimeStamp = Date.now();
			const timestep = currentTimeStamp - project.lastTimeStamp;
			project.lastTimeStamp = currentTimeStamp;
			project.callbacks.OnTick?.(project, timestep);
		}, 50);
	}

	OnEvent(eventName: string, eventHandler: () => void) {}
}
