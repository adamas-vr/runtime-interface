import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { MaterialHandle } from "./material";
import { MeshHandle } from "./mesh";

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
	static Create(entity: Entity, isSkinnedMesh: boolean = false): boolean {
		return Boolean(
			RpcClient.Call("Renderable::Create", {
				entityHandle: entity,
				isSkinnedMesh,
			}),
		);
	}

	/**
	 * Destroy the Renderable component on this entity.
	 * @param entityHandle The entity to remove the renderable component from
	 * @returns boolean indicating success
	 */
	static Destroy(entityHandle: Entity): boolean {
		return Boolean(RpcClient.Call("Renderable::Destroy", { entityHandle }));
	}

	/**
	 * Returns whether this entity currently has a Renderable.
	 * @param entityHandle The entity to check
	 * @returns boolean indicating if renderable component exists
	 */
	static HasComponent(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("Renderable::HasComponent", { entityHandle }),
		);
	}

	/**
	 * Set the mesh for the renderable component
	 * @param entityHandle The entity with the renderable component
	 * @param meshHandle The mesh handle to attach
	 * @returns boolean indicating success
	 */
	static SetMesh(entityHandle: Entity, meshHandle: MeshHandle): boolean {
		return Boolean(
			RpcClient.Call("Renderable::SetMesh", {
				entityHandle,
				meshHandle,
			}),
		);
	}

	static GetMesh(entityHandle: Entity): MeshHandle {
		return Number(
			RpcClient.Call("Renderable::GetMesh", {
				entityHandle,
			}),
		);
	}

	/**
	 * @param entityHandle
	 * @param index The entity with the renderable component
	 * @param weight [0, 1.0] The weight of the blend shape
	 * @returns boolean indicating success
	 */
	static SetBlendShapeWeight(
		entityHandle: Entity,
		index: number,
		weight: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Renderable::SetBlendShapeWeight", {
				entityHandle,
				index,
				weight,
			}),
		);
	}

	/**
	 * Get blend shape weight at the given index
	 * @param entityHandle
	 * @param index The entity with the renderable component
	 * @returns boolean indicating success
	 */
	static GetBlendShapeWeight(entityHandle: Entity, index: number): number {
		return Number(
			RpcClient.Call("Renderable::GetBlendShapeWeight", {
				entityHandle,
				index,
			}),
		);
	}

	/**
	 * Set the material for the renderable component
	 * @param entityHandle The entity with the renderable component
	 * @param materialHandle The material handle to attach
	 * @param index The material index (default: 0)
	 * @returns boolean indicating success
	 */
	static SetMaterial(
		entityHandle: Entity,
		materialHandle: MaterialHandle,
		index: number = 0,
	): boolean {
		return Boolean(
			RpcClient.Call("Renderable::SetMaterial", {
				entityHandle,
				materialHandle,
				index,
			}),
		);
	}

	/**
	 * Get the material for the renderable component
	 * @param entityHandle The entity with the renderable component
	 * @param index The material index (default: 0)
	 * @returns MaterialHandle
	 */
	static GetMaterial(entityHandle: Entity, index: number = 0): MaterialHandle {
		return Number(
			RpcClient.Call("Renderable::GetMaterial", {
				entityHandle,
				index,
			}),
		);
	}

	/**
	 * Enable or disable receiving shadows on this Renderable.
	 * @param entityHandle The entity with the renderable component
	 * @param receive Whether to receive shadows
	 * @returns boolean indicating success
	 */
	static SetReceiveShadows(entityHandle: Entity, receive: boolean): boolean {
		return Boolean(
			RpcClient.Call("Renderable::SetReceiveShadows", {
				entityHandle,
				receive,
			}),
		);
	}

	static GetReceiveShadows(entityHandle: Entity, receive: boolean): boolean {
		return Boolean(
			RpcClient.Call("Renderable::GetReceiveShadows", {
				entityHandle,
				receive,
			}),
		);
	}

	/**
	 * Set shadow‐casting mode.
	 * @param entityHandle The entity with the renderable component
	 * @param shadowMode The shadow casting mode
	 * @returns boolean indicating success
	 */
	static SetShadowMode(
		entityHandle: Entity,
		shadowMode: ShadowCastingMode,
	): boolean {
		return Boolean(
			RpcClient.Call("Renderable::SetShadowMode", {
				entityHandle,
				shadowMode,
			}),
		);
	}

	/**
	 * Get shadow‐casting mode.
	 * @param entityHandle The entity with the renderable component
	 * @returns boolean indicating success
	 */
	static GetShadowMode(entityHandle: Entity): ShadowCastingMode {
		return Number(
			RpcClient.Call("Renderable::GetShadowMode", {
				entityHandle,
			}),
		);
	}
}
