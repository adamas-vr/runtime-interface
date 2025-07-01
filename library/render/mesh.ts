import { RpcClient } from "@adamas/rpc";
import { Entity } from "@adamas/entity";

export type MeshHandle = number;

// NOTE: the following are not supported compared to legacy code:
// - Filament's VertexBufferBuilder / IndexBufferBuilder (Unity meshes are atomic)
// - Filament's Attribute, Normalized, AdvancedSkinning on a raw VB/IB

// We don't expose VertexBuffer/IndexBuffer builders in Unity; instead use Mesh RPCs directly
export class MeshManager {
	/**
	 * Create a new mesh
	 * @returns The mesh handle
	 */
	static Create(): MeshHandle;
	/**
	 * Create a new mesh and attach it to a renderable component
	 * @param entity The entity with the renderable component
	 * @returns The mesh handle
	 */
	static Create(entity: Entity): MeshHandle;
	static Create(entity?: Entity): MeshHandle {
		const meshHandle = Number(
			RpcClient.Call("Mesh_Create", {
				clientId: RpcClient.GetClientId(),
			}),
		);

		if (entity !== undefined) {
			RpcClient.Call("Renderable_SetMesh", {
				entityHandle: entity,
				meshHandle: meshHandle,
			});
		}

		return meshHandle;
	}

	/**
	 * Destroy a mesh
	 * @param handle The mesh handle to destroy
	 * @returns boolean indicating success
	 */
	static Destroy(handle: MeshHandle): boolean {
		return Boolean(RpcClient.Call("Mesh_Destroy", { meshHandle: handle }));
	}

	/**
	 * Set the vertices for the mesh
	 * @param handle The mesh handle
	 * @param vertices Array of vertex positions
	 * @returns boolean indicating success
	 */
	static SetVertices(handle: MeshHandle, vertices: number[]): boolean {
		return Boolean(
			RpcClient.Call("Mesh_SetVertices", {
				meshHandle: handle,
				verticesJson: JSON.stringify(vertices),
			}),
		);
	}

	/**
	 * Set the triangles (indices) for the mesh
	 * @param handle The mesh handle
	 * @param indices Array of triangle indices
	 * @returns boolean indicating success
	 */
	static SetTriangles(handle: MeshHandle, indices: number[]): boolean {
		return Boolean(
			RpcClient.Call("Mesh_SetTriangles", {
				meshHandle: handle,
				trianglesJson: JSON.stringify(indices),
			}),
		);
	}

	/**
	 * Set the UV coordinates for the mesh
	 * @param handle The mesh handle
	 * @param uvs Array of UV coordinates
	 * @returns boolean indicating success
	 */
	static SetUVs(handle: MeshHandle, uvs: number[]): boolean {
		return Boolean(
			RpcClient.Call("Mesh_SetUVs", {
				meshHandle: handle,
				uvsJson: JSON.stringify(uvs),
			}),
		);
	}

	/**
	 * Set the normals for the mesh
	 * @param handle The mesh handle
	 * @param normals Array of normal vectors
	 * @returns boolean indicating success
	 */
	static SetNormals(handle: MeshHandle, normals: number[]): boolean {
		return Boolean(
			RpcClient.Call("Mesh_SetNormals", {
				meshHandle: handle,
				normalsJson: JSON.stringify(normals),
			}),
		);
	}

	/**
	 * Recalculate normals for the mesh
	 * @param handle The mesh handle
	 * @returns boolean indicating success
	 */
	static RecalcNormals(handle: MeshHandle): boolean {
		return Boolean(
			RpcClient.Call("Mesh_RecalculateNormals", { meshHandle: handle }),
		);
	}

	/**
	 * Recalculate bounds for the mesh
	 * @param handle The mesh handle
	 * @returns boolean indicating success
	 */
	static RecalcBounds(handle: MeshHandle): boolean {
		return Boolean(
			RpcClient.Call("Mesh_RecalculateBounds", { meshHandle: handle }),
		);
	}
}
