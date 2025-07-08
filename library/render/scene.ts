import { RpcClient } from "@adamas/rpc";

export type SceneHandle = number;

// NOTE: the following are not supported compared to legacy code:
// - A dedicated "SkyboxBuilder" or multiple‐camera viewports (Unity handles those internally)

// includes skybox as well
export class SceneManager {
	/**
	 * Get the default scene handle
	 * @returns The default scene handle
	 */
	static GetDefault(): SceneHandle {
		return Number(RpcClient.Call("Scene_GetDefault", {}));
	}

	/**
	 * Set the skybox for the scene
	 * @param sceneHandle The scene handle
	 * @param skyboxHandle The skybox material handle
	 * @returns boolean indicating success
	 */
	static SetSkybox(sceneHandle: SceneHandle, skyboxHandle: number): boolean {
		return Boolean(
			RpcClient.Call("Scene_SetSkybox", {
				sceneHandle,
				skyboxHandle,
			}),
		);
	}

	/**
	 * Set the ambient light for the scene
	 * @param sceneHandle The scene handle
	 * @param r Red component (0-1)
	 * @param g Green component (0-1)
	 * @param b Blue component (0-1)
	 * @param intensity The ambient light intensity
	 * @returns boolean indicating success
	 */
	static SetAmbientLight(
		sceneHandle: SceneHandle,
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

	/**
	 * Set the fog parameters for the scene
	 * @param sceneHandle The scene handle
	 * @param enabled Whether fog is enabled
	 * @param mode The fog mode
	 * @param density The fog density
	 * @param start The fog start distance
	 * @param end The fog end distance
	 * @returns boolean indicating success
	 */
	static SetFog(
		sceneHandle: SceneHandle,
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
