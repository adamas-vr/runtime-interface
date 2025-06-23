import { NullEngine, Scene, SceneLoader, VertexBuffer, TransformNode, Bone, Skeleton, Texture as BabylonTexture, BaseTexture } from "@babylonjs/core";
import "@babylonjs/loaders";
import * as fs from "fs/promises";
import * as path from "path";
import { PNG } from "pngjs";

import { RpcClient } from "./rpc";
import { EntityManager }    from "./entity";
import { RenderableBuilder } from "./renderable";

/**
 * Import .glb/.gltf/VRM and push every asset—nodes, cameras, lights, skeletons, skinned
 * + non-skinned meshes, materials—to Unity via our RPC bridge.
 */
export async function importGltfAndRender(assetPath: string) {
  const engine = new NullEngine();
  const scene  = new Scene(engine);

  try {
    // Load file into a Buffer (Uint8Array) and append with explicit ".glb"
    const buffer = await fs.readFile(assetPath);
    await SceneLoader.AppendAsync("", buffer, scene, undefined, ".glb");

    console.log(`Loaded glTF with ${scene.meshes.length} meshes, ${scene.skeletons.length} skeletons, ${scene.cameras.length} cameras, ${scene.lights.length} lights`);

    // 1) Create a GameObject for each transform node and preserve hierarchy
    const nodeToEntity = new Map<TransformNode, number>();
    const skeletonHandles = new Map<Skeleton, number>();

    // Process root nodes recursively
    scene.rootNodes.forEach(root => {
      function recurse(node: TransformNode, parentEnt?: number) {
        const ent = EntityManager.Create(node.name || "node");
        nodeToEntity.set(node, ent);

        // Set local transform using the node's local matrix
        const localMatrix = node._localMatrix;
        RpcClient.Call("Transform_SetTransform", {
          entityHandle: ent,
          matrixJson: localMatrix.toArray().join(",")
        });

        // Set parent-child relationship
        if (parentEnt != null) {
          RpcClient.Call("Transform_SetParent", {
            entityHandle: ent,
            parentHandle: parentEnt
          });
        }

        // Process children
        node.getChildren().forEach(child => {
          if (child instanceof TransformNode) {
            recurse(child, ent);
          }
        });
      }

      if (root instanceof TransformNode) {
        recurse(root);
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

    // 3) Process Cameras
    scene.cameras.forEach(cam => {
      const ent = EntityManager.Create(cam.name || "camera");
      RpcClient.Call("Camera_Create", { entityHandle: ent });
      
      RpcClient.Call("Camera_SetProjection", {
        entityHandle: ent,
        projectionType: 0,          // 0 = PERSPECTIVE
        fov: cam.fov,
        aspect: cam.getEngine().getRenderWidth() / cam.getEngine().getRenderHeight(),
        near: cam.minZ,
        far: cam.maxZ
      });
      
      // Set camera transform
      const worldMatrix = cam.getWorldMatrix();
      RpcClient.Call("Transform_SetTransform", {
        entityHandle: ent,
        matrixJson: worldMatrix.toArray().join(",")
      });
    });

    // 4) Process Lights
    scene.lights.forEach(light => {
      const ent = EntityManager.Create(light.name || "light");
      
      // Map Babylon's light types to Unity's enum: 0=Spot, 1=Directional, 2=Point, 3=Area
      const typeMap = { "SpotLight": 0, "DirectionalLight": 1, "PointLight": 2 };
      const typeName = ((light as any).getTypeName?.() ?? "PointLight") as keyof typeof typeMap;
      
      RpcClient.Call("Light_Create", {
        entityHandle: ent,
        lightType: typeMap[typeName] ?? 2
      });
      
      RpcClient.Call("Light_SetColor", {
        entityHandle: ent,
        r: light.diffuse?.r ?? 1,
        g: light.diffuse?.g ?? 1,
        b: light.diffuse?.b ?? 1
      });
      
      RpcClient.Call("Light_SetIntensity", { 
        entityHandle: ent, 
        intensity: light.intensity || 1 
      });
      
      // Set light transform
      const worldMatrix = light.getWorldMatrix();
      RpcClient.Call("Transform_SetTransform", {
        entityHandle: ent,
        matrixJson: worldMatrix.toArray().join(",")
      });
    });

    // 5) Process Meshes & Materials
    for (const mesh of scene.meshes) {
      if (!mesh.getTotalVertices() || !mesh.getIndices()) {
        console.log(`Skipping mesh ${mesh.name} - no geometry data`);
        continue;
      }

      console.log(`Processing mesh: ${mesh.name}`);

      // Find or create the GameObject for this mesh
      const ent = nodeToEntity.get(mesh as any) || EntityManager.Create(mesh.name || "mesh");
      const rb = new RenderableBuilder().build(ent);

      // Upload geometry data
      const positions = mesh.getVerticesData(VertexBuffer.PositionKind)!;
      const indices = mesh.getIndices()!;
      rb.geometry(Array.from(positions), Array.from(indices));

      // Handle UV coordinates if available
      const uvs = mesh.getVerticesData(VertexBuffer.UVKind);
      if (uvs) {
        RpcClient.Call("Mesh_SetUVs", {
          meshHandle: rb.meshHandle,
          uvsJson: JSON.stringify(Array.from(uvs))
        });
      }

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
        await processMaterial(mesh.material, rb, assetPath);
      } else {
        // Create default material
        rb.materialURPLit().setBaseColor(0.8, 0.8, 0.8, 1.0);
      }
    }

    console.log("glTF import completed successfully");

  } catch (error) {
    console.error("Error importing glTF:", error);
    throw error;
  } finally {
    engine.dispose();
  }
}

/**
 * Process a Babylon material and convert it to Unity material properties
 */
async function processMaterial(material: any, rb: RenderableBuilder, assetPath: string) {
  try {
    console.log(`Processing material: ${material.name || 'unnamed'}`);
    
    rb.materialURPLit();

    // Handle base color texture
    const baseColorTexture = material.albedoTexture || material.baseTexture;
    if (baseColorTexture) {
      const textureHandle = await processTexture(baseColorTexture, assetPath);
      if (textureHandle !== -1) {
        rb.setBaseTexture(textureHandle);
      }
    }

    // Set base color (fallback or tint)
    const baseColor = material.albedoColor || material.diffuseColor;
    if (baseColor) {
      const colorArray = baseColor.asArray?.() ?? [baseColor.r ?? 1, baseColor.g ?? 1, baseColor.b ?? 1, baseColor.a ?? 1];
      const [r = 1, g = 1, b = 1, a = 1] = colorArray;
      rb.setBaseColor(r, g, b, a);
    } else {
      rb.setBaseColor(1, 1, 1, 1);
    }

    // Handle metallic and roughness properties
    const metallic = material.metallic ?? material.metallicFactor ?? 0;
    const roughness = material.roughness ?? material.roughnessFactor ?? 1;
    const smoothness = 1 - roughness;

    rb.setMetallic(metallic).setSmoothness(smoothness);

    console.log(`Material processed - Metallic: ${metallic}, Smoothness: ${smoothness}`);

  } catch (error) {
    console.error(`Error processing material: ${material.name}`, error);
    // Set default material properties on error
    rb.setBaseColor(0.8, 0.8, 0.8, 1.0);
  }
}

/**
 * Extract texture data from embedded glTF textures in Babylon.js
 */
async function extractEmbeddedTextureData(texture: BaseTexture): Promise<Buffer | undefined> {
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
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = image.naturalWidth || image.width;
          canvas.height = image.naturalHeight || image.height;
          ctx.drawImage(image, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log(`Extracted texture data from DOM image: ${canvas.width}x${canvas.height}`);
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
    if (typeof (texture as any).readPixels === 'function') {
      try {
        const pixels = (texture as any).readPixels();
        if (pixels) {
          console.log("Extracted texture data using readPixels()");
          return Buffer.from(pixels);
        }
      } catch (readError) {
        if (readError && typeof readError === "object" && "message" in readError) {
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
 * Process a Babylon texture and upload it to Unity
 */
async function processTexture(texture: BaseTexture, assetPath: string): Promise<number> {
  try {
    // Get texture URL - different ways depending on texture type
    let textureUrl: string | undefined;
    
    if ('url' in texture) {
      textureUrl = (texture as any).url;
    } else if ('name' in texture) {
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

    if (textureUrl.startsWith('data:')) {
      // Handle different types of data URLs
      if (textureUrl.includes('base64,')) {
        // Standard base64 data URL: data:image/png;base64,iVBORw0KGgoAAAANSUhEU...
        const match = textureUrl.match(/base64,(.+)$/);
        if (match && match[1]) {
          buffer = Buffer.from(match[1], 'base64');
          console.log("Extracted texture from base64 data URL");
        } else {
          console.warn(`Unable to parse base64 data from URL: ${textureUrl}`);
          return -1;
        }
      } else if (textureUrl.match(/^data:[0-9a-f-]+#/)) {
        // Handle embedded glTF texture references like: data:31c25f34-4e11-4a3c-860e-11a5f7410de8#image1
        console.log(`Processing embedded glTF texture: ${textureUrl}`);
        
        // Try to get the texture data directly from Babylon's internal texture system
        buffer = await extractEmbeddedTextureData(texture);
        
        if (!buffer) {
          console.warn("Could not extract texture data from embedded glTF reference");
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
        const resolvedPath = path.resolve(path.dirname(assetPath), textureUrl);
        buffer = await fs.readFile(resolvedPath);
      } catch (fileError) {
        console.warn(`Failed to load external texture file: ${textureUrl}`, fileError);
        return -1;
      }
    }

    if (!buffer) {
      console.warn("No texture data available");
      return -1;
    }

    // Decode the image data
    let png: PNG;
    try {
      png = PNG.sync.read(buffer);
    } catch (pngError) {
      console.warn("Failed to decode PNG data:", pngError);
      return -1;
    }

    // Create Unity texture
    const textureHandle = Number(RpcClient.Call("Texture_Create2D", {
      width: png.width,
      height: png.height,
      format: 4  // RGBA32
    }));

    if (textureHandle === -1) {
      console.warn("Failed to create Unity texture");
      return -1;
    }

    // Upload pixel data
    const success = RpcClient.Call("Texture_SetPixels", {
      textureHandle: textureHandle,
      pixelDataJson: Array.from(png.data).join(","),
      width: png.width,
      height: png.height
    });

    if (!success) {
      console.warn("Failed to upload texture pixels");
      return -1;
    }

    // Set texture filtering
    RpcClient.Call("Texture_SetFilterMode", {
      textureHandle: textureHandle,
      filterMode: 1  // Bilinear
    });

    console.log(`Texture processed successfully: ${png.width}x${png.height}`);
    return textureHandle;

  } catch (error) {
    console.error("Error processing texture:", error);
    return -1;
  }
}