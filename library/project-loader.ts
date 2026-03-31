import { quat, vec3, vec4 } from "gl-matrix";
import { TransformManager } from "./render/transform";
import { Entity, EntityManager } from "./entity";
import { Mesh, MeshManager } from "./render/mesh";
import { RenderableManager } from "./render/renderable";
import { Material, MaterialManager, MaterialProperty } from "./render/material";
import {
	TextureFormat,
	Texture,
	TextureManager,
	TextureDimension,
} from "./render/texture";
import { LightManager } from "./render/light";
import { ColliderManager } from "./physics/collider";
import { CameraManager } from "./render/camera";
import { RigidbodyManager } from "./physics/rigidbody";
import { GrabInteractableManager } from "./interaction";
import { RpcClient } from "./rpc";
import { UUID } from "crypto";
import { Networking } from "./networking";
import {
	Asset,
	AssetType,
	BoxCollider,
	CapsuleCollider,
	MaterialAsset,
	MeshAsset,
	ProjectDescription,
	PropertyComponent,
	SphereCollider,
	TextureAsset,
	TransformComponent,
	WorldProperty,
} from "./asset";
import { RendererManager } from "./render/renderer";
import { RAD2DEG } from "./utilities/rpc-utils";

export interface SceneGraph {}

function buildSceneGraphRuntime(
	scene: ProjectDescription["scene"],
	entityMap: Map<string, Entity>,
	properties: Map<UUID, PropertyComponent>,
	transforms: Map<UUID, TransformComponent>,
) {
	interface SceneGraphUUIDNode {
		entityId: number;
		children: Map<UUID, SceneGraphUUIDNode>;
	}

	function buildSceneGraphByName(
		root: SceneGraphUUIDNode,
		properties: Map<UUID, { name: string }>,
	) {
		const visit = (node: SceneGraphUUIDNode) => {
			const out: any = { entityId: node.entityId };

			for (const [childUUID, child] of node.children) {
				const prop = properties.get(childUUID)!;
				const name = `@${String(prop.name)}`;

				// Duplicate names at same level: keep the first one
				if (Object.prototype.hasOwnProperty.call(out, name)) continue;
				out[name] = visit(child);
			}

			return out;
		};

		const retval = visit(root);
		delete retval.entityId;
		return retval;
	}
	const sceneGraphNodeMap = new Map<UUID, SceneGraphUUIDNode>();
	const sceneGraphUUID: SceneGraphUUIDNode = {
		entityId: -1,
		children: new Map(),
	};

	for (const entity of scene.entities) {
		sceneGraphNodeMap.set(entity, {
			entityId: entityMap.get(entity)!,
			children: new Map(),
		});
	}

	for (const entity of scene.entities) {
		const transform = transforms.get(entity)!;

		if (transform.parent !== "00000000-0000-0000-0000-000000000000") {
			sceneGraphNodeMap
				.get(transform.parent as UUID)!
				.children.set(entity, sceneGraphNodeMap.get(entity)!);
		} else {
			sceneGraphUUID.children.set(entity, sceneGraphNodeMap.get(entity)!);
		}
	}

	const sceneGraph: any = {};
	Object.assign(sceneGraph, buildSceneGraphByName(sceneGraphUUID, properties));
	return sceneGraph;
}

export async function LoadProject(
	assetRecord: Map<UUID, Asset>,
	projectFile: ProjectDescription,
): Promise<SceneGraph> {
	const scene = projectFile.scene;
	const properties = scene.properties;
	const transforms = scene.transforms;
	const renderables = scene.renderables;
	const lights = scene.lights;
	const cameras = scene.cameras;
	const colliders = scene.colliders;
	const rigidbodies = scene.rigidbodies;
	const grabbles = scene.grabbles;

	const meshCache = new Map<UUID, Mesh>();
	const materialCache = new Map<UUID, Material>();
	const textureCache = new Map<UUID, Texture>();

	const createMesh = async (meshAsset: MeshAsset): Promise<Mesh> => {
		const cacheMeshHandle = meshCache.get(meshAsset.uuid);
		if (cacheMeshHandle) return cacheMeshHandle;

		const meshHandle = await RpcClient.Call<Mesh>(
			"Internal:Mesh_Create",
			RpcClient.GetClientId(),
			meshAsset,
		);

		meshCache.set(meshAsset.uuid, meshHandle);
		return meshHandle;
	};

	const createTexture = async (
		textureAsset: TextureAsset,
		linear = false,
	): Promise<Texture> => {
		const cacheTexHandle = textureCache.get(textureAsset.uuid);
		if (cacheTexHandle) return cacheTexHandle;

		const texHandle = await TextureManager.Create2D(
			1,
			1,
			TextureFormat.RGBA32,
			linear,
		);
		TextureManager.LoadImage(texHandle, textureAsset.image);
		TextureManager.SetFilterMode(texHandle, textureAsset.filterMode);
		TextureManager.SetWrapModeU(texHandle, textureAsset.wrapModeU);
		TextureManager.SetWrapModeV(texHandle, textureAsset.wrapModeV);

		textureCache.set(textureAsset.uuid, texHandle);
		return texHandle;
	};

	const createMaterial = async (
		materialAsset: MaterialAsset,
		culling: boolean,
	): Promise<Material> => {
		const cacheMatHandle = materialCache.get(materialAsset.uuid);
		if (cacheMatHandle) return cacheMatHandle;

		const matHandle = await MaterialManager.Create();
		MaterialManager.SetColor(
			matHandle,
			MaterialProperty.BaseColor,
			vec4.fromValues(
				materialAsset.baseColor[0],
				materialAsset.baseColor[1],
				materialAsset.baseColor[2],
				materialAsset.baseColor[3],
			),
		);

		if (materialAsset.baseColorMap) {
			const texAsset = assetRecord.get(materialAsset.baseColorMap);

			if (texAsset) {
				const texHandle = await createTexture(texAsset as TextureAsset);
				MaterialManager.SetTexture(
					matHandle,
					MaterialProperty.BaseColorMap,
					texHandle,
				);
				MaterialManager.SetFloat(
					matHandle,
					MaterialProperty.BaseColorMapRotation,
					materialAsset.baseColorTransform.rotation,
				);
				MaterialManager.SetVector(
					matHandle,
					MaterialProperty.BaseColorMapScaleOffset,
					vec4.fromValues(
						materialAsset.baseColorTransform.scale[0],
						materialAsset.baseColorTransform.scale[1],
						materialAsset.baseColorTransform.offset[0],
						materialAsset.baseColorTransform.offset[1],
					),
				);
			}
		}

		if (materialAsset.normalMap) {
			const texAsset = assetRecord.get(materialAsset.normalMap);

			if (texAsset) {
				const texHandle = await createTexture(texAsset as TextureAsset, true);
				MaterialManager.SetTexture(
					matHandle,
					MaterialProperty.NormalMap,
					texHandle,
				);
				MaterialManager.SetFloat(
					matHandle,
					MaterialProperty.NormalMapRotation,
					materialAsset.normalTransform.rotation,
				);
				MaterialManager.SetVector(
					matHandle,
					MaterialProperty.NormalMapScaleOffset,
					vec4.fromValues(
						materialAsset.normalTransform.scale[0],
						materialAsset.normalTransform.scale[1],
						materialAsset.normalTransform.offset[0],
						materialAsset.normalTransform.offset[1],
					),
				);

				MaterialManager.SetFloat(
					matHandle,
					MaterialProperty.NormalScale,
					materialAsset.normalScale,
				);
			}
		}

		MaterialManager.SetColor(
			matHandle,
			MaterialProperty.Emission,
			vec4.fromValues(
				materialAsset.emission[0] * materialAsset.emissionIntensity,
				materialAsset.emission[1] * materialAsset.emissionIntensity,
				materialAsset.emission[2] * materialAsset.emissionIntensity,
				1,
			),
		);

		if (materialAsset.emissionMap) {
			const texAsset = assetRecord.get(materialAsset.emissionMap);

			if (texAsset) {
				const texHandle = await createTexture(texAsset as TextureAsset);
				MaterialManager.SetTexture(
					matHandle,
					MaterialProperty.EmissionMap,
					texHandle,
				);
				MaterialManager.SetFloat(
					matHandle,
					MaterialProperty.EmissionMapRotation,
					materialAsset.emissionTransform.rotation,
				);
				MaterialManager.SetVector(
					matHandle,
					MaterialProperty.EmissionMapScaleOffset,
					vec4.fromValues(
						materialAsset.emissionTransform.scale[0],
						materialAsset.emissionTransform.scale[1],
						materialAsset.emissionTransform.offset[0],
						materialAsset.emissionTransform.offset[1],
					),
				);
			}
		}

		if (materialAsset.occlusionMap) {
			const texAsset = assetRecord.get(materialAsset.occlusionMap);

			if (texAsset) {
				const texHandle = await createTexture(texAsset as TextureAsset);
				MaterialManager.SetTexture(
					matHandle,
					MaterialProperty.OcclusionMap,
					texHandle,
				);
				MaterialManager.SetFloat(
					matHandle,
					MaterialProperty.OcclusionMapRotation,
					materialAsset.occlusionTransform.rotation,
				);
				MaterialManager.SetVector(
					matHandle,
					MaterialProperty.OcclusionMapScaleOffset,
					vec4.fromValues(
						materialAsset.occlusionTransform.scale[0],
						materialAsset.occlusionTransform.scale[1],
						materialAsset.occlusionTransform.offset[0],
						materialAsset.occlusionTransform.offset[1],
					),
				);

				MaterialManager.SetFloat(
					matHandle,
					MaterialProperty.OcclusionStrength,
					materialAsset.occlusionStrength,
				);
			}
		}

		if (materialAsset.metallicRoughnessMap) {
			const texAsset = assetRecord.get(materialAsset.metallicRoughnessMap);

			if (texAsset) {
				const texHandle = await createTexture(texAsset as TextureAsset);
				MaterialManager.SetTexture(
					matHandle,
					MaterialProperty.MetallicRoughnessMap,
					texHandle,
				);
				MaterialManager.SetFloat(
					matHandle,
					MaterialProperty.MetallicRoughnessMapRotation,
					materialAsset.metallicRoughnessTransform.rotation,
				);
				MaterialManager.SetVector(
					matHandle,
					MaterialProperty.MetallicRoughnessMapScaleOffset,
					vec4.fromValues(
						materialAsset.metallicRoughnessTransform.scale[0],
						materialAsset.metallicRoughnessTransform.scale[1],
						materialAsset.metallicRoughnessTransform.offset[0],
						materialAsset.metallicRoughnessTransform.offset[1],
					),
				);
			}
		}

		MaterialManager.SetFloat(
			matHandle,
			MaterialProperty.Metalness,
			materialAsset.metalness,
		);

		MaterialManager.SetFloat(
			matHandle,
			MaterialProperty.Roughness,
			materialAsset.roughness,
		);

		MaterialManager.SetAlphaMode(matHandle, materialAsset.alphaMode);
		MaterialManager.SetFloat(
			matHandle,
			MaterialProperty.AlphaCutoff,
			materialAsset.alphaCutoff,
		);

		MaterialManager.SetFloat(
			matHandle,
			MaterialProperty.Culling,
			culling ? 2 : 0,
		);

		materialCache.set(materialAsset.uuid, matHandle);
		return matHandle;
	};

	const setupWorld = async (world: WorldProperty) => {
		if (!world.worldEntrance) return;

		RendererManager.SetAmbientLight(world.ambientLight);
		RendererManager.SetReflectionIntensity(world.reflectionIntensity);

		if (world.skyboxTexture === undefined) return;

		const skybox = assetRecord.get(world.skyboxTexture) as TextureAsset;
		if (skybox === undefined || skybox.assetType !== AssetType.Texture)
			throw "Skybox texture is not valid";

		const renderTexture = await TextureManager.CreateRenderTexture(
			1024,
			1024,
			16,
			TextureDimension.Cube,
		);
		const skyboxTex = await TextureManager.Create2D(
			1,
			1,
			TextureFormat.RGBA32,
			true,
		);

		TextureManager.LoadImage(skyboxTex, skybox.image);
		TextureManager.SetFilterMode(skyboxTex, skybox.filterMode);
		TextureManager.SetWrapModeU(skyboxTex, skybox.wrapModeU);
		TextureManager.SetWrapModeV(skyboxTex, skybox.wrapModeV);

		RendererManager.SetSkybox2DTexture(skyboxTex);
		RendererManager.RenderCubemap(renderTexture);
		RendererManager.SetReflectionCubemap(renderTexture);
	};

	setupWorld(projectFile.world);

	const entityMap = new Map<string, Entity>();
	for (const entity of scene.entities) {
		const property = properties.get(entity)!;
		const entityId = await EntityManager.Create(property.name);
		entityMap.set(entity, entityId);
	}

	const sceneGraph = buildSceneGraphRuntime(
		scene,
		entityMap,
		properties,
		transforms,
	);

	for (const entity of scene.entities) {
		const currEntity = entityMap.get(entity)!;
		EntityManager.SetActive(currEntity, false);

		const transform = transforms.get(entity);
		if (transform) {
			if (transform.parent !== "00000000-0000-0000-0000-000000000000") {
				TransformManager.SetParent(
					currEntity,
					entityMap.get(transform.parent)!,
				);
			}

			TransformManager.SetLocalPosition(
				currEntity,
				vec3.fromValues(
					transform.localPosition[0],
					transform.localPosition[1],
					transform.localPosition[2],
				),
			);
			TransformManager.SetLocalScale(
				currEntity,
				vec3.fromValues(
					transform.localScale[0],
					transform.localScale[1],
					transform.localScale[2],
				),
			);
			TransformManager.SetLocalRotation(
				currEntity,
				quat.fromEuler(
					[0, 0, 0, 0],
					transform.localRotation[0] * RAD2DEG,
					transform.localRotation[1] * RAD2DEG,
					transform.localRotation[2] * RAD2DEG,
					"xyz",
				),
			);

			if (transform.isTransformSync) {
				Networking.MakeNetworkTransform(currEntity);
			}
		} else {
			throw Error(`Data corrupted. Entity ${entity} has no transform`);
		}

		const renderable = renderables.get(entity);
		if (renderable && renderable.mesh) {
			const meshAsset = assetRecord.get(renderable.mesh) as MeshAsset;

			if (meshAsset) {
				const meshHandle = await createMesh(meshAsset);

				if ((await MeshManager.BlendShapeCount(meshHandle)) > 0) {
					await RenderableManager.Create(currEntity, true);
				} else {
					await RenderableManager.Create(currEntity);
				}
				RenderableManager.SetEnabled(currEntity, false);

				RenderableManager.SetMesh(currEntity, meshHandle);
				RenderableManager.SetShadowMode(currEntity, renderable.castShadows);
				RenderableManager.SetReceiveShadows(
					currEntity,
					renderable.receiveShadows,
				);

				if (meshAsset.morphWeights) {
					(meshAsset.morphWeights as number[]).forEach((weight, index) => {
						if (weight != 0)
							RenderableManager.SetBlendShapeWeight(currEntity, index, weight);
					});
				}

				renderable.materialList.forEach(async (m, idx) => {
					if (m === undefined) return;
					const material = assetRecord.get(m);
					if (material === undefined) return;

					const matHandle = await createMaterial(
						material as MaterialAsset,
						renderable.culling,
					);
					RenderableManager.SetMaterial(currEntity, matHandle, idx);
				});

				if (renderable.enabled) {
					RenderableManager.SetEnabled(currEntity, true);
				}
			}
		}

		const light = lights.get(entity);
		if (light) {
			await LightManager.Create(currEntity, light.lightType);
			LightManager.SetEnabled(currEntity, false);

			LightManager.SetIntensity(currEntity, light.intensity);
			LightManager.SetColor(
				currEntity,
				vec3.fromValues(light.color[0], light.color[1], light.color[2]),
			);

			LightManager.SetRange(currEntity, light.range);
			LightManager.SetSpotAngle(currEntity, light.spotAngle);
			LightManager.SetShadows(currEntity, light.shadows);
			// LightManager.SetCullingMask(currEntity, light.cullingMask);

			if (light.enabled) {
				LightManager.SetEnabled(currEntity, true);
			}
		}

		const camera = cameras.get(entity);
		if (camera) {
			await CameraManager.Create(currEntity);
			CameraManager.SetEnabled(currEntity, false);

			CameraManager.SetProjectionType(currEntity, camera.projectionType);
			CameraManager.SetFieldOfView(currEntity, camera.perspectiveFov);
			CameraManager.SetOrthographicSize(currEntity, camera.orthographicSize);
			CameraManager.SetFarClipPlane(currEntity, camera.clippingFar);
			CameraManager.SetNearClipPlane(currEntity, camera.clippingNear);
			// CameraManager.SetCullingMask(currEntity, camera.cullingMask);

			if (camera.enabled) {
				CameraManager.SetEnabled(currEntity, true);
			}
		}

		const collider = colliders.get(entity);
		if (collider) {
			collider.colliders.forEach(async (collider) => {
				switch (collider.colliderType) {
					case "Box": {
						const c = collider as BoxCollider;
						const handle = await ColliderManager.CreateBox(currEntity);
						ColliderManager.SetBoxColliderCenter(
							handle,
							vec3.fromValues(c.center[0], c.center[1], c.center[2]),
						);
						ColliderManager.SetBoxColliderSize(
							handle,
							vec3.fromValues(c.size[0], c.size[1], c.size[2]),
						);
						ColliderManager.SetIsTrigger(handle, c.isTrigger);
						break;
					}
					case "Sphere": {
						const c = collider as SphereCollider;
						const handle = await ColliderManager.CreateSphere(currEntity);
						ColliderManager.SetSphereColliderCenter(
							handle,
							vec3.fromValues(c.center[0], c.center[1], c.center[2]),
						);
						ColliderManager.SetSphereColliderRadius(handle, c.radius!);
						ColliderManager.SetIsTrigger(handle, c.isTrigger);
						break;
					}
					case "Capsule": {
						const c = collider as CapsuleCollider;
						const handle = await ColliderManager.CreateCapsule(currEntity);
						ColliderManager.SetCapsuleColliderCenter(
							handle,
							vec3.fromValues(c.center[0], c.center[1], c.center[2]),
						);
						ColliderManager.SetCapsuleColliderRadius(handle, c.radius!);
						ColliderManager.SetCapsuleColliderHeight(handle, c.height!);
						ColliderManager.SetIsTrigger(handle, c.isTrigger);
						break;
					}
				}
			});
		}

		const rigidbody = rigidbodies.get(entity);
		if (rigidbody) {
			await RigidbodyManager.Create(currEntity);
			// RigidbodyManager.SetConstraints(currEntity, rigidbody.constraints);
			RigidbodyManager.SetLinearDamping(currEntity, rigidbody.linearDamping);
			RigidbodyManager.SetAngularDamping(currEntity, rigidbody.angularDamping);
			RigidbodyManager.SetMass(currEntity, rigidbody.mass);
			RigidbodyManager.SetIsKinematic(currEntity, rigidbody.isKinematic);
			RigidbodyManager.SetUseGravity(currEntity, rigidbody.useGravity);
		}

		const grabble = grabbles.get(entity);
		if (grabble) {
			await GrabInteractableManager.Create(currEntity);
			GrabInteractableManager.SetEnabled(currEntity, false);

			GrabInteractableManager.SetMovementType(currEntity, grabble.movementType);

			GrabInteractableManager.SetDynamicAttach(
				currEntity,
				grabble.dynamicAttach,
			);

			if (grabble.dynamicAttach && grabble.attachEntity) {
				GrabInteractableManager.SetAttachEntity(
					currEntity,
					entityMap.get(grabble.attachEntity)!,
				);
			}

			GrabInteractableManager.SetAllowHoverActivate(
				currEntity,
				grabble.allowHoverActivate,
			);

			GrabInteractableManager.SetTrackPosition(
				currEntity,
				grabble.trackPosition,
			);
			GrabInteractableManager.SetTrackRotation(
				currEntity,
				grabble.trackRotation,
			);
			GrabInteractableManager.SetThrowOnDetach(
				currEntity,
				grabble.throwOnDetach,
			);

			if (grabble.enabled) {
				GrabInteractableManager.SetEnabled(currEntity, true);
			}

			if (transform.isTransformSync) {
				GrabInteractableManager.MakeNetworkGrabble(currEntity);
			}
		}

		const property = properties.get(entity)!;
		if (property.activeEntity) {
			EntityManager.SetActive(currEntity, property.activeEntity);
		}
	}

	return sceneGraph;
}
