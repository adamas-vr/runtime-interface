import { vec3 } from "gl-matrix";
import { Entity } from "../entity";
import { RpcClient } from "../rpc";

export enum ForceMode {
	/** Add a continuous force to the rigidbody, using its mass. */
	Force = 0,
	/** Add a continuous acceleration to the rigidbody, ignoring its mass. */
	Acceleration = 5,
	/** Add an instant force impulse to the rigidbody, using its mass. */
	Impulse = 1,
	/** Add an instant velocity change to the rigidbody, ignoring its mass. */
	VelocityChange = 2,
}

// export enum RigidbodyConstraints {
// 	/** No constraints. */
// 	None = 0,
// 	/** Freeze motion along the X-axis. */
// 	FreezePositionX = 2,
// 	/** Freeze motion along the Y-axis. */
// 	FreezePositionY = 4,
// 	/** Freeze motion along the Z-axis. */
// 	FreezePositionZ = 8,
// 	/** Freeze rotation along the X-axis. */
// 	FreezeRotationX = 16,
// 	/** Freeze rotation along the Y-axis. */
// 	FreezeRotationY = 32,
// 	/** Freeze rotation along the Z-axis. */
// 	FreezeRotationZ = 64,
// 	/** Freeze motion along all axes. */
// 	FreezePosition = 14,
// 	/** Freeze rotation along all axes. */
// 	FreezeRotation = 112,
// 	/** Freeze rotation and motion along all axes. */
// 	FreezeAll = 126,
// }

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

	static GetLinearVelocity(entityHandle: Entity): vec3 {
		const [x, y, z] = JSON.parse(
			RpcClient.Call("RidigbodyAPI_GetLinearVelocity", {
				entityHandle,
			}),
		);
		return vec3.fromValues(x, y, z);
	}

	static GetAngularVelocity(entityHandle: Entity): vec3 {
		const [x, y, z] = JSON.parse(
			RpcClient.Call("RidigbodyAPI_GetAngularVelocity", {
				entityHandle,
			}),
		);
		return vec3.fromValues(x, y, z);
	}

	static AddForce(
		entityHandle: Entity,
		force: vec3,
		forceMode: ForceMode = ForceMode.Force,
	): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_AddForce", {
				entityHandle,
				fx: force[0],
				fy: force[1],
				fz: force[2],
				forceMode,
			}),
		);
	}

	static AddForceAtPosition(
		entityHandle: Entity,
		force: vec3,
		position: vec3,
		forceMode: ForceMode = ForceMode.Force,
	): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_AddForceAtPosition", {
				entityHandle,
				fx: force[0],
				fy: force[1],
				fz: force[2],
				px: position[0],
				py: position[1],
				pz: position[2],
				forceMode,
			}),
		);
	}

	static AddTorque(
		entityHandle: Entity,
		torque: vec3,
		forceMode: ForceMode = ForceMode.Force,
	): boolean {
		return Boolean(
			RpcClient.Call("RidigbodyAPI_AddTorque", {
				entityHandle,
				tx: torque[0],
				ty: torque[1],
				tz: torque[2],
				forceMode,
			}),
		);
	}

	// static GetConstraints(entityHandle: Entity): RigidbodyConstraints {
	// 	return Number(
	// 		RpcClient.Call("RidigbodyAPI_GetConstraints", {
	// 			entityHandle,
	// 		}),
	// 	);
	// }

	// static SetConstraints(
	// 	entityHandle: Entity,
	// 	constraints: RigidbodyConstraints,
	// ): boolean {
	// 	return Boolean(
	// 		RpcClient.Call("RidigbodyAPI_SetConstraints", {
	// 			entityHandle,
	// 			constraints,
	// 		}),
	// 	);
	// }

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
