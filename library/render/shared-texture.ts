import { RpcClient } from "../rpc";
import type { Texture } from "./texture";

interface SharedTextureCreateResult {
	sharedId: number;
	textureHandle: Texture;
	shareTokenJson: string;
	width: number;
	height: number;
	linear: boolean;
}

interface SharedTextureNativeAddon {
	openSharedTexture(shareTokenJson: string): number;
	closeSharedTexture(nativeHandle: number): void;
	writeRGBA(nativeHandle: number, rgbaData: Uint8Array): void;
	readRGBA(nativeHandle: number): Uint8Array;
}

interface SharedTextureShareToken {
	api: string;
	nativeTextureId: number;
}

let cachedAddon: SharedTextureNativeAddon | null = null;

function loadSharedTextureNativeAddon(): SharedTextureNativeAddon {
	if (cachedAddon) {
		return cachedAddon;
	}

	cachedAddon =
		require("./adamas_shared_texture.node") as SharedTextureNativeAddon;
	return cachedAddon;
}

function parseShareToken(shareTokenJson: string): SharedTextureShareToken {
	const parsed = JSON.parse(shareTokenJson) as SharedTextureShareToken;
	return parsed;
}

/**
 * Shared 2D GPU texture that is accessible from the local project and the
 * Adamas runtime.
 *
 * The underlying shared-memory pixel format is always 8-bit-per-channel
 * `RGBA`.
 *
 * This texture can be used in the same manner as a 2D texture created by
 * `TextureManager.Create2D`, including APIs that accept a texture handle for
 * rendering or material assignment.
 *
 * Color space is controlled by the `linear` argument:
 * - `false` (default): sRGB texture
 * - `true`: linear texture
 *
 * Use {@link uploadRGBA} and {@link readLatestRGBA} with `Uint8Array` data in
 * `R`, `G`, `B`, `A` byte order.
 */
export class SharedTexture {
	private readonly addon: SharedTextureNativeAddon;
	private readonly nativeHandle: number;
	private readonly createResult: SharedTextureCreateResult;
	private readonly parsedShareToken: SharedTextureShareToken;
	private closed = false;

	private constructor(
		createResult: SharedTextureCreateResult,
		addon: SharedTextureNativeAddon,
		nativeHandle: number,
	) {
		this.createResult = createResult;
		this.addon = addon;
		this.nativeHandle = nativeHandle;
		this.parsedShareToken = parseShareToken(createResult.shareTokenJson);
	}

	/**
	 * Creates a shared GPU texture.
	 *
	 * The underlying native shared-memory layout is `RGBA8`.
	 *
	 * @param width - Texture width in pixels.
	 * @param height - Texture height in pixels.
	 * @param linear - Whether the shared texture should use linear color space.
	 * Defaults to `false`, which creates an sRGB texture.
	 * @returns A promise that resolves to the created shared texture wrapper.
	 */
	static async Create(
		width: number,
		height: number,
		linear = false,
	): Promise<SharedTexture> {
		const createResult = await RpcClient.Call<SharedTextureCreateResult>(
			"GpuTexture::CreateShared",
			RpcClient.GetClientId(),
			width,
			height,
			linear,
		);

		const addon = loadSharedTextureNativeAddon();
		const nativeHandle = addon.openSharedTexture(createResult.shareTokenJson);
		return new SharedTexture(createResult, addon, nativeHandle);
	}

	/**
	 * Gets the texture handle for this shared texture.
	 *
	 * This handle can be passed to other render APIs that accept a texture handle.
	 */
	get textureHandle(): Texture {
		return this.createResult.textureHandle;
	}

	/**
	 * Gets the width of the shared texture in pixels.
	 */
	get width(): number {
		return this.createResult.width;
	}

	/**
	 * Gets the height of the shared texture in pixels.
	 */
	get height(): number {
		return this.createResult.height;
	}

	/**
	 * Gets whether the shared texture uses linear color space.
	 *
	 * When `false`, the shared texture uses sRGB color space.
	 */
	get linear(): boolean {
		return this.createResult.linear;
	}

	/**
	 * Gets the native texture id for this shared texture.
	 *
	 * This value can be forwarded to other native addons that coordinate with
	 * the same shared GPU resource.
	 *
	 * The underlying native backend is:
	 * - macOS: `metal-iosurface`
	 * - Windows: `d3d11`
	 */
	get nativeTextureId(): number {
		return this.parsedShareToken.nativeTextureId;
	}

	/**
	 * Uploads a full frame into the shared texture.
	 *
	 * The input data must be tightly packed 8-bit `RGBA` bytes in `R`, `G`, `B`,
	 * `A` order. The byte length must be exactly `width * height * 4`.
	 *
	 * @param rgbaData - Raw `RGBA8` pixel data for the full texture.
	 * @returns A promise that resolves when the shared texture has been updated.
	 */
	async uploadRGBA(rgbaData: Uint8Array): Promise<void> {
		this.throwIfClosed();
		const expectedSize = this.createResult.width * this.createResult.height * 4;
		if (rgbaData.byteLength !== expectedSize) {
			throw new Error(
				`SharedTexture.uploadRGBA expected ${expectedSize} bytes but got ${rgbaData.byteLength}.`,
			);
		}

		this.addon.writeRGBA(this.nativeHandle, rgbaData);
	}

	/**
	 * Copies a render texture into this shared texture on the runtime side.
	 *
	 * @param renderTextureHandle - Render texture handle to copy from.
	 * @returns A promise that resolves when the GPU copy request has completed.
	 */
	async blitFromRenderTexture(renderTexture: Texture): Promise<void> {
		this.throwIfClosed();
		await RpcClient.Call<void>(
			"GpuTexture::BlitFromRenderTexture",
			this.createResult.sharedId,
			renderTexture,
		);
	}

	/**
	 * Reads the latest full frame from the shared texture.
	 *
	 * The returned data is tightly packed 8-bit `RGBA` bytes in `R`, `G`, `B`,
	 * `A` order, matching the shared texture's true native memory format.
	 *
	 * @returns The latest full-frame `RGBA8` pixel buffer.
	 */
	readRGBA(): Uint8Array {
		this.throwIfClosed();
		return this.addon.readRGBA(this.nativeHandle);
	}

	/**
	 * Destroys the shared texture and releases its native resources.
	 *
	 * After this completes, the instance must not be used again.
	 *
	 * @returns A promise that resolves after both the runtime-side and local
	 * native shared-texture resources have been released.
	 */
	async close(): Promise<void> {
		if (this.closed) {
			return;
		}

		this.closed = true;
		try {
			await RpcClient.Call<boolean>(
				"GpuTexture::DestroyShared",
				this.createResult.sharedId,
			);
		} finally {
			this.addon.closeSharedTexture(this.nativeHandle);
		}
	}

	private throwIfClosed() {
		if (this.closed) {
			throw new Error("SharedTexture has been closed.");
		}
	}
}
