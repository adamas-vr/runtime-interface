import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { base64Encode } from "../utilities/base64";
import { RenderableManager } from "./renderable";

export type Mesh = number;

export class MeshManager {
	/**
	 * Create a new mesh
	 * @returns The mesh handle
	 */
	static Create(): Promise<Mesh>;
	/**
	 * Create a new mesh and attach it to a renderable component
	 * @param entity The entity with the renderable component
	 * @returns The mesh handle
	 */
	static Create(entity: Entity): Promise<Mesh>;
	static async Create(...args: [entity?: Entity]) {
		const meshHandle = await RpcClient.Call<Mesh>(
			"Mesh::Create",
			RpcClient.GetClientId(),
		);

		if (args[0] !== undefined) {
			await RenderableManager.SetMesh(args[0], meshHandle);
		}

		return meshHandle;
	}

	/**
	 * Destroy a mesh
	 * @param handle The mesh handle to destroy
	 * @returns boolean indicating success
	 */
	static Destroy(...args: [handle: Mesh]) {
		return RpcClient.Call<boolean>("Mesh::Destroy", ...args);
	}

	/**
	 * Set the vertices for the mesh
	 * @param handle The mesh handle
	 * @param vertices Array of vertex positions
	 * @returns boolean indicating success
	 */
	static SetVertices(handle: Mesh, vertices: Float32Array): Promise<void>;
	/**
	 * Set the vertices for the mesh
	 * @param handle The mesh handle
	 * @param base64Vertices Array of vertex positions encoded as a base64 string
	 * @returns boolean indicating success
	 */
	static SetVertices(handle: Mesh, base64Vertices: string): Promise<void>;
	static SetVertices(
		...args: [handle: Mesh, verticesOrBase64: Float32Array | string]
	) {
		let base64Vertices: string;

		if (typeof args[1] === "string") {
			base64Vertices = args[1];
		} else if (args[1].length % 3 == 0) {
			base64Vertices = base64Encode(args[1]);
		} else {
			throw "Invalid vertex buffer length.";
		}

		return RpcClient.Call<void>("Mesh::SetVertices", args[0], base64Vertices);
	}

	/**
	 * Set the triangles (indices) for the mesh
	 * @param handle The mesh handle
	 * @param indices Array of triangle indices
	 * @returns boolean indicating success
	 */
	static SetTriangles(handle: Mesh, indices: Uint16Array): Promise<void>;
	/**
	 * Set the triangles (indices) for the mesh
	 * @param handle The mesh handle
	 * @param base64Indices Array of triangle indices encoeded as a base64 string
	 * @returns boolean indicating success
	 */
	static SetTriangles(handle: Mesh, base64Indices: string): Promise<void>;
	static SetTriangles(
		...args: [handle: Mesh, indicesOrBase64: Uint16Array | string]
	) {
		let base64Triangles: string;

		if (typeof args[1] === "string") {
			base64Triangles = args[1];
		} else if (args[1].length % 3 == 0) {
			base64Triangles = base64Encode(args[1]);
		} else {
			throw "Invalid index buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetTriangles", args[0], base64Triangles);
	}

	static SetUVs(handle: Mesh, uvs: Float32Array): Promise<void>;
	static SetUVs(handle: Mesh, base64Uvs: string): Promise<void>;
	static SetUVs(...args: [handle: Mesh, uvsOrBase64: Float32Array | string]) {
		let base64Uvs: string;

		if (typeof args[1] === "string") {
			base64Uvs = args[1];
		} else if (args[1].length % 2 == 0) {
			base64Uvs = base64Encode(args[1]);
		} else {
			throw "Invalid uv buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetUVs", args[0], base64Uvs);
	}

	static SetNormals(handle: Mesh, normals: Float32Array): Promise<void>;
	static SetNormals(handle: Mesh, base64Normals: string): Promise<void>;
	static SetNormals(
		...args: [handle: Mesh, normalsOrBase64: Float32Array | string]
	) {
		let base64Normals: string;

		if (typeof args[1] === "string") {
			base64Normals = args[1];
		} else if (args[1].length % 3 == 0) {
			base64Normals = base64Encode(args[1]);
		} else {
			throw "Invalid normal buffer format.";
		}

		return RpcClient.Call<void>("Mesh::SetNormals", args[0], base64Normals);
	}

	/**
	 * Recalculate normals for the mesh
	 * @param handle The mesh handle
	 * @returns boolean indicating success
	 */
	static RecalcNormals(...args: [handle: Mesh]) {
		return RpcClient.Call<void>("Mesh::RecalculateNormals", ...args);
	}

	/**
	 * Recalculate bounds for the mesh
	 * @param handle The mesh handle
	 * @returns boolean indicating success
	 */
	static RecalcBounds(...args: [handle: Mesh]) {
		return RpcClient.Call<void>("Mesh::RecalculateBounds", ...args);
	}

	/**
	 * Return the number of blendShapes
	 * @param handle The mesh handle
	 * @returns -1 if mesh does not exist
	 */
	static BlendShapeCount(...args: [handle: Mesh]) {
		return RpcClient.Call<number>("Mesh::BlendShapeCount", ...args);
	}
}
