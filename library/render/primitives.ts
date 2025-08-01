import { MeshManager } from "@adamas/render/mesh";

export function NewCubeMesh(): number {
	// 8 vertices for a unit cube
	const cubeVertices = [
		-0.5,
		-0.5,
		-0.5, // 0: left-bottom-back
		0.5,
		-0.5,
		-0.5, // 1: right-bottom-back
		0.5,
		0.5,
		-0.5, // 2: right-top-back
		-0.5,
		0.5,
		-0.5, // 3: left-top-back
		-0.5,
		-0.5,
		0.5, // 4: left-bottom-front
		0.5,
		-0.5,
		0.5, // 5: right-bottom-front
		0.5,
		0.5,
		0.5, // 6: right-top-front
		-0.5,
		0.5,
		0.5, // 7: left-top-front
	];

	// 12 triangles = 36 indices for cube faces
	const cubeIndices = [
		// back face
		0, 2, 1, 0, 3, 2,
		// front face
		4, 5, 6, 4, 6, 7,
		// bottom face
		0, 1, 5, 0, 5, 4,
		// top face
		3, 7, 6, 3, 6, 2,
		// left face
		0, 4, 7, 0, 7, 3,
		// right face
		1, 2, 6, 1, 6, 5,
	];
	// Create mesh and attach to renderable
	const meshHandle = MeshManager.Create();
	MeshManager.SetVertices(meshHandle, cubeVertices);
	MeshManager.SetTriangles(meshHandle, cubeIndices);
	MeshManager.RecalcNormals(meshHandle);
	MeshManager.RecalcBounds(meshHandle);

	return meshHandle;
}

export function NewQuadMesh(): number {
	// Define 4 vertices of the quad in the X-Y plane, Z = 0
	const quadVertices = [
		-0.5,
		-0.5,
		0.0, // 0: bottom-left
		0.5,
		-0.5,
		0.0, // 1: bottom-right
		0.5,
		0.5,
		0.0, // 2: top-right
		-0.5,
		0.5,
		0.0, // 3: top-left
	];

	// Y-flipped UVs: (0,0) is top-left instead of bottom-left
	const quadUVs = [
		1.0,
		1.0, // 0: bottom-left
		0.0,
		1.0, // 1: bottom-right
		0.0,
		0.0, // 2: top-right
		1.0,
		0.0, // 3: top-left
	];
	const quadIndices = [0, 1, 2, 0, 2, 3];
	// Create mesh and set geometry
	const meshHandle = MeshManager.Create();
	MeshManager.SetVertices(meshHandle, quadVertices);
	MeshManager.SetUVs(meshHandle, quadUVs);
	MeshManager.SetTriangles(meshHandle, quadIndices);
	MeshManager.RecalcNormals(meshHandle);
	MeshManager.RecalcBounds(meshHandle);

	return meshHandle;
}
