import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { vec4 } from "gl-matrix";
import { TextureHandle } from "./texture";

export type MaterialHandle = number;

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
	static Create(): MaterialHandle;
	/**
	 * Create a new material and attach it to a renderable component
	 * @param entity The entity with the renderable component
	 * @param submeshIndex The submesh index to attach to (default: 0)
	 * @returns The material handle
	 */
	static Create(entity: Entity, submeshIndex?: number): MaterialHandle;
	static Create(entity?: Entity, submeshIndex: number = 0): MaterialHandle {
		const matHandle = Number(
			RpcClient.Call("Material::Create", {
				clientId: RpcClient.GetClientId(),
			}),
		);

		if (entity !== undefined) {
			RpcClient.Call("Renderable::SetMaterial", {
				entityHandle: entity,
				materialHandle: matHandle,
				index: submeshIndex,
			});
		}

		return matHandle;
	}

	/**
	 * Destroy a material
	 * @param handle The material handle to destroy
	 * @returns boolean indicating success
	 */
	static Destroy(handle: MaterialHandle): boolean {
		return Boolean(
			RpcClient.Call("Material::Destroy", { materialHandle: handle }),
		);
	}

	/**
	 * Set a float property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @param value The float value
	 * @returns boolean indicating success
	 */
	static SetFloat(
		handle: MaterialHandle,
		property: MaterialProperty,
		value: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Material::SetFloat", {
				materialHandle: handle,
				propertyName: property,
				value,
			}),
		);
	}

	/**
	 * Get a float property from the material
	 * @param handle The material handle
	 * @param property The property name
	 * @returns The float value
	 */
	static GetFloat(handle: MaterialHandle, property: MaterialProperty): number {
		return Number(
			RpcClient.Call("Material::GetFloat", {
				materialHandle: handle,
				propertyName: property,
			}),
		);
	}

	/**
	 * Set a vector property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @param value vec4 value
	 * @returns boolean indicating success
	 */
	static SetVector(
		handle: MaterialHandle,
		property: MaterialProperty,
		value: vec4,
	): boolean {
		let newW = value[3];
		if (property.includes("Texture_ST")) {
			newW = 1 - value[1] - newW;
		}

		return Boolean(
			RpcClient.Call("Material::SetVector", {
				materialHandle: handle,
				propertyName: property,
				x: value[0],
				y: value[1],
				z: value[2],
				w: newW,
			}),
		);
	}

	/**
	 * Get a vector property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @returns vec4 value
	 */
	static GetVector(handle: MaterialHandle, property: MaterialProperty): vec4 {
		const arr = JSON.parse(
			RpcClient.Call("Material::GetVector", {
				materialHandle: handle,
				propertyName: property,
			}),
		);

		if (arr.length != 4) throw `Property ${property} does not exist.`;

		let newW = arr[3];
		if (property.includes("Texture_ST")) {
			newW = 1 - arr[1] - newW;
		}
		return vec4.fromValues(arr[0], arr[1], arr[2], newW);
	}

	/**
	 * Set a color property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @param rgba vec4 color [0.0, 1.0]
	 * @returns boolean indicating success
	 */
	static SetColor(
		handle: MaterialHandle,
		property: MaterialProperty,
		rgba: vec4,
	): boolean {
		return Boolean(
			RpcClient.Call("Material::SetColor", {
				materialHandle: handle,
				propertyName: property,
				r: rgba[0],
				g: rgba[1],
				b: rgba[2],
				a: rgba[3],
			}),
		);
	}

	/**
	 * Get a color property from the material
	 * @param handle The material handle
	 * @param property The property name
	 * @returns Color
	 */
	static GetColor(handle: MaterialHandle, property: MaterialProperty): vec4 {
		const arr = JSON.parse(
			RpcClient.Call("Material::GetColor", {
				materialHandle: handle,
				propertyName: property,
			}),
		);

		if (arr.length != 4) throw `Property ${property} does not exist.`;
		return vec4.fromValues(arr[0], arr[1], arr[2], arr[3]);
	}

	/**
	 * Set a texture property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @param texture The texture handle
	 * @returns boolean indicating success
	 */
	static SetTexture(
		handle: MaterialHandle,
		property: MaterialProperty,
		texture: TextureHandle,
	): boolean {
		return Boolean(
			RpcClient.Call("Material::SetTexture", {
				materialHandle: handle,
				propertyName: property,
				textureHandle: texture,
			}),
		);
	}

	/**
	 * Get a texture property on the material
	 * @param handle The material handle
	 * @param property The property name
	 * @returns The texture handle
	 */
	static GetTexture(
		handle: MaterialHandle,
		property: MaterialProperty,
	): TextureHandle {
		return Number(
			RpcClient.Call("Material::GetTexture", {
				materialHandle: handle,
				propertyName: property,
			}),
		);
	}

	static SetAlphaMode(
		handle: MaterialHandle,
		alphaMode: AlphaMode = AlphaMode.Opaque,
	) {
		return Boolean(
			RpcClient.Call("Material::SetAlphaMode", {
				materialHandle: handle,
				alphaMode,
			}),
		);
	}

	static GetAlphaMode(handle: MaterialHandle): AlphaMode | undefined {
		const val = String(
			RpcClient.Call("Material::GetAlphaMode", {
				materialHandle: handle,
			}),
		);

		if (val == "") return undefined;
		return val as AlphaMode;
	}
}
