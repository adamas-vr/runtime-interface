/**
 * Entity management APIs for creating, destroying, and updating entities.
 *
 * @module entity
 */

import { Project } from "./project";
import { RpcClient } from "./rpc";

/**
 * Opaque numeric handle that identifies an entity.
 *
 * Values of this type are returned by entity creation APIs and consumed by other
 * entity management operations.
 */
export type Entity = number;

/**
 * Creates and manages entities.
 */
export class EntityManager {
	/**
	 * Creates a new entity.
	 *
	 * @param name - Human-readable name to assign to the new entity.
	 * @returns A promise that resolves to the newly created {@link Entity} handle.
	 */
	static async Create(name: string) {
		return RpcClient.Call<Entity>(
			"Entity::Create",
			Project.GetProjectId(),
			RpcClient.GetClientId(),
			name,
		);
	}

	/**
	 * Destroys an existing entity.
	 *
	 * @param entity - The {@link Entity} handle to remove from the runtime.
	 * @returns A promise that resolves to `true` when the entity was destroyed
	 * successfully, or `false` when the destroy operation was rejected or failed.
	 */
	static Destroy(entity: Entity) {
		return RpcClient.Call<boolean>("Entity::Destroy", entity);
	}

	/**
	 * Sets whether an entity is active.
	 *
	 * @param entity - The {@link Entity} handle to update.
	 * @param active - `true` to activate the entity; `false` to deactivate it.
	 * @returns A promise that resolves when the active state has been changed.
	 */
	static SetActive(entity: Entity, active: boolean) {
		return RpcClient.Call<void>("Entity::SetActive", entity, active);
	}

	/**
	 * Retrieves whether an entity is currently active.
	 *
	 * @param entity - The {@link Entity} handle to inspect.
	 * @returns A promise that resolves to `true` if the entity is active, otherwise
	 * `false`.
	 */
	static GetActive(entity: Entity) {
		return RpcClient.Call<boolean>("Entity::GetActive", entity);
	}

	/**
	 * Set the name of an entity.
	 *
	 * @param entity - The {@link Entity} to rename.
	 * @param name - The new human-readable name for the entity.
	 * @returns A promise that resolves when the name has been changed.
	 */
	static SetName(entity: Entity, name: string) {
		return RpcClient.Call<void>("Entity::SetName", entity, name);
	}

	/**
	 * Gets the name of an entity.
	 *
	 * @param entity - The {@link Entity} whose name should be returned.
	 * @returns A promise that resolves to the entity's current name.
	 */
	static GetName(entity: Entity) {
		return RpcClient.Call<string>("Entity::GetName", entity);
	}

	// static SetLayer(entity: Entity, layer: number): boolean {
	// 	return Boolean(RpcClient.Call("Entity::SetLayer", { entity, layer }));
	// }

	// static GetLayer(entity: Entity): number {
	// 	return Number(RpcClient.Call("Entity::GetLayer", { entity }));
	// }
}
