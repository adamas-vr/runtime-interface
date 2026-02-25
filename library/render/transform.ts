import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { quat, vec3 } from "gl-matrix";

export class TransformManager {
	/**
	 * Rotates the transform so the entity looks at the world position.
	 * @param entity The entity with the transform component
	 * @param worldPosition The world position to look at.
	 * @param worldUp The world upward direction.
	 * @returns boolean indicating success
	 */
	static LookAt(
		entity: Entity,
		worldPosition: vec3,
		worldUp: vec3 = vec3.fromValues(0, 1, 0),
	): boolean {
		return Boolean(
			RpcClient.Call("Transform::LookAt", {
				entityHandle: entity,
				posX: worldPosition[0],
				posY: worldPosition[1],
				posZ: worldPosition[2],
				upX: worldUp[0],
				upY: worldUp[1],
				upZ: worldUp[2],
			}),
		);
	}

	/**
	 * Sets this entity's parent transform.
	 * @param entity The entity with the transform component
	 * @param parent The parent entity
	 * @returns boolean indicating success
	 */
	static SetParent(entity: Entity, parent: Entity = -1): boolean {
		return Boolean(
			RpcClient.Call("Transform::SetParent", {
				processId: process.pid,
				entityHandle: entity,
				parentHandle: parent,
			}),
		);
	}

	/**
	 * Gets the parent entity handle, or undefined if none.
	 * @param entity The entity with the transform component
	 * @returns The parent entity handle or undefined
	 */
	static GetParent(entity: Entity): Entity | undefined {
		const parent = Number(
			RpcClient.Call("Transform::GetParent", {
				processId: process.pid,
				entityHandle: entity,
			}),
		);

		if (parent == -1) return undefined;
		return parent;
	}

	/**
	 * Sets world position vector.
	 * @param entity The entity with the transform component
	 * @param pos The position vector
	 * @returns boolean indicating success
	 */
	static SetWorldPosition(entity: Entity, pos: vec3): boolean {
		return Boolean(
			RpcClient.Call("Transform::SetWorldPosition", {
				entityHandle: entity,
				x: pos[0],
				y: pos[1],
				z: pos[2],
			}),
		);
	}

	/**
	 * Sets local position vector.
	 * @param entity The entity with the transform component
	 * @param pos The position vector
	 * @returns boolean indicating success
	 */
	static SetLocalPosition(entity: Entity, pos: vec3): boolean {
		return Boolean(
			RpcClient.Call("Transform::SetLocalPosition", {
				entityHandle: entity,
				x: pos[0],
				y: pos[1],
				z: pos[2],
			}),
		);
	}

	/**
	 * Gets world position vector.
	 * @param entity The entity with the transform component
	 * @returns The position vector
	 */
	static GetWorldPosition(entity: Entity): vec3 {
		const data = RpcClient.Call("Transform::GetWorldPosition", {
			entityHandle: entity,
		}) as string;
		const [x, y, z] = data.split(",").map((j) => parseFloat(j));
		return vec3.fromValues(x, y, z);
	}

	/**
	 * Gets local position vector.
	 * @param entity The entity with the transform component
	 * @returns The position vector
	 */
	static GetLocalPosition(entity: Entity): vec3 {
		const data = RpcClient.Call("Transform::GetLocalPosition", {
			entityHandle: entity,
		}) as string;
		const [x, y, z] = data.split(",").map((j) => parseFloat(j));
		return vec3.fromValues(x, y, z);
	}

	/**
	 * Sets world rotation quaternion.
	 * @param entity The entity with the transform component
	 * @param quat The rotation quaternion [x, y, z, w]
	 * @returns boolean indicating success
	 */
	static SetWorldRotation(entity: Entity, quat: quat): boolean {
		return Boolean(
			RpcClient.Call("Transform::SetWorldRotation", {
				entityHandle: entity,
				x: quat[0],
				y: quat[1],
				z: quat[2],
				w: quat[3],
			}),
		);
	}

	/**
	 * Sets local rotation quaternion.
	 * @param entity The entity with the transform component
	 * @param quat The rotation quaternion [x, y, z, w]
	 * @returns boolean indicating success
	 */
	static SetLocalRotation(entity: Entity, quat: quat): boolean {
		return Boolean(
			RpcClient.Call("Transform::SetLocalRotation", {
				entityHandle: entity,
				x: quat[0],
				y: quat[1],
				z: quat[2],
				w: quat[3],
			}),
		);
	}

	/**
	 * Gets local rotation quaternion.
	 * @param entity The entity with the transform component
	 * @returns The rotation quaternion
	 */
	static GetWorldRotation(entity: Entity): quat {
		const data = RpcClient.Call("Transform::GetWorldRotation", {
			entityHandle: entity,
		}) as string;
		const [x, y, z, w] = data.split(",").map((j) => parseFloat(j));
		return quat.fromValues(x, y, z, w);
	}

	/**
	 * Gets local rotation quaternion.
	 * @param entity The entity with the transform component
	 * @returns The rotation quaternion
	 */
	static GetLocalRotation(entity: Entity): quat {
		const data = RpcClient.Call("Transform::GetLocalRotation", {
			entityHandle: entity,
		}) as string;
		const [x, y, z, w] = data.split(",").map((j) => parseFloat(j));
		return quat.fromValues(x, y, z, w);
	}

	/**
	 * Sets local scale vector.
	 * @param entity The entity with the transform component
	 * @param scale The scale vector
	 * @returns boolean indicating success
	 */
	static SetLocalScale(entity: Entity, scale: vec3): boolean {
		return Boolean(
			RpcClient.Call("Transform::SetLocalScale", {
				entityHandle: entity,
				x: scale[0],
				y: scale[1],
				z: scale[2],
			}),
		);
	}

	/**
	 * Gets local scale vector.
	 * @param entity The entity with the transform component
	 * @returns The position vector
	 */
	static GetLocalScale(entity: Entity): vec3 {
		const data = RpcClient.Call("Transform::GetLocalScale", {
			entityHandle: entity,
		}) as string;
		const [x, y, z] = data.split(",").map((j) => parseFloat(j));
		return vec3.fromValues(x, y, z);
	}
}
