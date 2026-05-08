/**
 * APIs for creating and updating meshes.
 *
 * @module mesh
 */
import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { base64Decode } from "../utilities/base64";
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
	 * Typed arrays are recommended for best performance.
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
		let vertices: Float32Array;

		if (typeof verticesOrBase64 === "string") {
			const buffer = base64Decode(verticesOrBase64);
			if (buffer.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0) {
				throw "Invalid vertex buffer format.";
			}
			vertices = new Float32Array(buffer);
		} else {
			vertices = verticesOrBase64;
		}

		if (vertices.length % 3 !== 0) {
			throw "Invalid vertex buffer length.";
		}

		return RpcClient.Call<void>("Mesh::SetVertices", handle, vertices);
	}

	/**
	 * Sets the triangle indices of a mesh.
	 * Typed arrays are recommended for best performance.
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
		let indices: Uint16Array;

		if (typeof indicesOrBase64 === "string") {
			const buffer = base64Decode(indicesOrBase64);
			if (buffer.byteLength % Uint16Array.BYTES_PER_ELEMENT !== 0) {
				throw "Invalid index buffer format.";
			}
			indices = new Uint16Array(buffer);
		} else {
			indices = indicesOrBase64;
		}

		if (indices.length % 3 !== 0) {
			throw "Invalid index buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetTriangles", handle, indices);
	}

	/**
	 * Sets the UV coordinates of a mesh.
	 * Typed arrays are recommended for best performance.
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
		let uvs: Float32Array;

		if (typeof uvsOrBase64 === "string") {
			const buffer = base64Decode(uvsOrBase64);
			if (buffer.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0) {
				throw "Invalid uv buffer format.";
			}
			uvs = new Float32Array(buffer);
		} else {
			uvs = uvsOrBase64;
		}

		if (uvs.length % 2 !== 0) {
			throw "Invalid uv buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetUVs", handle, uvs);
	}

	/**
	 * Sets the normals of a mesh.
	 * Typed arrays are recommended for best performance.
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
		let normals: Float32Array;

		if (typeof normalsOrBase64 === "string") {
			const buffer = base64Decode(normalsOrBase64);
			if (buffer.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0) {
				throw "Invalid normal buffer format.";
			}
			normals = new Float32Array(buffer);
		} else {
			normals = normalsOrBase64;
		}

		if (normals.length % 3 !== 0) {
			throw "Invalid normal buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetNormals", handle, normals);
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
