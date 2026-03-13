import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { Material } from "./material";
import { Mesh } from "./mesh";

export enum ShadowCastingMode {
	/** No shadows are cast from this object. */
	Off = 0,
	/** Shadows are cast from this object. */
	On = 1,
	/** Shadows are cast from this object, treating it as two-sided. */
	TwoSided = 2,
	/** Object casts shadows, but is otherwise invisible in the Scene. */
	ShadowsOnly = 3,
}

export class RenderableManager {
	/**
	 * Create a renderable component and attach it to the specified entity
	 * @param entity The entity to attach the renderable component to
	 * @returns boolean indicating success
	 */
	static Create(...args: [entity: Entity, isSkinnedMesh?: boolean]) {
		return RpcClient.Call<boolean>(
			"Renderable::Create",
			args[0],
			args[1] ?? false,
		);
	}

	/**
	 * Destroy the Renderable component on this entity.
	 * @param entity The entity to remove the renderable component from
	 * @returns boolean indicating success
	 */
	static Destroy(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Renderable::Destroy", ...args);
	}

	/**
	 * Returns whether this entity currently has a Renderable.
	 * @param entity The entity to check
	 * @returns boolean indicating if renderable component exists
	 */
	static HasComponent(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Renderable::HasComponent", ...args);
	}

	/**
	 * Set if the renderable component is enabled
	 * @param entity The entity with the renderable component
	 * @param enabled If the renderable component is enabled
	 * @returns boolean indicating success
	 */
	static SetEnabled(...args: [entity: Entity, enabled: boolean]) {
		return RpcClient.Call<void>("Renderable::SetEnabled", ...args);
	}

	static GetEnabled(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Renderable::GetEnabled", ...args);
	}

	/**
	 * Set the mesh for the renderable component
	 * @param entity The entity with the renderable component
	 * @param mesh The mesh handle to attach
	 * @returns boolean indicating success
	 */
	static SetMesh(...args: [entity: Entity, mesh: Mesh]) {
		return RpcClient.Call<void>("Renderable::SetMesh", ...args);
	}

	static GetMesh(...args: [entity: Entity]) {
		return RpcClient.Call<Mesh>("Renderable::GetMesh", ...args);
	}

	/**
	 * @param entity
	 * @param index The entity with the renderable component
	 * @param weight [0, 1.0] The weight of the blend shape
	 * @returns boolean indicating success
	 */
	static SetBlendShapeWeight(
		...args: [entity: Entity, index: number, weight: number]
	) {
		return RpcClient.Call<void>("Renderable::SetBlendShapeWeight", ...args);
	}

	/**
	 * Get blend shape weight at the given index
	 * @param entity
	 * @param index The entity with the renderable component
	 * @returns boolean indicating success
	 */
	static GetBlendShapeWeight(...args: [entity: Entity, index: number]) {
		return RpcClient.Call<number>("Renderable::GetBlendShapeWeight", ...args);
	}

	/**
	 * Set the material for the renderable component
	 * @param entity The entity with the renderable component
	 * @param material The material handle to attach
	 * @param index The material index (default: 0)
	 * @returns boolean indicating success
	 */
	static SetMaterial(
		...args: [entity: Entity, material: Material, index?: number]
	) {
		return RpcClient.Call<void>(
			"Renderable::SetMaterial",
			args[0],
			args[1],
			args[2] ?? 0,
		);
	}

	/**
	 * Get the material for the renderable component
	 * @param entity The entity with the renderable component
	 * @param index The material index (default: 0)
	 * @returns material
	 */
	static GetMaterial(...args: [entity: Entity, index?: number]) {
		return RpcClient.Call<Material>(
			"Renderable::GetMaterial",
			args[0],
			args[1] ?? 0,
		);
	}

	/**
	 * Enable or disable receiving shadows on this Renderable.
	 * @param entity The entity with the renderable component
	 * @param receive Whether to receive shadows
	 * @returns boolean indicating success
	 */
	static SetReceiveShadows(...args: [entity: Entity, receive: boolean]) {
		return RpcClient.Call<void>("Renderable::SetReceiveShadows", ...args);
	}

	static GetReceiveShadows(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Renderable::GetReceiveShadows", ...args);
	}

	/**
	 * Set shadow‐casting mode.
	 * @param entity The entity with the renderable component
	 * @param shadowMode The shadow casting mode
	 * @returns boolean indicating success
	 */
	static SetShadowMode(
		...args: [entity: Entity, shadowMode: ShadowCastingMode]
	) {
		return RpcClient.Call<void>("Renderable::SetShadowMode", ...args);
	}

	/**
	 * Get shadow‐casting mode.
	 * @param entity The entity with the renderable component
	 * @returns boolean indicating success
	 */
	static GetShadowMode(...args: [entity: Entity]) {
		return RpcClient.Call<ShadowCastingMode>(
			"Renderable::GetShadowMode",
			...args,
		);
	}
}
