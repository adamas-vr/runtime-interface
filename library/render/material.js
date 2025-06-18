import { Texture } from "./texture.js";
import { TextureSampler } from "./texture-sampler.js";

export class Material
{
    constructor(internal) {
        this.internal = internal;
    }

    CreateInstance(name) {
        if (name == undefined)
            name = this.GetName();
        return new MaterialInstance(binding.Material$CreateInstance(this.internal, name))
    }
    GetName() {
        return binding.Material$GetName(this.internal);
    }
    GetShading() {
        return enumToString(binding.Material$GetShading(this.internal), Shading);
    }
    GetInterpolation() {
        return enumToString(binding.Material$GetInterpolation(this.internal), Interpolation);
    }
    GetBlendingMode() {
        return enumToString(binding.Material$GetBlendingMode(this.internal), BlendingMode);
    }
    GetVertexDomain() {
        return enumToString(binding.Material$GetVertexDomain(this.internal), VertexDomain);
    }
    GetSupportedVariants() {
        return binding.Material$GetSupportedVariants(this.internal);
    }
    GetMaterialDomain() {
        return enumToString(binding.Material$GetMaterialDomain(this.internal), MaterialDomain);
    }
    GetCullingMode() {
        return enumToString(binding.Material$GetCullingMode(this.internal), CullingMode);
    }
    GetTransparencyMode() {
        return enumToString(binding.Material$GetTransparencyMode(this.internal), TransparencyMode);
    }
    /**
     * 
     * @returns {boolean}
     */
    IsColorWriteEnabled() {
        return binding.Material$IsColorWriteEnabled(this.internal);
    }
    /**
     * 
     * @returns {boolean}
     */
    IsDepthWriteEnabled() {
        return binding.Material$IsDepthWriteEnabled(this.internal);
    }
    /**
     * 
     * @returns {boolean}
     */
    IsDepthCullingEnabled() {
        return binding.Material$IsDepthCullingEnabled(this.internal);
    }
    /**
     * 
     * @returns {boolean}
     */
    IsDoubleSided() {
        return binding.Material$IsDoubleSided(this.internal);
    }
    /**
     * 
     * @returns {boolean}
     */
    IsAlphaToCoverageEnabled() {
        return binding.Material$IsAlphaToCoverageEnabled(this.internal);
    }
    /**
     * Returns the alpha mask threshold used when the blending mode is set to masked.
     * @returns {number} float
     */
    GetMaskThreshold() {
        return binding.Material$GetMaskThreshold(this.internal);
    }
    /**
     * 
     * @returns {boolean}
     */
    HasShadowMultiplier() {
        return binding.Material$HasShadowMultiplier(this.internal);
    }
    /**
     * 
     * @returns {boolean}
     */
    HasSpecularAntiAliasing() {
        return binding.Material$HasSpecularAntiAliasing(this.internal);
    }
    /**
     * 
     * @returns {number}
     */
    GetSpecularAntiAliasingVariance() {
        return binding.Material$GetSpecularAntiAliasingVariance(this.internal);
    }
    /**
     * 
     * @returns {number}
     */
    GetSpecularAntiAliasingThreshold() {
        return binding.Material$GetSpecularAntiAliasingThreshold(this.internal);
    }

    GetRequiredAttributes() {
        return binding.Material$GetRequiredAttributes(this.internal);
    }
    GetRefractionMode() {
        return enumToString(binding.Material$GetRefractionMode(this.internal), RefractionMode);
    }
    GetRefractionType() {
        return enumToString(binding.Material$GetRefractionType(this.internal), RefractionType);
    }
    GetReflectionMode() {
        return enumToString(binding.Material$GetReflectionMode(this.internal), ReflectionMode);
    }
    GetFeatureLevel() {
        return binding.Material$GetFeatureLevel(this.internal);
    }

    /**
     * @returns {number}
     */
    GetParameterCount() {
        return binding.Material$GetParameterCount(this.internal);
    }
    /**
     * @returns {ParameterInfo[]}
     */
    GetParameters() {
        return binding.Material$GetParameters(this.internal, ParameterInfo.Build);
    }
    /**
     * 
     * @param {string} name 
     * @returns {boolean}
     */
    HasParameter(name) {
        return binding.Material$HasParameter(this.internal, name);
    }
    /**
     * 
     * @param {string} name 
     * @returns {boolean}
     */
    IsSampler(name) {
        return binding.Material$isSampler(this.internal, name);
    }

    GetDefaultInstance() {
        return new MaterialInstance(binding.Material$GetDefaultInstance(this.internal));
    }

    internal
}

export class MaterialBuilder
{
    Build() {
        if (this.payload == undefined)
            throw "Material payload is not defined.";
        return new Material(binding.MaterialBuilder$Build(this.payload));
    }
    Package(payload) {
        this.payload = payload;
        return this;
    }
    payload = undefined;
}

export class ParameterInfo
{
    static Build(name,
        isSampler, isSubpass,
        parameterType, samplerType, subpassType,
        count, precision)
    {
        let info = new ParameterInfo();
        info.name = name;
        info.isSampler = isSampler;
        info.isSubpass = isSubpass;
        info.parameterType = (isSampler || isSubpass)? undefined: enumToString(parameterType, UniformType);
        info.samplerType = isSampler? enumToString(samplerType, SamplerType): undefined;
        info.subpassType = isSubpass? enumToString(subpassType, SubpassType): undefined;
        info.count = count;
        info.precision = precision;
        return info;
    }
    //! Name of the parameter.
    name = undefined; 
    //! Whether the parameter is a sampler (texture).
    isSampler = undefined;
    //! Whether the parameter is a subpass type.
    isSubpass = undefined;
    //! Type of the parameter if the parameter is not a sampler.
    parameterType = undefined;
     //! Type of the parameter if the parameter is a sampler.
    samplerType = undefined;
    //! Type of the parameter if the parameter is a subpass.
    subpassType = undefined;
    //! Size of the parameter when the parameter is an array.
    count = undefined;
    //! Requested precision of the parameter.
    precision = undefined;
};

let enumToString = (value, obj) => {
    return Object.keys(obj).find(k=>obj[k]===value);
}

export const UniformType = Object.freeze({
    BOOL: 0,
    BOOL2: 1,
    BOOL3: 2,
    BOOL4: 3,
    FLOAT: 4,
    FLOAT2: 5,
    FLOAT3: 6,
    FLOAT4: 7,
    INT: 8,
    INT2: 9,
    INT3: 10,
    INT4: 11,
    UINT: 12,
    UINT2: 13,
    UINT3: 14,
    UINT4: 15,
    MAT3: 16,   //!< a 3x3 float matrix
    MAT4: 17,   //!< a 4x4 float matrix
    STRUCT: 18
});

export const Precision = Object.freeze({
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
    DEFAULT: 3
});


export const SubpassType = Object.freeze({
    SUBPASS_INPUT: 0
});

export const SamplerType = Object.freeze({
    SAMPLER_2D: 0,             //!< 2D texture
    SAMPLER_2D_ARRAY: 1,       //!< 2D array texture
    SAMPLER_CUBEMAP: 2,        //!< Cube map texture
    SAMPLER_EXTERNAL: 3,       //!< External texture
    SAMPLER_3D: 4,             //!< 3D texture
    SAMPLER_CUBEMAP_ARRAY: 5,  //!< Cube map array texture (feature level 2)
});

export const FeatureLevel = Object.freeze({
    FEATURE_LEVEL_0: 0,      //!< OpenGL ES 2.0 features
    FEATURE_LEVEL_1: 1,      //!< OpenGL ES 3.0 features (default)
    FEATURE_LEVEL_2: 2,      //!< OpenGL ES 3.1 features + 16 textures units + cubemap arrays
    FEATURE_LEVEL_3: 3       //!< OpenGL ES 3.1 features + 31 textures units + cubemap arrays
});

export const Shading = Object.freeze({
    UNLIT: 0,                  //!< no lighting applied, emissive possible
    LIT: 1,                    //!< default, standard lighting
    SUBSURFACE: 2,             //!< subsurface lighting model
    CLOTH: 3,                  //!< cloth lighting model
    SPECULAR_GLOSSINESS: 4,    //!< legacy lighting model
});

export const Interpolation = Object.freeze({
    SMOOTH: 0,                 //!< default, smooth interpolation
    FLAT: 1                    //!< flat interpolation
});

export const BlendingMode = Object.freeze({
    //! material is opaque
    OPAQUE: 0,
    //! material is transparent and color is alpha-pre-multiplied, affects diffuse lighting only
    TRANSPARENT: 1,
    //! material is additive (e.g.: hologram)
    ADD: 2,
    //! material is masked (i.e. alpha tested)
    MASKED: 3,
    /**
     * material is transparent and color is alpha-pre-multiplied, affects specular lighting
     * when adding more entries, change the size of FRenderer::CommandKey::blending
     */
    FADE: 4,
    //! material darkens what's behind it
    MULTIPLY: 5,
    //! material brightens what's behind it
    SCREEN: 6,
});

export const VertexDomain = Object.freeze({
    OBJECT: 0,                 //!< vertices are in object space, default
    WORLD: 1,                  //!< vertices are in world space
    VIEW: 2,                   //!< vertices are in view space
    DEVICE: 3                  //!< vertices are in normalized device space
    // when adding more entries, make sure to update VERTEX_DOMAIN_COUNT
});

export const MaterialDomain = Object.freeze({
    SURFACE         : 0, //!< shaders applied to renderables
    POST_PROCESS    : 1, //!< shaders applied to rendered buffers
    COMPUTE         : 2, //!< compute shader
});

export const CullingMode = Object.freeze({
    NONE: 0,               //!< No culling, front and back faces are visible
    FRONT: 1,              //!< Front face culling, only back faces are visible
    BACK: 2,               //!< Back face culling, only front faces are visible
    FRONT_AND_BACK: 3      //!< Front and Back, geometry is not visible
});

export const TransparencyMode = Object.freeze({
    //! the transparent object is drawn honoring the raster state
    DEFAULT: 0,
    /**
     * the transparent object is first drawn in the depth buffer,
     * then in the color buffer, honoring the culling mode, but ignoring the depth test function
     */
    TWO_PASSES_ONE_SIDE: 1,

    /**
     * the transparent object is drawn twice in the color buffer,
     * first with back faces only, then with front faces; the culling
     * mode is ignored. Can be combined with two-sided lighting
     */
    TWO_PASSES_TWO_SIDES: 2
});

/**
 * Refraction
 */
export const RefractionMode = Object.freeze({
    NONE            : 0, //!< no refraction
    CUBEMAP         : 1, //!< refracted rays go to the ibl cubemap
    SCREEN_SPACE    : 2, //!< refracted rays go to screen space
});

/**
 * Refraction type
 */
export const RefractionType = Object.freeze({
    SOLID           : 0, //!< refraction through solid objects (e.g. a sphere)
    THIN            : 1, //!< refraction through thin objects (e.g. window)
});

/**
 * Reflection mode
 */
export const ReflectionMode = Object.freeze({
    DEFAULT         : 0, //! reflections sample from the scene's IBL only
    SCREEN_SPACE    : 1, //! reflections sample from screen space, and fallback to the scene's IBL
});

export const RgbType = Object.freeze({
    /**
     * the color is defined in Rec.709-sRGB-D65 (sRGB) space
     */
    sRGB: 0,

    /**
     * the color is defined in Rec.709-Linear-D65 ("linear sRGB") space
     */
    LINEAR: 1
});

//! types of RGBA colors
export const RgbaType = Object.freeze({
    /**
     * the color is defined in Rec.709-sRGB-D65 (sRGB) space and the RGB values
     * have not been pre-multiplied by the alpha (for instance, a 50%
     * transparent red is <1,0,0,0.5>)
     */
    sRGB: 0,
    /**
     * the color is defined in Rec.709-Linear-D65 ("linear sRGB") space and the
     * RGB values have not been pre-multiplied by the alpha (for instance, a 50%
     * transparent red is <1,0,0,0.5>)
     */
    LINEAR: 1,
    /**
     * the color is defined in Rec.709-sRGB-D65 (sRGB) space and the RGB values
     * have been pre-multiplied by the alpha (for instance, a 50%
     * transparent red is <0.5,0,0,0.5>)
     */
    PREMULTIPLIED_sRGB: 2,
    /**
     * the color is defined in Rec.709-Linear-D65 ("linear sRGB") space and the
     * RGB values have been pre-multiplied by the alpha (for instance, a 50%
     * transparent red is <0.5,0,0,0.5>)
     */
    PREMULTIPLIED_LINEAR: 3
});

export const SamplerCompareFunc = Object.freeze({
    LE: 0,         //!< Less or equal
    GE: 1,         //!< Greater or equal
    L:  2,         //!< Strictly less than
    G:  3,         //!< Strictly greater than
    E:  4,         //!< Equal
    NE: 5,         //!< Not equal
    A:  6,         //!< Always. Depth / stencil testing is deactivated.
    N:  7          //!< Never. The depth / stencil test always fails.
});

export const StencilFace = Object.freeze({
    FRONT          : 1,    //!< Update stencil state for front-facing polygons.
    BACK           : 2,    //!< Update stencil state for back-facing polygons.
    FRONT_AND_BACK : 3,    //!< Update stencil state for all polygons.
});

export const StencilOperation = Object.freeze({
    KEEP           : 1,    //!< Keeps the current value.
    ZERO           : 2,    //!< Sets the value to 0.
    REPLACE        : 3,    //!< Sets the value to the stencil reference value.
    INCR           : 4,    //!< Increments the current value. Clamps to the maximum representable unsigned value.
    INCR_WRAP      : 5,    //!< Increments the current value. Wraps value to zero when incrementing the maximum representable unsigned value.
    DECR           : 6,    //!< Decrements the current value. Clamps to 0.
    DECR_WRAP      : 7,    //!< Decrements the current value. Wraps value to the maximum representable unsigned value when decrementing a value of zero.
    INVERT         : 8     //!< Bitwise inverts the current value.
});

export class MaterialInstance
{
    constructor(internal) {
        this.internal = internal;
    }

    Duplicate(materialInstance, name) {
        return new MaterialInstance(binding.MaterialInstance$Duplicate(materialInstance.internal, name));
    }
    GetMaterial() {
        return new Material(binding.MaterialInstance$GetMaterial(this.internal));
    }
    GetName() {
        return binding.MaterialInstance$GetName(this.internal);
    }
    SetParameterValue(name, value) {
        binding.MaterialInstance$SetParameter(this.internal, 0, name, value);
    }
    SetParameterArray(name, valueArray) {
        binding.MaterialInstance$SetParameter(this.internal, 1, name, valueArray);
    }
    /**
     * 
     * @param {String} name 
     * @param {Texture} texture 
     * @param {TextureSampler} sampler 
     */
    SetParameterTexture(name, texture, sampler) {
        binding.MaterialInstance$SetParameter(this.internal, 2, name, texture.internal,
            sampler.filterMag, sampler.filterMin,
            sampler.wrapS, sampler.wrapT, sampler.wrapR,
            sampler.anisotropyLog2, sampler.compareMode, sampler.compareFunc
        );
    }
    SetParameterRGB(name, colorEncoding, color) {
        binding.MaterialInstance$SetParameter(this.internal, 3, name, colorEncoding, color);
    }
    SetParameterRGBA(name, colorEncoding, color) {
        binding.MaterialInstance$SetParameter(this.internal, 4, name, colorEncoding, color);
    }

    /**
     * Set-up a custom scissor rectangle; by default it is disabled.
     *
     * The scissor rectangle gets clipped by the View's viewport, in other words, the scissor
     * cannot affect fragments outside of the View's Viewport.
     *
     * Currently the scissor is not compatible with dynamic resolution and should always be
     * disabled when dynamic resolution is used.
     *
     * @param {int32} left      left coordinate of the scissor box relative to the viewport
     * @param {int32} bottom    bottom coordinate of the scissor box relative to the viewport
     * @param {int32} width     width of the scissor box
     * @param {int32} height    height of the scissor box
     *
     */
    SetScissor(left, bottom, width, height) {
        binding.MaterialInstance$SetScissor(this.internal, 
            Math.floor(left), Math.floor(bottom), Math.floor(width), Math.floor(height)
        );
    }

    /**
     * Returns the scissor rectangle to its default disabled setting.
     *
     * Currently the scissor is not compatible with dynamic resolution and should always be
     * disabled when dynamic resolution is used.
     *
     */
    UnsetScissor() {
        binding.MaterialInstance$UnsetScissor(this.internal);
    }

    /**
     * Sets a polygon offset that will be applied to all renderables drawn with this material
     * instance.
     *
     *  The value of the offset is scale * dz + r * constant, where dz is the change in depth
     *  relative to the screen area of the triangle, and r is the smallest value that is guaranteed
     *  to produce a resolvable offset for a given implementation. This offset is added before the
     *  depth test.
     *
     *  @warning using a polygon offset other than zero has a significant negative performance
     *  impact, as most implementations have to disable early depth culling. DO NOT USE unless
     *  absolutely necessary.
     *
     * @param {Number} scale scale factor used to create a variable depth offset for each triangle
     * @param {Number} constant scale factor used to create a constant depth offset for each triangle
     */
    SetPolygonOffset(scale, constant) {
        binding.MaterialInstance$SetPolygonOffset(this.internal, scale, constant);
    }

    /**
     * Overrides the minimum alpha value a fragment must have to not be discarded when the blend
     * mode is MASKED. Defaults to 0.4 if it has not been set in the parent Material. The specified
     * value should be between 0 and 1 and will be clamped if necessary.
     * 
     * @param {Number} threshold
     */
    SetMaskThreshold(threshold) {
        binding.MaterialInstance$SetMaskThreshold(this.internal, threshold);
    }

    /**
     * Gets the minimum alpha value a fragment must have to not be discarded when the blend
     * mode is MASKED
     * 
     * @returns {Number}
     */
    GetMaskThreshold() {
        return binding.MaterialInstance$GetMaskThreshold(this.internal);
    }

    /**
     * Sets the screen space variance of the filter kernel used when applying specular
     * anti-aliasing. The default value is set to 0.15. The specified value should be between
     * 0 and 1 and will be clamped if necessary.
     * 
     * @param {Number} variance
     */
    SetSpecularAntiAliasingVariance(variance) {
        binding.MaterialInstance$SetSpecularAntiAliasingVariance(this.internal, variance);
    }

    /**
     * Gets the screen space variance of the filter kernel used when applying specular
     * anti-aliasing.
     * 
     * @returns {Number}
     */
    GetSpecularAntiAliasingVariance() {
        return binding.MaterialInstance$GetSpecularAntiAliasingVariance(this.internal);
    }

    /**
     * Sets the clamping threshold used to suppress estimation errors when applying specular
     * anti-aliasing. The default value is set to 0.2. The specified value should be between 0
     * and 1 and will be clamped if necessary.
     * 
     * @param {Number} threshold
     */
    SetSpecularAntiAliasingThreshold(threshold) {
        binding.MaterialInstance$SetSpecularAntiAliasingThreshold(this.internal, threshold);
    }

    /**
     * Gets the clamping threshold used to suppress estimation errors when applying specular
     * anti-aliasing.
     * 
     * @returns {Number}
     */
    GetSpecularAntiAliasingThreshold() {
        return binding.MaterialInstance$GetSpecularAntiAliasingThreshold(this.internal);
    }

    /**
     * Enables or disables double-sided lighting if the parent Material has double-sided capability,
     * otherwise prints a warning. If double-sided lighting is enabled, backface culling is
     * automatically disabled.
     * 
     * @param {Boolean} doubleSided
     */
    SetDoubleSided(doubleSided) {
        binding.MaterialInstance$SetDoubleSided(this.internal, doubleSided);
    }

    /**
     * Returns whether double-sided lighting is enabled when the parent Material has double-sided
     * capability.
     * 
     * @returns {Boolean}
     */
    IsDoubleSided() {
        return binding.MaterialInstance$IsDoubleSided(this.internal);
    }

    /**
     * Specifies how transparent objects should be rendered (default is DEFAULT).
     * 
     * @param {TransparencyMode} mode
     */
    SetTransparencyMode(mode) {
        binding.MaterialInstance$SetTransparencyMode(this.internal, mode);
    }

    /**
     * Returns the transparency mode.
     * 
     * @returns {TransparencyMode}
     */
    GetTransparencyMode() {
        return binding.MaterialInstance$GetTransparencyMode(this.internal);
    }

    /**
     * Overrides the default triangle culling state that was set on the material.
     * 
     * @param {CullingMode} culling
     */
    SetCullingMode(culling) {
        binding.MaterialInstance$SetCullingMode(this.internal, culling);
    }

    /**
     * Returns the face culling mode.
     * 
     * @returns {CullingMode}
     */
    GetCullingMode() {
        return binding.MaterialInstance$GetCullingMode(this.internal);
    }

    /**
     * Overrides the default color-buffer write state that was set on the material.
     * 
     * @param {Boolean} enable
     */
    SetColorWrite(enable) {
        binding.MaterialInstance$SetColorWrite(this.internal, enable);
    }

    /**
     * Returns whether color write is enabled.
     * 
     * @returns {Boolean}
     */
    IsColorWriteEnabled() {
        return binding.MaterialInstance$IsColorWriteEnabled(this.internal);
    }

    /**
     * Overrides the default depth-buffer write state that was set on the material.
     * 
     * @param {Boolean} enable
     */
    SetDepthWrite(enable) {
        binding.MaterialInstance$SetDepthWrite(this.internal, enable);
    }

    /**
     * Returns whether depth write is enabled.
     * 
     * @returns {Boolean}
     */
    IsDepthWriteEnabled() {
        return binding.MaterialInstance$IsDepthWriteEnabled(this.internal);
    }

    /**
     * Overrides the default depth testing state that was set on the material.
     * 
     * @param {Boolean} enable
     */
    SetDepthCulling(enable) {
        binding.MaterialInstance$SetDepthCulling(this.internal, enable);
    }

    /**
     * Overrides the default depth function state that was set on the material.
     * 
     * @param {SamplerCompareFunc} DepthFunc 
     */
    SetDepthFunc(depthFunc) {
        binding.MaterialInstance$SetDepthFunc(this.internal, depthFunc);
    }

    /**
     * Returns the depth function state.
     * 
     * @returns {SamplerCompareFunc}
     */
    GetDepthFunc() {
        return binding.MaterialInstance$GetDepthFunc(this.internal);
    }

    /**
     * Returns whether depth culling is enabled.
     * 
     * @returns {Boolean}
     */
    IsDepthCullingEnabled() {
        return binding.MaterialInstance$IsDepthCullingEnabled(this.internal);
    }

    /**
     * Overrides the default stencil-buffer write state that was set on the material.
     * 
     * @param {Boolean} enable
     */
    SetStencilWrite(enable) {
        binding.MaterialInstance$SetStencilWrite(this.internal, enable);
    }

    /**
     * Returns whether stencil write is enabled.
     * 
     * @returns {Boolean}
     */
    IsStencilWriteEnabled() {
        return binding.MaterialInstance$IsStencilWriteEnabled(this.internal);
    }

    /**
     * Sets the stencil comparison function (default is StencilCompareFunc::A).
     *
     * It's possible to set separate stencil comparison functions; one for front-facing polygons,
     * and one for back-facing polygons. The face parameter determines the comparison function(s)
     * updated by this call.
     * 
     * @param {SamplerCompareFunc} func
     * @param {StencilFace} face
     * 
     */
    SetStencilCompareFunction(func, face) {
        if (face == undefined)
            face = StencilFace.FRONT_AND_BACK;
        binding.MaterialInstance$SetStencilCompareFunction(this.internal, func, face);
    }

    /**
     * Sets the stencil fail operation (default is StencilOperation::KEEP).
     *
     * The stencil fail operation is performed to update values in the stencil buffer when the
     * stencil test fails.
     *
     * It's possible to set separate stencil fail operations; one for front-facing polygons, and one
     * for back-facing polygons. The face parameter determines the stencil fail operation(s) updated
     * by this call.
     * 
     * @param {StencilOperation} op
     * @param {StencilFace} face
     */
    SetStencilOpStencilFail(op, face) {
        if (face == undefined)
            face = StencilFace.FRONT_AND_BACK;
        binding.MaterialInstance$SetStencilOpStencilFail(this.internal, op, face);
    }

    /**
     * Sets the depth fail operation (default is StencilOperation::KEEP).
     *
     * The depth fail operation is performed to update values in the stencil buffer when the depth
     * test fails.
     *
     * It's possible to set separate depth fail operations; one for front-facing polygons, and one
     * for back-facing polygons. The face parameter determines the depth fail operation(s) updated
     * by this call.
     * 
     * @param {StencilOperation} op
     * @param {StencilFace} face
     */
    SetStencilOpDepthFail(op, face) {
        if (face == undefined)
            face = StencilFace.FRONT_AND_BACK;
        binding.MaterialInstance$SetStencilOpDepthFail(this.internal, op, face);
    }

    /**
     * Sets the depth-stencil pass operation (default is StencilOperation::KEEP).
     *
     * The depth-stencil pass operation is performed to update values in the stencil buffer when
     * both the stencil test and depth test pass.
     *
     * It's possible to set separate depth-stencil pass operations; one for front-facing polygons,
     * and one for back-facing polygons. The face parameter determines the depth-stencil pass
     * operation(s) updated by this call.
     * 
     * @param {StencilOperation} op
     * @param {StencilFace} face
     */
    SetStencilOpDepthStencilPass(op, face) {
        if (face == undefined)
            face = StencilFace.FRONT_AND_BACK;
        binding.MaterialInstance$SetStencilOpDepthStencilPass(this.internal, op, face);
    }

    /**
     * Sets the stencil reference value (default is 0).
     *
     * The stencil reference value is the left-hand side for stencil comparison tests. It's also
     * used as the replacement stencil value when StencilOperation is REPLACE.
     *
     * It's possible to set separate stencil reference values; one for front-facing polygons, and
     * one for back-facing polygons. The face parameter determines the reference value(s) updated by
     * this call.
     * 
     * @param {uint8} value
     * @param {StencilFace} face
     */
    SetStencilReferenceValue(value, face) {
        if (face == undefined)
            face = StencilFace.FRONT_AND_BACK;
        binding.MaterialInstance$SetStencilReferenceValue(this.internal, value, face);
    }

    /**
     * Sets the stencil read mask (default is 0xFF).
     *
     * The stencil read mask masks the bits of the values participating in the stencil comparison
     * test- both the value read from the stencil buffer and the reference value.
     *
     * It's possible to set separate stencil read masks; one for front-facing polygons, and one for
     * back-facing polygons. The face parameter determines the stencil read mask(s) updated by this
     * call.
     * 
     * @param {uint8} readMask
     * @param {StencilFace} face
     */
    SetStencilReadMask(readMask, face) {
        if (face == undefined)
            face = StencilFace.FRONT_AND_BACK;
        binding.MaterialInstance$SetStencilReadMask(this.internal, readMask, face);
    }

    /**
     * Sets the stencil write mask (default is 0xFF).
     *
     * The stencil write mask masks the bits in the stencil buffer updated by stencil operations.
     *
     * It's possible to set separate stencil write masks; one for front-facing polygons, and one for
     * back-facing polygons. The face parameter determines the stencil write mask(s) updated by this
     * call.
     * 
     * @param {uint8} writeMask
     * @param {StencilFace} face
     */
    SetStencilWriteMask(writeMask, face) {
        if (face == undefined)
            face = StencilFace.FRONT_AND_BACK;
        binding.MaterialInstance$SetStencilWriteMask(this.internal, writeMask, face);
    }

    internal
}