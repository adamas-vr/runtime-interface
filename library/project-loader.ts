import { quat, vec3, vec4 } from "gl-matrix";
import { TransformManager } from "./render/transform";
import { Entity, EntityManager } from "./entity";
import { MeshHandle, MeshManager } from "./render/mesh";
import { RenderableManager } from "./render/renderable";
import {
	MaterialHandle,
	MaterialManager,
	MaterialProperty,
} from "./render/material";
import { TextureFormat, TextureHandle, TextureManager } from "./render/texture";
import { LightManager, LightType } from "./render/light";
import { ColliderManager } from "./physics/collider";
import { CameraManager } from "./render/camera";
import { RigidbodyManager } from "./physics/rigidbody";
import {
	GrabInteractableManager,
	MovementType,
} from "./interaction/interaction";
import { RpcClient } from "./rpc";
import { UUID } from "crypto";
import { Networking } from "./networking/state-sync";

const RAD2DEG = 180 / Math.PI;

/**
 *
 * matelness and roughness share the same texture
 * culling is on matieral
 */

type Properties = {
	componentType: string;
	name: string;
	activeEntity: boolean;
};
type Transforms = {
	componentType: string;
	isTransformSync: boolean;
	parent: UUID;
	children: UUID[];
	localScale: {
		value: [number, number, number];
	};
	localRotation: {
		value: {
			x: number;
			y: number;
			z: number;
		};
	};
	localPosition: {
		value: [number, number, number];
	};
};
type Renderables = {
	componentType: string;
	enabled: boolean;
	layerMask: number;
	receiveShadows: boolean;
	castShadows: number;
	culling: boolean;
	mesh: string;
	materialList: string[];
};
type Lights = {
	componentType: string;
	enabled: boolean;
	color: {
		value: [number, number, number];
	};
	cullingMask: number;
	intensity: number;
	range: number;
	shadows: number;
	lightType: number;
	spotAngle: number;
	isSpotAngleDegree: boolean;
};
type Cameras = {
	componentType: string;
	enabled: boolean;
	projectionType: number;
	perspectiveFov: number;
	orthographicSize: number;
	clippingNear: number;
	clippingFar: number;
	cullingMask: number;
};
type Colliders = {
	componentType: string;
	colliders: (
		| {
				isTrigger: boolean;
				colliderType: string;
				center: {
					value: [number, number, number];
				};
				size: {
					value: [number, number, number];
				};
				radius?: undefined;
				height?: undefined;
		  }
		| {
				isTrigger: boolean;
				colliderType: string;
				center: {
					value: [number, number, number];
				};
				radius: number;
				size?: undefined;
				height?: undefined;
		  }
		| {
				isTrigger: boolean;
				colliderType: string;
				center: {
					value: [number, number, number];
				};
				height: number;
				radius: number;
				size?: undefined;
		  }
	)[];
};
type Rigidbodies = {
	componentType: string;
	constraints: number;
	angularDamping: number;
	isKinematic: boolean;
	linearDamping: number;
	mass: number;
	useGravity: boolean;
};

type Grabbles = {
	componentType: string;
	enabled: boolean;
	dynamicAttach: boolean;
	attachEntity?: UUID;
	allowHoverActivate: boolean;
	movementType: MovementType;
	trackPosition: boolean;
	trackRotation: boolean;
	throwOnDetach: boolean;
};

export interface SceneGraph {}

function buildSceneGraphRuntime(
	scene: any,
	entityMap: Map<string, Entity>,
	properties: Map<UUID, Properties>,
	transforms: Map<UUID, Transforms>,
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

	for (const entity of scene.entities.value) {
		sceneGraphNodeMap.set(entity, {
			entityId: entityMap.get(entity)!,
			children: new Map(),
		});
	}

	for (const entity of scene.entities.value) {
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

export function LoadProject(
	assetRecord: Map<string, object>,
	projectFile: any,
): SceneGraph {
	// type Properties = Exclude<(typeof scene.properties)[number][number], string>;
	// type Transforms = Exclude<(typeof scene.transforms)[number][number], string>;
	// type Renderables = Exclude<
	// 	(typeof scene.renderables)[number][number],
	// 	string
	// >;
	// type Lights = Exclude<(typeof scene.lights)[number][number], string>;
	// type Cameras = Exclude<(typeof scene.cameras)[number][number], string>;
	// type Colliders = Exclude<(typeof scene.colliders)[number][number], string>;
	// type Rigidbodies = Exclude<
	// 	(typeof scene.rigidbodies)[number][number],
	// 	string
	// >;
	// type Grabbles = Exclude<(typeof scene.grabbles)[number][number], string>;

	const scene = projectFile.scene;
	const properties = new Map(scene.properties.value as [UUID, Properties][]);
	const transforms = new Map(scene.transforms.value as [UUID, Transforms][]);
	const renderables = new Map(scene.renderables.value as [UUID, Renderables][]);
	const lights = new Map(scene.lights.value as [UUID, Lights][]);
	const cameras = new Map(scene.cameras.value as [UUID, Cameras][]);
	const colliders = new Map(scene.colliders.value as [UUID, Colliders][]);
	const rigidbodies = new Map(scene.rigidbodies.value as [UUID, Rigidbodies][]);
	const grabbles = new Map(scene.grabbles.value as [UUID, Grabbles][]);

	const meshCache = new Map<UUID, MeshHandle>();
	const materialCache = new Map<UUID, MaterialHandle>();
	const textureCache = new Map<UUID, TextureHandle>();

	const createMesh = (meshAsset: any): MeshHandle => {
		const cacheMeshHandle = meshCache.get(meshAsset.uuid);
		if (cacheMeshHandle) return cacheMeshHandle;

		const meshHandle = RpcClient.Call("Internal:Mesh_Create", {
			clientId: RpcClient.GetClientId(),
			meshAsset: JSON.stringify(meshAsset),
		});

		meshCache.set(meshAsset.uuid, meshHandle);
		return meshHandle;
	};

	const createTexture = (textureAsset: any, linear = false): TextureHandle => {
		const cacheTexHandle = textureCache.get(textureAsset.uuid);
		if (cacheTexHandle) return cacheTexHandle;

		const texHandle = TextureManager.Create2D(
			1,
			1,
			TextureFormat.RGBA32,
			linear,
		);
		TextureManager.LoadImage(texHandle, textureAsset.base64Image);
		TextureManager.SetFilterMode(texHandle, textureAsset.filterMode);
		TextureManager.SetWrapModeU(texHandle, textureAsset.wrapModeU);
		TextureManager.SetWrapModeV(texHandle, textureAsset.wrapModeV);

		textureCache.set(textureAsset.uuid, texHandle);
		return texHandle;
	};

	const createMaterial = (
		materialAsset: any,
		culling: boolean,
	): MaterialHandle => {
		const cacheMatHandle = materialCache.get(materialAsset.uuid);
		if (cacheMatHandle) return cacheMatHandle;

		const matHandle = MaterialManager.Create();
		MaterialManager.SetColor(
			matHandle,
			MaterialProperty.BaseColor,
			vec4.fromValues(
				materialAsset.baseColor.x,
				materialAsset.baseColor.y,
				materialAsset.baseColor.z,
				materialAsset.baseColor.w,
			),
		);

		if (materialAsset.baseColorMap) {
			const texAsset = assetRecord.get(materialAsset.baseColorMap);

			if (texAsset) {
				const texHandle = createTexture(texAsset);
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
						materialAsset.baseColorTransform.scale.value[0],
						materialAsset.baseColorTransform.scale.value[1],
						materialAsset.baseColorTransform.offset.value[0],
						materialAsset.baseColorTransform.offset.value[1],
					),
				);
			}
		}

		if (materialAsset.normalMap) {
			const texAsset = assetRecord.get(materialAsset.normalMap);

			if (texAsset) {
				const texHandle = createTexture(texAsset, true);
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
						materialAsset.normalTransform.scale.value[0],
						materialAsset.normalTransform.scale.value[1],
						materialAsset.normalTransform.offset.value[0],
						materialAsset.normalTransform.offset.value[1],
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
				materialAsset.emission.value[0] * materialAsset.emissionIntensity,
				materialAsset.emission.value[1] * materialAsset.emissionIntensity,
				materialAsset.emission.value[2] * materialAsset.emissionIntensity,
				1,
			),
		);

		if (materialAsset.emissionMap) {
			const texAsset = assetRecord.get(materialAsset.emissionMap);

			if (texAsset) {
				const texHandle = createTexture(texAsset);
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
						materialAsset.emissionTransform.scale.value[0],
						materialAsset.emissionTransform.scale.value[1],
						materialAsset.emissionTransform.offset.value[0],
						materialAsset.emissionTransform.offset.value[1],
					),
				);
			}
		}

		if (materialAsset.occlusionMap) {
			const texAsset = assetRecord.get(materialAsset.occlusionMap) as any;

			if (texAsset) {
				const texHandle = createTexture(texAsset);
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
						materialAsset.occlusionTransform.scale.value[0],
						materialAsset.occlusionTransform.scale.value[1],
						materialAsset.occlusionTransform.offset.value[0],
						materialAsset.occlusionTransform.offset.value[1],
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
			const texAsset = assetRecord.get(
				materialAsset.metallicRoughnessMap,
			) as any;

			if (texAsset) {
				const texHandle = createTexture(texAsset);
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
						materialAsset.metallicRoughnessTransform.scale.value[0],
						materialAsset.metallicRoughnessTransform.scale.value[1],
						materialAsset.metallicRoughnessTransform.offset.value[0],
						materialAsset.metallicRoughnessTransform.offset.value[1],
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

	const entityMap = new Map<string, Entity>();
	for (const entity of scene.entities.value) {
		const property = properties.get(entity)!;
		const entityId = EntityManager.Create(property.name);
		entityMap.set(entity, entityId);
	}

	const sceneGraph = buildSceneGraphRuntime(
		scene,
		entityMap,
		properties,
		transforms,
	);

	for (const entity of scene.entities.value) {
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
					transform.localPosition.value[0],
					transform.localPosition.value[1],
					transform.localPosition.value[2],
				),
			);
			TransformManager.SetLocalScale(
				currEntity,
				vec3.fromValues(
					transform.localScale.value[0],
					transform.localScale.value[1],
					transform.localScale.value[2],
				),
			);
			TransformManager.SetLocalRotation(
				currEntity,
				quat.fromEuler(
					[0, 0, 0, 0],
					transform.localRotation.value.x * RAD2DEG,
					transform.localRotation.value.y * RAD2DEG,
					transform.localRotation.value.z * RAD2DEG,
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
			const meshAsset = assetRecord.get(renderable.mesh) as any;

			if (meshAsset) {
				const meshHandle = createMesh(meshAsset);

				if (MeshManager.BlendShapeCount(meshHandle) > 0) {
					RenderableManager.Create(currEntity, true);
				} else {
					RenderableManager.Create(currEntity);
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

				renderable.materialList.forEach((m, idx) => {
					const material = assetRecord.get(m) as any;
					if (material === undefined) return;

					const matHandle = createMaterial(material, renderable.culling);
					RenderableManager.SetMaterial(currEntity, matHandle, idx);
				});

				if (renderable.enabled) {
					RenderableManager.SetEnabled(currEntity, true);
				}
			}
		}

		const light = lights.get(entity);
		if (light) {
			LightManager.Create(currEntity, light.lightType);
			LightManager.SetEnabled(currEntity, false);

			LightManager.SetIntensity(currEntity, light.intensity);
			LightManager.SetColor(
				currEntity,
				vec3.fromValues(
					light.color.value[0],
					light.color.value[1],
					light.color.value[2],
				),
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
			CameraManager.Create(currEntity);
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
			collider.colliders.forEach((c) => {
				switch (c.colliderType) {
					case "Box": {
						const handle = ColliderManager.CreateBox(currEntity);
						ColliderManager.SetBoxColliderCenter(
							handle,
							vec3.fromValues(
								c.center.value[0],
								c.center.value[1],
								c.center.value[2],
							),
						);
						ColliderManager.SetBoxColliderSize(
							handle,
							vec3.fromValues(
								c.size!.value[0],
								c.size!.value[1],
								c.size!.value[2],
							),
						);
						ColliderManager.SetIsTrigger(handle, c.isTrigger);
						break;
					}
					case "Sphere": {
						const handle = ColliderManager.CreateSphere(currEntity);
						ColliderManager.SetSphereColliderCenter(
							handle,
							vec3.fromValues(
								c.center.value[0],
								c.center.value[1],
								c.center.value[2],
							),
						);
						ColliderManager.SetSphereColliderRadius(handle, c.radius!);
						ColliderManager.SetIsTrigger(handle, c.isTrigger);
						break;
					}
					case "Capsule": {
						const handle = ColliderManager.CreateCapsule(currEntity);
						ColliderManager.SetCapsuleColliderCenter(
							handle,
							vec3.fromValues(
								c.center.value[0],
								c.center.value[1],
								c.center.value[2],
							),
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
			RigidbodyManager.Create(currEntity);
			// RigidbodyManager.SetConstraints(currEntity, rigidbody.constraints);
			RigidbodyManager.SetLinearDamping(currEntity, rigidbody.linearDamping);
			RigidbodyManager.SetAngularDamping(currEntity, rigidbody.angularDamping);
			RigidbodyManager.SetMass(currEntity, rigidbody.mass);
			RigidbodyManager.SetIsKinematic(currEntity, rigidbody.isKinematic);
			RigidbodyManager.SetUseGravity(currEntity, rigidbody.useGravity);
		}

		const grabble = grabbles.get(entity);
		if (grabble) {
			GrabInteractableManager.Create(currEntity);
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
