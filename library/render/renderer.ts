import { MaterialManager } from "./material";
import { TextureHandle, TextureManager } from "./texture";
import { RpcClient } from "../rpc";
import { vec3 } from "gl-matrix";

export class RendererManager {
	/**
	 * Set skybox texture. Support exr and hdr in Texture2D.
	 * @param sceneHandle The scene handle
	 * @param textureHandle The skybox material handle
	 * @returns boolean indicating success
	 */
	static SetSkybox2DTexture(textureHandle: TextureHandle): boolean {
		return Boolean(
			RpcClient.Call("Renderer::SetSkybox2DTexture", {
				textureHandle,
			}),
		);
	}

	static GetSkybox2DTexture(): TextureHandle {
		return Number(RpcClient.Call("Renderer::GetSkybox2DTexture", {}));
	}

	/**
	 * Set ambient light
	 * @param r Red component (0-1)
	 * @param g Green component (0-1)
	 * @param b Blue component (0-1)
	 * @param intensity The ambient light intensity
	 * @returns boolean indicating success
	 */
	static SetAmbientLight(
		r: number,
		g: number,
		b: number,
		intensity: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Renderer::SetAmbientLight", {
				r,
				g,
				b,
				intensity,
			}),
		);
	}

	static GetAmbientLight(): [vec3, number] {
		const val = JSON.parse(RpcClient.Call("Renderer::GetAmbientLight", {}));
		return [vec3.fromValues(val.x, val.y, val.z), val.w];
	}

	static RenderCubemap(
		textureHandle: TextureHandle,
		x: number,
		y: number,
		z: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Renderer::RenderCubemap", {
				textureHandle,
				x,
				y,
				z,
			}),
		);
	}

	static SetReflectionCubemap(textureHandle: TextureHandle): boolean {
		return Boolean(
			RpcClient.Call("Renderer::SetReflectionCubemap", {
				textureHandle,
			}),
		);
	}

	static GetReflectionCubemap(): TextureHandle {
		return Number(RpcClient.Call("Renderer::GetReflectionCubemap", {}));
	}

	static SetReflectionIntensity(intensity: number): boolean {
		return Boolean(
			RpcClient.Call("Renderer::SetReflectionIntensity", {
				intensity,
			}),
		);
	}

	static GetReflectionIntensity(): Number {
		return Number(RpcClient.Call("Renderer::GetReflectionIntensity", {}));
	}
}
