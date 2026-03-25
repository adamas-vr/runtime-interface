/**
 * APIs for creating and updating colliders.
 *
 * @module collider
 */
import { Entity } from "../entity";
import { User } from "../user";
import { RpcClient } from "../rpc";
import { vec3 } from "gl-matrix";

/**
 * Opaque numeric handle that identifies a collider.
 */
export type Collider = number;

/**
 * Creates and updates colliders and collider event callbacks.
 */
export class ColliderManager {
	/**
	 * Creates a box collider on an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to the created {@link Collider}.
	 */
	static CreateBox(entity: Entity) {
		return RpcClient.Call<Collider>("Collider::CreateBox", entity);
	}

	/**
	 * Creates a sphere collider on an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to the created {@link Collider}.
	 */
	static CreateSphere(entity: Entity) {
		return RpcClient.Call<Collider>("Collider::CreateSphere", entity);
	}

	/**
	 * Creates a capsule collider on an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to the created {@link Collider}.
	 */
	static CreateCapsule(entity: Entity) {
		return RpcClient.Call<Collider>("Collider::CreateCapsule", entity);
	}

	/**
	 * Destroys a collider on an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param collider - The {@link Collider} to destroy.
	 * @returns A promise that resolves to `true` if the collider was destroyed, or
	 * `false` otherwise.
	 */
	static Destroy(entity: Entity, collider: Collider) {
		return RpcClient.Call<boolean>("Collider::Destroy", entity, collider);
	}

	/**
	 * Checks whether an entity has a collider.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @param collider - The {@link Collider} to check.
	 * @returns A promise that resolves to `true` if the entity has the collider, or
	 * `false` otherwise.
	 */
	static HasComponent(entity: Entity, collider: Collider) {
		return RpcClient.Call<boolean>("Collider::HasComponent", entity, collider);
	}

	/**
	 * Gets the entity that owns a collider.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to the owning {@link Entity}.
	 */
	static GetEntity(collider: Collider) {
		return RpcClient.Call<Entity>("Collider::GetEntity", collider);
	}

	/**
	 * Gets all colliders on an entity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the list of {@link Collider} handles.
	 */
	static GetAllColliders(entity: Entity) {
		return RpcClient.Call<Collider[]>("Collider::GetAllColliders", entity);
	}

	/**
	 * Gets the center of a box collider.
	 *
	 * An error is thrown if the collider is not a box collider.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to the box collider center.
	 */
	static GetBoxColliderCenter(collider: Collider) {
		return RpcClient.Call<vec3>("Collider::GetBoxColliderCenter", collider);
	}

	/**
	 * Sets the center of a box collider.
	 *
	 * An error is thrown if the collider is not a box collider.
	 *
	 * @param collider - The {@link Collider} to update.
	 * @param center - The box collider center.
	 * @returns A promise that resolves when the center has been changed.
	 */
	static SetBoxColliderCenter(collider: Collider, center: vec3) {
		return RpcClient.Call<void>("Collider::SetBoxColliderCenter", collider, center);
	}

	/**
	 * Gets the size of a box collider.
	 *
	 * An error is thrown if the collider is not a box collider.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to the box collider size.
	 */
	static GetBoxColliderSize(collider: Collider) {
		return RpcClient.Call<vec3>("Collider::GetBoxColliderSize", collider);
	}

	/**
	 * Sets the size of a box collider.
	 *
	 * An error is thrown if the collider is not a box collider.
	 *
	 * @param collider - The {@link Collider} to update.
	 * @param size - The box collider size.
	 * @returns A promise that resolves when the size has been changed.
	 */
	static SetBoxColliderSize(collider: Collider, size: vec3) {
		return RpcClient.Call<void>("Collider::SetBoxColliderSize", collider, size);
	}

	/**
	 * Gets the center of a sphere collider.
	 *
	 * An error is thrown if the collider is not a sphere collider.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to the sphere collider center.
	 */
	static async GetSphereColliderCenter(collider: Collider) {
		return RpcClient.Call<vec3>("Collider::GetSphereColliderCenter", collider);
	}

	/**
	 * Sets the center of a sphere collider.
	 *
	 * An error is thrown if the collider is not a sphere collider.
	 *
	 * @param collider - The {@link Collider} to update.
	 * @param center - The sphere collider center.
	 * @returns A promise that resolves when the center has been changed.
	 */
	static SetSphereColliderCenter(collider: Collider, center: vec3) {
		return RpcClient.Call<void>("Collider::SetSphereColliderCenter", collider, center);
	}

	/**
	 * Gets the radius of a sphere collider.
	 *
	 * An error is thrown if the collider is not a sphere collider.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to the sphere collider radius.
	 */
	static GetSphereColliderRadius(collider: Collider) {
		return RpcClient.Call<number>("Collider::GetSphereColliderRadius", collider);
	}

	/**
	 * Sets the radius of a sphere collider.
	 *
	 * An error is thrown if the collider is not a sphere collider.
	 *
	 * @param collider - The {@link Collider} to update.
	 * @param radius - The sphere collider radius.
	 * @returns A promise that resolves when the radius has been changed.
	 */
	static SetSphereColliderRadius(collider: Collider, radius: number) {
		return RpcClient.Call<void>("Collider::SetSphereColliderRadius", collider, radius);
	}

	/**
	 * Gets the center of a capsule collider.
	 *
	 * An error is thrown if the collider is not a capsule collider.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to the capsule collider center.
	 */
	static GetCapsuleColliderCenter(collider: Collider) {
		return RpcClient.Call<vec3>("Collider::GetCapsuleColliderCenter", collider);
	}

	/**
	 * Sets the center of a capsule collider.
	 *
	 * An error is thrown if the collider is not a capsule collider.
	 *
	 * @param collider - The {@link Collider} to update.
	 * @param center - The capsule collider center.
	 * @returns A promise that resolves when the center has been changed.
	 */
	static SetCapsuleColliderCenter(collider: Collider, center: vec3) {
		return RpcClient.Call<void>(
			"Collider::SetCapsuleColliderCenter",
			collider,
			center,
		);
	}

	/**
	 * Gets the radius of a capsule collider.
	 *
	 * An error is thrown if the collider is not a capsule collider.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to the capsule collider radius.
	 */
	static GetCapsuleColliderRadius(collider: Collider) {
		return RpcClient.Call<number>(
			"Collider::GetCapsuleColliderRadius",
			collider,
		);
	}

	/**
	 * Sets the radius of a capsule collider.
	 *
	 * An error is thrown if the collider is not a capsule collider.
	 *
	 * @param collider - The {@link Collider} to update.
	 * @param radius - The capsule collider radius.
	 * @returns A promise that resolves when the radius has been changed.
	 */
	static SetCapsuleColliderRadius(collider: Collider, radius: number) {
		return RpcClient.Call<void>("Collider::SetCapsuleColliderRadius", collider, radius);
	}

	/**
	 * Gets the height of a capsule collider.
	 *
	 * An error is thrown if the collider is not a capsule collider.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to the capsule collider height.
	 */
	static GetCapsuleColliderHeight(collider: Collider) {
		return RpcClient.Call<number>(
			"Collider::GetCapsuleColliderHeight",
			collider,
		);
	}

	/**
	 * Sets the height of a capsule collider.
	 *
	 * An error is thrown if the collider is not a capsule collider.
	 *
	 * @param collider - The {@link Collider} to update.
	 * @param height - The capsule collider height.
	 * @returns A promise that resolves when the height has been changed.
	 */
	static SetCapsuleColliderHeight(collider: Collider, height: number) {
		return RpcClient.Call<void>("Collider::SetCapsuleColliderHeight", collider, height);
	}

	/**
	 * Gets whether a collider is a trigger.
	 *
	 * @param collider - The {@link Collider} to inspect.
	 * @returns A promise that resolves to `true` if the collider is a trigger, or
	 * `false` otherwise.
	 */
	static GetIsTrigger(collider: Collider) {
		return RpcClient.Call<boolean>("Collider::GetIsTrigger", collider);
	}

	/**
	 * Sets whether a collider is a trigger.
	 *
	 * @param collider - The {@link Collider} to update.
	 * @param isTrigger - Whether the collider is a trigger.
	 * @returns A promise that resolves when the trigger setting has been changed.
	 */
	static SetIsTrigger(collider: Collider, isTrigger: boolean) {
		return RpcClient.Call<void>("Collider::SetIsTrigger", collider, isTrigger);
	}

	/**
	 * Registers a callback for trigger enter events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onTriggerEnter - The callback invoked when another collider enters
	 * the trigger.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnTriggerEnter(
		entity: Entity,
		onTriggerEnter: (entity: Entity, collider: Collider) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnTriggerEnter",
			RpcClient.GetClientId(),
			entity,
			onTriggerEnter,
		);
	}

	/**
	 * Registers a callback for trigger exit events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onTriggerExit - The callback invoked when another collider exits the
	 * trigger.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnTriggerExit(
		entity: Entity,
		onTriggerExit: (entity: Entity, collider: Collider) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnTriggerExit",
			RpcClient.GetClientId(),
			entity,
			onTriggerExit,
		);
	}

	/**
	 * Registers a callback for trigger stay events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onTriggerStay - The callback invoked while another collider remains
	 * in the trigger.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnTriggerStay(
		entity: Entity,
		onTriggerStay: (entity: Entity, collider: Collider) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnTriggerStay",
			RpcClient.GetClientId(),
			entity,
			onTriggerStay,
		);
	}

	/**
	 * Registers a callback for collision enter events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onCollisionEnter - The callback invoked when another collider begins
	 * colliding.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnCollisionEnter(
		entity: Entity,
		onCollisionEnter: (entity: Entity, collider: Collider) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnCollisionEnter",
			RpcClient.GetClientId(),
			entity,
			onCollisionEnter,
		);
	}

	/**
	 * Registers a callback for collision exit events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onCollisionExit - The callback invoked when another collider stops
	 * colliding.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnCollisionExit(
		entity: Entity,
		onCollisionExit: (entity: Entity, collider: Collider) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnCollisionExit",
			RpcClient.GetClientId(),
			entity,
			onCollisionExit,
		);
	}

	/**
	 * Registers a callback for collision stay events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onCollisionStay - The callback invoked while another collider remains
	 * in contact.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnCollisionStay(
		entity: Entity,
		onCollisionStay: (entity: Entity, collider: Collider) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnCollisionStay",
			RpcClient.GetClientId(),
			entity,
			onCollisionStay,
		);
	}

	/**
	 * Registers a callback for user trigger enter events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onUserTriggerEnter - The callback invoked when a user enters the
	 * trigger.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnUserTriggerEnter(
		entity: Entity,
		onUserTriggerEnter: (user: User) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnUserTriggerEnter",
			RpcClient.GetClientId(),
			entity,
			(userId: string) => onUserTriggerEnter(new User(userId)),
		);
	}

	/**
	 * Registers a callback for user trigger exit events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onUserTriggerExit - The callback invoked when a user exits the
	 * trigger.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnUserTriggerExit(
		entity: Entity,
		onUserTriggerExit: (user: User) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnUserTriggerExit",
			RpcClient.GetClientId(),
			entity,
			(userId: string) => onUserTriggerExit(new User(userId)),
		);
	}

	/**
	 * Registers a callback for user trigger stay events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onUserTriggerStay - The callback invoked while a user remains in the
	 * trigger.
	 * @returns A promise that resolves to `true` if the callback was registered,
	 * or `false` otherwise.
	 */
	static async OnUserTriggerStay(
		entity: Entity,
		onUserTriggerStay: (user: User) => void,
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnUserTriggerStay",
			RpcClient.GetClientId(),
			entity,
			(userId: string) => onUserTriggerStay(new User(userId)),
		);
	}
}
