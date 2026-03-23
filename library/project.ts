import { ProjectBundle, ProjectMetadata, Version } from "./asset";
import { LoadProject, SceneGraph } from "./project-loader";
import { RpcClient } from "./rpc";
import { User } from "./user";

export interface ProjectCallbacks {
	OnSetup?: (project: Project, sceneGraph?: SceneGraph) => void;
	OnTick?: (project: Project, timestep: number) => void;
}

export async function generateId(name: string, uid: string): Promise<string> {
	const input = `${name}:${uid}`;

	// Encode string to Uint8Array
	const encoder = new TextEncoder();
	const data = encoder.encode(input);

	// Compute SHA-256 digest
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);

	// Convert ArrayBuffer to byte array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// Convert to base64url
	const base64url = btoa(String.fromCharCode(...hashArray))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, ""); // remove padding

	return base64url; // 43 chars
}

export function isVersion(value: string): value is Version {
	return /^\d+\.\d+\.\d+$/.test(value);
}

export class Project {
	private static projectId: string;

	private readonly bundle?: ProjectBundle;
	private readonly metadata: ProjectMetadata;

	private lastTimeStamp = Date.now();

	private constructor(metadata: ProjectMetadata, bundle?: ProjectBundle) {
		this.metadata = metadata;
		this.bundle = bundle;
	}

	static GetProjectId(): string {
		return Project.projectId;
	}

	static FromBundle(bundle: ProjectBundle): Project {
		return new Project(bundle.project.metadata, bundle);
	}

	static New(metadata: Omit<ProjectMetadata, "projectId">): Project {
		return new Project({
			name: metadata.name,
			author: metadata.author,
			version: metadata.version,
			previewImagePath: metadata.previewImagePath,
			projectId: "",
		});
	}

	async Launch(callbacks: ProjectCallbacks = {}): Promise<void> {
		const { name, author, version, previewImagePath } = this.metadata;

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
