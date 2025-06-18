import { MaterialInstance } from "./material.js";
import { VertexBuffer } from "./vertex-buffer.js";
import { IndexBuffer } from "./index-buffer.js";
import { Box } from "./box.js";
import { vec3 } from "../gl-matrix/esm/index.js";

export class RenderableManager {
	static HasComponent(entity) {
		return binding.RenderableManager$HasComponent(entity);
	}
	static Destroy(entity) {
		binding.RenderableManager$Destroy(entity);
	}

	/**
	 * Changes the bounding box used for frustum culling.
	 *
	 * @param {uint8} entity
	 * @param {Box} aabb
	 */
	static SetAxisAlignedBoundingBox(entity, aabb) {
		binding.RenderableManager$SetAxisAlignedBoundingBox(
			entity,
			aabb.center,
			aabb.halfExtent,
		);
	}

	/**
	 *
	 * @param {entity} entity
	 * @param {uint8} select
	 * @param {uint8} values
	 */
	static SetLayerMask(entity, select, values) {
		binding.RenderableManager$SetLayerMask(entity, select, values);
	}

	/**
	 * Changes the coarse-level draw ordering.
	 *
	 * @param {entity} entity
	 * @param {uint8_t} priority
	 */
	static SetPriority(entity, priority) {
		binding.RenderableManager$SetPriority(entity, priority);
	}

	/**
	 *
	 * @param {entity} entity
	 * @param {uint8} channel
	 */
	static SetChannel(entity, channel) {
		binding.RenderableManager$SetChannel(entity, channel);
	}

	/**
	 * Changes whether or not frustum culling is on.
	 *
	 * \see Builder::culling()
	 */
	static SetCulling(entity, enable) {
		binding.RenderableManager$SetCulling(entity, enable);
	}
	// /**
	//  * Changes whether or not the large-scale fog is applied to this renderable
	//  * @see Builder::fog()
	//  */
	// static setFogEnabled(Instance instance, bool enable) noexcept;

	// /**
	//  * Returns whether large-scale fog is enabled for this renderable.
	//  * @return True if fog is enabled for this renderable.
	//  * @see Builder::fog()
	//  */
	// static getFogEnabled(Instance instance) const noexcept;

	/**
	 *
	 * @param {entity} entity
	 * @param {uint} channel
	 * @param {boolean} enable
	 */
	static SetLightChannel(entity, channel, enable) {
		binding.RenderableManager$SetLightChannel(entity, channel, enable);
	}
	/**
	 *
	 * @param {entity} entity
	 * @param {uint} channel
	 * @returns {boolean}
	 */
	static GetLightChannel(entity, channel) {
		return binding.RenderableManager$GetLightChannel(entity, channel);
	}
	/**
	 *
	 * @param {entity} entity
	 * @param {boolean} enable
	 */
	static SetCastShadows(entity, enable) {
		binding.RenderableManager$SetCastShadows(entity, enable);
	}
	/**
	 *
	 * @param {entity} entity
	 * @param {boolean} enable
	 */
	static SetReceiveShadows(entity, enable) {
		binding.RenderableManager$SetReceiveShadows(entity, enable);
	}
	/**
	 *
	 * @param {entity} entity
	 * @param {boolean} enable
	 */
	static SetScreenSpaceContactShadows(entity, enable) {
		binding.RenderableManager$SetScreenSpaceContactShadows(entity, enable);
	}
	/**
	 *
	 * @param {entity} entity
	 * @returns {boolean}
	 */
	static IsShadowCaster(entity) {
		return binding.RenderableManager$IsShadowCaster(entity);
	}
	/**
	 *
	 * @param {entity} entity
	 * @returns {boolean}
	 */
	static IsShadowReceiver(entity) {
		return binding.RenderableManager$IsShadowReceiver(entity);
	}

	/** //TODO: float32 buffer instead?
	 * Updates the bone transforms in the range [offset, offset + boneCount).
	 *
	 * @param {entity} entity
	 * @param {ArrayBuffer} boneList an array of {unitQuaternion, translate, reservied float},
	 *                               must be a size of 8 * 4 (float) bytes
	 * @param {int} offset
	 */
	static SetBones(entity, boneList, offset = 0) {
		binding.RenderableManager$SetBones(entity, boneList, offset);
	}

	/**
	 *
	 * @param {entity} entity
	 * @param {mat4x4[]} transformList
	 * @param {int} offset
	 */
	static SetBoneTransforms(entity, transformList, offset = 0) {
		binding.RenderableManager$SetBoneTransforms(entity, transformList, offset);
	}

	// /**
	//  * Associates a region of a SkinningBuffer to a renderable instance
	//  *
	//  * Note: due to hardware limitations offset + 256 must be smaller or equal to
	//  *       skinningBuffer->getBoneCount()
	//  *
	//  * @param instance          Instance of the component obtained from getInstance().
	//  * @param skinningBuffer    skinning buffer to associate to the instance
	//  * @param count             Size of the region in bones, must be smaller or equal to 256.
	//  * @param offset            Start offset of the region in bones
	//  */
	// static SetSkinningBuffer(entity, SkinningBuffer* UTILS_NONNULL skinningBuffer,
	//         size_t count, size_t offset);

	/**
	 * Updates the vertex morphing weights on a renderable, all zeroes by default.
	 *
	 * The renderable must be built with morphing enabled, see Builder::morphing(). In legacy
	 * morphing mode, only the first 4 weights are considered.
	 *
	 * @param {entity} entity Instance of the component obtained from getInstance().
	 * @param {Float32Array[]} weights Pointer to morph target weights to be update.
	 * @param {int} offset Index of the first morph target weight to set at instance.
	 */
	static SetMorphWeights(entity, weights, offset = 0) {
		binding.RenderableManager$SetMorphWeights(entity, weights, offset);
	}

	// /**
	//  * Associates a MorphTargetBuffer to the given primitive.
	//  */
	// void setMorphTargetBufferAt(Instance instance, uint8_t level, size_t primitiveIndex,
	//         MorphTargetBuffer* UTILS_NONNULL morphTargetBuffer, size_t offset, size_t count);

	// /**
	//  * Utility method to change a MorphTargetBuffer to the given primitive
	//  */
	// inline void setMorphTargetBufferAt(Instance instance, uint8_t level, size_t primitiveIndex,
	//         MorphTargetBuffer* UTILS_NONNULL morphTargetBuffer);

	// /**
	//  * Get a MorphTargetBuffer to the given primitive or null if it doesn't exist.
	//  */
	// MorphTargetBuffer* UTILS_NULLABLE getMorphTargetBufferAt(Instance instance,
	//         uint8_t level, size_t primitiveIndex) const noexcept;

	/**
	 * Gets the number of morphing in the given entity.
	 * @returns {int}
	 */
	static GetMorphTargetCount(entity) {
		return binding.RenderableManager$GetMorphTargetCount(entity);
	}

	/**
	 * Gets the bounding box used for frustum culling.
	 *
	 * @returns {Box}
	 */
	static GetAxisAlignedBoundingBox(entity) {
		let ret = binding.RenderableManager$GetAxisAlignedBoundingBox(
			entity,
			vec3.fromValues,
		);
		return new Box(ret[0], ret[1]);
	}

	/**
	 *
	 * @param {entity} entity
	 * @returns {uint8}
	 */
	static GetLayerMask(entity) {
		return binding.RenderableManager$GetLayerMask(entity);
	}
	static GetPrimitiveCount(entity) {
		return binding.RenderableManager$GetPrimitiveCount(entity);
	}
	static SetMaterialInstanceAt(entity, primitiveIndex, materialInstance) {
		binding.RenderableManager$SetMaterialInstanceAt(
			entity,
			primitiveIndex,
			materialInstance.internal,
		);
	}
	static GetMaterialInstanceAt(entity, primitiveIndex) {
		return new MaterialInstance(
			binding.RenderableManager$GetMaterialInstanceAt(entity, primitiveIndex),
		);
	}
	static SetGeometryAt(
		entity,
		primitiveIndex,
		type,
		vertices,
		indices,
		offset,
		count,
	) {
		throw "not implemented";
	}
	static SetBlendOrderAt(entity, primitiveIndex, order) {
		throw "not implemented";
	}
}

export class RenderableBuilder {
	/**
	 * Creates a builder for renderable components.
	 *
	 * @param {int} count the number of primitives that will be supplied to the builder
	 */
	constructor(count) {
		this.internal = binding.RenderableBuilder$constructor(count);
	}
	/**
	 * Specifies the geometry data for a primitive.
	 *
	 * Filament primitives must have an associated VertexBuffer and IndexBuffer. Typically, each
	 * primitive is specified with a pair of daisy-chained calls: \c geometry(...) and \c
	 * material(...).
	 *
	 * @param {uint32_t} index zero-based index of the primitive, must be less than the count passed to Builder constructor
	 * @param {PrimitiveType} type specifies the topology of the primitive (e.g., \c RenderableManager::PrimitiveType::TRIANGLES)
	 * @param {VertexBuffer} vertices specifies the vertex buffer, which in turn specifies a set of attributes
	 * @param {IndexBuffer} indices specifies the index buffer (either u16 or u32)
	 * @param {uint32_t} offset specifies where in the index buffer to start reading (expressed as a number of indices)
	 * @param {uint32_t} count number of indices to read (for triangles, this should be a multiple of 3)
	 *
	 * @returns {RenderableBuilder}
	 */
	Geometry(
		index,
		type,
		vertices,
		indices,
		offset = undefined,
		count = undefined,
	) {
		binding.RenderableBuilder$Geometry(
			this.internal,
			index,
			type,
			vertices.internal,
			indices.internal,
			offset,
			count,
		);
		return this;
	}

	/**
	 * Binds a material instance to the specified primitive.
	 *
	 * If no material is specified for a given primitive, Filament will fall back to a basic
	 * default material.
	 *
	 * The MaterialInstance's material must have a feature level equal or lower to the engine's
	 * selected feature level.
	 *
	 * @param {size_t} index zero-based index of the primitive,
	 *                       must be less than the count passed to Builder constructor
	 * @param {MaterialInstance} materialInstance the material to bind
	 *
	 * @returns {RenderableBuilder}
	 *
	 * @see Engine::setActiveFeatureLevel
	 */
	Material(index, materialInstance) {
		binding.RenderableBuilder$Material(
			this.internal,
			index,
			materialInstance.internal,
		);
		return this;
	}

	/**
	 * The axis-aligned bounding box of the renderable.
	 *
	 * This is an object-space AABB used for frustum culling. For skinning and morphing, this
	 * should encompass all possible vertex positions. It is mandatory unless culling is
	 * disabled for the renderable.
	 *
	 * @param {Box} axisAlignedBoundingBox
	 * @returns {RenderableBuilder}
	 */
	BoundingBox(axisAlignedBoundingBox) {
		binding.RenderableBuilder$BoundingBox(
			this.internal,
			axisAlignedBoundingBox.center,
			axisAlignedBoundingBox.halfExtent,
		);
		return this;
	}

	/**
	 * Sets bits in a visibility mask. By default, this is 0x1.
	 *
	 * This feature provides a simple mechanism for hiding and showing groups of renderables
	 * in a Scene. See View::setVisibleLayers().
	 *
	 * For example, to set bit 1 and reset bits 0 and 2 while leaving all other bits unaffected,
	 * do: `builder.layerMask(7, 2)`.
	 *
	 * To change this at run time, see RenderableManager::setLayerMask.
	 *
	 * @param {uint8_t} select the set of bits to affect
	 * @param {uint8_t} values the replacement values for the affected bits
	 * @returns {RenderableBuilder}
	 */
	LayerMask(select, values) {
		binding.RenderableBuilder$LayerMask(this.internal, select, values);
		return this;
	}

	/**
	 * Provides coarse-grained control over draw order.
	 *
	 * In general Filament reserves the right to re-order renderables to allow for efficient
	 * rendering. However clients can control ordering at a coarse level using \em priority.
	 * The priority is applied separately for opaque and translucent objects, that is, opaque
	 * objects are always drawn before translucent objects regardless of the priority.
	 *
	 * For example, this could be used to draw a semitransparent HUD on top of everything,
	 * without using a separate View. Note that priority is completely orthogonal to
	 * Builder::layerMask, which merely controls visibility.
	 *
	 * The Skybox always using the lowest priority, so it's drawn last, which may improve
	 * performance.
	 *
	 * @param {uint8_t} priority clamped to the range [0..7], defaults to 4; 7 is lowest priority
	 *                 (rendered last).
	 *
	 * @returns {RenderableBuilder} Builder reference for chaining calls.
	 *
	 * @see Builder::blendOrder()
	 * @see Builder::channel()
	 * @see RenderableManager::setPriority()
	 * @see RenderableManager::setBlendOrderAt()
	 */
	Priority(priority) {
		binding.RenderableBuilder$Priority(this.internal, priority);
		return this;
	}

	/**
	 * Set the channel this renderable is associated to. There can be 4 channels.
	 * All renderables in a given channel are rendered together, regardless of anything else.
	 * They are sorted as usual within a channel.
	 * Channels work similarly to priorities, except that they enforce the strongest ordering.
	 *
	 * Channels 0 and 1 may not have render primitives using a material with `refractionType`
	 * set to `screenspace`.
	 *
	 * @param {uint8_t} channel clamped to the range [0..3], defaults to 2.
	 *
	 * @returns {RenderableBuilder} Builder reference for chaining calls.
	 *
	 * @see Builder::blendOrder()
	 * @see Builder::priority()
	 * @see RenderableManager::setBlendOrderAt()
	 */
	Channel(channel) {
		binding.RenderableBuilder$Channel(this.internal, channel);
		return this;
	}

	/**
	 * Controls frustum culling, true by default.
	 *
	 * \note Do not confuse frustum culling with backface culling. The latter is controlled via
	 * the material.
	 *
	 * @param {Boolean} enable
	 * @returns {RenderableBuilder}
	 */
	Culling(enable) {
		binding.RenderableBuilder$Culling(this.internal, enable);
		return this;
	}

	/**
	 * Enables or disables a light channel. Light channel 0 is enabled by default.
	 *
	 * @param {uint32_t} channel Light channel to enable or disable, between 0 and 7.
	 * @param {Boolean} enable Whether to enable or disable the light channel.
	 * @returns {RenderableBuilder}
	 */
	LightChannel(channel, enable) {
		if (enable == undefined) enable = true;
		binding.RenderableBuilder$LightChannel(this.internal, channel, enable);
		return this;
	}

	/**
	 * Controls if this renderable casts shadows, false by default.
	 *
	 * If the View's shadow type is set to ShadowType::VSM, castShadows should only be disabled
	 * if either is true:
	 *   - receiveShadows is also disabled
	 *   - the object is guaranteed to not cast shadows on itself or other objects (for example,
	 *     a ground plane)
	 *
	 * @param {Boolean} enable
	 * @returns {RenderableBuilder}
	 */
	CastShadows(enable) {
		binding.RenderableBuilder$CastShadows(this.internal, enable);
		return this;
	}

	/**
	 * Controls if this renderable receives shadows, true by default.
	 *
	 * @param {Boolean} enable
	 * @returns {RenderableBuilder}
	 */
	ReceiveShadows(enable) {
		binding.RenderableBuilder$ReceiveShadows(this.internal, enable);
		return this;
	}

	/**
	 * Controls if this renderable uses screen-space contact shadows. This is more
	 * expensive but can improve the quality of shadows, especially in large scenes.
	 * (off by default).
	 *
	 * @param {Boolean} enable
	 * @returns {RenderableBuilder}
	 */
	ScreenSpaceContactShadows(enable) {
		binding.RenderableBuilder$ScreenSpaceContactShadows(this.internal, enable);
		return this;
	}

	/**
	 * Allows bones to be swapped out and shared using SkinningBuffer.
	 *
	 * If skinning buffer mode is enabled, clients must call setSkinningBuffer() rather than
	 * setBones(). This allows sharing of data between renderables.
	 *
	 * @param enabled If true, enables buffer object mode.  False by default.
	 */
	// Builder& enableSkinningBuffers(bool enabled = true) noexcept;

	/**
	 * Controls if this renderable is affected by the large-scale fog.
	 * @param enabled If true, enables large-scale fog on this object. Disables it otherwise.
	 *                True by default.
	 * @return A reference to this Builder for chaining calls.
	 */
	// Builder& fog(bool enabled = true) noexcept;

	/**
	 * Enables GPU vertex skinning for up to 255 bones, 0 by default.
	 *
	 * Skinning Buffer mode must be enabled.
	 *
	 * Each vertex can be affected by up to 4 bones simultaneously. The attached
	 * VertexBuffer must provide data in the \c BONE_INDICES slot (uvec4) and the
	 * \c BONE_WEIGHTS slot (float4).
	 *
	 * See also RenderableManager::setSkinningBuffer() or SkinningBuffer::setBones(),
	 * which can be called on a per-frame basis to advance the animation.
	 *
	 * @param skinningBuffer nullptr to disable, otherwise the SkinningBuffer to use
	 * @param count 0 to disable, otherwise the number of bone transforms (up to 255)
	 * @param offset offset in the SkinningBuffer
	 */
	// Builder& skinning(SkinningBuffer* UTILS_NONNULL skinningBuffer,
	//         size_t count, size_t offset) noexcept;

	/**
	 * Enables GPU vertex skinning for up to 255 bones, 0 by default.
	 *
	 * Skinning Buffer mode must be disabled.
	 *
	 * Each vertex can be affected by up to 4 bones simultaneously. The attached
	 * VertexBuffer must provide data in the \c BONE_INDICES slot (uvec4) and the
	 * \c BONE_WEIGHTS slot (float4).
	 *
	 * See also RenderableManager::setBones(), which can be called on a per-frame basis
	 * to advance the animation.
	 *
	 * @param boneCount 0 to disable, otherwise the number of bone transforms (up to 255)
	 * @param transforms the initial set of transforms (one for each bone)
	 */
	// Builder& skinning(size_t boneCount, math::mat4f const* UTILS_NONNULL transforms) noexcept;
	// Builder& skinning(size_t boneCount, Bone const* UTILS_NONNULL bones) noexcept; //!< \overload
	// Builder& skinning(size_t boneCount) noexcept; //!< \overload

	/**
	 * Define bone indices and weights "pairs" for vertex skinning as a float2.
	 * The unsigned int(pair.x) defines index of the bone and pair.y is the bone weight.
	 * The pairs substitute \c BONE_INDICES and the \c BONE_WEIGHTS defined in the VertexBuffer.
	 * Both ways of indices and weights definition must not be combined in one primitive.
	 * Number of pairs per vertex bonesPerVertex is not limited to 4 bones.
	 * Vertex buffer used for \c primitiveIndex must be set for advance skinning.
	 * All bone weights of one vertex should sum to one. Otherwise they will be normalized.
	 * Data must be rectangular and number of bone pairs must be same for all vertices of this
	 * primitive.
	 * The data is arranged sequentially, all bone pairs for the first vertex, then for the
	 * second vertex, and so on.
	 *
	 * @param primitiveIndex zero-based index of the primitive, must be less than the primitive
	 *                       count passed to Builder constructor
	 * @param indicesAndWeights pairs of bone index and bone weight for all vertices
	 *                          sequentially
	 * @param count number of all pairs, must be a multiple of vertexCount of the primitive
	 *                          count = vertexCount * bonesPerVertex
	 * @param bonesPerVertex number of bone pairs, same for all vertices of the primitive
	 *
	 * @return Builder reference for chaining calls.
	 *
	 * @see VertexBuffer:Builder:advancedSkinning
	 */
	// Builder& boneIndicesAndWeights(size_t primitiveIndex,
	//         math::float2 const* UTILS_NONNULL indicesAndWeights,
	//         size_t count, size_t bonesPerVertex) noexcept;

	/**
	 * Define bone indices and weights "pairs" for vertex skinning as a float2.
	 * The unsigned int(pair.x) defines index of the bone and pair.y is the bone weight.
	 * The pairs substitute \c BONE_INDICES and the \c BONE_WEIGHTS defined in the VertexBuffer.
	 * Both ways of indices and weights definition must not be combined in one primitive.
	 * Number of pairs is not limited to 4 bones per vertex.
	 * Vertex buffer used for \c primitiveIndex must be set for advance skinning.
	 * All bone weights of one vertex should sum to one. Otherwise they will be normalized.
	 * Data doesn't have to be rectangular and number of pairs per vertices of primitive can be
	 * variable.
	 * The vector of the vertices contains the vectors of the pairs
	 *
	 * @param primitiveIndex zero-based index of the primitive, must be less than the primitive
	 *                       count passed to Builder constructor
	 * @param indicesAndWeightsVectors pairs of bone index and bone weight for all vertices of
	 *                                 the primitive sequentially
	 *
	 * @return Builder reference for chaining calls.
	 *
	 * @see VertexBuffer:Builder:advancedSkinning
	 */
	// Builder& boneIndicesAndWeights(size_t primitiveIndex,
	//         utils::FixedCapacityVector<
	//             utils::FixedCapacityVector<math::float2>> indicesAndWeightsVector) noexcept;
	/**
	 * Controls if the renderable has vertex morphing targets, zero by default. This is
	 * required to enable GPU morphing.
	 *
	 * Filament supports two morphing modes: standard (default) and legacy.
	 *
	 * For standard morphing, A MorphTargetBuffer must be created and provided via
	 * RenderableManager::setMorphTargetBufferAt(). Standard morphing supports up to
	 * \c CONFIG_MAX_MORPH_TARGET_COUNT morph targets.
	 *
	 * For legacy morphing, the attached VertexBuffer must provide data in the
	 * appropriate VertexAttribute slots (\c MORPH_POSITION_0 etc). Legacy morphing only
	 * supports up to 4 morph targets and will be deprecated in the future. Legacy morphing must
	 * be enabled on the material definition: either via the legacyMorphing material attribute
	 * or by calling filamat::MaterialBuilder::useLegacyMorphing().
	 *
	 * See also RenderableManager::setMorphWeights(), which can be called on a per-frame basis
	 * to advance the animation.
	 */
	// Builder& morphing(size_t targetCount) noexcept;

	/**
	 * Specifies the morph target buffer for a primitive.
	 *
	 * The morph target buffer must have an associated renderable and geometry. Two conditions
	 * must be met:
	 * 1. The number of morph targets in the buffer must equal the renderable's morph target
	 *    count.
	 * 2. The vertex count of each morph target must equal the geometry's vertex count.
	 *
	 * @param level the level of detail (lod), only 0 can be specified
	 * @param primitiveIndex zero-based index of the primitive, must be less than the count passed to Builder constructor
	 * @param morphTargetBuffer specifies the morph target buffer
	 * @param offset specifies where in the morph target buffer to start reading (expressed as a number of vertices)
	 * @param count number of vertices in the morph target buffer to read, must equal the geometry's count (for triangles, this should be a multiple of 3)
	 */
	// Builder& morphing(uint8_t level, size_t primitiveIndex,
	//         MorphTargetBuffer* UTILS_NONNULL morphTargetBuffer,
	//         size_t offset, size_t count) noexcept;

	// inline Builder& morphing(uint8_t level, size_t primitiveIndex,
	//         MorphTargetBuffer* UTILS_NONNULL morphTargetBuffer) noexcept;

	/**
	 * Sets the drawing order for blended primitives. The drawing order is either global or
	 * local (default) to this Renderable. In either case, the Renderable priority takes
	 * precedence.
	 *
	 * @param {int} primitiveIndex the primitive of interest
	 * @param {uint16_t} order draw order number (0 by default). Only the lowest 15 bits are used.
	 *
	 * @returns {RenderableBuilder} Builder reference for chaining calls.
	 *
	 * @see globalBlendOrderEnabled
	 */
	BlendOrder(primitiveIndex, order) {
		binding.RenderableBuilder$BlendOrder(this.internal, primitiveIndex, order);
		return this;
	}

	/**
	 * Sets whether the blend order is global or local to this Renderable (by default).
	 *
	 * @param {int} primitiveIndex the primitive of interest
	 * @param {Boolean} enabled true for global, false for local blend ordering.
	 *
	 * @returns {RenderableBuilder} Builder reference for chaining calls.
	 *
	 * @see blendOrder
	 */
	GlobalBlendOrderEnabled(primitiveIndex, enabled) {
		binding.RenderableBuilder$GlobalBlendOrderEnabled(
			this.internal,
			primitiveIndex,
			enabled,
		);
		return this;
	}

	/**
	 * Specifies the number of draw instances of this renderable. The default is 1 instance and
	 * the maximum number of instances allowed is 32767. 0 is invalid.
	 *
	 * All instances are culled using the same bounding box, so care must be taken to make
	 * sure all instances render inside the specified bounding box.
	 *
	 * The material must set its `instanced` parameter to `true` in order to use
	 * getInstanceIndex() in the vertex or fragment shader to get the instance index and
	 * possibly adjust the position or transform.
	 *
	 * @param {int} instanceCount the number of instances silently clamped between 1 and 32767.
	 * @returns {RenderableBuilder}
	 */
	Instances(instanceCount) {
		binding.RenderableBuilder$Instances(this.internal, instanceCount);
		return this;
	}

	/**
	 * Specifies the number of draw instances of this renderable and an \c InstanceBuffer
	 * containing their local transforms. The default is 1 instance and the maximum number of
	 * instances allowed when supplying transforms is given by
	 * \c Engine::getMaxAutomaticInstances (64 on most platforms). 0 is invalid. The
	 * \c InstanceBuffer must not be destroyed before this renderable.
	 *
	 * All instances are culled using the same bounding box, so care must be taken to make
	 * sure all instances render inside the specified bounding box.
	 *
	 * The material must set its `instanced` parameter to `true` in order to use
	 * \c getInstanceIndex() in the vertex or fragment shader to get the instance index.
	 *
	 * Only the \c VERTEX_DOMAIN_OBJECT vertex domain is supported.
	 *
	 * The local transforms of each instance can be updated with
	 * \c InstanceBuffer::setLocalTransforms.
	 *
	 * @param {mat4x4[]} instanceBuffer an InstanceBuffer containing at least instanceCount transforms
	 */
	InstanceBuffer(instanceBuffer) {
		binding.RenderableBuilder$InstanceBuffer(this.internal, instanceBuffer);
		return this;
	}

	/**
	 * Adds the Renderable component to an entity.
	 *
	 * @param engine Reference to the filament::Engine to associate this Renderable with.
	 * @param entity Entity to add the Renderable component to.
	 * @return Success if the component was created successfully, Error otherwise.
	 *
	 * If exceptions are disabled and an error occurs, this function is a no-op.
	 *        Success can be checked by looking at the return value.
	 *
	 * If this component already exists on the given entity and the construction is successful,
	 * it is first destroyed as if destroy(utils::Entity e) was called. In case of error,
	 * the existing component is unmodified.
	 *
	 * @exception utils::PostConditionPanic if a runtime error occurred, such as running out of
	 *            memory or other resources.
	 * @exception utils::PreConditionPanic if a parameter to a builder function was invalid.
	 */
	Build(entity) {
		return binding.RenderableBuilder$Build(this.internal, entity);
	}
}

export const PrimitiveType = Object.freeze({
	// don't change the enums values (made to match GL)
	POINTS: 0, //!< points
	LINES: 1, //!< lines
	LINE_STRIP: 3, //!< line strip
	TRIANGLES: 4, //!< triangles
	TRIANGLE_STRIP: 5, //!< triangle strip
});
