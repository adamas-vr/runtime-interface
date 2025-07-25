import { RpcClient } from "@adamas/rpc";
import { base64Encode } from "@adamas/utilities/base64";

export type TextureHandle = number;

// NOTE: the following are not supported compared to legacy code:
// - Filament's TextureBuilder, Swizzle, GenerateMipmaps, PixelBufferDescriptor

export class TextureManager {
	/**
	 * Create a 2D texture
	 * @param width The texture width
	 * @param height The texture height
	 * @param format The texture format
	 * @returns The texture handle
	 */
	static Create2D(
		width: number,
		height: number,
		format: number,
	): TextureHandle {
		return Number(
			RpcClient.Call("Texture_Create2D", {
				width,
				height,
				format,
				clientId: RpcClient.GetClientId(),
			}),
		);
	}

	/**
	 * Create a 2D texture and attach it to a material
	 * @param width The texture width
	 * @param height The texture height
	 * @param format The texture format
	 * @param materialHandle The material handle to attach to
	 * @param propertyName The material property name
	 * @returns The texture handle
	 */
	static Create2DForMaterial(
		width: number,
		height: number,
		format: number,
		materialHandle: number,
		propertyName: string,
	): TextureHandle {
		const textureHandle = Number(
			RpcClient.Call("Texture_Create2D", {
				width,
				height,
				format,
				clientId: RpcClient.GetClientId(),
			}),
		);
		RpcClient.Call("Material_SetTexture", {
			materialHandle: materialHandle,
			propertyName: propertyName,
			textureHandle: textureHandle,
		});
		return textureHandle;
	}

	/**
	 * Create a render texture
	 * @param width The texture width
	 * @param height The texture height
	 * @param depth The texture depth
	 * @param format The texture format
	 * @param usage The texture usage flags
	 * @returns The texture handle
	 */
	static CreateRenderTexture(
		width: number,
		height: number,
		depth: number,
		format: number,
		usage: number,
	): TextureHandle {
		return Number(
			RpcClient.Call("Texture_CreateRenderTexture", {
				width,
				height,
				depth,
				format,
				usage,
				clientId: RpcClient.GetClientId(),
			}),
		);
	}

	/**
	 * Destroy a texture
	 * @param handle The texture handle to destroy
	 * @returns boolean indicating success
	 */
	static Destroy(handle: TextureHandle): boolean {
		return Boolean(
			RpcClient.Call("Texture_Destroy", { textureHandle: handle }),
		);
	}

	/**
	 * Set raw RGBA iamge for the texture
	 * @param handle The texture handle
	 * @param rgbaDataJson RGBA values
	 * @param width The texture width
	 * @param height The texture height
	 * @returns boolean indicating success
	 */
	static LoadRawTextureData(
		handle: TextureHandle,
		base64Rgba: ArrayBufferLike,
		width: number,
		height: number,
	): boolean {
		const base64String = base64Encode(base64Rgba)
		return Boolean(
			RpcClient.Call("Texture_LoadRawTextureData", {
				textureHandle: handle,
				base64Rgba: base64String,
				width,
				height,
			}),
		);
	}

	/**
	 * Loads PNG/JPG image byte array into a texture.
	 * @param handle The texture handle
	 * @param imageDataJson JSON string with comma-separated RGBA values
	 * @returns boolean indicating success
	 */
	static LoadImage(
		handle: TextureHandle,
		base64Image: ArrayBufferLike,
	): boolean {
		const base64String = base64Encode(base64Image)

		return Boolean(
			RpcClient.Call("Texture_LoadImage", {
				textureHandle: handle,
				base64Image: base64String,
			}),
		);
	}

	/**
	 * Set the filter mode for the texture
	 * @param handle The texture handle
	 * @param mode The filter mode
	 * @returns boolean indicating success
	 */
	static SetFilterMode(
		handle: TextureHandle,
		mode: TextureFilterMode,
	): boolean {
		return Boolean(
			RpcClient.Call("Texture_SetFilterMode", {
				textureHandle: handle,
				filterMode: mode,
			}),
		);
	}

	/**
	 * Set the wrap mode for the texture
	 * @param handle The texture handle
	 * @param wrapMode The wrap mode
	 * @returns boolean indicating success
	 */
	static SetWrapMode(
		handle: TextureHandle,
		wrapMode: TextureWrapMode,
	): boolean {
		return Boolean(
			RpcClient.Call("Texture_SetWrapMode", {
				textureHandle: handle,
				wrapMode,
			}),
		);
	}
}

export enum TextureFilterMode {
	NEAREST = 0,
	LINEAR = 1,
	NEAREST_MIPMAP_NEAREST = 2,
	LINEAR_MIPMAP_NEAREST = 3,
	NEAREST_MIPMAP_LINEAR = 4,
	LINEAR_MIPMAP_LINEAR = 5,
}

export enum TextureWrapMode {
	CLAMP_TO_EDGE = 0,
	REPEAT = 1,
	MIRRORED_REPEAT = 2,
}
