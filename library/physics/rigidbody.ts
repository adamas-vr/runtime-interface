import { Entity } from "../entity";
import { RpcClient } from "../rpc";

export class RigidbodyManager {
	static Create(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_Create", {
				entityHandle,
			}),
		);
	}

	static Destroy(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_Destroy", {
				entityHandle,
			}),
		);
	}

	static HasComponent(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_HasComponent", {
				entityHandle,
			}),
		);
	}

	static GetIsKinematic(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_GetIsKinematic", {
				entityHandle,
			}),
		);
	}

	static SetIsKinematic(entityHandle: Entity, isKinematic: boolean): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_SetIsKinematic", {
				entityHandle,
				isKinematic,
			}),
		);
	}

	static GetUseGravity(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_GetUseGravity", {
				entityHandle,
			}),
		);
	}

	static SetUseGravity(entityHandle: Entity, useGravity: boolean): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_SetUseGravity", {
				entityHandle,
				useGravity,
			}),
		);
	}

	static GetMass(entityHandle: Entity): number {
		return Number(
			RpcClient.Call("RidigbodyAPI_GetMass", {
				entityHandle,
			}),
		);
	}

	static SetMass(entityHandle: Entity, mass: number): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_SetMass", {
				entityHandle,
				mass,
			}),
		);
	}

	static GetLinearDamping(entityHandle: Entity): number {
		return Number(
			RpcClient.Call("RidigbodyAPI_GetLinearDamping", {
				entityHandle,
			}),
		);
	}

	static SetLinearDamping(
		entityHandle: Entity,
		linearDamping: number,
	): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_SetLinearDamping", {
				entityHandle,
				linearDamping,
			}),
		);
	}

	static GetAngularDamping(entityHandle: Entity): number {
		return Number(
			RpcClient.Call("RidigbodyAPI_GetAngularDamping", {
				entityHandle,
			}),
		);
	}

	static SetAngularDamping(
		entityHandle: Entity,
		angularDamping: number,
	): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_SetAngularDamping", {
				entityHandle,
				angularDamping,
			}),
		);
	}
}
