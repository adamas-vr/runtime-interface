/**
 * Transform management APIs for reading and updating entity transforms.
 *
 * @module transform
 */
import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { quat, vec3 } from "gl-matrix";
import { Project } from "../project";

/**
 * Reads and updates entity transforms.
 */
export class TransformManager {
	/**
	 * Rotates an entity so it faces a world position.
	 *
	 * @param entity - The {@link Entity} to rotate.
	 * @param worldPosition - The world position to face.
	 * @param worldUp - The upward direction to use. Defaults to `[0, 1, 0]`.
	 * @returns A promise that resolves when the rotation has been changed.
	 */
	static LookAt(entity: Entity, worldPosition: vec3, worldUp?: vec3) {
		return RpcClient.Call<void>(
			"Transform::LookAt",
			entity,
			Array.from(worldPosition),
			Array.from(worldUp ?? vec3.fromValues(0, 1, 0)),
		);
	}

	/**
	 * Sets the parent of an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param parent - The parent {@link Entity}. If omitted, the entity will have
	 * no parent.
	 * @returns A promise that resolves when the parent has been changed.
	 */
	static async SetParent(entity: Entity, parent?: Entity) {
		return RpcClient.Call<void>(
			"Transform::SetParent",
			Project.GetProjectId(),
			entity,
			parent ?? -1,
		);
	}

	/**
	 * Gets the parent of an entity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the parent {@link Entity}, or
	 * `undefined` if the entity has no parent.
	 */
	static async GetParent(entity: Entity) {
		const parent = await RpcClient.Call<Entity>(
			"Transform::GetParent",
			Project.GetProjectId(),
			entity,
		);

		if (parent === -1) return undefined;
		return parent;
	}

	/**
	 * Sets the world position of an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param pos - The world position.
	 * @returns A promise that resolves when the world position has been changed.
	 */
	static SetWorldPosition(entity: Entity, pos: vec3) {
		return RpcClient.Call<void>("Transform::SetWorldPosition", entity, pos);
	}

	/**
	 * Sets the local position of an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param pos - The local position.
	 * @returns A promise that resolves when the local position has been changed.
	 */
	static SetLocalPosition(entity: Entity, pos: vec3) {
		return RpcClient.Call<void>("Transform::SetLocalPosition", entity, pos);
	}

	/**
	 * Gets the world position of an entity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the world position.
	 */
	static GetWorldPosition(entity: Entity) {
		return RpcClient.Call<vec3>("Transform::GetWorldPosition", entity);
	}

	/**
	 * Gets the local position of an entity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the local position.
	 */
	static GetLocalPosition(entity: Entity) {
		return RpcClient.Call<vec3>("Transform::GetLocalPosition", entity);
	}

	/**
	 * Sets the world rotation of an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param rotation - The world rotation quaternion in `[x, y, z, w]` order.
	 * @returns A promise that resolves when the world rotation has been changed.
	 */
	static SetWorldRotation(entity: Entity, rotation: quat) {
		return RpcClient.Call<void>(
			"Transform::SetWorldRotation",
			entity,
			rotation,
		);
	}

	/**
	 * Sets the local rotation of an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param rotation - The local rotation quaternion in `[x, y, z, w]` order.
	 * @returns A promise that resolves when the local rotation has been changed.
	 */
	static SetLocalRotation(entity: Entity, rotation: quat) {
		return RpcClient.Call<void>(
			"Transform::SetLocalRotation",
			entity,
			rotation,
		);
	}

	/**
	 * Gets the world rotation of an entity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the world rotation quaternion.
	 */
	static GetWorldRotation(entity: Entity) {
		return RpcClient.Call<quat>("Transform::GetWorldRotation", entity);
	}

	/**
	 * Gets the local rotation of an entity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the local rotation quaternion.
	 */
	static GetLocalRotation(entity: Entity) {
		return RpcClient.Call<quat>("Transform::GetLocalRotation", entity);
	}

	/**
	 * Sets the local scale of an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param scale - The local scale.
	 * @returns A promise that resolves when the local scale has been changed.
	 */
	static SetLocalScale(entity: Entity, scale: vec3) {
		return RpcClient.Call<void>("Transform::SetLocalScale", entity, scale);
	}

	/**
	 * Gets the local scale of an entity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the local scale.
	 */
	static GetLocalScale(entity: Entity) {
		return RpcClient.Call<vec3>("Transform::GetLocalScale", entity);
	}
}
