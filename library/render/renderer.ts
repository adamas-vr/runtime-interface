import { Texture } from "./texture";
import { RpcClient } from "../rpc";
import { vec3 } from "gl-matrix";

export class RendererManager {
	/**
	 * Set skybox texture. Support exr and hdr in Texture2D.
	 * @param texture The skybox material handle
	 * @returns boolean indicating success
	 */
	static SetSkybox2DTexture(...args: [texture: Texture]) {
		return RpcClient.Call<void>("Renderer::SetSkybox2DTexture", ...args);
	}

	static GetSkybox2DTexture() {
		return RpcClient.Call<Texture>("Renderer::GetSkybox2DTexture");
	}

	/**
	 * Set ambient light.
	 * @param color HDR color. Each component's range is [0, +10]
	 * @returns
	 */
	static SetAmbientLight(...args: [color: vec3]) {
		return RpcClient.Call<void>("Renderer::SetAmbientLight", args[0]);
	}

	static GetAmbientLight() {
		return RpcClient.Call<vec3>("Renderer::GetAmbientLight");
	}

	static RenderCubemap(...args: [texture: Texture, position: vec3]) {
		return RpcClient.Call<void>("Renderer::RenderCubemap", ...args);
	}

	static SetReflectionCubemap(...args: [texture: Texture]) {
		return RpcClient.Call<void>("Renderer::SetReflectionCubemap", ...args);
	}

	static GetReflectionCubemap() {
		return RpcClient.Call<Texture>("Renderer::GetReflectionCubemap");
	}

	/**
	 *
	 * @param intensity [0, 10] floating point. No reflection is 0
	 * @returns
	 */
	static SetReflectionIntensity(...args: [intensity: number]) {
		return RpcClient.Call<void>("Renderer::SetReflectionIntensity", ...args);
	}

	static GetReflectionIntensity() {
		return RpcClient.Call<number>("Renderer::GetReflectionIntensity");
	}
}
