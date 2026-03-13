import { Project } from "./project";
import { RpcClient } from "./rpc";

export type Entity = number;

export class EntityManager {
	/**
	 * Create a new Entity
	 * @param name Name of the entity
	 * @returns entity handle
	 */
	static async Create(...args: [name: string]) {
		return RpcClient.Call<Entity>(
			"Entity::Create",
			Project.GetProjectId(),
			RpcClient.GetClientId(),
			...args,
		);
	}

	/**
	 * Destroy the entity
	 * @param entity
	 */
	static Destroy(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Entity::Destroy", ...args);
	}

	static SetActive(...args: [entity: Entity, active: boolean]) {
		return RpcClient.Call<void>("Entity::SetActive", ...args);
	}

	static GetActive(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Entity::GetActive", ...args);
	}

	static SetName(...args: [entity: Entity, name: string]) {
		return RpcClient.Call<void>("Entity::SetName", ...args);
	}

	static GetName(...args: [entity: Entity]) {
		return RpcClient.Call<string>("Entity::GetName", ...args);
	}

	// static SetLayer(entity: Entity, layer: number): boolean {
	// 	return Boolean(RpcClient.Call("Entity::SetLayer", { entity, layer }));
	// }

	// static GetLayer(entity: Entity): number {
	// 	return Number(RpcClient.Call("Entity::GetLayer", { entity }));
	// }
}
