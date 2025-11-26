import { MaterialManager } from "./material";
import { TextureManager } from "./texture";
import { SceneManager } from "./scene";

export class RendererManager {
	// ------------------------------------------------------------
	// Camera / XR
	// ------------------------------------------------------------

	/**
	 * Filament: Renderer::getDefaultCameraEntity()
	 * Unity RPC not yet implemented; please register a CameraManager method.
	 * @returns The default camera entity handle
	 */
	static GetDefaultCameraEntity(): number {
		console.warn("GetDefaultCameraEntity(): Unity RPC not available");
		return -1;
	}

	/**
	 * Filament: Renderer::getXRCameras()
	 * Unity RPC not yet implemented.
	 * @returns Array of XR camera entity handles
	 */
	static GetXRCameras(): number[] {
		console.warn("GetXRCameras(): Unity RPC not available");
		return [];
	}

	// ------------------------------------------------------------
	// Material / Skybox / Indirect Light
	// ------------------------------------------------------------

	/**
	 * Destroy a material instance (mimics Filament::Renderer::destroyMaterialInstance)
	 * @param instanceHandle The material instance handle to destroy
	 * @returns boolean indicating success
	 */
	static DestroyMaterialInstance(instanceHandle: number): boolean {
		return MaterialManager.Destroy(instanceHandle);
	}

	/**
	 * Destroy a render-target (in Unity, render textures)
	 * @param rtHandle The render target handle to destroy
	 * @returns boolean indicating success
	 */
	static DestroyRenderTarget(rtHandle: number): boolean {
		return TextureManager.Destroy(rtHandle);
	}

	/**
	 * Destroy a skybox (in Unity, just a material)
	 * @param skyboxMatHandle The skybox material handle to destroy
	 * @returns boolean indicating success
	 */
	static DestroySkybox(skyboxMatHandle: number): boolean {
		return MaterialManager.Destroy(skyboxMatHandle);
	}

	/**
	 * Destroy an indirect light (no direct Unity equivalent)
	 * @param ilHandle The indirect light handle to destroy
	 * @returns boolean indicating success
	 */
	static DestroyIndirectLight(ilHandle: number): boolean {
		console.warn("DestroyIndirectLight(): no Unity RPC equivalent");
		return false;
	}

	// ------------------------------------------------------------
	// Scene-level convenience
	// ------------------------------------------------------------

	/**
	 * Wraps Scene_SetSkybox
	 * @param sceneHandle The scene handle
	 * @param skyboxMatHandle The skybox material handle
	 * @returns boolean indicating success
	 */
	static SetSkybox(sceneHandle: number, skyboxMatHandle: number): boolean {
		return SceneManager.SetSkybox(sceneHandle, skyboxMatHandle);
	}

	/**
	 * Wraps Scene_SetAmbientLight
	 * @param sceneHandle The scene handle
	 * @param r Red component (0-1)
	 * @param g Green component (0-1)
	 * @param b Blue component (0-1)
	 * @param intensity The ambient light intensity
	 * @returns boolean indicating success
	 */
	static SetAmbientLight(
		sceneHandle: number,
		r: number,
		g: number,
		b: number,
		intensity: number,
	): boolean {
		return SceneManager.SetAmbientLight(sceneHandle, r, g, b, intensity);
	}

	/**
	 * Wraps Scene_SetFog
	 * @param sceneHandle The scene handle
	 * @param enabled Whether fog is enabled
	 * @param mode The fog mode
	 * @param density The fog density
	 * @param start The fog start distance
	 * @param end The fog end distance
	 * @returns boolean indicating success
	 */
	static SetFog(
		sceneHandle: number,
		enabled: boolean,
		mode: number,
		density: number,
		start: number,
		end: number,
	): boolean {
		return SceneManager.SetFog(sceneHandle, enabled, mode, density, start, end);
	}
}
