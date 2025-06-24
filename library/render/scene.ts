import { RpcClient } from "@adamas/rpc";

// NOTE: the following are not supported compared to legacy code:
// - A dedicated “SkyboxBuilder” or multiple‐camera viewports (Unity handles those internally)

// includes skybox as well
export class Scene {
	static getDefault(): number {
		return Number(RpcClient.Call("Scene_GetDefault", {}));
	}

	static setSkybox(sceneHandle: number, skyboxHandle: number): boolean {
		return Boolean(
			RpcClient.Call("Scene_SetSkybox", {
				sceneHandle,
				skyboxHandle,
			}),
		);
	}

	static setAmbientLight(
		sceneHandle: number,
		r: number,
		g: number,
		b: number,
		intensity: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Scene_SetAmbientLight", {
				sceneHandle,
				r,
				g,
				b,
				intensity,
			}),
		);
	}

	static setFog(
		sceneHandle: number,
		enabled: boolean,
		mode: number,
		density: number,
		start: number,
		end: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Scene_SetFog", {
				sceneHandle,
				enabled,
				mode,
				density,
				start,
				end,
			}),
		);
	}
}
