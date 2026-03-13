import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { quat, vec3 } from "gl-matrix";
import { Project } from "../project";

export class TransformManager {
	/**
	 * Rotates the transform so the entity looks at the world position.
	 * @param entity The entity with the transform component
	 * @param worldPosition The world position to look at.
	 * @param worldUp The world upward direction.
	 */
	static LookAt(
		...args: [entity: Entity, worldPosition: vec3, worldUp?: vec3]
	) {
		return RpcClient.Call<void>(
			"Transform::LookAt",
			args[0],
			Array.from(args[1]),
			Array.from(args[2] ?? vec3.fromValues(0, 1, 0)),
		);
	}

	/**
	 * Sets this entity's parent transform.
	 * @param entity The entity with the transform component
	 * @param parent The parent entity
	 */
	static async SetParent(...args: [entity: Entity, parent?: Entity]) {
		return RpcClient.Call<void>(
			"Transform::SetParent",
			Project.GetProjectId(),
			args[0],
			args[1] ?? -1,
		);
	}

	/**
	 * Gets the parent entity handle, or undefined if none.
	 * @param entity The entity with the transform component
	 * @returns The parent entity handle or undefined
	 */
	static async GetParent(...args: [entity: Entity]) {
		const parent = await RpcClient.Call<Entity>(
			"Transform::GetParent",
			Project.GetProjectId(),
			args[0],
		);

		if (parent === -1) return undefined;
		return parent;
	}

	/**
	 * Sets world position vector.
	 * @param entity The entity with the transform component
	 * @param pos The position vector
	 */
	static SetWorldPosition(...args: [entity: Entity, pos: vec3]) {
		return RpcClient.Call<void>("Transform::SetWorldPosition", ...args);
	}

	/**
	 * Sets local position vector.
	 * @param entity The entity with the transform component
	 * @param pos The position vector
	 */
	static SetLocalPosition(...args: [entity: Entity, pos: vec3]) {
		return RpcClient.Call<void>("Transform::SetLocalPosition", ...args);
	}

	/**
	 * Gets world position vector.
	 * @param entity The entity with the transform component
	 * @returns The position vector
	 */
	static GetWorldPosition(...args: [entity: Entity]) {
		return RpcClient.Call<vec3>("Transform::GetWorldPosition", ...args);
	}

	/**
	 * Gets local position vector.
	 * @param entity The entity with the transform component
	 * @returns The position vector
	 */
	static GetLocalPosition(...args: [entity: Entity]) {
		return RpcClient.Call<vec3>("Transform::GetLocalPosition", ...args);
	}

	/**
	 * Sets world rotation quaternion.
	 * @param entity The entity with the transform component
	 * @param rotation The rotation quaternion [x, y, z, w]
	 */
	static SetWorldRotation(...args: [entity: Entity, rotation: quat]) {
		return RpcClient.Call<void>("Transform::SetWorldRotation", ...args);
	}

	/**
	 * Sets local rotation quaternion.
	 * @param entity The entity with the transform component
	 * @param rotation The rotation quaternion [x, y, z, w]
	 */
	static SetLocalRotation(...args: [entity: Entity, rotation: quat]) {
		return RpcClient.Call<void>("Transform::SetLocalRotation", ...args);
	}

	/**
	 * Gets world rotation quaternion.
	 * @param entity The entity with the transform component
	 * @returns The rotation quaternion
	 */
	static GetWorldRotation(...args: [entity: Entity]) {
		return RpcClient.Call<quat>("Transform::GetWorldRotation", ...args);
	}

	/**
	 * Gets local rotation quaternion.
	 * @param entity The entity with the transform component
	 * @returns The rotation quaternion
	 */
	static GetLocalRotation(...args: [entity: Entity]) {
		return RpcClient.Call<quat>("Transform::GetLocalRotation", ...args);
	}

	/**
	 * Sets local scale vector.
	 * @param entity The entity with the transform component
	 * @param scale The scale vector
	 */
	static SetLocalScale(...args: [entity: Entity, scale: vec3]) {
		return RpcClient.Call<void>("Transform::SetLocalScale", ...args);
	}

	/**
	 * Gets local scale vector.
	 * @param entity The entity with the transform component
	 * @returns The scale vector
	 */
	static GetLocalScale(...args: [entity: Entity]) {
		return RpcClient.Call<vec3>("Transform::GetLocalScale", ...args);
	}
}
