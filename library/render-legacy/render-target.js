import { Texture } from "./texture.js";

import { TextureCubemapFace } from "./texture.js";

export class RenderTarget {
	constructor(internal) {
		this.internal = internal;
	}

	static MAX_SUPPORTED_COLOR_ATTACHMENTS_COUNT = 8;

	static AttachmentPoint = Object.freeze({
		COLOR0: 0, //!< identifies the 1st color attachment
		COLOR1: 1, //!< identifies the 2nd color attachment
		COLOR2: 2, //!< identifies the 3rd color attachment
		COLOR3: 3, //!< identifies the 4th color attachment
		COLOR4: 4, //!< identifies the 5th color attachment
		COLOR5: 5, //!< identifies the 6th color attachment
		COLOR6: 6, //!< identifies the 7th color attachment
		COLOR7: 7, //!< identifies the 8th color attachment
		DEPTH: 8,
		COLOR: 0, //!< identifies the 1st color attachment
	});

	/**
	 * Gets the texture set on the given attachment point
	 * @param {AttachmentPoint} attachment Attachment point
	 * @return {Texture} A Texture object or nullptr if no texture is set for this attachment point
	 */
	GetTexture(attachment) {
		return new Texture(
			binding.RenderTarget$GetTexture(this.internal, attachment),
		);
	}

	/**
	 * Returns the mipmap level set on the given attachment point
	 * @param {AttachmentPoint} attachment Attachment point
	 * @return {uint8_t} the mipmap level set on the given attachment point
	 */
	GetMipLevel(attachment) {
		return binding.RenderTarget$GetMipLevel(this.internal, attachment);
	}

	/**
	 * Returns the face of a cubemap set on the given attachment point
	 * @param {AttachmentPoint} attachment Attachment point
	 * @return {TextureCubemapFace} A cubemap face identifier. This is only relevant if the attachment's texture is
	 * a cubemap.
	 */
	GetFace(attachment) {
		return binding.RenderTarget$GetFace(this.internal, attachment);
	}

	/**
	 * Returns the texture-layer set on the given attachment point
	 * @param {AttachmentPoint} attachment Attachment point
	 * @return {uint32_t} A texture layer. This is only relevant if the attachment's texture is a 3D texture.
	 */
	GetLayer(attachment) {
		return binding.RenderTarget$GetLayer(this.internal, attachment);
	}

	/**
	 * Returns the number of color attachments usable by this instance of Engine. This method is
	 * guaranteed to return at least MIN_SUPPORTED_COLOR_ATTACHMENTS_COUNT and at most
	 * MAX_SUPPORTED_COLOR_ATTACHMENTS_COUNT.
	 * @return {uint8_t} Number of color attachments usable in a render target.
	 */
	GetSupportedColorAttachmentsCount() {
		return binding.RenderTarget$GetSupportedColorAttachmentsCount(
			this.internal,
		);
	}
}

export class RenderTargetBuilder {
	constructor() {
		this.internal = binding.RenderTargetBuilder$constructor();
	}

	/**
	 * Sets a texture to a given attachment point.
	 *
	 * When using a DEPTH attachment, it is important to always disable post-processing
	 * in the View. Failing to do so will cause the DEPTH attachment to be ignored in most
	 * cases.
	 *
	 * When the intention is to keep the content of the DEPTH attachment after rendering,
	 * Usage::SAMPLEABLE must be set on the DEPTH attachment, otherwise the content of the
	 * DEPTH buffer may be discarded.
	 *
	 * @param {AttachmentPoint} attachment The attachment point of the texture.
	 * @param {Texture} texture The associated texture object.
	 * @return {RenderTargetBuilder} A reference to this Builder for chaining calls.
	 */
	Texture(attachment, texture) {
		binding.RenderTargetBuilder$Texture(
			this.internal,
			attachment,
			texture.internal,
		);
		return this;
	}

	/**
	 * Sets the mipmap level for a given attachment point.
	 *
	 * @param {AttachmentPoint} attachment The attachment point of the texture.
	 * @param {uint8_t} level The associated mipmap level, 0 by default.
	 * @return {RenderTargetBuilder} A reference to this Builder for chaining calls.
	 */
	MipLevel(attachment, level) {
		binding.RenderTargetBuilder$MipLevel(this.internal, attachment, level);
	}

	/**
	 * Sets the cubemap face for a given attachment point.
	 *
	 * @param {AttachmentPoint} attachment The attachment point.
	 * @param {TextureCubemapFace} face The associated cubemap face.
	 * @return {RenderTargetBuilder} A reference to this Builder for chaining calls.
	 */
	Face(attachment, face) {
		binding.RenderTargetBuilder$Face(this.internal, attachment, face);
	}

	/**
	 * Sets the layer for a given attachment point (for 3D textures).
	 *
	 * @param {AttachmentPoint} attachment The attachment point.
	 * @param {uint32_t} layer The associated cubemap layer.
	 * @return {RenderTargetBuilder} A reference to this Builder for chaining calls.
	 */
	Layer(attachment, layer) {
		binding.RenderTargetBuilder$Layer(this.internal, attachment, layer);
	}

	/**
	 * Creates the RenderTarget object and returns a pointer to it.
	 *
	 * @return {RenderTarget} pointer to the newly created object.
	 */
	Build() {
		return new RenderTarget(binding.RenderTargetBuilder$Build(this.internal));
	}
}
