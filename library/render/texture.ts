/**
 * APIs for creating, updating, and reading textures.
 *
 * @module texture
 */
import { vec2 } from "gl-matrix";
import { RpcClient } from "../rpc";

/**
 * Opaque numeric handle that identifies a texture.
 */
export type Texture = number;

/**
 * Supported texture data formats.
 */
export enum TextureFormat {
	/** Alpha-only texture format, 8 bit integer. */
	Alpha8 = 1,
	/** Three channel RGB texture format, 8-bits unsigned integer per channel. */
	RGB24 = 3,
	/** Four channel RGBA texture format, 8-bits unsigned integer per channel. */
	RGBA32 = 4,
}

/**
 * Supported render texture formats.
 */
export enum RenderTextureFormat {
	/** Depth render texture format. */
	Depth = 1,
	/** Shadow map render texture format. */
	Shadowmap = 3,
	/** Default color render texture format. */
	Default = 7,
	/** Default HDR color render texture format. */
	DefaultHDR = 9,
}

/**
 * Supported texture dimensions.
 */
export enum TextureDimension {
	/** 2D texture. */
	Tex2D = 2,
	/** Cubemap texture.  */
	Cube = 4,
}

/**
 * Texture filtering modes.
 */
export enum TextureFilterMode {
	Nearest = 0,
	Linear = 1,
	NearestMipmapNearest = 2,
	LinearMipmapNearest = 3,
	NearestMipmapLinear = 4,
	LinearMipmapLinear = 5,
}

/**
 * Texture wrapping modes.
 */
export enum TextureWrapMode {
	ClampToEdge = 0,
	Repeat = 1,
	MirroredRepeat = 2,
}

/**
 * Image data returned from a texture readback operation.
 */
export interface ImageReadbackResult {
	/** Width of the image, in pixels. */
	width: number;
	/** Height of the image, in pixels. */
	height: number;
	/** Encoding of the returned image data. */
	kind: "rgba" | "png" | "jpeg";

	/** Base64-encoded image data. */
	data: string;
}

/**
 * Creates, updates, and reads textures.
 */
export class TextureManager {
	/**
	 * Creates a 2D texture.
	 *
	 * @param width - The texture width, in pixels.
	 * @param height - The texture height, in pixels.
	 * @param format - The texture format. Defaults to {@link TextureFormat.RGBA32}.
	 * @param linear - Whether the texture should use linear color format. Defaults to
	 * `false` (sRGB).
	 * @returns A promise that resolves to the created {@link Texture}.
	 */
	static async Create2D(
		width: number,
		height: number,
		format?: TextureFormat,
		linear?: boolean,
	) {
		return RpcClient.Call<Texture>(
			"Texture::Create2D",
			RpcClient.GetClientId(),
			width,
			height,
			format ?? TextureFormat.RGBA32,
			linear ?? false,
		);
	}

	/**
	 * Creates a render texture.
	 *
	 * @param width - The texture width, in pixels. Defaults to `512`.
	 * @param height - The texture height, in pixels. Defaults to `512`.
	 * @param depth - The depth buffer size. Defaults to `16`.
	 * @param dimension - The texture dimension. Defaults to
	 * {@link TextureDimension.Tex2D}.
	 * @param format - The texture format. Defaults to
	 * {@link RenderTextureFormat.DefaultHDR}.
	 * @returns A promise that resolves to the created {@link Texture}.
	 */
	static async CreateRenderTexture(
		width?: number,
		height?: number,
		depth?: number,
		dimension?: TextureDimension,
		format?: RenderTextureFormat,
	) {
		return RpcClient.Call<Texture>(
			"Texture::CreateRenderTexture",
			RpcClient.GetClientId(),
			width ?? 512,
			height ?? 512,
			depth ?? 16,
			dimension ?? TextureDimension.Tex2D,
			format ?? RenderTextureFormat.DefaultHDR,
		);
	}

	/**
	 * Destroys a texture.
	 *
	 * @param handle - The {@link Texture} to destroy.
	 * @returns A promise that resolves to `true` if the texture was destroyed, or
	 * `false` otherwise.
	 */
	static Destroy(handle: Texture) {
		return RpcClient.Call<boolean>("Texture::Destroy", handle);
	}

	/**
	 * Gets the size of a texture.
	 *
	 * @param handle - The {@link Texture} to inspect.
	 * @returns A promise that resolves to the texture size as `[width, height]`.
	 */
	static GetTextureSize(handle: Texture) {
		return RpcClient.Call<vec2>("Texture::GetTextureSize", handle);
	}

	/**
	 * Sets raw RGBA image data for a texture.
	 *
	 * @param handle - The {@link Texture} to update.
	 * @param rgbaData - RGBA byte data in `R`, `G`, `B`, `A` order.
	 * @param width - The image width, in pixels.
	 * @param height - The image height, in pixels.
	 * @returns A promise that resolves when the image data has been changed.
	 */
	static LoadRGBAImage(
		handle: Texture,
		rgbaData: Uint8Array,
		width: number,
		height: number,
	) {
		return RpcClient.Call<void>(
			"Texture::LoadRawTextureData",
			handle,
			rgbaData,
			width,
			height,
		);
	}

	/**
	 * Loads encoded image data into a texture.
	 *
	 * @param handle - The {@link Texture} to update.
	 * @param image - PNG, JPG, or EXR image data.
	 * @returns A promise that resolves when the image data has been changed.
	 */
	static LoadImage(handle: Texture, image: Uint8Array) {
		return RpcClient.Call<void>("Texture::LoadImage", handle, image);
	}

	/**
	 * Gets image data from a texture in RGBA format.
	 *
	 * @param handle - The {@link Texture} to read.
	 * @returns A promise that resolves to the image data.
	 */
	static ReadbackRGBAImage(handle: Texture) {
		return RpcClient.Call<ImageReadbackResult>(
			"Texture::ReadbackRGBAImage",
			handle,
		);
	}

	/**
	 * Gets image data from a texture in JPEG format.
	 *
	 * @param handle - The {@link Texture} to read.
	 * @param quality - The JPEG quality, from `0` to `100`. Defaults to `75`.
	 * @returns A promise that resolves to the image data.
	 */
	static ReadbackJPGImage(handle: Texture, quality?: number) {
		return RpcClient.Call<ImageReadbackResult>(
			"Texture::ReadbackJPGImage",
			handle,
			quality ?? 75,
		);
	}

	/**
	 * Gets image data from a texture in PNG format.
	 *
	 * @param handle - The {@link Texture} to read.
	 * @returns A promise that resolves to the image data.
	 */
	static ReadbackPNGImage(handle: Texture) {
		return RpcClient.Call<ImageReadbackResult>(
			"Texture::ReadbackPNGImage",
			handle,
		);
	}

	/**
	 * Sets the filter mode of a texture.
	 *
	 * @param handle - The {@link Texture} to update.
	 * @param mode - The filter mode to apply.
	 * @returns A promise that resolves when the filter mode has been changed.
	 */
	static SetFilterMode(handle: Texture, mode: TextureFilterMode) {
		return RpcClient.Call<void>("Texture::SetFilterMode", handle, mode);
	}

	/**
	 * Sets the wrap mode of a texture on the U axis.
	 *
	 * @param handle - The {@link Texture} to update.
	 * @param wrapMode - The wrap mode to apply.
	 * @returns A promise that resolves when the wrap mode has been changed.
	 */
	static SetWrapModeU(handle: Texture, wrapMode: TextureWrapMode) {
		return RpcClient.Call<void>("Texture::SetWrapModeU", handle, wrapMode);
	}

	/**
	 * Sets the wrap mode of a texture on the V axis.
	 *
	 * @param handle - The {@link Texture} to update.
	 * @param wrapMode - The wrap mode to apply.
	 * @returns A promise that resolves when the wrap mode has been changed.
	 */
	static SetWrapModeV(handle: Texture, wrapMode: TextureWrapMode) {
		return RpcClient.Call<void>("Texture::SetWrapModeV", handle, wrapMode);
	}
}
