import { RpcClient } from "./rpc";

export type Entity = number;

export class EntityManager {
	/**
	 * Create a new Entity
	 * @param name Name of the entity
	 * @returns entity handle
	 */
	static Create(name: string): Entity {
		return Number(
			RpcClient.Call("Entity::Create", {
				name,
				clientId: RpcClient.GetClientId(),
				processId: process.pid,
			}),
		);
	}

	/**
	 * Destroy the entity
	 * @param {Entity} entityHandle
	 * @returns
	 */
	static Destroy(entityHandle: Entity): boolean {
		return Boolean(RpcClient.Call("Entity::Destroy", { entityHandle }));
	}

	static SetName(entityHandle: Entity, name: string): boolean {
		return Boolean(RpcClient.Call("Entity::SetName", { entityHandle, name }));
	}

	static GetName(entityHandle: Entity): string {
		return RpcClient.Call("Entity::GetName", { entityHandle });
	}

	// static SetLayer(entityHandle: Entity, layer: number): boolean {
	// 	return Boolean(RpcClient.Call("Entity::SetLayer", { entityHandle, layer }));
	// }

	// static GetLayer(entityHandle: Entity): number {
	// 	return Number(RpcClient.Call("Entity::GetLayer", { entityHandle }));
	// }
}
