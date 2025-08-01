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
} from "@babylonjs/core";
import "@babylonjs/loaders";

import * as fs from "fs/promises";
import * as path from "path";
import { PNG } from "pngjs";

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
import { vec4 } from "gl-matrix";

const DEFAULT_MATERIAL = MaterialManager.Create(ShaderType.URP_LIT);
MaterialManager.SetColor(
	DEFAULT_MATERIAL,
	ShaderProperties.BaseColor,
	vec4.fromValues(0.8, 0.8, 0.8, 1.0),
);

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
		const nodeToEntity = new Map<TransformNode, Entity>();
		const skeletonHandles = new Map<Skeleton, number>();
		const materialCache = new Map<string, MaterialHandle>();
		const textureCache = new Map<BaseTexture, TextureHandle>();

		function recurse(node: TransformNode, parentEnt?: number) {
			const ent = EntityManager.Create(node.name || "node");
			nodeToEntity.set(node, ent);

			// Set local transform using the node's local matrix
			const localMatrix = node._localMatrix;
			TransformManager.SetTransform(ent, localMatrix.asArray());

			// Set parent-child relationship
			if (parentEnt != null) {
				TransformManager.SetParent(ent, parentEnt);
			}

			// Process children
			node.getChildren().forEach((child) => {
				if (child instanceof TransformNode) {
					recurse(child, ent);
				}
			});
		}

		/**
		 * Process a Babylon material and convert it to Unity material properties
		 */
		async function processMaterial(
			material: any,
			entityHandle: number,
			assetPath: string,
		) {
			try {
				console.log(`Processing material: ${material.name || "unnamed"}`);

				const cachedMaterialHandle = materialCache.get(material.name);
				if (cachedMaterialHandle) {
					console.log(`Read cached material: ${material.name || "unnamed"}`);
					RenderableManager.SetMaterial(entityHandle, cachedMaterialHandle);
					return;
				}

				// Create material
				const materialHandle = MaterialManager.Create(ShaderType.URP_LIT);

				// Handle base color texture
				const baseColorTexture = material.albedoTexture || material.baseTexture;
				if (baseColorTexture) {
					const textureHandle = await processTexture(
						baseColorTexture,
						assetPath,
					);
					if (textureHandle !== -1) {
						MaterialManager.SetTexture(
							materialHandle,
							ShaderProperties.BaseMap,
							textureHandle,
						);
					}
				}

				// Set base color (fallback or tint)
				const baseColor = material.albedoColor || material.diffuseColor;
				if (baseColor) {
					const colorArray = baseColor.asArray?.() ?? [
						baseColor.r ?? 1,
						baseColor.g ?? 1,
						baseColor.b ?? 1,
						baseColor.a ?? 1,
					];
					const [r = 1, g = 1, b = 1, a = 1] = colorArray;
					MaterialManager.SetColor(
						materialHandle,
						ShaderProperties.BaseColor,
						vec4.fromValues(r, g, b, a),
					);
				} else {
					MaterialManager.SetColor(
						materialHandle,
						ShaderProperties.BaseColor,
						vec4.fromValues(1.0, 1.0, 1.0, 1.0),
					);
				}

				// Handle metallic and roughness properties
				const metallic = material.metallic ?? material.metallicFactor ?? 0;
				const roughness = material.roughness ?? material.roughnessFactor ?? 1;
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
				RenderableManager.SetMaterial(entityHandle, materialHandle);
				materialCache.set(material.name, materialHandle);
				console.log(
					`Material processed - Metallic: ${metallic}, Smoothness: ${smoothness}`,
				);
			} catch (error) {
				console.error(`Error processing material: ${material.name}`, error);
				// Set default material properties on error
				RenderableManager.SetMaterial(entityHandle, DEFAULT_MATERIAL);
			}
		}

		/**
		 * Process a Babylon texture and upload it to Unity
		 */
		async function processTexture(
			texture: BaseTexture,
			assetPath: string,
		): Promise<number> {
			try {
				const cachedTextureHandle = textureCache.get(texture);
				if (cachedTextureHandle) {
					return cachedTextureHandle;
				}

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
					return -1;
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
							return -1;
						}
						console.log("Successfully extracted embedded glTF texture data");
					} else {
						console.warn(`Unknown data URL format: ${textureUrl}`);
						return -1;
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
						return -1;
					}
				}

				if (!buffer) {
					console.warn("No texture data available");
					return -1;
				}

				// Create Unity texture
				const textureHandle = TextureManager.Create2D(
					10,
					10,
					TextureFormat.RGBA32,
				);
				if (textureHandle === -1) {
					console.warn("Failed to create Unity texture");
					return -1;
				}

				// Upload pixel data
				const success = TextureManager.LoadImage(textureHandle, buffer.buffer);
				if (!success) {
					console.warn("Failed to upload texture pixels");
					return -1;
				}

				// Set texture filtering
				TextureManager.SetFilterMode(textureHandle, 1); // Bilinear

				console.log(`Texture processed successfully: ${texture.name}`);
				textureCache.set(texture, textureHandle);
				return textureHandle;
			} catch (error) {
				console.error("Error processing texture:", error);
				return -1;
			}
		}

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

							const imageData = ctx.getImageData(
								0,
								0,
								canvas.width,
								canvas.height,
							);
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

		// Process root nodes recursively
		scene.rootNodes.forEach((root) => {
			if (root instanceof TransformNode) {
				recurse(root, rootEntity);
			}
		});

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

		// // 3) Process Cameras
		// scene.cameras.forEach((cam) => {
		// 	const ent = EntityManager.Create(cam.name || "camera");
		// 	CameraManager.Create(ent);

		// 	CameraManager.SetProjection(
		// 		ent,
		// 		0, // 0 = PERSPECTIVE
		// 		cam.fov,
		// 		cam.getEngine().getRenderWidth() / cam.getEngine().getRenderHeight(),
		// 		cam.minZ,
		// 		cam.maxZ,
		// 	);

		// 	// Set camera transform
		// 	const worldMatrix = cam.getWorldMatrix();
		// 	TransformManager.SetTransform(
		// 		ent,
		// 		Array.from(worldMatrix.toArray()) as Matrix4,
		// 	);
		// });

		// // 4) Process Lights
		// scene.lights.forEach((light) => {
		// 	const ent = EntityManager.Create(light.name || "light");

		// 	// Map Babylon's light types to Unity's enum: 0=Spot, 1=Directional, 2=Point, 3=Area
		// 	const typeMap = { SpotLight: 0, DirectionalLight: 1, PointLight: 2 };
		// 	const typeName = ((light as any).getTypeName?.() ??
		// 		"PointLight") as keyof typeof typeMap;

		// 	LightManager.Create(ent, typeMap[typeName] ?? 2);

		// 	LightManager.SetColor(
		// 		ent,
		// 		light.diffuse?.r ?? 1,
		// 		light.diffuse?.g ?? 1,
		// 		light.diffuse?.b ?? 1,
		// 	);

		// 	LightManager.SetIntensity(ent, light.intensity || 1);

		// 	// Set light transform
		// 	const worldMatrix = light.getWorldMatrix();
		// 	TransformManager.SetTransform(
		// 		ent,
		// 		Array.from(worldMatrix.toArray()) as Matrix4,
		// 	);
		// });

		// 5) Process Meshes & Materials
		for (const mesh of scene.meshes) {
			if (!mesh.getTotalVertices() || !mesh.getIndices()) {
				console.log(`Skipping mesh ${mesh.name} - no geometry data`);
				continue;
			}

			console.log(`Processing mesh: ${mesh.name}`);

			// Find or create the GameObject for this mesh
			const ent =
				nodeToEntity.get(mesh as any) ||
				EntityManager.Create(mesh.name || "mesh");

			// Create renderable component
			RenderableManager.Create(ent);

			// Create mesh and attach to renderable
			const meshHandle = MeshManager.Create(ent);

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

			// Process material
			if (mesh.material) {
				await processMaterial(mesh.material, ent, assetPath);
			} else {
				RenderableManager.SetMaterial(ent, DEFAULT_MATERIAL);
			}
		}

		console.log("glTF import completed successfully");
	} catch (error) {
		console.error("Error importing glTF:", error);
		throw error;
	} finally {
		engine.dispose();
	}

	return rootEntity;
}
