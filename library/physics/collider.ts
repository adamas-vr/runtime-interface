import { Entity } from "@adamas/entity";
import { RpcClient } from "@adamas/rpc";

export type ColliderHandle = number;

export class ColliderManager {
	static CreateBox(entityHandle: Entity): ColliderHandle {
		return Number(
			RpcClient.Call("ColliderAPI_CreateBox", {
				entityHandle,
			}),
		);
	}

	static CreateSphere(entityHandle: Entity): ColliderHandle {
		return Number(
			RpcClient.Call("ColliderAPI_CreateSphere", {
				entityHandle,
			}),
		);
	}

	static CreateCapsule(entityHandle: Entity): ColliderHandle {
		return Number(
			RpcClient.Call("ColliderAPI_CreateCapsule", {
				entityHandle,
			}),
		);
	}

	static Destroy(
		entityHandle: Entity,
		colliderHandle: ColliderHandle,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI_Destroy", {
				entityHandle,
				colliderHandle,
			}),
		);
	}

	static HasComponent(
		entityHandle: Entity,
		colliderHandle: ColliderHandle,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI_HasComponent", {
				entityHandle,
				colliderHandle,
			}),
		);
	}

	static GetGameObject(entityHandle: Entity): ColliderHandle {
		return Number(
			RpcClient.Call("ColliderAPI_GetGameObject", {
				entityHandle,
			}),
		);
	}

	static GetIsTrigger(entityHandle: Entity): Boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI_GetIsTrigger", {
				entityHandle,
			}),
		);
	}

	static SetIsTrigger(colliderHandle: Entity, isTrigger: boolean): Boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI_SetIsTrigger", {
				colliderHandle,
				isTrigger,
			}),
		);
	}

	static AddTriggerEnterCallback(
		entityHandle: Entity,
		onTriggerEnter: () => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI_AddTriggerEnterCallback", {
				entityHandle,
				onTriggerEnter,
			}),
		);
	}

	static AddTriggerExitCallback(
		entityHandle: Entity,
		onTriggerExit: () => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI_AddTriggerExitCallback", {
				entityHandle,
				onTriggerExit,
			}),
		);
	}

	static AddTriggerStayCallback(
		entityHandle: Entity,
		onTriggerStay: () => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI_AddTriggerStayCallback", {
				entityHandle,
				onTriggerStay,
			}),
		);
	}
}
