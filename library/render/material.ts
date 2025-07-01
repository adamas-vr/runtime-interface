import { RpcClient } from "@adamas/rpc";
import { Entity } from "@adamas/entity";

export type MaterialHandle = number;

export class MaterialManager {
	/**
	 * Create a new material with the specified shader
	 * @param shaderName The name of the shader to use
	 * @returns The material handle
	 */
	static Create(shaderName: string): MaterialHandle;
	/**
	 * Create a new material and attach it to a renderable component
	 * @param shaderName The name of the shader to use
	 * @param entity The entity with the renderable component
	 * @param submeshIndex The submesh index to attach to (default: 0)
	 * @returns The material handle
	 */
	static Create(
		shaderName: string,
		entity: Entity,
		submeshIndex?: number,
	): MaterialHandle;
	static Create(
		shaderName: string,
		entity?: Entity,
		submeshIndex: number = 0,
	): MaterialHandle {
		const matHandle = Number(
			RpcClient.Call("Material_Create", {
				shaderName,
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
		prop: string,
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
	 * @param x X component
	 * @param y Y component
	 * @param z Z component
	 * @param w W component
	 * @returns boolean indicating success
	 */
	static SetVector(
		handle: MaterialHandle,
		prop: string,
		x: number,
		y: number,
		z: number,
		w: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Material_SetVector", {
				materialHandle: handle,
				propertyName: prop,
				x,
				y,
				z,
				w,
			}),
		);
	}

	/**
	 * Set a color property on the material
	 * @param handle The material handle
	 * @param prop The property name
	 * @param r Red component (0-1)
	 * @param g Green component (0-1)
	 * @param b Blue component (0-1)
	 * @param a Alpha component (0-1)
	 * @returns boolean indicating success
	 */
	static SetColor(
		handle: MaterialHandle,
		prop: string,
		r: number,
		g: number,
		b: number,
		a: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Material_SetColor", {
				materialHandle: handle,
				propertyName: prop,
				r,
				g,
				b,
				a,
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
		prop: string,
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
	static GetFloat(handle: MaterialHandle, prop: string): number {
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
	static GetColor(handle: MaterialHandle, prop: string): string {
		return RpcClient.Call("Material_GetColor", {
			materialHandle: handle,
			propertyName: prop,
		});
	}
}
