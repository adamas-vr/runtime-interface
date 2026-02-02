import { RpcClient } from "./rpc";

export type Entity = number;

export class EntityManager {
	/**
	 * Create a new Entity
	 * @returns {Entity}
	 */
	static Create(name: string): Entity {
		return Number(
			RpcClient.Call("Entity_Create", {
				name,
				clientId: RpcClient.GetClientId(),
				processId: process.pid,
			}),
		);
	}

	/**
	 * Destroys an Entity.
	 * @param {Entity} entity
	 * @returns {Boolean} If entity is destroyed successfully
	 */
	static Destroy(entityHandle: Entity): boolean {
		return Boolean(RpcClient.Call("Entity_Destroy", { entityHandle }));
	}

	static SetName(entityHandle: Entity, name: string): boolean {
		return Boolean(RpcClient.Call("Entity_SetName", { entityHandle, name }));
	}

	static GetName(entityHandle: Entity): string {
		return RpcClient.Call("Entity_GetName", { entityHandle });
	}
}
