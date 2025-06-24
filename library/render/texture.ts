import { RpcClient } from "@adamas/rpc";

// NOTE: the following are not supported compared to legacy code:
// - Filament’s TextureBuilder, Swizzle, GenerateMipmaps, PixelBufferDescriptor

export class Texture {
	constructor(public handle: number) {}

	static create2D(
		width: number,
		height: number,
		depth: number,
		format: number,
	): number {
		return Number(
			RpcClient.Call("Texture_Create2D", {
				width,
				height,
				depth,
				format,
			}),
		);
	}

	static createRenderTexture(
		width: number,
		height: number,
		depth: number,
		format: number,
		usage: number,
	): number {
		return Number(
			RpcClient.Call("Texture_CreateRenderTexture", {
				width,
				height,
				depth,
				usage,
			}),
		);
	}

	static destroy(handle: number): boolean {
		return Boolean(
			RpcClient.Call("Texture_Destroy", { textureHandle: handle }),
		);
	}

	static setPixels(
		handle: number,
		name: string,
		x: number,
		y: number,
		w: number,
		h: number,
		data: Uint8Array,
	): boolean {
		return Boolean(
			RpcClient.Call("Texture_SetPixels", {
				textureHandle: handle,
				name,
				x,
				y,
				w,
				h,
				// TODO: need to extend bridge to pass raw byte buffers
			}),
		);
	}

	static setFilterMode(handle: number, mode: number): boolean {
		return Boolean(
			RpcClient.Call("Texture_SetFilterMode", {
				textureHandle: handle,
				filterMode: mode,
			}),
		);
	}

	static setWrapMode(handle: number, wrapMode: number): boolean {
		return Boolean(
			RpcClient.Call("Texture_SetWrapMode", {
				textureHandle: handle,
				wrapMode,
			}),
		);
	}
}
