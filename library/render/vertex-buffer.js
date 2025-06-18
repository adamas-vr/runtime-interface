export class VertexBuffer
{
    constructor(internal) {
        this.internal = internal;
    }

    /**
     * Returns the vertex count.
     * @return {Integer} Number of vertices in this vertex buffer set.
     */
    GetVertexCount() {
        return binding.VertexBuffer$GetVertexCount(this.internal);
    }

    /**
     * Asynchronously copy-initializes the specified buffer from the given buffer data.
     *
     * Do not use this if you called enableBufferObjects() on the Builder.
     *
     * @param bufferIndex Index of the buffer to initialize. Must be between 0
     *                    and Builder::bufferCount() - 1.
     * @param {ArrayBuffer} buffer 
     *     A BufferDescriptor representing the data used to initialize the buffer at
     *     index bufferIndex. BufferDescriptor points to raw, untyped data that will
     *     be copied as-is into the buffer.
     * @param {uint32_t} byteOffset 
     *     Offset in *bytes* into the buffer at index bufferIndex of this vertex buffer set.
     */
    SetBufferAt(bufferIndex, buffer, byteOffset) {
        if (byteOffset == undefined)
            byteOffset = 0;
        binding.VertexBuffer$SetBufferAt(this.internal, bufferIndex, buffer, byteOffset);
    }
};

export class VertexBufferBuilder
{
    constructor() {
        this.internal = binding.VertexBufferBuilder$constructor();
    }

    /**
     * Defines how many buffers will be created in this vertex buffer set. These buffers are
     * later referenced by index from 0 to \p bufferCount - 1.
     *
     * This call is mandatory. The default is 0.
     *
     * @param {uint8_t} bufferCount Number of buffers in this vertex buffer set. The maximum value is 8.
     * @return {VertexBufferBuilder} A reference to this Builder for chaining calls.
     */
    BufferCount(bufferCount) {
        binding.VertexBufferBuilder$BufferCount(this.internal, bufferCount);
        return this;
    }

    /**
     * Size of each buffer in the set in vertex.
     *
     * @param {uint32_t} vertexCount Number of vertices in each buffer in this set.
     * @return {VertexBufferBuilder} A reference to this Builder for chaining calls.
     */
    VertexCount(vertexCount) {
        binding.VertexBufferBuilder$VertexCount(this.internal, vertexCount);
        return this;
    }

    /**
     * Sets up an attribute for this vertex buffer set.
     *
     * Using \p byteOffset and \p byteStride, attributes can be interleaved in the same buffer.
     *
     * @param {VertexAttribute} attribute The attribute to set up.
     * @param {uint8_t}         bufferIndex The index of the buffer containing the data for this attribute. Must
     *                                      be between 0 and bufferCount() - 1.
     * @param {AttributeType}   attributeType The type of the attribute data (e.g. byte, float3, etc...)
     * @param {uint32_t}        byteOffset Offset in *bytes* into the buffer \p bufferIndex
     * @param {uint8_t}         byteStride Stride in *bytes* to the next element of this attribute. When set to
     *                   zero the attribute size, as defined by \p attributeType is used.
     * @returns {VertexBufferBuilder}
     *
     * @warning VertexAttribute::TANGENTS must be specified as a quaternion and is how normals
     *          are specified.
     *
     * @warning Not all backends support 3-component attributes that are not floats. For help
     *          with conversion, see geometry::Transcoder.
     *
     * This is a no-op if the \p attribute is an invalid enum.
     * This is a no-op if the \p bufferIndex is out of bounds.
     *
     */
    Attribute(attribute, bufferIndex, attributeType, byteOffset, byteStride) {
        if (byteOffset == undefined)
            byteOffset = 0;
        if (byteStride == undefined)
            byteStride = 0;
        binding.VertexBufferBuilder$Attribute(this.internal,
            attribute, bufferIndex, attributeType, byteOffset, byteStride
        );
        return this;
    }

    /**
     * Sets whether a given attribute should be normalized. By default attributes are not
     * normalized. A normalized attribute is mapped between 0 and 1 in the shader. This applies
     * only to integer types.
     *
     * @param {VertexAttribute} attribute Enum of the attribute to set the normalization flag to.
     * @param {Boolean} normalize true to automatically normalize the given attribute.
     * @return {VertexBufferBuilder} A reference to this Builder for chaining calls.
     *
     * This is a no-op if the \p attribute is an invalid enum.
     */
    Normalized(attribute, normalize) {
        if (normalize == undefined)
            normalize = true;
        binding.VertexBufferBuilder$Normalize(this.internal, attribute, normalize);
        return this;
    }

    /**
     * Sets advanced skinning mode. Bone data, indices and weights will be
     * set in RenderableManager:Builder:boneIndicesAndWeights methods.
     * Works with or without buffer objects.
     *
     * @param {Boolean} enabled If true, enables advanced skinning mode. False by default.
     * @returns {VertexBufferBuilder}
     */
    AdvancedSkinning(enabled) {
        binding.VertexBufferBuilder$AdvancedSkinning(this.internal, enabled);
        return this;
    }

    /**
     * Creates the VertexBuffer object and returns a pointer to it.
     *
     * @return {VertexBuffer} pointer to the newly created object.
     */
    Build() {
        return new VertexBuffer(binding.VertexBufferBuilder$Build(this.internal));
    }
};

export const VertexAttribute = Object.freeze({
    // Update hasIntegerTarget() in VertexBuffer when adding an attribute that will
    // be read as integers in the shaders

    POSITION        : 0, //!< XYZ position (float3)
    TANGENTS        : 1, //!< tangent, bitangent and normal, encoded as a quaternion (float4)
    COLOR           : 2, //!< vertex color (float4)
    UV0             : 3, //!< texture coordinates (float2)
    UV1             : 4, //!< texture coordinates (float2)
    BONE_INDICES    : 5, //!< indices of 4 bones, as unsigned integers (uvec4)
    BONE_WEIGHTS    : 6, //!< weights of the 4 bones (normalized float4)
    // -- we have 1 unused slot here --
    CUSTOM0         : 8,
    CUSTOM1         : 9,
    CUSTOM2         : 10,
    CUSTOM3         : 11,
    CUSTOM4         : 12,
    CUSTOM5         : 13,
    CUSTOM6         : 14,
    CUSTOM7         : 15,
});

/**
 * Supported element types
 */
export const AttributeType = Object.freeze({
    BYTE    : 0,
    BYTE2   : 1,
    BYTE3   : 2,
    BYTE4   : 3,
    UBYTE   : 4,
    UBYTE2  : 5,
    UBYTE3  : 6,
    UBYTE4  : 7,
    SHORT   : 8,
    SHORT2  : 9,
    SHORT3  : 10,
    SHORT4  : 11,
    USHORT  : 12,
    USHORT2 : 13,
    USHORT3 : 14,
    USHORT4 : 15,
    INT     : 16,
    UINT    : 17,
    FLOAT   : 18,
    FLOAT2  : 19,
    FLOAT3  : 20,
    FLOAT4  : 21,
    HALF    : 22,
    HALF2   : 23,
    HALF3   : 24,
    HALF4   : 25,
});