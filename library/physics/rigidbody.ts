/**
 * APIs for creating and updating rigidbody components.
 *
 * @module rigidbody
 */
import { vec3 } from "gl-matrix";
import { Entity } from "../entity";
import { RpcClient } from "../rpc";

/**
 * Supported force application modes.
 */
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

/**
 * Creates and updates rigidbody components.
 */
export class RigidbodyManager {
	/**
	 * Creates a rigidbody component on an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the rigidbody component was
	 * created, or `false` otherwise.
	 */
	static Create(entity: Entity) {
		return RpcClient.Call<boolean>("Ridigbody::Create", entity);
	}

	/**
	 * Removes a rigidbody component from an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the rigidbody component was
	 * removed, or `false` otherwise.
	 */
	static Destroy(entity: Entity) {
		return RpcClient.Call<boolean>("Ridigbody::Destroy", entity);
	}

	/**
	 * Checks whether an entity has a rigidbody component.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the entity has a rigidbody
	 * component, or `false` otherwise.
	 */
	static HasComponent(entity: Entity) {
		return RpcClient.Call<boolean>("Ridigbody::HasComponent", entity);
	}

	/**
	 * Gets the linear velocity of a rigidbody.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the linear velocity in meters per
	 * second.
	 */
	static GetLinearVelocity(entity: Entity) {
		return RpcClient.Call<vec3>("Ridigbody::GetLinearVelocity", entity);
	}

	/**
	 * Gets the angular velocity of a rigidbody.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the angular velocity in radians per
	 * second.
	 */
	static GetAngularVelocity(entity: Entity) {
		return RpcClient.Call<vec3>("Ridigbody::GetAngularVelocity", entity);
	}

	/**
	 * Adds force to a rigidbody.
	 *
	 * The force is expressed in newtons for {@link ForceMode.Force}, meters per
	 * second squared for {@link ForceMode.Acceleration}, newton-seconds for
	 * {@link ForceMode.Impulse}, and meters per second for
	 * {@link ForceMode.VelocityChange}.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param force - The force vector.
	 * @param forceMode - The force application mode. Defaults to
	 * {@link ForceMode.Force}.
	 * @returns A promise that resolves when the force has been applied.
	 */
	static AddForce(entity: Entity, force: vec3, forceMode?: ForceMode) {
		return RpcClient.Call<void>(
			"Ridigbody::AddForce",
			entity,
			Array.from(force),
			forceMode ?? ForceMode.Force,
		);
	}

	/**
	 * Adds force to a rigidbody at a world position.
	 *
	 * The force is expressed in newtons for {@link ForceMode.Force}, meters per
	 * second squared for {@link ForceMode.Acceleration}, newton-seconds for
	 * {@link ForceMode.Impulse}, and meters per second for
	 * {@link ForceMode.VelocityChange}.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param force - The force vector.
	 * @param position - The world position where the force is applied, in meters.
	 * @param forceMode - The force application mode. Defaults to
	 * {@link ForceMode.Force}.
	 * @returns A promise that resolves to `true` if the force was applied, or
	 * `false` otherwise.
	 */
	static AddForceAtPosition(
		entity: Entity,
		force: vec3,
		position: vec3,
		forceMode?: ForceMode,
	) {
		return RpcClient.Call<boolean>(
			"Ridigbody::AddForceAtPosition",
			entity,
			Array.from(force),
			Array.from(position),
			forceMode ?? ForceMode.Force,
		);
	}

	/**
	 * Adds torque to a rigidbody.
	 *
	 * The torque is expressed in newton-meters for {@link ForceMode.Force},
	 * radians per second squared for {@link ForceMode.Acceleration},
	 * newton-meter-seconds for {@link ForceMode.Impulse}, and radians per second
	 * for {@link ForceMode.VelocityChange}.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param torque - The torque vector.
	 * @param forceMode - The force application mode. Defaults to
	 * {@link ForceMode.Force}.
	 * @returns A promise that resolves when the torque has been applied.
	 */
	static AddTorque(entity: Entity, torque: vec3, forceMode?: ForceMode) {
		return RpcClient.Call<void>(
			"Ridigbody::AddTorque",
			entity,
			Array.from(torque),
			forceMode ?? ForceMode.Force,
		);
	}

	/**
	 * Gets whether a rigidbody is kinematic.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the rigidbody is kinematic, or
	 * `false` otherwise.
	 */
	static GetIsKinematic(entity: Entity) {
		return RpcClient.Call<boolean>("Ridigbody::GetIsKinematic", entity);
	}

	/**
	 * Sets whether a rigidbody is kinematic.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param isKinematic - Whether the rigidbody is kinematic.
	 * @returns A promise that resolves when the kinematic setting has been
	 * changed.
	 */
	static SetIsKinematic(entity: Entity, isKinematic: boolean) {
		return RpcClient.Call<void>(
			"Ridigbody::SetIsKinematic",
			entity,
			isKinematic,
		);
	}

	/**
	 * Gets whether a rigidbody uses gravity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the rigidbody uses gravity, or
	 * `false` otherwise.
	 */
	static GetUseGravity(entity: Entity) {
		return RpcClient.Call<boolean>("Ridigbody::GetUseGravity", entity);
	}

	/**
	 * Sets whether a rigidbody uses gravity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param useGravity - Whether the rigidbody uses gravity.
	 * @returns A promise that resolves when the gravity setting has been changed.
	 */
	static SetUseGravity(entity: Entity, useGravity: boolean) {
		return RpcClient.Call<void>("Ridigbody::SetUseGravity", entity, useGravity);
	}

	/**
	 * Gets the mass of a rigidbody.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the mass in kilograms.
	 */
	static GetMass(entity: Entity) {
		return RpcClient.Call<number>("Ridigbody::GetMass", entity);
	}

	/**
	 * Sets the mass of a rigidbody.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param mass - The mass in kilograms.
	 * @returns A promise that resolves when the mass has been changed.
	 */
	static SetMass(entity: Entity, mass: number) {
		return RpcClient.Call<void>("Ridigbody::SetMass", entity, mass);
	}

	/**
	 * Gets the linear damping of a rigidbody.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the linear damping.
	 */
	static GetLinearDamping(entity: Entity) {
		return RpcClient.Call<number>("Ridigbody::GetLinearDamping", entity);
	}

	/**
	 * Sets the linear damping of a rigidbody.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param linearDamping - The linear damping.
	 * @returns A promise that resolves when the linear damping has been changed.
	 */
	static SetLinearDamping(entity: Entity, linearDamping: number) {
		return RpcClient.Call<void>(
			"Ridigbody::SetLinearDamping",
			entity,
			linearDamping,
		);
	}

	/**
	 * Gets the angular damping of a rigidbody.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the angular damping.
	 */
	static GetAngularDamping(entity: Entity) {
		return RpcClient.Call<number>("Ridigbody::GetAngularDamping", entity);
	}

	/**
	 * Sets the angular damping of a rigidbody.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param angularDamping - The angular damping.
	 * @returns A promise that resolves when the angular damping has been changed.
	 */
	static SetAngularDamping(entity: Entity, angularDamping: number) {
		return RpcClient.Call<void>(
			"Ridigbody::SetAngularDamping",
			entity,
			angularDamping,
		);
	}
}
