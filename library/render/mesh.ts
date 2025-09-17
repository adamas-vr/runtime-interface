import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { vec2, vec3 } from "../gl-matrix";
import { base64Encode } from "../utilities/base64";

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
	static SetVertices(handle: MeshHandle, vertices: vec3[]): boolean;
	/**
	 * Set the vertices for the mesh
	 * @param handle The mesh handle
	 * @param base64Vertices Array of vertex positions encoded as a base64 string
	 * @returns boolean indicating success
	 */
	static SetVertices(handle: MeshHandle, base64Vertices: string): boolean;
	static SetVertices(
		handle: MeshHandle,
		verticesOrBase64: vec3[] | string,
	): boolean {
		let base64Vertices;

		if (typeof verticesOrBase64 === "string") {
			base64Vertices = verticesOrBase64;
		} else {
			const buffer = new Float32Array(verticesOrBase64.length * 3);
			for (let i = 0; i < verticesOrBase64.length; i++) {
				const n = verticesOrBase64[i];
				buffer[i * 3] = n[0];
				buffer[i * 3 + 1] = n[1];
				buffer[i * 3 + 2] = n[2];
			}
			base64Vertices = base64Encode(buffer.buffer);
		}

		return Boolean(
			RpcClient.Call("Mesh_SetVertices", {
				meshHandle: handle,
				base64Vertices,
			}),
		);
	}

	/**
	 * Set the triangles (indices) for the mesh
	 * @param handle The mesh handle
	 * @param indices Array of triangle indices
	 * @returns boolean indicating success
	 */
	static SetTriangles(handle: MeshHandle, indices: vec3[]): boolean;
	/**
	 * Set the triangles (indices) for the mesh
	 * @param handle The mesh handle
	 * @param base64Indices Array of triangle indices encoeded as a base64 string
	 * @returns boolean indicating success
	 */
	static SetTriangles(handle: MeshHandle, base64Indices: string): boolean;
	static SetTriangles(
		handle: MeshHandle,
		indicesOrBase64: vec3[] | string,
	): boolean {
		let base64Triangles: string;

		if (typeof indicesOrBase64 === "string") {
			base64Triangles = indicesOrBase64;
		} else {
			const buffer = new Float32Array(indicesOrBase64.length * 3);
			for (let i = 0; i < indicesOrBase64.length; i++) {
				const n = indicesOrBase64[i];
				buffer[i * 3] = n[0];
				buffer[i * 3 + 1] = n[1];
				buffer[i * 3 + 2] = n[2];
			}
			base64Triangles = base64Encode(buffer.buffer);
		}

		return Boolean(
			RpcClient.Call("Mesh_SetTriangles", {
				meshHandle: handle,
				base64Triangles,
			}),
		);
	}

	static SetUVs(handle: MeshHandle, uvs: vec2[]): boolean;
	static SetUVs(handle: MeshHandle, base64Uvs: string): boolean;
	static SetUVs(handle: MeshHandle, uvsOrBase64: vec2[] | string): boolean {
		let base64Uvs: string;

		if (typeof uvsOrBase64 === "string") {
			base64Uvs = uvsOrBase64;
		} else {
			const buffer = new Float32Array(uvsOrBase64.length * 2);
			for (let i = 0; i < uvsOrBase64.length; i++) {
				const n = uvsOrBase64[i];
				buffer[i * 2] = n[0];
				buffer[i * 2 + 1] = n[1];
			}
			base64Uvs = base64Encode(buffer.buffer);
		}

		return Boolean(
			RpcClient.Call("Mesh_SetUVs", {
				meshHandle: handle,
				base64Uvs,
			}),
		);
	}

	static SetNormals(handle: MeshHandle, normals: vec3[]): boolean;
	static SetNormals(handle: MeshHandle, base64Normals: string): boolean;
	static SetNormals(
		handle: MeshHandle,
		normalsOrBase64: vec3[] | string,
	): boolean {
		let base64Normals: string;

		if (typeof normalsOrBase64 === "string") {
			base64Normals = normalsOrBase64;
		} else {
			const buffer = new Float32Array(normalsOrBase64.length * 3);
			for (let i = 0; i < normalsOrBase64.length; i++) {
				const n = normalsOrBase64[i];
				buffer[i * 3] = n[0];
				buffer[i * 3 + 1] = n[1];
				buffer[i * 3 + 2] = n[2];
			}
			base64Normals = base64Encode(buffer.buffer);
		}

		return Boolean(
			RpcClient.Call("Mesh_SetNormals", {
				meshHandle: handle,
				base64Normals,
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
