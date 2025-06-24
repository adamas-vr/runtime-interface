import { vec3 } from "../gl-matrix/esm/index.js";
import { RenderTarget } from "./render-target.js";
import { Scene } from "./scene.js";
import { Viewport } from "./viewport.js";

export const AntiAliasing = Object.freeze({
	NONE: 0, //!< no anti aliasing performed as part of post-processing
	FXAA: 1, //!< FXAA is a low-quality but very efficient type of anti-aliasing. (default).
});

/**
 * Options for Temporal Anti-aliasing (TAA)
 * Most TAA parameters are extremely costly to change, as they will trigger the TAA post-process
 * shaders to be recompiled. These options should be changed or set during initialization.
 * `filterWidth`, `feedback` and `jitterPattern`, however, can be changed at any time.
 *
 * `feedback` of 0.1 effectively accumulates a maximum of 19 samples in steady state.
 * see "A Survey of Temporal Antialiasing Techniques" by Lei Yang and all for more information.
 *
 */
export class TemporalAntiAliasingOptions {
	static Build(
		a1,
		a2,
		a3,
		a4,
		a5,
		a6,
		a7,
		a8,
		a9,
		a10,
		a11,
		a12,
		a13,
		a14,
		a15,
	) {
		let ret = new TemporalAntiAliasingOptions();
		ret.boxClipping = a1;
		ret.boxType = a2;
		ret.enabled = a3;
		ret.feedback = a4;
		ret.filterHistory = a5;
		ret.filterInput = a6;
		ret.filterWidth = a7;
		ret.historyReprojection = a8;
		ret.jitterPattern = a9;
		ret.lodBias = a10;
		ret.preventFlickering = a11;
		ret.sharpness = a12;
		ret.upscaling = a13;
		ret.useYCoCg = a14;
		ret.varianceGamma = a15;
		return ret;
	}
	filterWidth = 1.0; //!< reconstruction filter width typically between 0.2 (sharper, aliased) and 1.5 (smoother)
	feedback = 0.12; //!< history feedback, between 0 (maximum temporal AA) and 1 (no temporal AA).
	lodBias = -1.0; //!< texturing lod bias (typically -1 or -2)
	sharpness = 0.0; //!< post-TAA sharpen, especially useful when upscaling is true.
	enabled = false; //!< enables or disables temporal anti-aliasing
	upscaling = false; //!< 4x TAA upscaling. Disables Dynamic Resolution. [BETA]

	static BoxType = Object.freeze({
		AABB: 0, //!< use an AABB neighborhood
		VARIANCE: 1, //!< use the variance of the neighborhood (not recommended)
		AABB_VARIANCE: 2, //!< use both AABB and variance
	});

	static BoxClipping = Object.freeze({
		ACCURATE: 0, //!< Accurate box clipping
		CLAMP: 1, //!< clamping
		NONE: 2, //!< no rejections (use for debugging)
	});

	static JitterPattern = Object.freeze({
		RGSS_X4: 0, //!  4-samples, rotated grid sampling
		UNIFORM_HELIX_X4: 1, //!  4-samples, uniform grid in helix sequence
		HALTON_23_X8: 2, //!  8-samples of halton 2,3
		HALTON_23_X16: 3, //! 16-samples of halton 2,3
		HALTON_23_X32: 4, //! 32-samples of halton 2,3
	});

	filterHistory = true; //!< whether to filter the history buffer
	filterInput = true; //!< whether to apply the reconstruction filter to the input
	useYCoCg = false; //!< whether to use the YcoCg color-space for history rejection
	boxType = TemporalAntiAliasingOptions.BoxType.AABB; //!< type of color gamut box
	boxClipping = TemporalAntiAliasingOptions.BoxClipping.ACCURATE; //!< clipping algorithm
	jitterPattern = TemporalAntiAliasingOptions.JitterPattern.HALTON_23_X16; //! Jitter Pattern
	varianceGamma = 1.0; //! High values increases ghosting artefact, lower values increases jittering, range [0.75, 1.25]

	preventFlickering = false; //!< adjust the feedback dynamically to reduce flickering
	historyReprojection = true; //!< whether to apply history reprojection (debug option)
}

export class ScreenSpaceReflectionsOptions {
	static Build(a1, a2, a3, a4, a5) {
		let ret = new ScreenSpaceReflectionsOptions();
		ret.bias = a1;
		ret.enabled = a2;
		ret.maxDistance = a3;
		ret.stride = a4;
		ret.thickness = a5;
		return ret;
	}
	thickness = 0.1; //!< ray thickness, in world units
	bias = 0.01; //!< bias, in world units, to prevent self-intersections
	maxDistance = 3.0; //!< maximum distance, in world units, to raycast
	stride = 2.0; //!< stride, in texels, for samples along the ray.
	enabled = false;
}

export class GuardBandOptions {
	static Build(a1) {
		let ret = new GuardBandOptions();
		ret.enabled = a1;
		return ret;
	}
	enabled = false;
}

export class MultiSampleAntiAliasingOptions {
	static Build(a1, a2, a3) {
		let ret = new MultiSampleAntiAliasingOptions();
		ret.customResolve = a1;
		ret.enabled = a2;
		ret.sampleCount = a3;
		return ret;
	}
	enabled = false; //!< enables or disables msaa

	/**
	 * {uint8_t}
	 * sampleCount number of samples to use for multi-sampled anti-aliasing.\n
	 *              0: treated as 1
	 *              1: no anti-aliasing
	 *              n: sample count. Effective sample could be different depending on the
	 *                 GPU capabilities.
	 */
	sampleCount = 4;

	/**
	 * custom resolve improves quality for HDR scenes, but may impact performance.
	 */
	customResolve = false;
}

export const QualityLevel = Object.freeze({
	LOW: 0,
	MEDIUM: 1,
	HIGH: 2,
	ULTRA: 3,
});

export class AmbientOcclusionOptions {
	static Build(
		a1,
		a2,
		a3,
		a4,
		a5,
		a6,
		a7,
		a8,
		a9,
		a10,
		a11,
		a12,
		a13,
		a14,
		a15,
		a16,
		a17,
		a18,
		a19,
		a20,
		a21,
		a22,
	) {
		let ret = new AmbientOcclusionOptions();
		ret.bentNormals = a1;
		ret.bias = a2;

		ret.bilateralThreshold = a3;
		ret.enabled = a4;
		ret.intensity = a5;
		ret.lowPassFilter = a6;
		ret.minHorizonAngleRad = a7;

		ret.power = a8;
		ret.quality = a9;
		ret.radius = a10;
		ret.resolution = a11;
		ret.upsampling = a12;

		ret.ssct.contactDistanceMax = a13;
		ret.ssct.depthBias = a14;
		ret.ssct.depthSlopeBias = a15;
		ret.ssct.enabled = a16;
		ret.ssct.intensity = a17;

		ret.ssct.lightConeRad = a18;
		ret.ssct.lightDirection = a19;
		ret.ssct.rayCount = a20;
		ret.ssct.sampleCount = a21;
		ret.ssct.shadowDistance = a22;
		return ret;
	}
	radius = 0.3; //!< Ambient Occlusion radius in meters, between 0 and ~10.
	power = 1.0; //!< Controls ambient occlusion's contrast. Must be positive.
	bias = 0.0005; //!< Self-occlusion bias in meters. Use to avoid self-occlusion. Between 0 and a few mm.
	resolution = 0.5; //!< How each dimension of the AO buffer is scaled. Must be either 0.5 or 1.0.
	intensity = 1.0; //!< Strength of the Ambient Occlusion effect.
	bilateralThreshold = 0.05; //!< depth distance that constitute an edge for filtering
	quality = QualityLevel.LOW; //!< affects # of samples used for AO.
	lowPassFilter = QualityLevel.MEDIUM; //!< affects AO smoothness
	upsampling = QualityLevel.LOW; //!< affects AO buffer upsampling quality
	enabled = false; //!< enables or disables screen-space ambient occlusion
	bentNormals = false; //!< enables bent normals computation from AO, and specular AO
	minHorizonAngleRad = 0.0; //!< min angle in radian to consider

	/**
	 * Screen Space Cone Tracing (SSCT) options
	 * Ambient shadows from dominant light
	 */
	ssct = {
		lightConeRad: 1.0, //!< full cone angle in radian, between 0 and pi/2
		shadowDistance: 0.3, //!< how far shadows can be cast
		contactDistanceMax: 1.0, //!< max distance for contact
		intensity: 0.8, //!< intensity
		lightDirection: vec3.fromValues(0, -1, 0), //!< light direction
		depthBias: 0.01, //!< depth bias in world units (mitigate self shadowing)
		depthSlopeBias: 0.01, //!< depth slope bias (mitigate self shadowing)
		sampleCount: 4, //!< tracing sample count, between 1 and 255
		rayCount: 1, //!< # of rays to trace, between 1 and 255
		enabled: false, //!< enables or disables SSCT
	};
}

/**
 * Options to control the bloom effect
 *
 * enabled:     Enable or disable the bloom post-processing effect. Disabled by default.
 *
 * levels:      Number of successive blurs to achieve the blur effect, the minimum is 3 and the
 *              maximum is 12. This value together with resolution influences the spread of the
 *              blur effect. This value can be silently reduced to accommodate the original
 *              image size.
 *
 * resolution:  Resolution of bloom's minor axis. The minimum value is 2^levels and the
 *              the maximum is lower of the original resolution and 4096. This parameter is
 *              silently clamped to the minimum and maximum.
 *              It is highly recommended that this value be smaller than the target resolution
 *              after dynamic resolution is applied (horizontally and vertically).
 *
 * strength:    how much of the bloom is added to the original image. Between 0 and 1.
 *
 * blendMode:   Whether the bloom effect is purely additive (false) or mixed with the original
 *              image (true).
 *
 * threshold:   When enabled, a threshold at 1.0 is applied on the source image, this is
 *              useful for artistic reasons and is usually needed when a dirt texture is used.
 *
 * dirt:        A dirt/scratch/smudges texture (that can be RGB), which gets added to the
 *              bloom effect. Smudges are visible where bloom occurs. Threshold must be
 *              enabled for the dirt effect to work properly.
 *
 * dirtStrength: Strength of the dirt texture.
 */
export class BloomOptions {
	static Build(
		a1,
		a2,
		a3,
		a4,
		a5,
		a6,
		a7,
		a8,
		a9,
		a10,
		a11,
		a12,
		a13,
		a14,
		a15,
		a16,
		a17,
		a18,
		a19,
	) {
		let ret = new BloomOptions();
		ret.blendMode = a1;
		ret.chromaticAberration = a2;
		ret.dirt = undefined; //TODO: texture support
		ret.dirtStrength = a4;
		ret.enabled = a5;

		ret.ghostCount = a6;
		ret.ghostSpacing = a7;
		ret.ghostThreshold = a8;
		ret.haloRadius = a9;
		ret.haloThickness = a10;

		ret.haloThreshold = a11;
		ret.highlight = a12;
		ret.lensFlare = a13;
		ret.levels = a14;
		ret.quality = a15;

		ret.resolution = a16;
		ret.starburst = a17;
		ret.strength = a18;
		ret.threshold = a19;
		return ret;
	}
	static BlendMode = Object.freeze({
		ADD: 0, //!< Bloom is modulated by the strength parameter and added to the scene
		INTERPOLATE: 1, //!< Bloom is interpolated with the scene using the strength parameter
	});
	dirt = undefined; //!< (TODO: texture type) user provided dirt texture
	dirtStrength = 0.2; //!< strength of the dirt texture
	strength = 0.1; //!< bloom's strength between 0.0 and 1.0
	resolution = 384; //!< {uint32_t} resolution of vertical axis (2^levels to 2048)
	levels = 6; //!< {uint8_t} number of blur levels (1 to 11)
	blendMode = BloomOptions.BlendMode.ADD; //!< how the bloom effect is applied
	threshold = true; //!< whether to threshold the source
	enabled = false; //!< enable or disable bloom
	highlight = 1000.0; //!< {float} limit highlights to this value before bloom [10, +inf]

	/**
	 * Bloom quality level.
	 * LOW (default): use a more optimized down-sampling filter, however there can be artifacts
	 *      with dynamic resolution, this can be alleviated by using the homogenous mode.
	 * MEDIUM: Good balance between quality and performance.
	 * HIGH: In this mode the bloom resolution is automatically increased to avoid artifacts.
	 *      This mode can be significantly slower on mobile, especially at high resolution.
	 *      This mode greatly improves the anamorphic bloom.
	 */
	quality = QualityLevel.LOW;

	lensFlare = false; //!< enable screen-space lens flare
	starburst = true; //!< enable starburst effect on lens flare
	chromaticAberration = 0.005; //!< amount of chromatic aberration
	ghostCount = 4; //!< {uint8_t} number of flare "ghosts"
	ghostSpacing = 0.6; //!< spacing of the ghost in screen units [0, 1[
	ghostThreshold = 10.0; //!< hdr threshold for the ghosts
	haloThickness = 0.1; //!< thickness of halo in vertical screen units, 0 to disable
	haloRadius = 0.4; //!< radius of halo in vertical screen units [0, 0.5]
	haloThreshold = 10.0; //!< hdr threshold for the halo
}

export const ShadowType = Object.freeze({
	PCF: 0, //!< percentage-closer filtered shadows (default)
	VSM: 1, //!< variance shadows
	DPCF: 2, //!< PCF with contact hardening simulation
	PCSS: 3, //!< PCF with soft shadows and contact hardening
	PCFd: 4, // for debugging only, don't use.
});

export class VsmShadowOptions {
	static Build(a1, a2, a3, a4, a5, a6) {
		let ret = new VsmShadowOptions();
		ret.anisotropy = a1;
		ret.highPrecision = a2;
		ret.lightBleedReduction = a3;
		ret.minVarianceScale = a4;
		ret.mipmapping = a5;
		ret.msaaSamples = a6;
		return ret;
	}
	/**
	 * {uint8_t}
	 * Sets the number of anisotropic samples to use when sampling a VSM shadow map. If greater
	 * than 0, mipmaps will automatically be generated each frame for all lights.
	 *
	 * The number of anisotropic samples = 2 ^ vsmAnisotropy.
	 */
	anisotropy = 0;

	/**
	 * Whether to generate mipmaps for all VSM shadow maps.
	 */
	mipmapping = false;

	/**
	 * {uint8_t}
	 * The number of MSAA samples to use when rendering VSM shadow maps.
	 * Must be a power-of-two and greater than or equal to 1. A value of 1 effectively turns
	 * off MSAA.
	 * Higher values may not be available depending on the underlying hardware.
	 */
	msaaSamples = 1;

	/**
	 * Whether to use a 32-bits or 16-bits texture format for VSM shadow maps. 32-bits
	 * precision is rarely needed, but it does reduces light leaks as well as "fading"
	 * of the shadows in some situations. Setting highPrecision to true for a single
	 * shadow map will double the memory usage of all shadow maps.
	 */
	highPrecision = false;

	/**
	 * VSM minimum variance scale, must be positive.
	 */
	minVarianceScale = 0.5;

	/**
	 * VSM light bleeding reduction amount, between 0 and 1.
	 */
	lightBleedReduction = 0.15;
}

export class SoftShadowOptions {
	static Build(a1, a2) {
		let ret = new SoftShadowOptions();
		ret.penumbraRatioScale = a1;
		ret.penumbraScale = a2;
		return ret;
	}
	/**
	 * Globally scales the penumbra of all DPCF and PCSS shadows
	 * Acceptable values are greater than 0
	 */
	penumbraScale = 1.0;

	/**
	 * Globally scales the computed penumbra ratio of all DPCF and PCSS shadows.
	 * This effectively controls the strength of contact hardening effect and is useful for
	 * artistic purposes. Higher values make the shadows become softer faster.
	 * Acceptable values are equal to or greater than 1.
	 */
	penumbraRatioScale = 1.0;
}

export const BlendMode = Object.freeze({
	OPAQUE: 0,
	TRANSLUCENT: 1,
});

/**
 * Options to control Depth of Field (DoF) effect in the scene.
 *
 * cocScale can be used to set the depth of field blur independently from the camera
 * aperture, e.g. for artistic reasons. This can be achieved by setting:
 *      cocScale = cameraAperture / desiredDoFAperture
 */
export class DepthOfFieldOptions {
	static Filter = Object.freeze({
		NONE: 0,
		UNUSED: 1,
		MEDIAN: 2,
	});
	cocScale = 1.0; //!< circle of confusion scale factor (amount of blur)
	cocAspectRatio = 1.0; //!< width/height aspect ratio of the circle of confusion
	maxApertureDiameter = 0.01; //!< maximum aperture diameter in meters (zero to disable rotation)
	enabled = false; //!< enable or disable depth of field effect
	filter = DepthOfFieldOptions.Filter.MEDIAN; //!< filter to use for filling gaps in the kernel
	nativeResolution = false; //!< perform DoF processing at native resolution
	/**
	 * Number of of rings used by the gather kernels. The number of rings affects quality
	 * and performance. The actual number of sample per pixel is defined
	 * as (ringCount * 2 - 1)^2. Here are a few commonly used values:
	 *       3 rings :   25 ( 5x 5 grid)
	 *       4 rings :   49 ( 7x 7 grid)
	 *       5 rings :   81 ( 9x 9 grid)
	 *      17 rings : 1089 (33x33 grid)
	 *
	 * With a maximum circle-of-confusion of 32, it is never necessary to use more than 17 rings.
	 *
	 * Usually all three settings below are set to the same value, however, it is often
	 * acceptable to use a lower ring count for the "fast tiles", which improves performance.
	 * Fast tiles are regions of the screen where every pixels have a similar
	 * circle-of-confusion radius.
	 *
	 * A value of 0 means default, which is 5 on desktop and 3 on mobile.
	 *
	 * @{
	 */
	foregroundRingCount = 0; //!< {uint8_t} number of kernel rings for foreground tiles
	backgroundRingCount = 0; //!< {uint8_t} number of kernel rings for background tiles
	fastGatherRingCount = 0; //!< {uint8_t} number of kernel rings for fast tiles
	/** @}*/

	/**
	 * maximum circle-of-confusion in pixels for the foreground, must be in [0, 32] range.
	 * A value of 0 means default, which is 32 on desktop and 24 on mobile.
	 * {uint16_t}
	 */
	maxForegroundCOC = 0;

	/**
	 * maximum circle-of-confusion in pixels for the background, must be in [0, 32] range.
	 * A value of 0 means default, which is 32 on desktop and 24 on mobile.
	 * {uint16_t}
	 */
	maxBackgroundCOC = 0;
}

export class View {
	constructor(internal) {
		this.internal = internal;
	}

	/**
	 *
	 * @param {string} name
	 */
	SetName(name) {
		binding.View$SetName(this.internal, name);
	}
	/**
	 *
	 * @returns {string}
	 */
	GetName() {
		return binding.View$GetName(this.internal);
	}
	/**
	 *
	 * @param {Scene} Scene
	 */
	SetScene(scene) {
		binding.View$SetScene(this.internal, scene.internal);
	}
	/**
	 *
	 * @returns {Scene}
	 */
	GetScene() {
		return binding.View$GetScene(this.internal);
	}

	/**
	 *
	 * @param {RenderTarget} renderTarget
	 */
	SetRenderTarget(renderTarget) {
		binding.View$SetRenderTarget(this.internal, renderTarget.internal);
	}

	/**
	 * @returns {RenderTarget}
	 */
	GetRenderTarget() {
		return new RenderTarget(binding.View$GetRenderTarget(this.internal));
	}

	/**
	 *
	 * @param {Viewport} viewport
	 */
	SetViewport(viewport) {
		binding.View$SetViewport(
			this.internal,
			Math.floor(viewport.left),
			Math.floor(viewport.bottom),
			Math.floor(viewport.width),
			Math.floor(viewport.height),
		);
	}

	/**
	 * @returns {Viewport}
	 */
	GetViewport() {
		return binding.View$GetViewport(this.internal, Viewport.Build);
	}

	/**
	 *
	 * @param {entity} camera
	 * @returns {boolean}
	 */
	SetCamera(cameraEntity) {
		return binding.View$SetCamera(this.internal, cameraEntity);
	}
	/**
	 * @returns {entity}
	 */
	GetCamera() {
		return binding.View$GetCamera(this.internal);
	}
	/**
	 *
	 * @param {number} blendMode BlendMode enum
	 */
	SetBlendMode(blendMode) {
		binding.View$SetBlendMode(this.internal, blendMode);
	}
	/**
	 *
	 * @returns {number} BlendMode enum
	 */
	GetBlendMode() {
		return binding.View$GetBlendMode(this.internal);
	}
	/**
	 *
	 * @param {uint8} select
	 * @param {uint8} values
	 */
	SetVisibleLayers(select, values) {
		binding.View$SetVisibleLayers(this.internal, select, values);
	}
	/**
	 *
	 * @param {int} layer
	 * @param {boolean} enabled
	 */
	SetLayerEnabled(layer, enabled) {
		binding.View$SetLayerEnabled(this.internal, layer, enabled);
	}
	/**
	 * @returns {uint8}
	 */
	GetVisibleLayers() {
		return binding.View$GetVisibleLayers(this.internal);
	}
	/**
	 *
	 * @param {boolean} enabled
	 */
	SetShadowingEnabled(enabled) {
		binding.View$SetShadowingEnabled(this.internal, enabled);
	}
	/**
	 *
	 * @returns {boolean}
	 */
	IsShadowingEnabled() {
		return binding.View$IsShadowingEnabled(this.internal);
	}

	/**
	 * Enables or disables screen space refraction. Enabled by default.
	 *
	 * @param {Boolean} enabled true enables screen space refraction, false disables it.
	 */
	SetScreenSpaceRefractionEnabled(enabled) {
		binding.View$SetScreenSpaceRefractionEnabled(this.internal, enabled);
	}

	/**
	 * @return {Boolean} whether screen space refraction is enabled
	 */
	IsScreenSpaceRefractionEnabled() {
		return binding.View$IsScreenSpaceRefractionEnabled(this.internal);
	}

	/**
	 * Enables or disables anti-aliasing in the post-processing stage. Enabled by default.
	 * MSAA can be enabled in addition, see setSampleCount().
	 *
	 * @param {AntiAliasing} type FXAA for enabling, NONE for disabling anti-aliasing.
	 *
	 * @note For MSAA anti-aliasing, see setSamplerCount().
	 *
	 */
	SetAntiAliasing(type) {
		binding.View$SetAntiAliasing(this.internal, type);
	}

	/**
	 * Queries whether anti-aliasing is enabled during the post-processing stage. To query
	 * whether MSAA is enabled, see getSampleCount().
	 *
	 * @return {AntiAliasing} The post-processing anti-aliasing method.
	 */
	GetAntiAliasing() {
		return binding.View$GetAntiAliasing(this.internal);
	}

	/**
	 * Enables or disable temporal anti-aliasing (TAA). Disabled by default.
	 *
	 * @param {TemporalAntiAliasingOptions} options temporal anti-aliasing options
	 */
	SetTemporalAntiAliasingOptions(options) {
		binding.View$SetTemporalAntiAliasingOptions(
			this.internal,
			options.boxClipping,
			options.boxType,
			options.enabled,
			options.feedback,
			options.filterHistory,

			options.filterInput,
			options.filterWidth,
			options.historyReprojection,
			options.jitterPattern,
			options.lodBias,

			options.preventFlickering,
			options.sharpness,
			options.upscaling,
			options.useYCoCg,
			options.varianceGamma,
		);
	}

	/**
	 * Returns temporal anti-aliasing options.
	 *
	 * @return {TemporalAntiAliasingOptions} temporal anti-aliasing options
	 */
	GetTemporalAntiAliasingOptions() {
		return binding.View$GetTemporalAntiAliasingOptions(
			this.internal,
			TemporalAntiAliasingOptions.Build,
		);
	}

	/**
	 * Enables or disable screen-space reflections. Disabled by default.
	 *
	 * @param {ScreenSpaceReflectionsOptions} options screen-space reflections options
	 */
	SetScreenSpaceReflectionsOptions(options) {
		binding.View$SetScreenSpaceReflectionsOptions(
			this.internal,
			options.bias,
			options.enabled,
			options.maxDistance,
			options.stride,
			options.thickness,
		);
	}

	/**
	 * Returns screen-space reflections options.
	 *
	 * @return {ScreenSpaceReflectionsOptions} screen-space reflections options
	 */
	GetScreenSpaceReflectionsOptions() {
		return binding.View$GetScreenSpaceReflectionsOptions(
			this.internal,
			ScreenSpaceReflectionsOptions.Build,
		);
	}

	/**
	 * Enables or disable screen-space guard band. Disabled by default.
	 *
	 * @param {GuardBandOptions} options guard band options
	 */
	SetGuardBandOptions(options) {
		binding.View$SetGuardBandOptions(this.internal, options.enabled);
	}

	/**
	 * Returns screen-space guard band options.
	 *
	 * @return {GuardBandOptions} guard band options
	 */
	GetGuardBandOptions() {
		return binding.View$GetGuardBandOptions(
			this.internal,
			GuardBandOptions.Build,
		);
	}

	/**
	 * Enables or disable multi-sample anti-aliasing (MSAA). Disabled by default.
	 *
	 * @param {MultiSampleAntiAliasingOptions} options multi-sample anti-aliasing options
	 */
	SetMultiSampleAntiAliasingOptions(options) {
		binding.View$SetMultiSampleAntiAliasingOptions(
			this.internal,
			options.customResolve,
			options.enabled,
			options.sampleCount,
		);
	}

	/**
	 * Returns multi-sample anti-aliasing options.
	 *
	 * @return {MultiSampleAntiAliasingOptions} multi-sample anti-aliasing options
	 */
	GetMultiSampleAntiAliasingOptions() {
		return binding.View$GetMultiSampleAntiAliasingOptions(
			this.internal,
			MultiSampleAntiAliasingOptions.Build,
		);
	}

	/**
	 * Sets this View's color grading transforms.
	 *
	 * @param colorGrading Associate the specified ColorGrading to this View. A ColorGrading can be
	 *                     associated to several View instances.\n
	 *                     \p colorGrading can be nullptr to dissociate the currently set
	 *                     ColorGrading from this View. Doing so will revert to the use of the
	 *                     default color grading transforms.\n
	 *                     The View doesn't take ownership of the ColorGrading pointer (which
	 *                     acts as a reference).
	 *
	 * @note
	 *  There is no reference-counting.
	 *  Make sure to dissociate a ColorGrading from all Views before destroying it.
	 */
	SetColorGrading(colorGrading) {
		throw "todo";
	}

	/**
	 * Returns the color grading transforms currently associated to this view.
	 * @return A pointer to the ColorGrading associated to this View.
	 */
	GetColorGrading() {
		throw "todo";
	}

	/**
	 * Sets ambient occlusion options.
	 *
	 * @param {AmbientOcclusionOptions} options Options for ambient occlusion.
	 */
	SetAmbientOcclusionOptions(options) {
		binding.View$SetAmbientOcclusionOptions(
			this.internal,
			options.bentNormals,
			options.bias,

			options.bilateralThreshold,
			options.enabled,
			options.intensity,
			options.lowPassFilter,
			options.minHorizonAngleRad,

			options.power,
			options.quality,
			options.radius,
			options.resolution,
			options.upsampling,

			options.ssct.contactDistanceMax,
			options.ssct.depthBias,
			options.ssct.depthSlopeBias,
			options.ssct.enabled,
			options.ssct.intensity,

			options.ssct.lightConeRad,
			options.ssct.lightDirection,
			options.ssct.rayCount,
			options.ssct.sampleCount,
			options.ssct.shadowDistance,
		);
	}

	/**
	 * Gets the ambient occlusion options.
	 *
	 * @return {AmbientOcclusionOptions} ambient occlusion options currently set.
	 */
	GetAmbientOcclusionOptions() {
		return binding.View$GetAmbientOcclusionOptions(
			this.internal,
			AmbientOcclusionOptions.Build,
			vec3.fromValues,
		);
	}

	/**
	 * Enables or disables bloom in the post-processing stage. Disabled by default.
	 *
	 * @param {BloomOptions} options options
	 */
	SetBloomOptions(options) {
		binding.View$SetBloomOptions(
			this.internal,
			options.blendMode,
			options.chromaticAberration,
			options.dirt,
			options.dirtStrength,
			options.enabled,

			options.ghostCount,
			options.ghostSpacing,
			options.ghostThreshold,
			options.haloRadius,
			options.haloThickness,

			options.haloThreshold,
			options.highlight,
			options.lensFlare,
			options.levels,
			options.quality,

			options.resolution,
			options.starburst,
			options.strength,
			options.threshold,
		);
	}

	/**
	 * Queries the bloom options.
	 *
	 * @return {BloomOptions} the current bloom options for this view.
	 */
	GetBloomOptions() {
		return binding.View$GetBloomOptions(this.internal, BloomOptions.Build);
	}

	/**
	 * Enables or disables fog. Disabled by default.
	 *
	 * @param options options
	 */
	// void setFogOptions(FogOptions options) noexcept;

	/**
	 * Queries the fog options.
	 *
	 * @return the current fog options for this view.
	 */
	// FogOptions getFogOptions() const noexcept;

	/**
	 * Enables or disables Depth of Field. Disabled by default.
	 *
	 * @param options options
	 */
	// void setDepthOfFieldOptions(DepthOfFieldOptions options) noexcept;

	/**
	 * Queries the depth of field options.
	 *
	 * @return the current depth of field options for this view.
	 */
	// DepthOfFieldOptions getDepthOfFieldOptions() const noexcept;

	/**
	 * Enables or disables the vignetted effect in the post-processing stage. Disabled by default.
	 *
	 * @param options options
	 */
	// void setVignetteOptions(VignetteOptions options) noexcept;

	/**
	 * Queries the vignette options.
	 *
	 * @return the current vignette options for this view.
	 */
	// VignetteOptions getVignetteOptions() const noexcept;

	/**
	 * Enables or disables dithering in the post-processing stage. Enabled by default.
	 *
	 * @param dithering dithering type
	 */
	// void setDithering(Dithering dithering) noexcept;

	/**
	 * Queries whether dithering is enabled during the post-processing stage.
	 *
	 * @return the current dithering type for this view.
	 */
	// Dithering getDithering() const noexcept;

	/**
	 * Sets the dynamic resolution options for this view. Dynamic resolution options
	 * controls whether dynamic resolution is enabled, and if it is, how it behaves.
	 *
	 * @param options The dynamic resolution options to use on this view
	 */
	// void setDynamicResolutionOptions(DynamicResolutionOptions const& options) noexcept;

	/**
	 * Returns the dynamic resolution options associated with this view.
	 * @return value set by setDynamicResolutionOptions().
	 */
	// DynamicResolutionOptions getDynamicResolutionOptions() const noexcept;

	/**
	 * Sets the rendering quality for this view. Refer to RenderQuality for more
	 * information about the different settings available.
	 *
	 * @param renderQuality The render quality to use on this view
	 */
	// void setRenderQuality(RenderQuality const& renderQuality) noexcept;

	/**
	 * Returns the render quality used by this view.
	 * @return value set by setRenderQuality().
	 */
	// RenderQuality getRenderQuality() const noexcept;

	/**
	 * Sets options relative to dynamic lighting for this view.
	 *
	 * @param {number} zLightNear Distance from the camera where the lights are expected to shine.
	 *                   This parameter can affect performance and is useful because depending
	 *                   on the scene, lights that shine close to the camera may not be
	 *                   visible -- in this case, using a larger value can improve performance.
	 *                   e.g. when standing and looking straight, several meters of the ground
	 *                   isn't visible and if lights are expected to shine there, there is no
	 *                   point using a short zLightNear. (Default 5m).
	 *
	 * @param {number} zLightFar Distance from the camera after which lights are not expected to be visible.
	 *                  Similarly to zLightNear, setting this value properly can improve
	 *                  performance. (Default 100m).
	 *
	 *
	 * Together zLightNear and zLightFar must be chosen so that the visible influence of lights
	 * is spread between these two values.
	 *
	 */
	SetDynamicLightingOptions(zLightNear, zLightFar) {
		binding.View$SetDynamicLightingOptions(
			this.internal,
			zLightNear,
			zLightFar,
		);
	}

	/**
	 * Set the shadow mapping technique this View uses.
	 *
	 * The ShadowType affects all the shadows seen within the View.
	 *
	 * ShadowType::VSM imposes a restriction on marking renderables as only shadow receivers (but
	 * not casters). To ensure correct shadowing with VSM, all shadow participant renderables should
	 * be marked as both receivers and casters. Objects that are guaranteed to not cast shadows on
	 * themselves or other objects (such as flat ground planes) can be set to not cast shadows,
	 * which might improve shadow quality.
	 *
	 * @param {ShadowType} shadow
	 */
	SetShadowType(shadow) {
		binding.View$SetShadowType(this.internal, shadow);
	}

	/**
	 * Sets VSM shadowing options that apply across the entire View.
	 *
	 * Additional light-specific VSM options can be set with LightManager::setShadowOptions.
	 *
	 * Only applicable when shadow type is set to ShadowType::VSM.
	 *
	 * @param {VsmShadowOptions} options Options for shadowing.
	 *
	 */
	SetVsmShadowOptions(options) {
		binding.View$SetVsmShadowOptions(
			this.internal,
			options.anisotropy,
			options.highPrecision,
			options.lightBleedReduction,
			options.minVarianceScale,
			options.mipmapping,
			options.msaaSamples,
		);
	}

	/**
	 * Returns the VSM shadowing options associated with this View.
	 *
	 * @return value set by setVsmShadowOptions().
	 */
	GetVsmShadowOptions() {
		return binding.View$GetVsmShadowOptions(this.internal);
	}

	/**
	 * Sets soft shadowing options that apply across the entire View.
	 *
	 * Additional light-specific soft shadow parameters can be set with LightManager::setShadowOptions.
	 *
	 * Only applicable when shadow type is set to ShadowType::DPCF or ShadowType::PCSS.
	 *
	 * @param {SoftShadowOptions} options Options for shadowing.
	 *
	 * @see setShadowType
	 *
	 * @warning This API is still experimental and subject to change.
	 */
	SetSoftShadowOptions(options) {
		binding.View$SetSoftShadowOptions(
			this.internal,
			options.penumbraRatioScale,
			options.penumbraScale,
		);
	}

	/**
	 * Returns the soft shadowing options associated with this View.
	 *
	 * @return value set by setSoftShadowOptions().
	 */
	GetSoftShadowOptions() {
		return binding.View$GetSoftShadowOptions(
			this.internal,
			SoftShadowOptions.Build,
		);
	}
	/**
	 * Enables or disables post processing. Enabled by default.
	 *
	 * Post-processing includes:
	 *  - Depth-of-field
	 *  - Bloom
	 *  - Vignetting
	 *  - Temporal Anti-aliasing (TAA)
	 *  - Color grading & gamma encoding
	 *  - Dithering
	 *  - FXAA
	 *  - Dynamic scaling
	 *
	 * Disabling post-processing forgoes color correctness as well as some anti-aliasing techniques
	 * and should only be used for debugging, UI overlays or when using custom render targets
	 * (see RenderTarget).
	 *
	 * @param {Boolean} enabled true enables post processing, false disables it.
	 *
	 */
	SetPostProcessingEnabled(enabled) {
		binding.View$SetPostProcessingEnabled(this.internal, enabled);
	}

	//! Returns true if post-processing is enabled. See setPostProcessingEnabled() for more info.
	IsPostProcessingEnabled() {
		return binding.View$IsPostProcessingEnabled(this.internal);
	}

	/**
	 * Inverts the winding order of front faces. By default front faces use a counter-clockwise
	 * winding order. When the winding order is inverted, front faces are faces with a clockwise
	 * winding order.
	 *
	 * Changing the winding order will directly affect the culling mode in materials
	 * (see Material::getCullingMode()).
	 *
	 * Inverting the winding order of front faces is useful when rendering mirrored reflections
	 * (water, mirror surfaces, front camera in AR, etc.).
	 *
	 * @param {Boolean} inverted True to invert front faces, false otherwise.
	 */
	SetFrontFaceWindingInverted(inverted) {
		binding.View$SetFrontFaceWindingInverted(this.internal, inverted);
	}

	/**
	 * Returns true if the winding order of front faces is inverted.
	 * See setFrontFaceWindingInverted() for more information.
	 *
	 * @returns {Boolean}
	 */
	IsFrontFaceWindingInverted() {
		return binding.View$IsFrontFaceWindingInverted(this.internal);
	}

	/**
	 * Enables use of the stencil buffer.
	 *
	 * The stencil buffer is an 8-bit, per-fragment unsigned integer stored alongside the depth
	 * buffer. The stencil buffer is cleared at the beginning of a frame and discarded after the
	 * color pass.
	 *
	 * Each fragment's stencil value is set during rasterization by specifying stencil operations on
	 * a Material. The stencil buffer can be used as a mask for later rendering by setting a
	 * Material's stencil comparison function and reference value. Fragments that don't pass the
	 * stencil test are then discarded.
	 *
	 * If post-processing is disabled, then the SwapChain must have the CONFIG_HAS_STENCIL_BUFFER
	 * flag set in order to use the stencil buffer.
	 *
	 * A renderable's priority (see RenderableManager::setPriority) is useful to control the order
	 * in which primitives are drawn.
	 *
	 * @param {Boolean} enabled True to enable the stencil buffer, false disables it (default)
	 */
	SetStencilBufferEnabled(enabled) {
		binding.View$SetStencilBufferEnabled(this.internal, enabled);
	}

	/**
	 * Returns true if the stencil buffer is enabled.
	 * See setStencilBufferEnabled() for more information.
	 *
	 * @returns {Boolean}
	 */
	IsStencilBufferEnabled() {
		return binding.View$IsStencilBufferEnabled(this.internal);
	}

	/**
	 *
	 * @param {uint32_t} xPos
	 * @param {uint32_t} yPos
	 * @param {*} fn
	 */
	Pick(xPos, yPos, fn) {
		binding.View$Pick(this.internal, xPos, yPos, (entity) => {
			fn(entity);
		});
	}

	/**
	 * Get an Entity representing the large scale fog object.
	 * This entity is always inherited by the View's Scene.
	 *
	 * It is for example possible to create a TransformManager component with this
	 * Entity and apply a transformation globally on the fog.
	 *
	 * @return {Entity} an Entity representing the large scale fog object.
	 */
	GetFogEntity() {
		return binding.View$GetFogEntity(this.internal);
	}
}
