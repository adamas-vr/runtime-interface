import { RpcClient } from "@adamas/rpc";

/**
 * Wrapper for Unity Transform RPCs.
 */
export class TransformManager {
	/** Returns whether this entity has a Transform component */
	static hasComponent(entityHandle: number): boolean {
		return Boolean(RpcClient.Call("Transform_HasComponent", { entityHandle }));
	}

	/** Sets the full transform matrix (column-major JSON) */
	static setTransform(entityHandle: number, matrixJson: string): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetTransform", { entityHandle, matrixJson }),
		);
	}

	/** Gets the transform matrix as a JSON string */
	static getTransform(entityHandle: number): string {
		return RpcClient.Call("Transform_GetTransform", { entityHandle });
	}

	/** Sets the parent of this transform to another entity */
	static setParent(entityHandle: number, parentHandle: number): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetParent", { entityHandle, parentHandle }),
		);
	}

	/** Gets the parent entity handle (or -1 if none) */
	static getParent(entityHandle: number): number {
		return Number(RpcClient.Call("Transform_GetParent", { entityHandle }));
	}

	/** Sets local position */
	static setPosition(
		entityHandle: number,
		x: number,
		y: number,
		z: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetPosition", { entityHandle, x, y, z }),
		);
	}

	/** Gets local position as a JSON string "{x,y,z}" */
	static getPosition(entityHandle: number): string {
		return RpcClient.Call("Transform_GetPosition", { entityHandle });
	}

	/** Sets local rotation as quaternion */
	static setRotation(
		entityHandle: number,
		x: number,
		y: number,
		z: number,
		w: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetRotation", { entityHandle, x, y, z, w }),
		);
	}

	/** Sets local scale */
	static setScale(
		entityHandle: number,
		x: number,
		y: number,
		z: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Transform_SetScale", { entityHandle, x, y, z }),
		);
	}
}
