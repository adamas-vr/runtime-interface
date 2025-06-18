

export class IndexBuffer
{
    constructor(internal) {
        this.internal = internal;
    }
    /**
     * Asynchronously copy-initializes a region of this IndexBuffer from the data provided.
     *
     * @param engine Reference to the filament::Engine to associate this IndexBuffer with.
     * @param {ArrayBuffer} buffer A BufferDescriptor representing the data used to initialize the IndexBuffer.
     *               BufferDescriptor points to raw, untyped data that will be interpreted as
     *               either 16-bit or 32-bits indices based on the Type of this IndexBuffer.
     * @param {uint32_t} byteOffset Offset in *bytes* into the IndexBuffer
     */
    SetBuffer(buffer,  byteOffset) {
        if (byteOffset == undefined)
            byteOffset = 0;
        binding.IndexBuffer$SetBuffer(this.internal, buffer, byteOffset);
    }

    /**
     * Returns the size of this IndexBuffer in elements.
     * @return {Integer} The number of indices the IndexBuffer holds.
     */
    GetIndexCount() {
        return binding.IndexBuffer$GetIndexCount(this.internal)
    }
};

export class IndexBufferBuilder
{
    /**
     * Size of the index buffer in elements.
     * @param {uint32_t} indexCount Number of indices the IndexBuffer can hold.
     */
    IndexCount(indexCount) {
        this.indexCount = indexCount;
        return this;
    }

    /**
     * Type of the index buffer, 16-bit or 32-bit.
     * @param {IndexType} indexType Type of indices stored in the IndexBuffer.
     */
    BufferType(indexType) {
        this.indexType = indexType;
        return this;
    }

    /**
     * Creates the IndexBuffer object and returns a pointer to it. After creation, the index
     * buffer is uninitialized. Use IndexBuffer::setBuffer() to initialize the IndexBuffer.
     * 
     * @returns {IndexBuffer}
     */
    Build() {
        return new IndexBuffer(
            binding.IndexBufferBuilder$Build(this.indexCount, this.indexType)
        );
    }

    indexCount = 0;
    indexType = IndexType.UINT;
};

export const IndexType = Object.freeze({
    USHORT: 12,     //!< 16-bit indices
    UINT:   17,     //!< 32-bit indices
});