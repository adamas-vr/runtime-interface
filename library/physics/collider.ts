import { Entity } from "../entity";
import { User } from "../player";
import { RpcClient } from "../rpc";
import { vec3 } from "gl-matrix";

export type ColliderHandle = number;

export class ColliderManager {
	static CreateBox(entityHandle: Entity): ColliderHandle {
		return Number(
			RpcClient.Call("ColliderAPI::CreateBox", {
				entityHandle,
			}),
		);
	}

	static CreateSphere(entityHandle: Entity): ColliderHandle {
		return Number(
			RpcClient.Call("ColliderAPI::CreateSphere", {
				entityHandle,
			}),
		);
	}

	static CreateCapsule(entityHandle: Entity): ColliderHandle {
		return Number(
			RpcClient.Call("ColliderAPI::CreateCapsule", {
				entityHandle,
			}),
		);
	}

	static Destroy(
		entityHandle: Entity,
		colliderHandle: ColliderHandle,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::Destroy", {
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
			RpcClient.Call("ColliderAPI::HasComponent", {
				entityHandle,
				colliderHandle,
			}),
		);
	}

	static GetEntity(colliderHandle: ColliderHandle): Entity {
		return Number(
			RpcClient.Call("ColliderAPI::GetEntity", {
				colliderHandle,
			}),
		);
	}

	static GetAllColliders(entityHandle: Entity): ColliderHandle[] {
		const json = String(
			RpcClient.Call("ColliderAPI::GetAllColliders", {
				entityHandle,
			}),
		);

		return JSON.parse(json) as ColliderHandle[];
	}

	static GetBoxColliderCenter(colliderHandle: ColliderHandle): vec3 {
		const center = JSON.parse(
			RpcClient.Call("ColliderAPI::GetBoxColliderCenter", {
				colliderHandle,
			}) as string,
		) as number[];

		return vec3.fromValues(center[0], center[1], center[2]);
	}

	static SetBoxColliderCenter(
		colliderHandle: ColliderHandle,
		center: vec3,
	): boolean {
		return RpcClient.Call("ColliderAPI::SetBoxColliderCenter", {
			colliderHandle,
			v0: center[0],
			v1: center[1],
			v2: center[2],
		});
	}

	static GetBoxColliderSize(colliderHandle: ColliderHandle): vec3 {
		const center = JSON.parse(
			RpcClient.Call("ColliderAPI::GetBoxColliderSize", {
				colliderHandle,
			}) as string,
		) as number[];

		return vec3.fromValues(center[0], center[1], center[2]);
	}

	static SetBoxColliderSize(
		colliderHandle: ColliderHandle,
		size: vec3,
	): boolean {
		return RpcClient.Call("ColliderAPI::SetBoxColliderSize", {
			colliderHandle,
			v0: size[0],
			v1: size[1],
			v2: size[2],
		});
	}

	static GetSphereColliderCenter(colliderHandle: ColliderHandle): vec3 {
		const center = JSON.parse(
			RpcClient.Call("ColliderAPI::GetSphereColliderCenter", {
				colliderHandle,
			}) as string,
		) as number[];

		return vec3.fromValues(center[0], center[1], center[2]);
	}

	static SetSphereColliderCenter(
		colliderHandle: ColliderHandle,
		center: vec3,
	): boolean {
		return RpcClient.Call("ColliderAPI::SetSphereColliderCenter", {
			colliderHandle,
			v0: center[0],
			v1: center[1],
			v2: center[2],
		});
	}

	static GetSphereColliderRadius(colliderHandle: ColliderHandle): number {
		return RpcClient.Call("ColliderAPI::GetSphereColliderRadius", {
			colliderHandle,
		}) as number;
	}

	static SetSphereColliderRadius(
		colliderHandle: ColliderHandle,
		radius: number,
	): boolean {
		return RpcClient.Call("ColliderAPI::SetSphereColliderRadius", {
			colliderHandle,
			radius,
		});
	}

	static GetCapsuleColliderCenter(colliderHandle: ColliderHandle): vec3 {
		const center = JSON.parse(
			RpcClient.Call("ColliderAPI::GetCapsuleColliderCenter", {
				colliderHandle,
			}) as string,
		) as number[];

		return vec3.fromValues(center[0], center[1], center[2]);
	}

	static SetCapsuleColliderCenter(
		colliderHandle: ColliderHandle,
		center: vec3,
	): boolean {
		return RpcClient.Call("ColliderAPI::SetCapsuleColliderCenter", {
			colliderHandle,
			v0: center[0],
			v1: center[1],
			v2: center[2],
		});
	}

	static GetCapsuleColliderRadius(colliderHandle: ColliderHandle): number {
		return RpcClient.Call("ColliderAPI::GetCapsuleColliderRadius", {
			colliderHandle,
		}) as number;
	}

	static SetCapsuleColliderRadius(
		colliderHandle: ColliderHandle,
		radius: number,
	): boolean {
		return RpcClient.Call("ColliderAPI::SetCapsuleColliderRadius", {
			colliderHandle,
			radius,
		});
	}

	static GetCapsuleColliderHeight(colliderHandle: ColliderHandle): number {
		return RpcClient.Call("ColliderAPI::GetCapsuleColliderHeight", {
			colliderHandle,
		}) as number;
	}

	static SetCapsuleColliderHeight(
		colliderHandle: ColliderHandle,
		height: number,
	): boolean {
		return RpcClient.Call("ColliderAPI::SetCapsuleColliderHeight", {
			colliderHandle,
			height,
		});
	}

	static GetIsTrigger(entityHandle: Entity): Boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::GetIsTrigger", {
				entityHandle,
			}),
		);
	}

	static SetIsTrigger(colliderHandle: Entity, isTrigger: boolean): Boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::SetIsTrigger", {
				colliderHandle,
				isTrigger,
			}),
		);
	}

	static OnTriggerEnter(
		entityHandle: Entity,
		onTriggerEnter: (entity: Entity, collider: ColliderHandle) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnTriggerEnter", {
				entityHandle,
				onTriggerEnter: (args: any) =>
					onTriggerEnter(args.entityHandle, args.colliderHandle),
			}),
		);
	}

	static OnTriggerExit(
		entityHandle: Entity,
		onTriggerExit: (entity: Entity, collider: ColliderHandle) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnTriggerExit", {
				entityHandle,
				onTriggerExit: (args: any) =>
					onTriggerExit(args.entityHandle, args.colliderHandle),
			}),
		);
	}

	static OnTriggerStay(
		entityHandle: Entity,
		onTriggerStay: (entity: Entity, collider: ColliderHandle) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnTriggerStay", {
				entityHandle,
				onTriggerStay: (args: any) =>
					onTriggerStay(args.entityHandle, args.colliderHandle),
			}),
		);
	}

	static OnCollisionEnter(
		entityHandle: Entity,
		onCollisionEnter: (entity: Entity, collider: ColliderHandle) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnCollisionEnter", {
				entityHandle,
				onCollisionEnter: (args: any) => {
					onCollisionEnter(args.entityHandle, args.colliderHandle);
				},
			}),
		);
	}

	static OnCollisionExit(
		entityHandle: Entity,
		onCollisionExit: (entity: Entity, collider: ColliderHandle) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnCollisionExit", {
				entityHandle,
				onCollisionExit: (args: any) => {
					onCollisionExit(args.entityHandle, args.colliderHandle);
				},
			}),
		);
	}

	static OnCollisionStay(
		entityHandle: Entity,
		onCollisionStay: (entity: Entity, collider: ColliderHandle) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnCollisionStay", {
				entityHandle,
				onCollisionStay: (args: any) => {
					onCollisionStay(args.entityHandle, args.colliderHandle);
				},
			}),
		);
	}

	static OnUserTriggerEnter(
		entityHandle: Entity,
		onUserTriggerEnter: (user: User) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnUserTriggerEnter", {
				entityHandle,
				onUserTriggerEnter: (args: any) =>
					onUserTriggerEnter(new User(args.userId)),
			}),
		);
	}

	static OnUserTriggerExit(
		entityHandle: Entity,
		onUserTriggerExit: (user: User) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnUserTriggerExit", {
				entityHandle,
				onUserTriggerExit: (args: any) =>
					onUserTriggerExit(new User(args.userId)),
			}),
		);
	}

	static OnUserTriggerStay(
		entityHandle: Entity,
		onUserTriggerStay: (user: User) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("ColliderAPI::OnUserTriggerStay", {
				entityHandle,
				onUserTriggerStay: (args: any) =>
					onUserTriggerStay(new User(args.userId)),
			}),
		);
	}
}
