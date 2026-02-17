import { RpcClient } from "../rpc";
import { base64Encode } from "../utilities/base64";
import { MaterialHandle } from "./material";

export type TextureHandle = number;

// NOTE: the following are not supported compared to legacy code:
// - Filament's TextureBuilder, Swizzle, GenerateMipmaps, PixelBufferDescriptor

export enum TextureFormat {
	//
	// Summary:
	//     Alpha-only texture format, 8 bit integer.
	Alpha8 = 1,
	//
	// Summary:
	//     Three channel (RGB) texture format, 8-bits unsigned integer per channel.
	RGB24 = 3,
	//
	// Summary:
	//     Four channel (RGBA) texture format, 8-bits unsigned integer per channel.
	RGBA32 = 4,
}

export enum RenderTextureFormat {
	//
	// Summary:
	//     A depth render texture format.
	Depth = 1,
	//
	// Summary:
	//     A native shadowmap render texture format.
	Shadowmap = 3,
	//
	// Summary:
	//     Default color render texture format: will be chosen accordingly to Frame Buffer
	//     format and Platform.
	Default = 7,
	//
	// Summary:
	//     Default HDR color render texture format: will be chosen accordingly to Frame
	//     Buffer format and Platform.
	DefaultHDR = 9,
}

export enum TextureDimension {
	//
	// Summary:
	//     2D texture (Texture2D).
	Tex2D = 2,
	//
	// Summary:
	//     Cubemap texture.
	Cube = 4,
}

export class TextureManager {
	/**
	 * Create a 2D texture
	 * @param width The texture width
	 * @param height The texture height
	 * @param format The texture format
	 * @param linear Whether the texture is color (sRGB) or raw data (linear)
	 * @returns The texture handle
	 */
	static Create2D(
		width: number,
		height: number,
		format: TextureFormat = TextureFormat.RGBA32,
		linear: boolean = false,
	): TextureHandle {
		return Number(
			RpcClient.Call("Texture_Create2D", {
				width,
				height,
				format,
				linear,
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
		format: TextureFormat,
		materialHandle: MaterialHandle,
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
	 * @returns The texture handle
	 */
	static CreateRenderTexture(
		width: number,
		height: number,
		depth: number,
		dimension: TextureDimension = TextureDimension.Tex2D,
		format: RenderTextureFormat = RenderTextureFormat.Default,
	): TextureHandle {
		return Number(
			RpcClient.Call("Texture_CreateRenderTexture", {
				width,
				height,
				depth,
				dimension,
				format,
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
		const base64String = base64Encode(base64Rgba);
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
	static LoadImage(handle: TextureHandle, image: ArrayBufferLike): boolean {
		const base64Image = base64Encode(image);

		return Boolean(
			RpcClient.Call("Texture_LoadImage", {
				textureHandle: handle,
				base64Image,
			}),
		);
	}

	/**
	 * Loads PNG/JPG image byte array into a texture.
	 * @param handle The texture handle
	 * @param imageDataJson JSON string with comma-separated RGBA values
	 * @returns boolean indicating success
	 */
	static LoadImageBase64(handle: TextureHandle, base64Image: string): boolean {
		return Boolean(
			RpcClient.Call("Texture_LoadImage", {
				textureHandle: handle,
				base64Image,
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
	 * Set the U coordinate wrap mode for the texture
	 * @param handle The texture handle
	 * @param wrapMode The wrap mode
	 * @returns boolean indicating success
	 */
	static SetWrapModeU(
		handle: TextureHandle,
		wrapMode: TextureWrapMode,
	): boolean {
		return Boolean(
			RpcClient.Call("Texture_SetWrapModeU", {
				textureHandle: handle,
				wrapMode,
			}),
		);
	}

	/**
	 * Set the V coordinate wrap mode for the texture
	 * @param handle The texture handle
	 * @param wrapMode The wrap mode
	 * @returns boolean indicating success
	 */
	static SetWrapModeV(
		handle: TextureHandle,
		wrapMode: TextureWrapMode,
	): boolean {
		return Boolean(
			RpcClient.Call("Texture_SetWrapModeV", {
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
