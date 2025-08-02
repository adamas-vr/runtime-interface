import {
	NullEngine,
	Scene,
	SceneLoader,
	VertexBuffer,
	TransformNode,
	Bone,
	Skeleton,
	BaseTexture,
	Tools,
	Material,
	AbstractMesh,
	PBRMaterial,
	Node,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import * as fs from "fs/promises";
import * as path from "path";

import { Entity, EntityManager } from "@adamas/entity";
import { RenderableManager } from "@adamas/render/renderable";
import { MeshManager } from "@adamas/render/mesh";
import {
	MaterialHandle,
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { CameraManager } from "@adamas/render/camera";
import { LightManager } from "@adamas/render/light";
import { TransformManager } from "@adamas/render/transform";
import {
	TextureFormat,
	TextureHandle,
	TextureManager,
} from "@adamas/render/texture";
import { quat, vec3, vec4 } from "gl-matrix";

const DEFAULT_MATERIAL = MaterialManager.Create(ShaderType.URP_LIT);
MaterialManager.SetColor(
	DEFAULT_MATERIAL,
	ShaderProperties.BaseColor,
	vec4.fromValues(0.8, 0.8, 0.8, 1.0),
);

/**
 * Extract texture data from embedded glTF textures in Babylon.js
 */
async function extractEmbeddedTextureData(
	texture: BaseTexture,
): Promise<Buffer | undefined> {
	try {
		// Method 1: Check for direct buffer access
		if ((texture as any)._buffer) {
			console.log("Found texture data in _buffer");
			return Buffer.from((texture as any)._buffer);
		}

		// Method 2: Check texture source buffer
		if ((texture as any)._source && (texture as any)._source._buffer) {
			console.log("Found texture data in _source._buffer");
			return Buffer.from((texture as any)._source._buffer);
		}

		// Method 3: Check internal texture object
		const internalTexture = (texture as any)._texture;
		if (internalTexture) {
			if (internalTexture._buffer) {
				console.log("Found texture data in internal texture _buffer");
				return Buffer.from(internalTexture._buffer);
			}

			// Method 4: Check if it's a WebGL texture with associated image data
			if (internalTexture._source && internalTexture._source._buffer) {
				console.log("Found texture data in internal texture source");
				return Buffer.from(internalTexture._source._buffer);
			}
		}

		// Method 5: Try to access the underlying image data
		if ((texture as any)._domImage) {
			const image = (texture as any)._domImage;
			if (image instanceof HTMLImageElement) {
				// Convert image to canvas and extract data
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				if (ctx) {
					canvas.width = image.naturalWidth || image.width;
					canvas.height = image.naturalHeight || image.height;
					ctx.drawImage(image, 0, 0);

					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					console.log(
						`Extracted texture data from DOM image: ${canvas.width}x${canvas.height}`,
					);
					return Buffer.from(imageData.data);
				}
			}
		}

		// Method 6: Check for Babylon's texture data property
		if ((texture as any).textureData) {
			console.log("Found texture data in textureData property");
			return Buffer.from((texture as any).textureData);
		}

		// Method 7: Try to read pixel data if it's a readable texture
		if (typeof (texture as any).readPixels === "function") {
			try {
				const pixels = (texture as any).readPixels();
				if (pixels) {
					console.log("Extracted texture data using readPixels()");
					return Buffer.from(pixels);
				}
			} catch (readError) {
				if (
					readError &&
					typeof readError === "object" &&
					"message" in readError
				) {
					console.log("readPixels() failed:", (readError as any).message);
				} else {
					console.log("readPixels() failed with unknown error:", readError);
				}
			}
		}

		console.log("No accessible texture data found in embedded texture");
		return undefined;
	} catch (error) {
		console.warn("Error extracting embedded texture data:", error);
		return undefined;
	}
}

/**
 * Import .glb/.gltf/VRM and push every asset—nodes, cameras, lights, skeletons, skinned
 * + non-skinned meshes, materials—to Unity via our RPC bridge.
 */
export async function importGltfAndRender(
	assetPath: string,
	name: string = "model",
): Promise<Entity> {
	const engine = new NullEngine();
	const scene = new Scene(engine);
	const rootEntity = EntityManager.Create(name);

	try {
		// Load file into a Buffer (Uint8Array) and append with explicit ".glb"
		const buffer = await fs.readFile(assetPath);
		await SceneLoader.AppendAsync("", buffer, scene, undefined, ".glb");

		console.log(
			`Loaded glTF with ${scene.meshes.length} meshes, 
			${scene.skeletons.length} skeletons, 
			${scene.cameras.length} cameras, 
			${scene.lights.length} lights`,
		);

		// 1) Create a GameObject for each transform node and preserve hierarchy
		const skeletonHandles = new Map<Skeleton, number>();
		const materialCache = new Map<Material, MaterialHandle>();
		const textureCache = new Map<BaseTexture, TextureHandle>();
		const meshCache = new Map<AbstractMesh, TextureHandle>();

		/**
		 * Process a Babylon texture and upload it to Unity
		 */
		const texProm = scene.textures.map(async (texture) => {
			try {
				// Get texture URL - different ways depending on texture type
				let textureUrl: string | undefined;

				if ("url" in texture) {
					textureUrl = (texture as any).url;
				} else if ("name" in texture) {
					textureUrl = texture.name;
				} else if ((texture as any)._url) {
					textureUrl = (texture as any)._url;
				}

				if (!textureUrl) {
					console.warn("Texture has no URL or name");
					return;
				}

				console.log(`Processing texture: ${textureUrl}`);

				let buffer: Buffer | undefined;

				if (textureUrl.startsWith("data:")) {
					// Handle different types of data URLs
					if (textureUrl.includes("base64,")) {
						// Standard base64 data URL: data:image/png;base64,iVBORw0KGgoAAAANSUhEU...
						const match = textureUrl.match(/base64,(.+)$/);
						if (match && match[1]) {
							buffer = Buffer.from(match[1], "base64");
							console.log("Extracted texture from base64 data URL");
						} else {
							console.warn(
								`Unable to parse base64 data from URL: ${textureUrl}`,
							);
							return -1;
						}
					} else if (textureUrl.match(/^data:[0-9a-f-]+#/)) {
						// Handle embedded glTF texture references like: data:31c25f34-4e11-4a3c-860e-11a5f7410de8#image1
						console.log(`Processing embedded glTF texture: ${textureUrl}`);

						// Try to get the texture data directly from Babylon's internal texture system
						buffer = await extractEmbeddedTextureData(texture);

						if (!buffer) {
							console.warn(
								"Could not extract texture data from embedded glTF reference",
							);
							return;
						}
						console.log("Successfully extracted embedded glTF texture data");
					} else {
						console.warn(`Unknown data URL format: ${textureUrl}`);
						return;
					}
				} else {
					// External file reference
					try {
						const resolvedPath = path.resolve(
							path.dirname(assetPath),
							textureUrl,
						);
						buffer = await fs.readFile(resolvedPath);
					} catch (fileError) {
						console.warn(
							`Failed to load external texture file: ${textureUrl}`,
							fileError,
						);
						return;
					}
				}

				if (!buffer) {
					console.warn("No texture data available");
					return;
				}

				// Create Unity texture
				const textureHandle = TextureManager.Create2D(
					10,
					10,
					TextureFormat.RGBA32,
				);

				// Upload pixel data
				const success = TextureManager.LoadImage(textureHandle, buffer.buffer);
				if (!success) {
					console.warn("Failed to upload texture pixels");
					return;
				}

				// Set texture filtering
				TextureManager.SetFilterMode(textureHandle, 1); // Bilinear

				console.log(`Texture processed successfully: ${texture.name}`);
				textureCache.set(texture, textureHandle);
			} catch (error) {
				console.error("Error processing texture:", error);
			}
		});
		await Promise.all(texProm);

		const matProm = scene.materials.map(async (mat) => {
			const material: PBRMaterial = mat as PBRMaterial;
			console.log(`\nMaterial: ${material.name}`);
			console.log(`Type: ${material.getClassName()}`);
			try {
				console.log(`Processing material: ${material.name || "unnamed"}`);

				// Create material
				const materialHandle = MaterialManager.Create(ShaderType.URP_LIT);

				// Handle base color texture
				if (material.albedoTexture) {
					const textureHandle = textureCache.get(material.albedoTexture);
					if (textureHandle) {
						MaterialManager.SetTexture(
							materialHandle,
							ShaderProperties.BaseMap,
							textureHandle,
						);
					}
				}

				// Set base color (fallback or tint)
				const baseColor = material.albedoColor;
				if (baseColor) {
					MaterialManager.SetColor(
						materialHandle,
						ShaderProperties.BaseColor,
						vec4.fromValues(baseColor.r, baseColor.g, baseColor.b, 1.0),
					);
				} else {
					MaterialManager.SetColor(
						materialHandle,
						ShaderProperties.BaseColor,
						vec4.fromValues(1.0, 1.0, 1.0, 1.0),
					);
				}

				// Handle metallic and roughness properties
				const metallic = material.metallic ?? 0;
				const roughness = material.roughness ?? 1;
				const smoothness = 1 - roughness;

				MaterialManager.SetFloat(
					materialHandle,
					ShaderProperties.Metallic,
					metallic,
				);
				MaterialManager.SetFloat(
					materialHandle,
					ShaderProperties.Smoothness,
					smoothness,
				);

				// Cache and set the material to the renderable
				materialCache.set(mat, materialHandle);
				console.log(
					`Material processed - Metallic: ${metallic}, Smoothness: ${smoothness}`,
				);
			} catch (error) {
				console.error(`Error processing material: ${material.name}`, error);
			}
		});
		await Promise.all(matProm);

		// TODO: 2) Process Skeletons (armatures) for VRM support
		// scene.skeletons.forEach((skeleton: Skeleton, skelIndex) => {
		//   console.log(`Processing skeleton: ${skeleton.name} with ${skeleton.bones.length} bones`);

		//   const skelHandle = Number(RpcClient.Call("Skeleton_Create", {
		//     name: skeleton.name || `skeleton_${skelIndex}`
		//   }));

		//   skeletonHandles.set(skeleton, skelHandle);

		//   // Process bones
		//   skeleton.bones.forEach((bone: Bone, boneIndex) => {
		//     const parent = bone.getParent() as Bone | null;
		//     const parentIndex = parent ? skeleton.bones.indexOf(parent) : -1;

		//     console.log(`Adding bone: ${bone.name} (parent: ${parentIndex})`);

		//     RpcClient.Call("Skeleton_AddBone", {
		//       skeletonHandle: skelHandle,
		//       boneIndex: boneIndex,
		//       name: bone.name || `bone_${boneIndex}`,
		//       parentIndex: parentIndex
		//     });

		//     // Get the transform matrices for this skeleton
		//     const transformMatrices = skeleton.getTransformMatrices(null);
		//     if (transformMatrices) {
		//       // Extract inverse bind matrix for this bone (16 floats per bone)
		//       const invBindMatrix = Array.from(transformMatrices.slice(boneIndex * 16, (boneIndex + 1) * 16));

		//       RpcClient.Call("Skeleton_SetInverseBindPose", {
		//         skeletonHandle: skelHandle,
		//         boneIndex: boneIndex,
		//         matrix: invBindMatrix
		//       });
		//     }
		//   });
		// });

		// Process Meshes & Materials
		const meshProm = scene.meshes.map(async (mesh) => {
			if (!mesh.getTotalVertices() || !mesh.getIndices()) {
				console.log(`Skipping mesh ${mesh.name} - no geometry data`);
				return;
			}

			console.log(`Processing mesh: ${mesh.name}`);

			// Create mesh and attach to renderable
			const meshHandle = MeshManager.Create();

			// Upload geometry data
			const positions = mesh.getVerticesData(VertexBuffer.PositionKind)!;
			const indices = mesh.getIndices()!;
			MeshManager.SetVertices(meshHandle, Array.from(positions));
			MeshManager.SetTriangles(meshHandle, Array.from(indices));

			// Handle UV coordinates if available
			const uvs = mesh.getVerticesData(VertexBuffer.UVKind);
			if (uvs) {
				MeshManager.SetUVs(meshHandle, Array.from(uvs));
			}

			// Recalculate normals and bounds
			MeshManager.RecalcNormals(meshHandle);
			MeshManager.RecalcBounds(meshHandle);

			// TODO: Handle skinning data for VRM avatars
			// const skeleton = (mesh as any).skeleton as Skeleton;
			// if (skeleton && skeletonHandles.has(skeleton)) {
			//   const joints = mesh.getVerticesData(VertexBuffer.MatricesIndicesKind);
			//   const weights = mesh.getVerticesData(VertexBuffer.MatricesWeightsKind);

			//   if (joints && weights) {
			//     console.log(`Setting up skinning for mesh: ${mesh.name}`);

			//     RpcClient.Call("Mesh_SetBoneIndices", {
			//       meshHandle: rb.meshHandle,
			//       indices: JSON.stringify(Array.from(joints))
			//     });

			//     RpcClient.Call("Mesh_SetBoneWeights", {
			//       meshHandle: rb.meshHandle,
			//       weights: JSON.stringify(Array.from(weights))
			//     });

			//     RpcClient.Call("Renderable_SetSkeleton", {
			//       entityHandle: ent,
			//       skeletonHandle: skeletonHandles.get(skeleton)!
			//     });
			//   }
			// }

			meshCache.set(mesh, meshHandle);
		});
		await Promise.all(meshProm);

		function recurse(node: Node, parentEnt?: number) {
			const ent = EntityManager.Create(node.name || "node");
			if (parentEnt != null) {
				TransformManager.SetParent(ent, parentEnt);
			}

			if (node instanceof AbstractMesh) {
				console.log("node instanceof AbstractMesh");
				RenderableManager.Create(ent);

				const mesh = meshCache.get(node);
				console.log("Getting Mesh: ", mesh);
				if (mesh) {
					RenderableManager.SetMesh(ent, mesh);
				}
				const mat = node.material && materialCache.get(node.material);
				if (mat) RenderableManager.SetMaterial(ent, mat);
			}

			if (node instanceof TransformNode) {
				TransformManager.SetLocalPosition(
					ent,
					vec3.fromValues(node.position._x, node.position._y, node.position._z),
				);
				TransformManager.SetLocalScale(
					ent,
					vec3.fromValues(node.scaling._x, node.scaling._y, node.scaling._z),
				);
				if (node.rotationQuaternion) {
					console.log("node.rotation", node.rotationQuaternion);
					TransformManager.SetLocalRotation(
						ent,
						quat.fromValues(
							node.rotationQuaternion._x,
							node.rotationQuaternion._y,
							node.rotationQuaternion._z,
							node.rotationQuaternion._w,
						),
					);
				}

				// Process children
				node.getChildren().forEach((child) => {
					if (child instanceof TransformNode) {
						recurse(child, ent);
					}
				});
			}
		}

		// Process root nodes recursively
		scene.rootNodes.forEach((node) => {
			recurse(node, rootEntity);
		});

		console.log("glTF import completed successfully");
	} catch (error) {
		console.error("Error importing glTF:", error);
		throw error;
	} finally {
		engine.dispose();
	}

	return rootEntity;
}
