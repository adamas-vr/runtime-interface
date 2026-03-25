/**
 * APIs for creating and updating materials.
 *
 * @module material
 */
import { Entity } from "../entity";
import { RpcClient } from "../rpc";
import { vec4 } from "gl-matrix";
import { Texture } from "./texture";

/**
 * Opaque numeric handle that identifies a material.
 */
export type Material = number;

/**
 * Supported material properties.
 */
export enum MaterialProperty {
	/** Base color as a `vec4`, with each channel in the range `[0.0, 1.0]`. */
	BaseColor = "baseColorFactor",
	/** Base color texture. */
	BaseColorMap = "baseColorTexture",
	/** Base color texture scale and offset as a `vec4`. */
	BaseColorMapScaleOffset = "baseColorTexture_ST",
	/** Base color texture rotation as a non-negative number in `[0, +inf]`. */
	BaseColorMapRotation = "baseColorTextureRotation",

	/** Normal map strength in the range `[0.0, 2.0]`. */
	NormalScale = "normalScale",
	/** Normal map texture. */
	NormalMap = "normalTexture",
	/** Normal map texture scale and offset as a `vec4`. */
	NormalMapScaleOffset = "normalTexture_ST",
	/** Normal map texture rotation as a non-negative number in `[0, +inf]`. */
	NormalMapRotation = "normalTextureRotation",

	/** Emission color as a vector with values in the range `[0.0, +inf]`. */
	Emission = "emissiveFactor",
	/** Emission texture. */
	EmissionMap = "emissiveTexture",
	/** Emission texture scale and offset as a `vec4`. */
	EmissionMapScaleOffset = "emissiveTexture_ST",
	/** Emission texture rotation as a non-negative number in `[0, +inf]`. */
	EmissionMapRotation = "emissiveTextureRotation",

	/** Occlusion strength in the range `[0.0, 1.0]`. */
	OcclusionStrength = "occlusionStrength",
	/** Occlusion texture. */
	OcclusionMap = "occlusionTexture",
	/** Occlusion texture scale and offset as a `vec4`. */
	OcclusionMapScaleOffset = "occlusionTexture_ST",
	/** Occlusion texture rotation as a non-negative number in `[0, +inf]`. */
	OcclusionMapRotation = "occlusionTextureRotation",

	/** Metallic value in the range `[0.0, 1.0]`. */
	Metalness = "metallicFactor",
	/** Roughness value in the range `[0.0, 1.0]`. */
	Roughness = "roughnessFactor",
	/** Metallic-roughness texture. */
	MetallicRoughnessMap = "metallicRoughnessTexture",
	/** Metallic-roughness texture scale and offset as a `vec4`. */
	MetallicRoughnessMapScaleOffset = "metallicRoughnessTexture_ST",
	/** Metallic-roughness texture rotation as a non-negative number in `[0, +inf]`. */
	MetallicRoughnessMapRotation = "metallicRoughnessTextureRotation",

	/** Alpha cutoff value in the range `[0.0, 1.0]`. */
	AlphaCutoff = "alphaCutoff",

	/** Culling mode, where `0` means two-sided and `2` means front-only. */
	Culling = "_Cull",
}

/**
 * Supported alpha modes for a material.
 */
export enum AlphaMode {
	/** Fully opaque alpha mode. */
	Opaque = "Opaque",
	/** Masked alpha mode that uses the alpha cutoff to discard low-alpha fragments. */
	Mask = "Mask",
	/** Blended alpha mode that mixes the material color with other colors using alpha. */
	Blend = "Blend",
}

/**
 * Creates and updates materials.
 */
export class MaterialManager {
	/**
	 * Creates a material.
	 *
	 * @returns A promise that resolves to the created {@link Material}.
	 */
	static Create(): Promise<Material>;
	/**
	 * Creates a material and assigns it to an entity.
	 *
	 * @param entity - The {@link Entity} to assign the material to.
	 * @param submeshIndex - The submesh index to assign the material to. Defaults
	 * to `0`.
	 * @returns A promise that resolves to the created {@link Material}.
	 */
	static Create(entity: Entity, submeshIndex?: number): Promise<Material>;
	static async Create(entity?: Entity, submeshIndex?: number) {
		const matHandle = await RpcClient.Call<Material>(
			"Material::Create",
			RpcClient.GetClientId(),
		);

		if (entity !== undefined) {
			await RpcClient.Call<boolean>(
				"Renderable::SetMaterial",
				entity,
				matHandle,
				submeshIndex ?? 0,
			);
		}

		return matHandle;
	}

	/**
	 * Destroys a material.
	 *
	 * @param handle - The {@link Material} to destroy.
	 * @returns A promise that resolves to `true` if the material was destroyed, or
	 * `false` otherwise.
	 */
	static Destroy(handle: Material) {
		return RpcClient.Call<boolean>("Material::Destroy", handle);
	}

	/**
	 * Sets a numeric property on a material.
	 *
	 * @param handle - The {@link Material} to update.
	 * @param property - The property to change.
	 * @param value - The numeric value to assign.
	 * @returns A promise that resolves when the property has been changed.
	 */
	static SetFloat(handle: Material, property: MaterialProperty, value: number) {
		return RpcClient.Call<void>("Material::SetFloat", handle, property, value);
	}

	/**
	 * Gets a numeric property from a material.
	 *
	 * @param handle - The {@link Material} to inspect.
	 * @param property - The property to read.
	 * @returns A promise that resolves to the numeric property value.
	 */
	static GetFloat(handle: Material, property: MaterialProperty) {
		return RpcClient.Call<number>("Material::GetFloat", handle, property);
	}

	/**
	 * Sets a vector property on a material.
	 *
	 * @param handle - The {@link Material} to update.
	 * @param property - The property to change.
	 * @param value - The vector value to assign.
	 * @returns A promise that resolves when the property has been changed.
	 */
	static SetVector(handle: Material, property: MaterialProperty, value: vec4) {
		let newW = value[3];
		if (property.includes("Texture_ST")) {
			newW = 1 - value[1] - newW;
		}

		const vec = [value[0], value[1], value[2], newW];
		return RpcClient.Call<void>("Material::SetVector", handle, property, vec);
	}

	/**
	 * Gets a vector property from a material.
	 *
	 * @param handle - The {@link Material} to inspect.
	 * @param property - The property to read.
	 * @returns A promise that resolves to the vector property value.
	 */
	static async GetVector(handle: Material, property: MaterialProperty) {
		const arr = await RpcClient.Call<vec4>(
			"Material::GetVector",
			handle,
			property,
		);

		let newW = arr[3];
		if (property.includes("Texture_ST")) {
			newW = 1 - arr[1] - newW;
		}
		return vec4.fromValues(arr[0], arr[1], arr[2], newW);
	}

	/**
	 * Sets a color property on a material.
	 *
	 * @param handle - The {@link Material} to update.
	 * @param property - The property to change.
	 * @param rgba - The color value to assign as an RGBA `vec4`, with each channel
	 * in the range `[0.0, 1.0]`.
	 * @returns A promise that resolves when the property has been changed.
	 */
	static SetColor(handle: Material, property: MaterialProperty, rgba: vec4) {
		return RpcClient.Call<void>("Material::SetColor", handle, property, rgba);
	}

	/**
	 * Gets a color property from a material.
	 *
	 * @param handle - The {@link Material} to inspect.
	 * @param property - The property to read.
	 * @returns A promise that resolves to the color value as an RGBA `vec4`, with
	 * each channel in the range `[0.0, 1.0]`.
	 */
	static async GetColor(handle: Material, property: MaterialProperty) {
		return RpcClient.Call<vec4>("Material::GetColor", handle, property);
	}

	/**
	 * Sets a texture property on a material.
	 *
	 * @param handle - The {@link Material} to update.
	 * @param property - The property to change.
	 * @param texture - The {@link Texture} to assign.
	 * @returns A promise that resolves when the property has been changed.
	 */
	static SetTexture(
		handle: Material,
		property: MaterialProperty,
		texture: Texture,
	) {
		return RpcClient.Call<void>(
			"Material::SetTexture",
			handle,
			property,
			texture,
		);
	}

	/**
	 * Gets a texture property from a material.
	 *
	 * @param handle - The {@link Material} to inspect.
	 * @param property - The property to read.
	 * @returns A promise that resolves to the assigned {@link Texture}.
	 */
	static GetTexture(handle: Material, property: MaterialProperty) {
		return RpcClient.Call<Texture>("Material::GetTexture", handle, property);
	}

	/**
	 * Sets the alpha mode of a material.
	 *
	 * @param handle - The {@link Material} to update.
	 * @param alphaMode - The alpha mode to assign. Defaults to
	 * {@link AlphaMode.Opaque}.
	 * @returns A promise that resolves when the alpha mode has been changed.
	 */
	static SetAlphaMode(handle: Material, alphaMode?: AlphaMode) {
		return RpcClient.Call<void>(
			"Material::SetAlphaMode",
			handle,
			alphaMode ?? AlphaMode.Opaque,
		);
	}

	/**
	 * Gets the alpha mode of a material.
	 *
	 * @param handle - The {@link Material} to inspect.
	 * @returns A promise that resolves to the alpha mode.
	 */
	static GetAlphaMode(handle: Material) {
		return RpcClient.Call<AlphaMode>("Material::GetAlphaMode", handle);
	}
}
