import { vec4 } from "../gl-matrix/esm/index.js";

export const SamplerType = Object.freeze({
	SAMPLER_2D: 0, //!< 2D texture
	SAMPLER_2D_ARRAY: 1, //!< 2D array texture
	SAMPLER_CUBEMAP: 2, //!< Cube map texture
	SAMPLER_EXTERNAL: 3, //!< External texture
	SAMPLER_3D: 4, //!< 3D texture
	SAMPLER_CUBEMAP_ARRAY: 5, //!< Cube map array texture (feature level 2)
});

export const TextureFormat = Object.freeze({
	// 8-bits per element
	R8: 0,
	R8_SNORM: 1,
	R8UI: 2,
	R8I: 3,
	STENCIL8: 4,

	// 16-bits per element
	R16F: 5,
	R16UI: 6,
	R16I: 7,
	RG8: 8,
	RG8_SNORM: 9,
	RG8UI: 10,
	RG8I: 11,
	RGB565: 12,
	RGB9_E5: 13, // 9995 is actually 32 bpp but it's here for historical reasons.
	RGB5_A1: 14,
	RGBA4: 15,
	DEPTH16: 16,

	// 24-bits per element
	RGB8: 17,
	SRGB8: 18,
	RGB8_SNORM: 19,
	RGB8UI: 20,
	RGB8I: 21,
	DEPTH24: 22,

	// 32-bits per element
	R32F: 23,
	R32UI: 24,
	R32I: 25,
	RG16F: 26,
	RG16UI: 27,
	RG16I: 28,
	R11F_G11F_B10F: 29,
	RGBA8: 30,
	SRGB8_A8: 31,
	RGBA8_SNORM: 32,
	UNUSED: 33, // used to be rgbm
	RGB10_A2: 34,
	RGBA8UI: 35,
	RGBA8I: 36,
	DEPTH32F: 37,
	DEPTH24_STENCIL8: 38,
	DEPTH32F_STENCIL8: 39,

	// 48-bits per element
	RGB16F: 40,
	RGB16UI: 41,
	RGB16I: 42,

	// 64-bits per element
	RG32F: 43,
	RG32UI: 44,
	RG32I: 45,
	RGBA16F: 46,
	RGBA16UI: 47,
	RGBA16I: 48,

	// 96-bits per element
	RGB32F: 49,
	RGB32UI: 50,
	RGB32I: 51,

	// 128-bits per element
	RGBA32F: 52,
	RGBA32UI: 53,
	RGBA32I: 54,

	// compressed formats

	// Mandatory in GLES 3.0 and GL 4.3
	EAC_R11: 55,
	EAC_R11_SIGNED: 56,
	EAC_RG11: 57,
	EAC_RG11_SIGNED: 58,
	ETC2_RGB8: 59,
	ETC2_SRGB8: 60,
	ETC2_RGB8_A1: 61,
	ETC2_SRGB8_A1: 62,
	ETC2_EAC_RGBA8: 63,
	ETC2_EAC_SRGBA8: 64,

	// Available everywhere except Android/iOS
	DXT1_RGB: 65,
	DXT1_RGBA: 66,
	DXT3_RGBA: 67,
	DXT5_RGBA: 68,
	DXT1_SRGB: 69,
	DXT1_SRGBA: 70,
	DXT3_SRGBA: 71,
	DXT5_SRGBA: 72,

	// ASTC formats are available with a GLES extension
	RGBA_ASTC_4x4: 73,
	RGBA_ASTC_5x4: 74,
	RGBA_ASTC_5x5: 75,
	RGBA_ASTC_6x5: 76,
	RGBA_ASTC_6x6: 77,
	RGBA_ASTC_8x5: 78,
	RGBA_ASTC_8x6: 79,
	RGBA_ASTC_8x8: 80,
	RGBA_ASTC_10x5: 81,
	RGBA_ASTC_10x6: 82,
	RGBA_ASTC_10x8: 83,
	RGBA_ASTC_10x10: 84,
	RGBA_ASTC_12x10: 85,
	RGBA_ASTC_12x12: 86,
	SRGB8_ALPHA8_ASTC_4x4: 87,
	SRGB8_ALPHA8_ASTC_5x4: 88,
	SRGB8_ALPHA8_ASTC_5x5: 89,
	SRGB8_ALPHA8_ASTC_6x5: 90,
	SRGB8_ALPHA8_ASTC_6x6: 91,
	SRGB8_ALPHA8_ASTC_8x5: 92,
	SRGB8_ALPHA8_ASTC_8x6: 93,
	SRGB8_ALPHA8_ASTC_8x8: 94,
	SRGB8_ALPHA8_ASTC_10x5: 95,
	SRGB8_ALPHA8_ASTC_10x6: 96,
	SRGB8_ALPHA8_ASTC_10x8: 97,
	SRGB8_ALPHA8_ASTC_10x10: 98,
	SRGB8_ALPHA8_ASTC_12x10: 99,
	SRGB8_ALPHA8_ASTC_12x12: 100,

	// RGTC formats available with a GLES extension
	RED_RGTC1: 101, // BC4 unsigned
	SIGNED_RED_RGTC1: 102, // BC4 signed
	RED_GREEN_RGTC2: 103, // BC5 unsigned
	SIGNED_RED_GREEN_RGTC2: 104, // BC5 signed

	// BPTC formats available with a GLES extension
	RGB_BPTC_SIGNED_FLOAT: 105, // BC6H signed
	RGB_BPTC_UNSIGNED_FLOAT: 106, // BC6H unsigned
	RGBA_BPTC_UNORM: 107, // BC7
	SRGB_ALPHA_BPTC_UNORM: 108, // BC7 sRGB
});

export const TextureCubemapFace = Object.freeze({
	POSITIVE_X: 0, //!< +x face
	NEGATIVE_X: 1, //!< -x face
	POSITIVE_Y: 2, //!< +y face
	NEGATIVE_Y: 3, //!< -y face
	POSITIVE_Z: 4, //!< +z face
	NEGATIVE_Z: 5, //!< -z face
});

export const PixelDataFormat = Object.freeze({
	R: 0, //!< One Red channel, float
	R_INTEGER: 1, //!< One Red channel, integer
	RG: 2, //!< Two Red and Green channels, float
	RG_INTEGER: 3, //!< Two Red and Green channels, integer
	RGB: 4, //!< Three Red, Green and Blue channels, float
	RGB_INTEGER: 5, //!< Three Red, Green and Blue channels, integer
	RGBA: 6, //!< Four Red, Green, Blue and Alpha channels, float
	RGBA_INTEGER: 7, //!< Four Red, Green, Blue and Alpha channels, integer
	UNUSED: 8, //!< used to be rgbm
	DEPTH_COMPONENT: 9, //!< Depth, 16-bit or 24-bits usually
	DEPTH_STENCIL: 10, //!< Two Depth (24-bits) + Stencil (8-bits) channels
	ALPHA: 11, //!< One Alpha channel, float
});

export const PixelDataType = Object.freeze({
	UBYTE: 0, //!< unsigned byte
	BYTE: 1, //!< signed byte
	USHORT: 2, //!< unsigned short (16-bit)
	SHORT: 3, //!< signed short (16-bit)
	UINT: 4, //!< unsigned int (32-bit)
	INT: 5, //!< signed int (32-bit)
	HALF: 6, //!< half-float (16-bit float)
	FLOAT: 7, //!< float (32-bits float)
	COMPRESSED: 8, //!< compressed pixels, @see CompressedPixelDataType
	UINT_10F_11F_11F_REV: 9, //!< three low precision floating-point numbers
	USHORT_565: 10, //!< unsigned int (16-bit), encodes 3 RGB channels
	UINT_2_10_10_10_REV: 11, //!< unsigned normalized 10 bits RGB, 2 bits alpha
});

export const TextureUsage = Object.freeze({
	NONE: 0x00,
	COLOR_ATTACHMENT: 0x01, //!< Texture can be used as a color attachment
	DEPTH_ATTACHMENT: 0x02, //!< Texture can be used as a depth attachment
	STENCIL_ATTACHMENT: 0x04, //!< Texture can be used as a stencil attachment
	UPLOADABLE: 0x08, //!< Data can be uploaded into this texture (default)
	SAMPLEABLE: 0x10, //!< Texture can be sampled (default)
	SUBPASS_INPUT: 0x20, //!< Texture can be used as a subpass input
	BLIT_SRC: 0x40, //!< Texture can be used the source of a blit()
	BLIT_DST: 0x80, //!< Texture can be used the destination of a blit()
	DEFAULT: 0x18, //!< Default texture usage: UPLOADABLE | SAMPLEABLE
});

//! Texture swizzle
export const TextureSwizzle = Object.freeze({
	SUBSTITUTE_ZERO: 0,
	SUBSTITUTE_ONE: 1,
	CHANNEL_0: 2,
	CHANNEL_1: 3,
	CHANNEL_2: 4,
	CHANNEL_3: 5,
});

export class Texture {
	constructor(internal) {
		this.internal = internal;
	}

	/**
	 *
	 * @param {TextureFormat} format
	 * @returns {Boolean}
	 */
	static IsTextureFormatSupported(format) {
		return binding.Texture$IsTextureFormatSupported(format);
	}
	static IsTextureSwizzleSupported() {
		return binding.Texture$IsTextureSwizzleSupported();
	}
	/**
	 *
	 * @param {PixelDataFormat} format
	 * @param {PixelDataType} type
	 * @param {Integer} stride
	 * @param {Integer} height
	 * @param {Integer} alignment
	 * @returns {Integer}
	 */
	static ComputeTextureDataSize(format, type, stride, height, alignment) {
		return binding.Texture$ComputeTextureDataSize(
			format,
			type,
			stride,
			height,
			alignment,
		);
	}

	/**
	 * Returns the width of a 2D or 3D texture level
	 * @param {Integer} level texture level.
	 * @return {Integer} Width in texel of the specified \p level, clamped to 1.
	 * @attention If this texture is using Sampler::SAMPLER_EXTERNAL, the dimension
	 * of the texture are unknown and this method always returns whatever was set on the Builder.
	 */
	GetWidth(level) {
		if (level == undefined) level = 0;
		return binding.Texture$GetWidth(this.internal, level);
	}

	/**
	 * Returns the height of a 2D or 3D texture level
	 * @param {Integer} level texture level.
	 * @return {Integer} Height in texel of the specified \p level, clamped to 1.
	 * @attention If this texture is using Sampler::SAMPLER_EXTERNAL, the dimension
	 * of the texture are unknown and this method always returns whatever was set on the Builder.
	 */
	GetHeight(level) {
		if (level == undefined) level = 0;
		return binding.Texture$GetHeight(this.internal, level);
	}

	/**
	 * Returns the depth of a 3D texture level
	 * @param level texture level.
	 * @return Depth in texel of the specified \p level, clamped to 1.
	 * @attention If this texture is using Sampler::SAMPLER_EXTERNAL, the dimension
	 * of the texture are unknown and this method always returns whatever was set on the Builder.
	 */
	GetDepth(level) {
		if (level == undefined) level = 0;
		return binding.Texture$GetDepth(this.internal, level);
	}

	/**
	 * Returns the maximum number of levels this texture can have.
	 * @return {Integer} maximum number of levels this texture can have.
	 * @attention If this texture is using Sampler::SAMPLER_EXTERNAL, the dimension
	 * of the texture are unknown and this method always returns whatever was set on the Builder.
	 */
	GetLevels() {
		return binding.Texture$GetLevels(this.internal);
	}

	/**
	 * Return this texture Sampler as set by Builder::sampler().
	 * @return {SamplerType} this texture Sampler as set by Builder::sampler()
	 */
	GetTarget() {
		return binding.Texture$GetTarget(this.internal);
	}

	/**
	 * Return this texture InternalFormat as set by Builder::format().
	 * @return {TextureFormat} this texture InternalFormat as set by Builder::format().
	 */
	GetFormat() {
		return binding.Texture$GetFormat(this.internal);
	}

	/**
	 * Updates a sub-image of a 3D texture or 2D texture array for a level. Cubemaps are treated
	 * like a 2D array of six layers.
	 *
	 * @param {Integer} level     Level to set the image for.
	 * @param {Integer} xoffset   Left offset of the sub-region to update.
	 * @param {Integer} yoffset   Bottom offset of the sub-region to update.
	 * @param {Integer} zoffset   Depth offset of the sub-region to update.
	 * @param {Integer} width     Width of the sub-region to update.
	 * @param {Integer} height    Height of the sub-region to update.
	 * @param {Integer} depth     Depth of the sub-region to update.
	 * @param {PixelBufferDescriptor} buffer   Client-side buffer containing the image to set.
	 *
	 * @attention \p engine must be the instance passed to Builder::build()
	 * @attention \p level must be less than getLevels().
	 * @attention \p buffer's Texture::Format must match that of getFormat().
	 * @attention This Texture instance must use Sampler::SAMPLER_3D, Sampler::SAMPLER_2D_ARRAY
	 *             or Sampler::SAMPLER_CUBEMAP.
	 *
	 */
	SetImage(level, xoffset, yoffset, zoffset, width, height, depth, buffer) {
		binding.Texture$SetImage(
			this.internal,
			level,
			xoffset,
			yoffset,
			zoffset,
			width,
			height,
			depth,
			buffer.buffer,
			buffer.pixelDataFormat,
			buffer.pixelDataType,
		);
	}

	/**
	 * Generates all the mipmap levels automatically. This requires the texture to have a
	 * color-renderable format and usage set to BLIT_SRC | BLIT_DST. If unspecified,
	 * usage bits are set automatically.
	 *
	 * @attention \p engine must be the instance passed to Builder::build()
	 * @attention This Texture instance must NOT use SamplerType::SAMPLER_3D or it has no effect
	 */
	GenerateMipmaps() {
		binding.Texture$GenerateMipmaps(this.internal);
	}
}

export class PixelBufferDescriptor {
	static Build(a1, a2, a3) {
		let ret = new PixelBufferDescriptor();
		ret.buffer = a1;
		ret.pixelDataFormat = a2;
		ret.pixelDataType = a3;
		return ret;
	}

	buffer = new ArrayBuffer(0);
	pixelDataFormat = PixelDataFormat.RGBA;
	pixelDataType = PixelDataType.UBYTE;
}

export class TextureBuilder {
	/**
	 * Specifies the width in texels of the texture. Doesn't need to be a power-of-two.
	 * @param {Integer} width Width of the texture in texels (default: 1).
	 * @returns {TextureBuilder}
	 */
	Width(width) {
		this.width = width;
		return this;
	}

	/**
	 * Specifies the height in texels of the texture. Doesn't need to be a power-of-two.
	 * @param {Integer} height Height of the texture in texels (default: 1).
	 * @returns {TextureBuilder}
	 */
	Height(height) {
		this.height = height;
		return this;
	}

	/**
	 * Specifies the depth in texels of the texture. Doesn't need to be a power-of-two.
	 * The depth controls the number of layers in a 2D array texture. Values greater than 1
	 * effectively create a 3D texture.
	 * @param {Integer} depth Depth of the texture in texels (default: 1).
	 * @returns {TextureBuilder}
	 * @attention This Texture instance must use Sampler::SAMPLER_3D or
	 *            Sampler::SAMPLER_2D_ARRAY or it has no effect.
	 */
	Depth(depth) {
		this.depth = depth;
		return this;
	}

	/**
	 * Specifies the numbers of mip map levels.
	 * This creates a mip-map pyramid. The maximum number of levels a texture can have is
	 * such that max(width, height, level) / 2^MAX_LEVELS = 1
	 * @param {uint8_t} levels Number of mipmap levels for this texture.
	 * @returns {TextureBuilder}
	 */
	Levels(levels) {
		this.levels = levels;
		return this;
	}

	/**
	 * Specifies the type of sampler to use.
	 * @param {SamplerType} target Sampler type
	 * @returns {TextureBuilder}
	 */
	Sampler(target) {
		this.target = target;
		return this;
	}

	/**
	 * Specifies the *internal* format of this texture.
	 *
	 * The internal format specifies how texels are stored (which may be different from how
	 * they're specified in setImage()). InternalFormat specifies both the color components
	 * and the data type used.
	 *
	 * @param {TextureFormat} format Format of the texture's texel.
	 * @returns {TextureBuilder}
	 */
	Format(format) {
		this.format = format;
		return this;
	}

	/**
	 * Specifies if the texture will be used as a render target attachment.
	 *
	 * If the texture is potentially rendered into, it may require a different memory layout,
	 * which needs to be known during construction.
	 *
	 * @param {TextureUsage} usage Defaults to Texture::Usage::DEFAULT;
	 *                             c.f. Texture::Usage::COLOR_ATTACHMENT.
	 * @returns {TextureBuilder}
	 */
	Usage(usage) {
		this.usage = usage;
		return this;
	}

	/**
	 * Specifies how a texture's channels map to color components
	 *
	 * Texture Swizzle is only supported if isTextureSwizzleSupported() returns true.
	 *
	 * @param {TextureSwizzle} r  texture channel for red component
	 * @param {TextureSwizzle} g  texture channel for green component
	 * @param {TextureSwizzle} b  texture channel for blue component
	 * @param {TextureSwizzle} a  texture channel for alpha component
	 * @returns {TextureBuilder}
	 */
	Swizzle(r, g, b, a) {
		this.rgba = vec4.fromValues(r, g, b, a);
		return this;
	}

	/**
	 * Creates the Texture object and returns a pointer to it.
	 *
	 * @return {Texture} pointer to the newly created object.
	 */
	Build() {
		return new Texture(
			binding.TextureBuilder$Build(
				this.width,
				this.height,
				this.depth,
				this.levels,
				this.target,
				this.format,
				this.usage,
				this.rgba,
			),
		);
	}

	width = 1;
	height = 1;
	depth = 1;
	levels = 1;
	target = SamplerType.SAMPLER_2D;
	format = TextureFormat.RGBA8;
	usage = TextureUsage.NONE;
	rgba = undefined;
}
