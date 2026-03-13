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
	static Create(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Ridigbody::Create", ...args);
	}

	static Destroy(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Ridigbody::Destroy", ...args);
	}

	static HasComponent(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Ridigbody::HasComponent", ...args);
	}

	static GetLinearVelocity(...args: [entity: Entity]) {
		return RpcClient.Call<vec3>("Ridigbody::GetLinearVelocity", ...args);
	}

	static GetAngularVelocity(...args: [entity: Entity]) {
		return RpcClient.Call<vec3>("Ridigbody::GetAngularVelocity", ...args);
	}

	static AddForce(
		...args: [entity: Entity, force: vec3, forceMode?: ForceMode]
	) {
		return RpcClient.Call<void>(
			"Ridigbody::AddForce",
			args[0],
			Array.from(args[1]),
			args[2] ?? ForceMode.Force,
		);
	}

	static AddForceAtPosition(
		...args: [
			entity: Entity,
			force: vec3,
			position: vec3,
			forceMode?: ForceMode,
		]
	) {
		return RpcClient.Call<boolean>(
			"Ridigbody::AddForceAtPosition",
			args[0],
			Array.from(args[1]),
			Array.from(args[2]),
			args[3] ?? ForceMode.Force,
		);
	}

	static AddTorque(
		...args: [entity: Entity, torque: vec3, forceMode?: ForceMode]
	) {
		return RpcClient.Call<void>(
			"Ridigbody::AddTorque",
			args[0],
			Array.from(args[1]),
			args[2] ?? ForceMode.Force,
		);
	}

	static GetIsKinematic(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Ridigbody::GetIsKinematic", ...args);
	}

	static SetIsKinematic(...args: [entity: Entity, isKinematic: boolean]) {
		return RpcClient.Call<void>("Ridigbody::SetIsKinematic", ...args);
	}

	static GetUseGravity(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Ridigbody::GetUseGravity", ...args);
	}

	static SetUseGravity(...args: [entity: Entity, useGravity: boolean]) {
		return RpcClient.Call<void>("Ridigbody::SetUseGravity", ...args);
	}

	static GetMass(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Ridigbody::GetMass", ...args);
	}

	static SetMass(...args: [entity: Entity, mass: number]) {
		return RpcClient.Call<void>("Ridigbody::SetMass", ...args);
	}

	static GetLinearDamping(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Ridigbody::GetLinearDamping", ...args);
	}

	static SetLinearDamping(...args: [entity: Entity, linearDamping: number]) {
		return RpcClient.Call<void>("Ridigbody::SetLinearDamping", ...args);
	}

	static GetAngularDamping(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Ridigbody::GetAngularDamping", ...args);
	}

	static SetAngularDamping(...args: [entity: Entity, angularDamping: number]) {
		return RpcClient.Call<void>("Ridigbody::SetAngularDamping", ...args);
	}
}
