import { RpcClient } from "@adamas/rpc";
import { Entity } from "@adamas/entity";

export type Matrix4 = [
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
];

export interface Vector3 {
	x: number;
	y: number;
	z: number;
}

/**
 * Wrapper for Unity Transform RPCs.
 * Provides strongly-typed parameters and returns.
 */
export class TransformManager {
	/**
	 * Create a Transform component and attach it to the specified entity
	 * @param entity The entity to attach the transform to
	 * @returns boolean indicating success
	 */
	static Create(entity: Entity): boolean {
		return Boolean(
			RpcClient.Call("Transform_Create", { entityHandle: entity }),
		);
	}

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
	static SetTransform(entity: Entity, srcMatrix: Matrix4): boolean {
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
	static GetTransform(entity: Entity): Matrix4 {
		const result = RpcClient.Call("Transform_GetTransform", {
			entityHandle: entity,
		}) as string;
		const nums = result.split(",").map((j) => parseFloat(j));
		if (nums.length !== 16) {
			throw new Error(`Invalid transform data (${nums.length} elements)`);
		}
		return nums as Matrix4;
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
	 * Sets local position vector.
	 * @param entity The entity with the transform component
	 * @param pos The position vector
	 * @returns boolean indicating success
	 */
	static SetPosition(entity: Entity, pos: Vector3): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetPosition", {
				entityHandle: entity,
				x: pos.x,
				y: pos.y,
				z: pos.z,
			}),
		);
	}

	/**
	 * Gets local position vector.
	 * @param entity The entity with the transform component
	 * @returns The position vector
	 */
	static GetPosition(entity: Entity): Vector3 {
		const data = RpcClient.Call("Transform_GetPosition", {
			entityHandle: entity,
		}) as string;
		const [x, y, z] = data.split(",").map((j) => parseFloat(j));
		return { x, y, z };
	}

	/**
	 * Sets local rotation quaternion.
	 * @param entity The entity with the transform component
	 * @param quat The rotation quaternion [x, y, z, w]
	 * @returns boolean indicating success
	 */
	static SetRotation(
		entity: Entity,
		quat: [number, number, number, number],
	): boolean {
		const [x, y, z, w] = quat;
		return Boolean(
			RpcClient.Call("Transform_SetRotation", {
				entityHandle: entity,
				x,
				y,
				z,
				w,
			}),
		);
	}

	/**
	 * Sets local scale vector.
	 * @param entity The entity with the transform component
	 * @param scale The scale vector
	 * @returns boolean indicating success
	 */
	static SetScale(entity: Entity, scale: Vector3): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetScale", {
				entityHandle: entity,
				x: scale.x,
				y: scale.y,
				z: scale.z,
			}),
		);
	}
}
