import { RpcClient } from "@adamas/rpc";

// NOTE: the following are not supported compared to legacy code:
// - Filament’s VertexBufferBuilder / IndexBufferBuilder (Unity meshes are atomic)
// - Filament’s Attribute, Normalized, AdvancedSkinning on a raw VB/IB

// We don’t expose VertexBuffer/IndexBuffer builders in Unity; instead use Mesh RPCs directly
export class Mesh {
	constructor(public handle: number) {}

	static create(): number {
		return Number(RpcClient.Call("Mesh_Create", {}));
	}

	static destroy(handle: number): boolean {
		return Boolean(RpcClient.Call("Mesh_Destroy", { meshHandle: handle }));
	}

	static setVertices(handle: number, vertices: number[]): boolean {
		return Boolean(
			RpcClient.Call("Mesh_SetVertices", {
				meshHandle: handle,
				verticesJson: JSON.stringify(vertices),
			}),
		);
	}

	static setTriangles(handle: number, indices: number[]): boolean {
		return Boolean(
			RpcClient.Call("Mesh_SetTriangles", {
				meshHandle: handle,
				trianglesJson: JSON.stringify(indices),
			}),
		);
	}

	static setUVs(handle: number, uvs: number[]): boolean {
		return Boolean(
			RpcClient.Call("Mesh_SetUVs", {
				meshHandle: handle,
				uvsJson: JSON.stringify(uvs),
			}),
		);
	}

	static setNormals(handle: number, normals: number[]): boolean {
		return Boolean(
			RpcClient.Call("Mesh_SetNormals", {
				meshHandle: handle,
				normalsJson: JSON.stringify(normals),
			}),
		);
	}

	static recalcNormals(handle: number): boolean {
		return Boolean(
			RpcClient.Call("Mesh_RecalculateNormals", { meshHandle: handle }),
		);
	}

	static recalcBounds(handle: number): boolean {
		return Boolean(
			RpcClient.Call("Mesh_RecalculateBounds", { meshHandle: handle }),
		);
	}
}
