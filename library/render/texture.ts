import { vec2 } from "gl-matrix";
import { RpcClient } from "../rpc";
import { base64Encode } from "../utilities/base64";

export type Texture = number;

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
	data: string;
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
	static async Create2D(
		...args: [
			width: number,
			height: number,
			format?: TextureFormat,
			linear?: boolean,
		]
	) {
		return RpcClient.Call<Texture>(
			"Texture::Create2D",
			RpcClient.GetClientId(),
			args[0],
			args[1],
			args[2] ?? TextureFormat.RGBA32,
			args[3] ?? false,
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
	static async CreateRenderTexture(
		...args: [
			width?: number,
			height?: number,
			depth?: number,
			dimension?: TextureDimension,
			format?: RenderTextureFormat,
		]
	) {
		return RpcClient.Call<Texture>(
			"Texture::CreateRenderTexture",
			RpcClient.GetClientId(),
			args[0] ?? 512,
			args[1] ?? 512,
			args[2] ?? 16,
			args[3] ?? TextureDimension.Tex2D,
			args[4] ?? RenderTextureFormat.DefaultHDR,
		);
	}

	/**
	 * Destroy a texture
	 * @param handle The texture handle to destroy
	 * @returns boolean indicating success
	 */
	static Destroy(...args: [handle: Texture]) {
		return RpcClient.Call<boolean>("Texture::Destroy", ...args);
	}

	static GetTextureSize(...args: [handle: Texture]) {
		return RpcClient.Call<vec2>("Texture::GetTextureSize", ...args);
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
		handle: Texture,
		rgbaData: Uint8Array,
		width: number,
		height: number,
	): Promise<void>;
	/**
	 * Set raw RGBA iamge for the texture
	 * @param handle The texture handle
	 * @param rgbaData RGBA values in base64 string encoding
	 * @param width The texture width
	 * @param height The texture height
	 * @returns boolean indicating success
	 */
	static LoadRGBAImage(
		handle: Texture,
		rgbaData: string,
		width: number,
		height: number,
	): Promise<void>;
	static LoadRGBAImage(
		...args: [
			handle: Texture,
			rgbaData: Uint8Array | string,
			width: number,
			height: number,
		]
	) {
		return RpcClient.Call<void>(
			"Texture::LoadRawTextureData",
			args[0],
			typeof args[1] === "string" ? args[1] : base64Encode(args[1]),
			args[2],
			args[3],
		);
	}

	/**
	 * Loads PNG, JPG, and EXR image byte array into a texture.
	 * @param handle The texture handle
	 * @param image PNG, JPG, or EXR image data in arraybuffer
	 * @returns boolean indicating success
	 */
	static LoadImage(handle: Texture, image: Uint8Array): Promise<void>;
	/**
	 * Loads PNG, JPG, and EXR image byte array into a texture.
	 * @param handle The texture handle
	 * @param image PNG, JPG, or EXR image data in base64 string encoding
	 * @returns boolean indicating success
	 */
	static LoadImage(handle: Texture, image: string): Promise<void>;
	static LoadImage(...args: [handle: Texture, image: Uint8Array | string]) {
		return RpcClient.Call<void>(
			"Texture::LoadImage",
			args[0],
			typeof args[1] === "string" ? args[1] : base64Encode(args[1]),
		);
	}

	/**
	 * Read back image data in RGBA format
	 * @param handle The texture handle
	 * @returns image readback result
	 */
	static ReadbackRGBAImage(...args: [handle: Texture]) {
		return RpcClient.Call<ImageReadbackResult>(
			"Texture::ReadbackRGBAImage",
			args[0],
		);
	}

	/**
	 * Read back image data in jpg format
	 * @param handle The texture handle
	 * @returns image readback result
	 */
	static ReadbackJPGImage(...args: [handle: Texture, quality?: number]) {
		return RpcClient.Call<ImageReadbackResult>(
			"Texture::ReadbackJPGImage",
			args[0],
			args[1] ?? 75,
		);
	}

	/**
	 * Read back image data in png format
	 * @param handle The texture handle
	 * @returns image readback result
	 */
	static ReadbackPNGImage(...args: [handle: Texture]) {
		return RpcClient.Call<ImageReadbackResult>(
			"Texture::ReadbackPNGImage",
			args[0],
		);
	}

	/**
	 * Set the filter mode for the texture
	 * @param handle The texture handle
	 * @param mode The filter mode
	 * @returns boolean indicating success
	 */
	static SetFilterMode(...args: [handle: Texture, mode: TextureFilterMode]) {
		return RpcClient.Call<void>("Texture::SetFilterMode", ...args);
	}

	/**
	 * Set the U coordinate wrap mode for the texture
	 * @param handle The texture handle
	 * @param wrapMode The wrap mode
	 * @returns boolean indicating success
	 */
	static SetWrapModeU(...args: [handle: Texture, wrapMode: TextureWrapMode]) {
		return RpcClient.Call<void>("Texture::SetWrapModeU", ...args);
	}

	/**
	 * Set the V coordinate wrap mode for the texture
	 * @param handle The texture handle
	 * @param wrapMode The wrap mode
	 * @returns boolean indicating success
	 */
	static SetWrapModeV(...args: [handle: Texture, wrapMode: TextureWrapMode]) {
		return RpcClient.Call<void>("Texture::SetWrapModeV", ...args);
	}
}
