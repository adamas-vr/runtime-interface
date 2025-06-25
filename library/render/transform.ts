import { RpcClient } from "@adamas/rpc";

/**
 * Wrapper for Unity Transform RPCs.
 * Automatically transposes row-major matrices to Unity's column-major format
 * and flips the Z-axis to correct handedness.
 */
export class TransformManager {
	/** Returns whether this entity has a Transform component */
	static hasComponent(entityHandle: number): boolean {
		return Boolean(RpcClient.Call("Transform_HasComponent", { entityHandle }));
	}

	/**
	 * Sets the full transform matrix.
	 * Accepts a row-major CSV string, transposes to column-major,
	 * flips the Z-axis, and sends to Unity.
	 */
	static setTransform(entityHandle: number, srcMatrixJson: string): boolean {
		// Parse row-major values
		const src = srcMatrixJson.split(",").map((s) => parseFloat(s.trim()));
		if (src.length !== 16) {
			console.error(`Invalid matrix length: ${src.length}`);
			return false;
		}

		// Transpose to column-major
		const colMaj = new Float32Array(16);
		for (let r = 0; r < 4; r++) {
			for (let c = 0; c < 4; c++) {
				colMaj[c * 4 + r] = src[r * 4 + c];
			}
		}

		// Flip Z-axis (third column of a 4x4 matrix)
		colMaj[8] = -colMaj[8];
		colMaj[9] = -colMaj[9];
		colMaj[10] = -colMaj[10];
		colMaj[11] = -colMaj[11];

		const fixedMatrixJson = Array.from(colMaj).join(",");
		return Boolean(
			RpcClient.Call("Transform_SetTransform", {
				entityHandle,
				matrixJson: fixedMatrixJson,
			}),
		);
	}

	/** Gets the transform matrix as a JSON string (column-major) */
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
