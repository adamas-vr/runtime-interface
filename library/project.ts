import { assetRecord, projectFile } from "adamas:project";
import { LoadProject, SceneGraph } from "./project-loader";
import { RpcClient } from "./rpc";

export interface ProjectCallbacks {
	OnSetup?: (project: Project, sceneGraph: SceneGraph) => void;
	OnTick?: (project: Project, timestep: number) => void;
}

export class Project {
	lastTimeStamp = Date.now();
	constructor(private callbacks: ProjectCallbacks) {}

	static GetProjectId() {
		return RpcClient.Call("ProjectManager_GetProjectIdFromPid", {
			pid: process.pid,
		}) as string;
	}

	static Launch(callbacks: ProjectCallbacks) {
		let sceneGraph = LoadProject(assetRecord, projectFile);

		const project = new Project(callbacks);
		project.callbacks.OnSetup?.(project, sceneGraph);
		setInterval(() => {
			const currentTimeStamp = Date.now();
			const timestep = currentTimeStamp - project.lastTimeStamp;
			project.lastTimeStamp = currentTimeStamp;
			project.callbacks.OnTick?.(project, timestep);
		}, 50);
	}

	OnEvent(eventName: string, eventHandler: () => void) {}
}
