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
	 * Sets the ambient light color.
	 *
	 * @param color - The HDR color as a `vec3`, with each component in the range
	 * `[0, +10]`.
	 * @returns A promise that resolves when the ambient light has been changed.
	 */
	static SetAmbientLight(color: vec3) {
		return RpcClient.Call<void>("Renderer::SetAmbientLight", color);
	}

	/**
	 * Gets the ambient light color.
	 *
	 * @returns A promise that resolves to the ambient light color as a `vec3`.
	 */
	static GetAmbientLight() {
		return RpcClient.Call<vec3>("Renderer::GetAmbientLight");
	}

	/**
	 * Renders a cubemap from a position.
	 *
	 * @param texture - The {@link Texture} to render into. It must be a render texture with a cube dimesion.
	 * @param position - The world position to render from.
	 * @returns A promise that resolves when the cubemap has been rendered.
	 */
	static RenderCubemap(texture: Texture, position: vec3) {
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
	 * Sets the reflection intensity.
	 *
	 * @param intensity - The reflection intensity as a number in the range
	 * `[0, 10]`, where `0` means no reflection.
	 * @returns A promise that resolves when the reflection intensity has been
	 * changed.
	 */
	static SetReflectionIntensity(intensity: number) {
		return RpcClient.Call<void>("Renderer::SetReflectionIntensity", intensity);
	}

	/**
	 * Gets the reflection intensity.
	 *
	 * @returns A promise that resolves to the reflection intensity.
	 */
	static GetReflectionIntensity() {
		return RpcClient.Call<number>("Renderer::GetReflectionIntensity");
	}
}
