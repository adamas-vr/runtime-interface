import { Entity } from "../entity";
import { RpcClient } from "../rpc";
import { vec3 } from "gl-matrix";

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

	static GetBoxColliderCenter(colliderHandle: ColliderHandle): vec3 {
		const center = JSON.parse(
			RpcClient.Call("ColliderAPI_GetBoxColliderCenter", {
				colliderHandle,
			}) as string,
		) as number[];

		return vec3.fromValues(center[0], center[1], center[2]);
	}

	static SetBoxColliderCenter(
		colliderHandle: ColliderHandle,
		center: vec3,
	): boolean {
		return RpcClient.Call("ColliderAPI_SetBoxColliderCenter", {
			colliderHandle,
			v0: center[0],
			v1: center[1],
			v2: center[2],
		});
	}

	static GetBoxColliderSize(colliderHandle: ColliderHandle): vec3 {
		const center = JSON.parse(
			RpcClient.Call("ColliderAPI_GetBoxColliderSize", {
				colliderHandle,
			}) as string,
		) as number[];

		return vec3.fromValues(center[0], center[1], center[2]);
	}

	static SetBoxColliderSize(
		colliderHandle: ColliderHandle,
		size: vec3,
	): boolean {
		return RpcClient.Call("ColliderAPI_SetBoxColliderSize", {
			colliderHandle,
			v0: size[0],
			v1: size[1],
			v2: size[2],
		});
	}

	static GetSphereColliderCenter(colliderHandle: ColliderHandle): vec3 {
		const center = JSON.parse(
			RpcClient.Call("ColliderAPI_GetSphereColliderCenter", {
				colliderHandle,
			}) as string,
		) as number[];

		return vec3.fromValues(center[0], center[1], center[2]);
	}

	static SetSphereColliderCenter(
		colliderHandle: ColliderHandle,
		center: vec3,
	): boolean {
		return RpcClient.Call("ColliderAPI_SetSphereColliderCenter", {
			colliderHandle,
			v0: center[0],
			v1: center[1],
			v2: center[2],
		});
	}

	static GetSphereColliderRadius(colliderHandle: ColliderHandle): number {
		return RpcClient.Call("ColliderAPI_GetSphereColliderRadius", {
			colliderHandle,
		}) as number;
	}

	static SetSphereColliderRadius(
		colliderHandle: ColliderHandle,
		radius: number,
	): boolean {
		return RpcClient.Call("ColliderAPI_SetSphereColliderRadius", {
			colliderHandle,
			radius,
		});
	}

	static GetCapsuleColliderCenter(colliderHandle: ColliderHandle): vec3 {
		const center = JSON.parse(
			RpcClient.Call("ColliderAPI_GetCapsuleColliderCenter", {
				colliderHandle,
			}) as string,
		) as number[];

		return vec3.fromValues(center[0], center[1], center[2]);
	}

	static SetCapsuleColliderCenter(
		colliderHandle: ColliderHandle,
		center: vec3,
	): boolean {
		return RpcClient.Call("ColliderAPI_SetCapsuleColliderCenter", {
			colliderHandle,
			v0: center[0],
			v1: center[1],
			v2: center[2],
		});
	}

	static GetCapsuleColliderRadius(colliderHandle: ColliderHandle): number {
		return RpcClient.Call("ColliderAPI_GetCapsuleColliderRadius", {
			colliderHandle,
		}) as number;
	}

	static SetCapsuleColliderRadius(
		colliderHandle: ColliderHandle,
		radius: number,
	): boolean {
		return RpcClient.Call("ColliderAPI_SetCapsuleColliderRadius", {
			colliderHandle,
			radius,
		});
	}

	static GetCapsuleColliderHeight(colliderHandle: ColliderHandle): number {
		return RpcClient.Call("ColliderAPI_GetCapsuleColliderHeight", {
			colliderHandle,
		}) as number;
	}

	static SetCapsuleColliderHeight(
		colliderHandle: ColliderHandle,
		height: number,
	): boolean {
		return RpcClient.Call("ColliderAPI_SetCapsuleColliderHeight", {
			colliderHandle,
			height,
		});
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
