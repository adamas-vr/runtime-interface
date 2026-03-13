import { Entity } from "../entity";
import { RpcClient } from "../rpc";
import { vec4 } from "gl-matrix";
import { Texture } from "./texture";

export type Material = number;

export enum MaterialProperty {
	/** vec4 [0.0, 1.0] */
	BaseColor = "baseColorFactor",
	/** 2D Texture */
	BaseColorMap = "baseColorTexture",
	/** vec4 */
	BaseColorMapScaleOffset = "baseColorTexture_ST",
	/** float [0, +inf] */
	BaseColorMapRotation = "baseColorTextureRotation",

	/** float [0.0, 2.0] */
	NormalScale = "normalScale",
	/** 2D Texture */
	NormalMap = "normalTexture",
	/** vec4 */
	NormalMapScaleOffset = "normalTexture_ST",
	/** float [0, +inf] */
	NormalMapRotation = "normalTextureRotation",

	/** vec3 [0.0, +inf] HDR supported */
	Emission = "emissiveFactor",
	/** 2D Texture */
	EmissionMap = "emissiveTexture",
	/** vec4 */
	EmissionMapScaleOffset = "emissiveTexture_ST",
	/** float [0, +inf] */
	EmissionMapRotation = "emissiveTextureRotation",

	/** float [0.0, 1.0] */
	OcclusionStrength = "occlusionStrength",
	/** 2D Texture */
	OcclusionMap = "occlusionTexture",
	/** vec4 */
	OcclusionMapScaleOffset = "occlusionTexture_ST",
	/** float [0, +inf] */
	OcclusionMapRotation = "occlusionTextureRotation",

	/** float [0.0, 1.0] */
	Metalness = "metallicFactor",
	/** float [0.0, 1.0] */
	Roughness = "roughnessFactor",
	/** float */
	MetallicRoughnessMap = "metallicRoughnessTexture",
	/** vec4 */
	MetallicRoughnessMapScaleOffset = "metallicRoughnessTexture_ST",
	/** float [0, +inf] */
	MetallicRoughnessMapRotation = "metallicRoughnessTextureRotation",

	/** float [0.0, 1.0] */
	AlphaCutoff = "alphaCutoff",

	/** float 0: Two Sides; 2: Front Only */
	Culling = "_Cull",
}

export enum AlphaMode {
	Opaque = "Opaque",
	Mask = "Mask",
	Blend = "Blend",
}

export class MaterialManager {
	/**
	 * Create a new material
	 * @returns The material handle
	 */
	static Create(): Promise<Material>;
	/**
	 * Create a new material and attach it to a renderable component
	 * @param entity The entity with the renderable component
	 * @param submeshIndex The submesh index to attach to (default: 0)
	 * @returns The material handle
	 */
	static Create(entity: Entity, submeshIndex?: number): Promise<Material>;
	static async Create(...args: [entity?: Entity, submeshIndex?: number]) {
		const matHandle = await RpcClient.Call<Material>(
			"Material::Create",
			RpcClient.GetClientId(),
		);

		if (args[0] !== undefined) {
			await RpcClient.Call<boolean>(
				"Renderable::SetMaterial",
				args[0],
				matHandle,
				args[1] ?? 0,
			);
		}

		return matHandle;
	}

	/**
	 * Destroy a material
	 * @param handle The material handle to destroy
	 * @returns boolean indicating success
	 */
	static Destroy(...args: [handle: Material]) {
		return RpcClient.Call<boolean>("Material::Destroy", ...args);
	}

	/**
	 * Set a float property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @param value The float value
	 * @returns boolean indicating success
	 */
	static SetFloat(
		...args: [handle: Material, property: MaterialProperty, value: number]
	) {
		return RpcClient.Call<void>("Material::SetFloat", ...args);
	}

	/**
	 * Get a float property from the material
	 * @param handle The material handle
	 * @param property The property name
	 * @returns The float value
	 */
	static GetFloat(...args: [handle: Material, property: MaterialProperty]) {
		return RpcClient.Call<number>("Material::GetFloat", ...args);
	}

	/**
	 * Set a vector property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @param value vec4 value
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
	 * Get a vector property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @returns vec4 value
	 */
	static async GetVector(
		...args: [handle: Material, property: MaterialProperty]
	) {
		const arr = await RpcClient.Call<vec4>("Material::GetVector", ...args);

		let newW = arr[3];
		if (args[1].includes("Texture_ST")) {
			newW = 1 - arr[1] - newW;
		}
		return vec4.fromValues(arr[0], arr[1], arr[2], newW);
	}

	/**
	 * Set a color property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @param rgba vec4 color [0.0, 1.0]
	 */
	static SetColor(
		...args: [handle: Material, property: MaterialProperty, rgba: vec4]
	) {
		return RpcClient.Call<void>("Material::SetColor", ...args);
	}

	/**
	 * Get a color property from the material
	 * @param handle The material handle
	 * @param property The property name
	 * @returns Color
	 */
	static async GetColor(
		...args: [handle: Material, property: MaterialProperty]
	) {
		return RpcClient.Call<vec4>("Material::GetColor", ...args);
	}

	/**
	 * Set a texture property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @param texture The texture handle
	 */
	static SetTexture(
		...args: [handle: Material, property: MaterialProperty, texture: Texture]
	) {
		return RpcClient.Call<void>("Material::SetTexture", ...args);
	}

	/**
	 * Get a texture property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @returns The texture handle
	 */
	static GetTexture(...args: [handle: Material, property: MaterialProperty]) {
		return RpcClient.Call<Texture>("Material::GetTexture", ...args);
	}

	static SetAlphaMode(...args: [handle: Material, alphaMode?: AlphaMode]) {
		return RpcClient.Call<void>(
			"Material::SetAlphaMode",
			args[0],
			args[1] ?? AlphaMode.Opaque,
		);
	}

	static GetAlphaMode(...args: [handle: Material]) {
		return RpcClient.Call<AlphaMode>("Material::GetAlphaMode", ...args);
	}
}
