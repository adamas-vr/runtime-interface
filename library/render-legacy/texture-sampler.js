//! Sampler Wrap mode
export const SamplerWrapMode = Object.freeze({
	CLAMP_TO_EDGE: 0, //!< clamp-to-edge. The edge of the texture extends to infinity.
	REPEAT: 1, //!< repeat. The texture infinitely repeats in the wrap direction.
	MIRRORED_REPEAT: 2, //!< mirrored-repeat. The texture infinitely repeats and mirrors in the wrap direction.
});

//! Sampler minification filter
export const SamplerMinFilter = Object.freeze({
	// don't change the enums values
	NEAREST: 0, //!< No filtering. Nearest neighbor is used.
	LINEAR: 1, //!< Box filtering. Weighted average of 4 neighbors is used.
	NEAREST_MIPMAP_NEAREST: 2, //!< Mip-mapping is activated. But no filtering occurs.
	LINEAR_MIPMAP_NEAREST: 3, //!< Box filtering within a mip-map level.
	NEAREST_MIPMAP_LINEAR: 4, //!< Mip-map levels are interpolated, but no other filtering occurs.
	LINEAR_MIPMAP_LINEAR: 5, //!< Both interpolated Mip-mapping and linear filtering are used.
});

//! Sampler magnification filter
export const SamplerMagFilter = Object.freeze({
	// don't change the enums values
	NEAREST: 0, //!< No filtering. Nearest neighbor is used.
	LINEAR: 1, //!< Box filtering. Weighted average of 4 neighbors is used.
});

//! Sampler compare mode
export const SamplerCompareMode = Object.freeze({
	// don't change the enums values
	NONE: 0,
	COMPARE_TO_TEXTURE: 1,
});

//! comparison function for the depth / stencil sampler
export const SamplerCompareFunc = Object.freeze({
	// don't change the enums values
	LE: 0, //!< Less or equal
	GE: 1, //!< Greater or equal
	L: 2, //!< Strictly less than
	G: 3, //!< Strictly greater than
	E: 4, //!< Equal
	NE: 5, //!< Not equal
	A: 6, //!< Always. Depth / stencil testing is deactivated.
	N: 7, //!< Never. The depth / stencil test always fails.
});

export class TextureSampler {
	filterMag = SamplerMagFilter.NEAREST; //!< magnification filter (NEAREST)
	filterMin = SamplerMinFilter.NEAREST; //!< minification filter  (NEAREST)
	wrapS = SamplerWrapMode.CLAMP_TO_EDGE; //!< s-coordinate wrap mode (CLAMP_TO_EDGE)
	wrapT = SamplerWrapMode.CLAMP_TO_EDGE; //!< t-coordinate wrap mode (CLAMP_TO_EDGE)
	wrapR = SamplerWrapMode.CLAMP_TO_EDGE; //!< r-coordinate wrap mode (CLAMP_TO_EDGE)
	anisotropyLog2 = 0; //!< anisotropy level (0)
	compareMode = SamplerCompareMode.NONE; //!< sampler compare mode (NONE)
	compareFunc = SamplerCompareFunc.LE;
}
