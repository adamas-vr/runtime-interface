import { mat3 } from "../gl-matrix/esm/index.js";
import { Texture } from "./texture.js";

export class IndirectLight {
	constructor(internal) {
		this.internal = internal;
	}

	/**
	 * Sets the environment's intensity.
	 *
	 * Because the environment is encoded usually relative to some reference, the
	 * range can be adjusted with this method.
	 *
	 * @param {Number} intensity  Scale factor applied to the environment and irradiance such that
	 *                   the result is in lux, or <i>lumen/m^2</i> (default = 30000)
	 */
	SetIntensity(intensity) {
		binding.IndirectLight$SetIntensity(this.internal, intensity);
	}

	/**
	 * Returns the environment's intensity in <i>lux</i>, or <i>lumen/m^2</i>.
	 * @returns {Number}
	 */
	GetIntensity() {
		return binding.IndirectLight$GetIntensity(this.internal);
	}

	/**
	 * Sets the rigid-body transformation to apply to the IBL.
	 *
	 * @param {mat3} rotation 3x3 rotation matrix. Must be a rigid-body transform.
	 */
	SetRotation(rotation) {
		binding.IndirectLight$SetRotation(this.internal, rotation);
	}

	/**
	 * Returns the rigid-body transformation applied to the IBL.
	 * @returns {mat3}
	 */
	GetRotation() {
		return binding.IndirectLight$GetRotation(this.internal, mat3.fromValues);
	}

	/**
	 * Returns the associated reflection map, or null if it does not exist.
	 *
	 * @returns {Texture}
	 */
	GetReflectionsTexture() {
		let internal = binding.IndirectLight$GetReflectionsTexture(this.internal);
		if (internal) return new Texture(internal);
		else return undefined;
	}

	/**
	 * Returns the associated irradiance map, or null if it does not exist.
	 *
	 * @returns {Texture}
	 */
	GetIrradianceTexture() {
		let internal = binding.IndirectLight$GetIrradianceTexture(this.internal);
		if (internal) return new Texture(internal);
		else return undefined;
	}
}

export class IndirectLightBuilder {
	constructor(reflections, intensity, rotation) {
		if (reflections) this.mReflections = reflections;
		if (intensity) this.mIntensity = intensity;
		if (rotation) this.mRotation = rotation;
	}

	Build() {
		if (!this.mReflections) throw "Reflection cubemap must be provided";
		return new IndirectLight(
			binding.IndirectLightBuilder$Build(
				this.mReflections.internal,
				this.mIntensity,
				this.mRotation,
			),
		);
	}

	mReflections = undefined;
	mIntensity = 30000;
	mRotation = mat3.identity(mat3.create());
}
