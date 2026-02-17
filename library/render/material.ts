import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { vec4 } from "gl-matrix";

export type MaterialHandle = number;

export enum ShaderType {
	UnityGLTF = "UnityGLTF/PBRGraph",
}

export enum ShaderProperties {
	/** vec4 [0.0, 1.0] */
	BaseColor = "baseColorFactor",
	/** 2D Texture */
	BaseColorMap = "baseColorTexture",

	/** float [0.0, 2.0] */
	NormalScale = "normalScale",
	/** 2D Texture */
	NormalMap = "normalTexture",

	/** vec3 [0.0, 1.0] */
	Emission = "emissiveFactor",
	/** 2D Texture */
	EmissionMap = "emissiveTexture",

	/** float [0.0, 1.0] */
	OcclusionStrength = "occlusionStrength",
	/** 2D Texture */
	OcclusionMap = "occlusionTexture",

	/** float [0.0, 1.0] */
	Roughness = "roughnessFactor",
	/** float */
	RoughnessMap = "metallicRoughnessTexture",

	/** float [0.0, 1.0] */
	Metalness = "metallicFactor",
	/** 2D Texture */
	MetalnessMap = "metallicRoughnessTexture",

	/** float [0.0, 1.0] */
	AlphaCutoff = "alphaCutoff",

	/** float 0: Two Sides; 2: Front Only */
	Culling = "_Cull",
}

export class MaterialManager {
	/**
	 * Create a new material with the specified shader
	 * @param shader The name of the shader to use
	 * @returns The material handle
	 */
	static Create(shader: ShaderType): MaterialHandle;

	/**
	 * Create a new material and attach it to a renderable component
	 * @param shader The name of the shader to use
	 * @param entity The entity with the renderable component
	 * @param submeshIndex The submesh index to attach to (default: 0)
	 * @returns The material handle
	 */
	static Create(
		shader: ShaderType,
		entity: Entity,
		submeshIndex?: number,
	): MaterialHandle;

	static Create(
		shader: ShaderType = ShaderType.UnityGLTF,
		entity?: Entity,
		submeshIndex: number = 0,
	): MaterialHandle {
		const matHandle = Number(
			RpcClient.Call("Material_Create", {
				shaderName: shader,
				clientId: RpcClient.GetClientId(),
			}),
		);

		if (entity !== undefined) {
			RpcClient.Call("Renderable_SetMaterial", {
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
			RpcClient.Call("Material_Destroy", { materialHandle: handle }),
		);
	}

	/**
	 * Create a material instance
	 * @param handle The material handle to create an instance from
	 * @returns The material instance handle
	 */
	static CreateInstance(handle: MaterialHandle): MaterialHandle {
		return Number(
			RpcClient.Call("Material_CreateInstance", {
				materialHandle: handle,
				clientId: RpcClient.GetClientId(),
			}),
		);
	}

	/**
	 * Set a float property on the material
	 * @param handle The material handle
	 * @param prop The property name
	 * @param value The float value
	 * @returns boolean indicating success
	 */
	static SetFloat(
		handle: MaterialHandle,
		prop: ShaderProperties,
		value: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Material_SetFloat", {
				materialHandle: handle,
				propertyName: prop,
				value,
			}),
		);
	}

	/**
	 * Set a vector property on the material
	 * @param handle The material handle
	 * @param prop The property name
	 * @param value vec4 value
	 * @returns boolean indicating success
	 */
	static SetVector(
		handle: MaterialHandle,
		prop: ShaderProperties,
		value: vec4,
	): boolean {
		return Boolean(
			RpcClient.Call("Material_SetVector", {
				materialHandle: handle,
				propertyName: prop,
				x: value[0],
				y: value[1],
				z: value[2],
				w: value[3],
			}),
		);
	}

	/**
	 * Set a color property on the material
	 * @param handle The material handle
	 * @param prop The property name
	 * @param rgba vec4 color [0.0, 1.0]
	 * @returns boolean indicating success
	 */
	static SetColor(
		handle: MaterialHandle,
		prop: ShaderProperties,
		rgba: vec4,
	): boolean {
		return Boolean(
			RpcClient.Call("Material_SetColor", {
				materialHandle: handle,
				propertyName: prop,
				r: rgba[0],
				g: rgba[1],
				b: rgba[2],
				a: rgba[3],
			}),
		);
	}

	/**
	 * Set a texture property on the material
	 * @param handle The material handle
	 * @param prop The property name
	 * @param tex The texture handle
	 * @returns boolean indicating success
	 */
	static SetTexture(
		handle: MaterialHandle,
		prop: ShaderProperties,
		tex: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Material_SetTexture", {
				materialHandle: handle,
				propertyName: prop,
				textureHandle: tex,
			}),
		);
	}

	/**
	 * Get a float property from the material
	 * @param handle The material handle
	 * @param prop The property name
	 * @returns The float value
	 */
	static GetFloat(handle: MaterialHandle, prop: ShaderProperties): number {
		return Number(
			RpcClient.Call("Material_GetFloat", {
				materialHandle: handle,
				propertyName: prop,
			}),
		);
	}

	/**
	 * Get a color property from the material
	 * @param handle The material handle
	 * @param prop The property name
	 * @returns The color as a string
	 */
	static GetColor(handle: MaterialHandle, prop: ShaderProperties): string {
		return RpcClient.Call("Material_GetColor", {
			materialHandle: handle,
			propertyName: prop,
		});
	}

	static SetAlphaMode(
		handle: MaterialHandle,
		alphaMode: "Blend" | "Mask" | "Opaque" = "Opaque",
	) {
		return Boolean(
			RpcClient.Call("Material_SetAlphaMode", {
				materialHandle: handle,
				alphaMode,
			}),
		);
	}
}
