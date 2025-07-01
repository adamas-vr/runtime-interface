import { RpcClient } from "@adamas/rpc";
import { Entity } from "@adamas/entity";

// NOTE: the following are not supported compared to legacy code:
// - Filament's RenderableBuilder.Geometry(index,type,vertices,indices,offset,count)
// - RenderableBuilder.Material(index,materialInstance)
// - BoundingBox(...), SetBlendOrderAt

// TODO: make this clear.
// - entity
// - renderable component
//     - mesh
//     - materials
//         - texture
export class RenderableManager {
	/**
	 * Create a renderable component and attach it to the specified entity
	 * @param entity The entity to attach the renderable component to
	 * @returns boolean indicating success
	 */
	static Create(entity: Entity): boolean {
		return Boolean(
			RpcClient.Call("Renderable_Create", { entityHandle: entity }),
		);
	}

	/**
	 * Destroy the Renderable component on this entity.
	 * @param entityHandle The entity to remove the renderable component from
	 * @returns boolean indicating success
	 */
	static Destroy(entityHandle: number): boolean {
		return Boolean(RpcClient.Call("Renderable_Destroy", { entityHandle }));
	}

	/**
	 * Returns whether this entity currently has a Renderable.
	 * @param entityHandle The entity to check
	 * @returns boolean indicating if renderable component exists
	 */
	static HasComponent(entityHandle: number): boolean {
		return Boolean(RpcClient.Call("Renderable_HasComponent", { entityHandle }));
	}

	/**
	 * Set the mesh for the renderable component
	 * @param entityHandle The entity with the renderable component
	 * @param meshHandle The mesh handle to attach
	 * @returns boolean indicating success
	 */
	static SetMesh(entityHandle: number, meshHandle: number): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetMesh", {
				entityHandle,
				meshHandle,
			}),
		);
	}

	/**
	 * Set the material for the renderable component
	 * @param entityHandle The entity with the renderable component
	 * @param materialHandle The material handle to attach
	 * @param index The submesh index (default: 0)
	 * @returns boolean indicating success
	 */
	static SetMaterial(
		entityHandle: number,
		materialHandle: number,
		index: number = 0,
	): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetMaterial", {
				entityHandle,
				materialHandle,
				index,
			}),
		);
	}

	/**
	 * Set the layer mask on this Renderable (bitmask of visible layers).
	 * @param entityHandle The entity with the renderable component
	 * @param layerMask The layer mask
	 * @returns boolean indicating success
	 */
	static SetLayerMask(entityHandle: number, layerMask: number): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetLayerMask", {
				entityHandle,
				layerMask,
			}),
		);
	}

	/**
	 * Enable or disable receiving shadows on this Renderable.
	 * @param entityHandle The entity with the renderable component
	 * @param receive Whether to receive shadows
	 * @returns boolean indicating success
	 */
	static SetReceiveShadows(entityHandle: number, receive: boolean): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetReceiveShadows", {
				entityHandle,
				receive,
			}),
		);
	}

	/**
	 * Control shadow‐casting mode.
	 *   0 = Off, 1 = On, 2 = TwoSided, 3 = ShadowsOnly
	 * @param entityHandle The entity with the renderable component
	 * @param shadowMode The shadow casting mode
	 * @returns boolean indicating success
	 */
	static SetCastShadows(entityHandle: number, shadowMode: number): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetCastShadows", {
				entityHandle,
				shadowMode,
			}),
		);
	}

	/**
	 * Enable or disable frustum‐culling on this Renderable.
	 * @param entityHandle The entity with the renderable component
	 * @param enabled Whether to enable culling
	 * @returns boolean indicating success
	 */
	static SetCulling(entityHandle: number, enabled: boolean): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetCulling", {
				entityHandle,
				enabled,
			}),
		);
	}
}
