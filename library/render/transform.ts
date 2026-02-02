import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { mat4, quat, vec3 } from "gl-matrix";

/**
 * Wrapper for Unity Transform RPCs.
 * Provides strongly-typed parameters and returns.
 */
export class TransformManager {
	/**
	 * Checks if the entity has a Transform component.
	 * @param entity The entity to check
	 * @returns boolean indicating if transform component exists
	 */
	static HasComponent(entity: Entity): boolean {
		return Boolean(
			RpcClient.Call("Transform_HasComponent", { entityHandle: entity }),
		);
	}

	/**
	 * Sets the world transform given a 16-element row-major matrix.
	 * Transposes to column-major and flips Z-axis for Unity.
	 * TODO: double check if this is correct, what are we using internally?
	 * Use the coords provided by gl matrix or unity.
	 * @param entity The entity with the transform component
	 * @param srcMatrix The source transformation matrix
	 * @returns boolean indicating success
	 */
	static SetTransform(entity: Entity, srcMatrix: mat4): boolean {
		const colMaj: number[] = new Array(16);
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				let val = srcMatrix[row * 4 + col];
				if (col === 2) val = -val; // flip Z-axis
				colMaj[col * 4 + row] = val;
			}
		}
		const matrixJson = colMaj.join(",");
		return Boolean(
			RpcClient.Call("Transform_SetTransform", {
				entityHandle: entity,
				matrixJson,
			}),
		);
	}

	/**
	 * Retrieves the world transform matrix (column-major).
	 * @param entity The entity with the transform component
	 * @returns The transformation matrix
	 */
	static GetTransform(entity: Entity): mat4 {
		const result = RpcClient.Call("Transform_GetTransform", {
			entityHandle: entity,
		}) as string;
		const nums = result.split(",").map((j) => parseFloat(j));

		if (nums.length !== 16) {
			throw new Error(`Invalid transform data (${nums.length} elements)`);
		}
		return mat4.fromValues(
			nums[0],
			nums[1],
			nums[2],
			nums[3],
			nums[4],
			nums[5],
			nums[6],
			nums[7],
			nums[8],
			nums[9],
			nums[10],
			nums[11],
			nums[12],
			nums[13],
			nums[14],
			nums[15],
		);
	}

	/**
	 * Sets this entity's parent transform.
	 * @param entity The entity with the transform component
	 * @param parent The parent entity
	 * @returns boolean indicating success
	 */
	static SetParent(entity: Entity, parent: Entity): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetParent", {
				processId: process.pid,
				entityHandle: entity,
				parentHandle: parent,
			}),
		);
	}

	/**
	 * Gets the parent entity handle, or -1 if none.
	 * @param entity The entity with the transform component
	 * @returns The parent entity handle
	 */
	static GetParent(entity: Entity): Entity {
		return Number(
			RpcClient.Call("Transform_GetParent", { entityHandle: entity }),
		);
	}

	/**
	 * Sets world position vector.
	 * @param entity The entity with the transform component
	 * @param pos The position vector
	 * @returns boolean indicating success
	 */
	static SetWorldPosition(entity: Entity, pos: vec3): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetWorldPosition", {
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
			RpcClient.Call("Transform_SetLocalPosition", {
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
		const data = RpcClient.Call("Transform_GetWorldPosition", {
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
		const data = RpcClient.Call("Transform_GetLocalPosition", {
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
			RpcClient.Call("Transform_SetWorldRotation", {
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
			RpcClient.Call("Transform_SetLocalRotation", {
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
		const data = RpcClient.Call("Transform_GetWorldRotation", {
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
		const data = RpcClient.Call("Transform_GetLocalRotation", {
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
			RpcClient.Call("Transform_SetLocalScale", {
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
		const data = RpcClient.Call("Transform_GetLocalScale", {
			entityHandle: entity,
		}) as string;
		const [x, y, z] = data.split(",").map((j) => parseFloat(j));
		return vec3.fromValues(x, y, z);
	}
}
