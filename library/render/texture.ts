import { vec2 } from "gl-matrix";
import { RpcClient } from "../rpc";
import { base64Encode } from "../utilities/base64";

export type TextureHandle = number;

export enum TextureFormat {
	/**  Alpha-only texture format, 8 bit integer. */
	Alpha8 = 1,
	/** Three channel (RGB) texture format, 8-bits unsigned integer per channel. */
	RGB24 = 3,
	/** Four channel (RGBA) texture format, 8-bits unsigned integer per channel. */
	RGBA32 = 4,
}

export enum RenderTextureFormat {
	/** A depth render texture format. */
	Depth = 1,
	/** A native shadowmap render texture format. */
	Shadowmap = 3,
	/** Default color render texture format: will be chosen accordingly to Frame Buffer format and Platform. */
	Default = 7,
	/** Default HDR color render texture format: will be chosen accordingly to Frame Buffer format and Platform. */
	DefaultHDR = 9,
}

export enum TextureDimension {
	/** 2D texture (Texture2D). */
	Tex2D = 2,
	/** Cubemap texture.  */
	Cube = 4,
}

export enum TextureFilterMode {
	Nearest = 0,
	Linear = 1,
	NearestMipmapNearest = 2,
	LinearMipmapNearest = 3,
	NearestMipmapLinear = 4,
	LinearMipmapLinear = 5,
}

export enum TextureWrapMode {
	ClampToEdge = 0,
	Repeat = 1,
	MirroredRepeat = 2,
}

export interface ImageReadbackResult {
	width: number;
	height: number;
	kind: "rgba" | "png" | "jpeg";

	/**  Base64 of payload (raw bytes or encoded bytes) */
	base64: string;
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
			RpcClient.Call("Texture::Create2D", {
				width,
				height,
				format,
				linear,
				clientId: RpcClient.GetClientId(),
			}),
		);
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
		width: number = 512,
		height: number = 512,
		depth: number = 16,
		dimension: TextureDimension = TextureDimension.Tex2D,
		format: RenderTextureFormat = RenderTextureFormat.DefaultHDR,
	): TextureHandle {
		return Number(
			RpcClient.Call("Texture::CreateRenderTexture", {
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
			RpcClient.Call("Texture::Destroy", { textureHandle: handle }),
		);
	}

	static GetTextureSize(handle: TextureHandle): vec2 {
		const retval = RpcClient.Call("Texture::GetTextureSize", {
			textureHandle: handle,
		});

		if (Array.isArray(retval) && retval.length == 2) {
			return vec2.fromValues(retval[0], retval[1]);
		}

		throw "GetTextureSize failed";
	}

	/**
	 * Set raw RGBA iamge for the texture
	 * @param handle The texture handle
	 * @param rgbaData RGBA values in array buffer, each element is 1 byte in R, G, B, A order
	 * @param width The texture width
	 * @param height The texture height
	 * @returns boolean indicating success
	 */
	static LoadRGBAImage(
		handle: TextureHandle,
		rgbaData: ArrayBufferLike,
		width: number,
		height: number,
	): boolean;
	/**
	 * Set raw RGBA iamge for the texture
	 * @param handle The texture handle
	 * @param rgbaData RGBA values in base64 string encoding
	 * @param width The texture width
	 * @param height The texture height
	 * @returns boolean indicating success
	 */
	static LoadRGBAImage(
		handle: TextureHandle,
		rgbaData: string,
		width: number,
		height: number,
	): boolean;
	static LoadRGBAImage(
		handle: TextureHandle,
		rgbaData: ArrayBufferLike | string,
		width: number,
		height: number,
	): boolean {
		let base64Rgba;
		if (typeof rgbaData !== "string") {
			base64Rgba = base64Encode(rgbaData);
		} else {
			base64Rgba = rgbaData;
		}

		return Boolean(
			RpcClient.Call("Texture::LoadRawTextureData", {
				textureHandle: handle,
				base64Rgba,
				width,
				height,
			}),
		);
	}

	/**
	 * Loads PNG, JPG, and EXR image byte array into a texture.
	 * @param handle The texture handle
	 * @param image PNG, JPG, or EXR image data in arraybuffer
	 * @returns boolean indicating success
	 */
	static LoadImage(handle: TextureHandle, image: ArrayBufferLike): boolean;
	/**
	 * Loads PNG, JPG, and EXR image byte array into a texture.
	 * @param handle The texture handle
	 * @param image PNG, JPG, or EXR image data in base64 string encoding
	 * @returns boolean indicating success
	 */
	static LoadImage(handle: TextureHandle, image: string): boolean;
	static LoadImage(
		handle: TextureHandle,
		image: ArrayBufferLike | string,
	): boolean {
		let base64Image;
		if (typeof image !== "string") {
			base64Image = base64Encode(image);
		} else {
			base64Image = image;
		}

		return Boolean(
			RpcClient.Call("Texture::LoadImage", {
				textureHandle: handle,
				base64Image,
			}),
		);
	}

	/**
	 * Read back image data in RGBA format
	 * @param handle The texture handle
	 * @returns image readback result
	 */
	static ReadbackRGBAImage(handle: TextureHandle): ImageReadbackResult {
		const retval = RpcClient.Call("Texture::ReadbackRGBAImage", {
			textureHandle: handle,
			mipLevel: 0,
		});

		if (retval.ok) {
			return retval as ImageReadbackResult;
		} else {
			throw "Image readback error";
		}
	}

	/**
	 * Read back image data in jpg format
	 * @param handle The texture handle
	 * @returns image readback result
	 */
	static ReadbackJPGImage(
		handle: TextureHandle,
		quality: number = 75,
	): ImageReadbackResult {
		const retval = RpcClient.Call("Texture::ReadbackJPGImage", {
			textureHandle: handle,
			quality,
			mipLevel: 0,
		});

		if (retval.ok) {
			return retval as ImageReadbackResult;
		} else {
			throw "Image readback error";
		}
	}

	/**
	 * Read back image data in png format
	 * @param handle The texture handle
	 * @returns image readback result
	 */
	static ReadbackPNGImage(handle: TextureHandle): ImageReadbackResult {
		const retval = RpcClient.Call("Texture::ReadbackPNGImage", {
			textureHandle: handle,
			mipLevel: 0,
		});

		if (retval.ok) {
			return retval as ImageReadbackResult;
		} else {
			throw "Image readback error";
		}
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
			RpcClient.Call("Texture::SetFilterMode", {
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
			RpcClient.Call("Texture::SetWrapModeU", {
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
			RpcClient.Call("Texture::SetWrapModeV", {
				textureHandle: handle,
				wrapMode,
			}),
		);
	}
}
