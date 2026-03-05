import { MaterialManager } from "./material";
import { TextureHandle, TextureManager } from "./texture";
import { RpcClient } from "../rpc";
import { vec3 } from "gl-matrix";

export class RendererManager {
	/**
	 * Set skybox texture. Support exr and hdr in Texture2D.
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
	 * Set ambient light.
	 * @param color HDR color. Each component's range is [0, +10]
	 * @returns
	 */
	static SetAmbientLight(color: vec3): boolean {
		return Boolean(
			RpcClient.Call("Renderer::SetAmbientLight", {
				r: color[0],
				g: color[1],
				b: color[2],
			}),
		);
	}

	static GetAmbientLight(): vec3 {
		const val = JSON.parse(RpcClient.Call("Renderer::GetAmbientLight", {}));
		return vec3.fromValues(val[0], val[1], val[2]);
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

	/**
	 *
	 * @param intensity [0, 10] floating point. No reflection is 0
	 * @returns
	 */
	static SetReflectionIntensity(intensity: number): boolean {
		return Boolean(
			RpcClient.Call("Renderer::SetReflectionIntensity", {
				intensity,
			}),
		);
	}

	static GetReflectionIntensity(): number {
		return Number(RpcClient.Call("Renderer::GetReflectionIntensity", {}));
	}
}
