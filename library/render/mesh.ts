/**
 * APIs for creating and updating meshes.
 *
 * @module mesh
 */
import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { base64Encode } from "../utilities/base64";
import { RenderableManager } from "./renderable";

/**
 * Opaque numeric handle that identifies a mesh.
 */
export type Mesh = number;

/**
 * Creates and updates meshes.
 */
export class MeshManager {
	/**
	 * Creates a mesh.
	 *
	 * @returns A promise that resolves to the created {@link Mesh}.
	 */
	static Create(): Promise<Mesh>;
	/**
	 * Creates a mesh and assigns it to an entity.
	 *
	 * @param entity - The {@link Entity} to assign the mesh to.
	 * @returns A promise that resolves to the created {@link Mesh}.
	 */
	static Create(entity: Entity): Promise<Mesh>;
	static async Create(entity?: Entity) {
		const meshHandle = await RpcClient.Call<Mesh>(
			"Mesh::Create",
			RpcClient.GetClientId(),
		);

		if (entity !== undefined) {
			await RenderableManager.SetMesh(entity, meshHandle);
		}

		return meshHandle;
	}

	/**
	 * Destroys a mesh.
	 *
	 * @param handle - The {@link Mesh} to destroy.
	 * @returns A promise that resolves to `true` if the mesh was destroyed, or
	 * `false` otherwise.
	 */
	static Destroy(handle: Mesh) {
		return RpcClient.Call<boolean>("Mesh::Destroy", handle);
	}

	/**
	 * Sets the vertex positions of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @param vertices - Vertex positions.
	 * @returns A promise that resolves when the vertex positions have been changed.
	 */
	static SetVertices(handle: Mesh, vertices: Float32Array): Promise<void>;
	/**
	 * Sets the vertex positions of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @param base64Vertices - Base64-encoded vertex positions.
	 * @returns A promise that resolves when the vertex positions have been changed.
	 */
	static SetVertices(handle: Mesh, base64Vertices: string): Promise<void>;
	static SetVertices(handle: Mesh, verticesOrBase64: Float32Array | string) {
		let base64Vertices: string;

		if (typeof verticesOrBase64 === "string") {
			base64Vertices = verticesOrBase64;
		} else if (verticesOrBase64.length % 3 == 0) {
			base64Vertices = base64Encode(verticesOrBase64);
		} else {
			throw "Invalid vertex buffer length.";
		}

		return RpcClient.Call<void>("Mesh::SetVertices", handle, base64Vertices);
	}

	/**
	 * Sets the triangle indices of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @param indices - Triangle indices.
	 * @returns A promise that resolves when the triangle indices have been changed.
	 */
	static SetTriangles(handle: Mesh, indices: Uint16Array): Promise<void>;
	/**
	 * Sets the triangle indices of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @param base64Indices - Base64-encoded triangle indices.
	 * @returns A promise that resolves when the triangle indices have been changed.
	 */
	static SetTriangles(handle: Mesh, base64Indices: string): Promise<void>;
	static SetTriangles(handle: Mesh, indicesOrBase64: Uint16Array | string) {
		let base64Triangles: string;

		if (typeof indicesOrBase64 === "string") {
			base64Triangles = indicesOrBase64;
		} else if (indicesOrBase64.length % 3 == 0) {
			base64Triangles = base64Encode(indicesOrBase64);
		} else {
			throw "Invalid index buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetTriangles", handle, base64Triangles);
	}

	/**
	 * Sets the UV coordinates of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @param uvs - UV coordinates.
	 * @returns A promise that resolves when the UV coordinates have been changed.
	 */
	static SetUVs(handle: Mesh, uvs: Float32Array): Promise<void>;
	/**
	 * Sets the UV coordinates of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @param base64Uvs - Base64-encoded UV coordinates.
	 * @returns A promise that resolves when the UV coordinates have been changed.
	 */
	static SetUVs(handle: Mesh, base64Uvs: string): Promise<void>;
	static SetUVs(handle: Mesh, uvsOrBase64: Float32Array | string) {
		let base64Uvs: string;

		if (typeof uvsOrBase64 === "string") {
			base64Uvs = uvsOrBase64;
		} else if (uvsOrBase64.length % 2 == 0) {
			base64Uvs = base64Encode(uvsOrBase64);
		} else {
			throw "Invalid uv buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetUVs", handle, base64Uvs);
	}

	/**
	 * Sets the normals of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @param normals - Normal vectors.
	 * @returns A promise that resolves when the normals have been changed.
	 */
	static SetNormals(handle: Mesh, normals: Float32Array): Promise<void>;
	/**
	 * Sets the normals of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @param base64Normals - Base64-encoded normal vectors.
	 * @returns A promise that resolves when the normals have been changed.
	 */
	static SetNormals(handle: Mesh, base64Normals: string): Promise<void>;
	static SetNormals(handle: Mesh, normalsOrBase64: Float32Array | string) {
		let base64Normals: string;

		if (typeof normalsOrBase64 === "string") {
			base64Normals = normalsOrBase64;
		} else if (normalsOrBase64.length % 3 == 0) {
			base64Normals = base64Encode(normalsOrBase64);
		} else {
			throw "Invalid normal buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetNormals", handle, base64Normals);
	}

	/**
	 * Recalculates the normals of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @returns A promise that resolves when the normals have been recalculated.
	 */
	static RecalcNormals(handle: Mesh) {
		return RpcClient.Call<void>("Mesh::RecalculateNormals", handle);
	}

	/**
	 * Recalculates the bounds of a mesh.
	 *
	 * @param handle - The {@link Mesh} to update.
	 * @returns A promise that resolves when the bounds have been recalculated.
	 */
	static RecalcBounds(handle: Mesh) {
		return RpcClient.Call<void>("Mesh::RecalculateBounds", handle);
	}

	/**
	 * Gets the number of blend shapes in a mesh.
	 *
	 * @param handle - The {@link Mesh} to inspect.
	 * @returns A promise that resolves to the number of blend shapes. Throw if
	 * the mesh does not exist.
	 */
	static BlendShapeCount(handle: Mesh) {
		return RpcClient.Call<number>("Mesh::BlendShapeCount", handle);
	}
}
