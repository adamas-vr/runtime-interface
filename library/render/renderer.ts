/**
 * APIs for updating renderer settings.
 *
 * @module renderer
 */
import { Texture } from "./texture";
import { RpcClient } from "../rpc";
import { vec3 } from "gl-matrix";

/**
 * Updates renderer settings.
 */
export class RendererManager {
	/**
	 * Sets the skybox texture.
	 *
	 * @param texture - The skybox {@link Texture}; it must be a 2D texture.
	 * @returns A promise that resolves when the skybox texture has been changed.
	 */
	static SetSkybox2DTexture(texture: Texture) {
		return RpcClient.Call<void>("Renderer::SetSkybox2DTexture", texture);
	}

	/**
	 * Gets the skybox texture.
	 *
	 * @returns A promise that resolves to the skybox {@link Texture}.
	 */
	static GetSkybox2DTexture() {
		return RpcClient.Call<Texture>("Renderer::GetSkybox2DTexture");
	}

	/**
	 * Renders a cubemap from a position.
	 *
	 * @param texture - The {@link Texture} to render into. It must be a render texture with a cube dimesion.
	 * @param position - The world position to render from. Defaults to `[0, 0, 0]`.
	 * @returns A promise that resolves when the cubemap has been rendered.
	 */
	static RenderCubemap(texture: Texture, position: vec3 = [0, 0, 0]) {
		return RpcClient.Call<void>("Renderer::RenderCubemap", texture, position);
	}

	/**
	 * Sets the reflection cubemap.
	 *
	 * @param texture - The {@link Texture} to assign as the reflection cubemap. It must have a cube dimesion.
	 * @returns A promise that resolves when the reflection cubemap has been
	 * changed.
	 */
	static SetReflectionCubemap(texture: Texture) {
		return RpcClient.Call<void>("Renderer::SetReflectionCubemap", texture);
	}

	/**
	 * Gets the reflection cubemap.
	 *
	 * @returns A promise that resolves to the reflection cubemap {@link Texture}.
	 */
	static GetReflectionCubemap() {
		return RpcClient.Call<Texture>("Renderer::GetReflectionCubemap");
	}

	/**
	 * Sets the environment intensity.
	 *
	 * @param intensity - The environment intensity as a number in the range
	 * `[0, 10]`, where `0` means no environment lighting and reflection.
	 * @returns A promise that resolves when the environment intensity has been
	 * changed.
	 */
	static SetEnvironmentIntensity(intensity: number) {
		return RpcClient.Call<void>("Renderer::SetEnvironmentIntensity", intensity);
	}

	/**
	 * Gets the environment intensity.
	 *
	 * @returns A promise that resolves to the environment intensity.
	 */
	static GetEnvironmentIntensity() {
		return RpcClient.Call<number>("Renderer::GetEnvironmentIntensity");
	}
}
