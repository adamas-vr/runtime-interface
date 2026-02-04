import { quat, vec3, vec4 } from "gl-matrix";
import { TransformManager } from "./render/transform";
import { Entity, EntityManager } from "./entity";
import { MeshHandle, MeshManager } from "./render/mesh";
import { RenderableManager } from "./render/renderable";
import {
	MaterialHandle,
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "./render/material";
import { TextureFormat, TextureHandle, TextureManager } from "./render/texture";
import { LightManager, LightType } from "./render/light";
import { ColliderManager } from "./physics/collider";
import { CameraManager } from "./render/camera";
import { RigidbodyManager } from "./physics/rigidbody";
import { GrabInteractableManager } from "./interaction/interaction";
import { RpcClient } from "./rpc";
import { UUID } from "crypto";

const RAD2DEG = 180 / Math.PI;

/**
 *
 * matelness and roughness share the same texture
 * culling is on matieral
 */

type Properties = {
	componentType: string;
	name: string;
};
type Transforms = {
	componentType: string;
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
	layerMask: number;
	receiveShadows: boolean;
	castShadows: number;
	culling: boolean;
	mesh: string;
	materialList: string[];
};
type Lights = {
	componentType: string;
	color: {
		x: number;
		y: number;
		z: number;
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
	cullingMask: number;
	projectionType: number;
	projectionFov: number;
	projectionAspectRatio: number;
	projectionNear: number;
	projectionFar: number;
	renderTexture: string;
	orthoLeft: number;
	orthoRight: number;
	orthoBottom: number;
	orthoTop: number;
	orthoNear: number;
	orthoFar: number;
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
	angularDamping: number;
	isKinematic: boolean;
	linearDamping: number;
	mass: number;
	useGravity: boolean;
};
type Grabbles = {
	componentType: string;
	throwOnDetach: boolean;
	trackPosition: boolean;
	trackRotation: boolean;
	trackScale: boolean;
	attachEntity: string;
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
		TextureManager.LoadImageBase64(texHandle, textureAsset.base64Image);
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

		const matHandle = MaterialManager.Create(ShaderType.UnityGLTF);
		MaterialManager.SetColor(
			matHandle,
			ShaderProperties.BaseColor,
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
					ShaderProperties.BaseColorMap,
					texHandle,
				);
			}
		}

		if (materialAsset.normalMap) {
			const texAsset = assetRecord.get(materialAsset.normalMap);

			if (texAsset) {
				const texHandle = createTexture(texAsset, true);
				MaterialManager.SetTexture(
					matHandle,
					ShaderProperties.NormalMap,
					texHandle,
				);

				MaterialManager.SetFloat(
					matHandle,
					ShaderProperties.NormalScale,
					materialAsset.normalScale,
				);
			}
		}

		MaterialManager.SetColor(
			matHandle,
			ShaderProperties.Emission,
			vec4.fromValues(
				materialAsset.emission.value[0],
				materialAsset.emission.value[1],
				materialAsset.emission.value[2],
				1,
			),
		);

		if (materialAsset.emissionMap) {
			const texAsset = assetRecord.get(materialAsset.emissionMap);

			if (texAsset) {
				const texHandle = createTexture(texAsset);
				MaterialManager.SetTexture(
					matHandle,
					ShaderProperties.EmissionMap,
					texHandle,
				);
			}
		}

		if (materialAsset.occlusionMap) {
			const texAsset = assetRecord.get(materialAsset.occlusionMap) as any;

			if (texAsset) {
				const texHandle = createTexture(texAsset);
				MaterialManager.SetTexture(
					matHandle,
					ShaderProperties.OcclusionMap,
					texHandle,
				);

				MaterialManager.SetFloat(
					matHandle,
					ShaderProperties.OcclusionStrength,
					materialAsset.occlusionStrength,
				);
			}
		}

		if (materialAsset.roughnessMap || materialAsset.metalnessMap) {
			const texAsset = assetRecord.get(
				materialAsset.roughnessMap || materialAsset.metalnessMap,
			) as any;

			if (texAsset) {
				const texHandle = createTexture(texAsset);
				MaterialManager.SetTexture(
					matHandle,
					ShaderProperties.RoughnessMap,
					texHandle,
				);
			}
		}

		MaterialManager.SetFloat(
			matHandle,
			ShaderProperties.Metalness,
			materialAsset.metalness,
		);

		MaterialManager.SetFloat(
			matHandle,
			ShaderProperties.Roughness,
			materialAsset.roughness,
		);

		MaterialManager.SetAlphaMode(matHandle, materialAsset.alphaMode);
		MaterialManager.SetFloat(
			matHandle,
			ShaderProperties.AlphaCutoff,
			materialAsset.alphaCutoff,
		);

		MaterialManager.SetFloat(
			matHandle,
			ShaderProperties.Culling,
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

				RenderableManager.SetMesh(currEntity, meshHandle);

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
			}
		}

		const light = lights.get(entity);
		if (light) {
			LightManager.Create(currEntity, light.lightType);
			LightManager.SetColor(
				currEntity,
				vec3.fromValues(light.color.x, light.color.y, light.color.z),
			);
			LightManager.SetCullingMask(currEntity, light.cullingMask);
			LightManager.SetIntensity(currEntity, light.intensity);
			LightManager.SetRange(currEntity, light.range);
			LightManager.SetShadows(currEntity, light.shadows);

			if (light.lightType == LightType.Spot)
				LightManager.SetSpotAngle(currEntity, light.spotAngle);
		}

		const camera = cameras.get(entity);
		if (camera) {
			CameraManager.Create(currEntity);
			CameraManager.SetCullingMask(currEntity, camera.cullingMask);

			if (camera.projectionType == 0) {
				CameraManager.SetProjection(
					currEntity,
					0,
					camera.projectionFov,
					camera.projectionAspectRatio,
					camera.projectionNear,
					camera.projectionFar,
				);
			} else {
				CameraManager.SetOrthographic(
					currEntity,
					camera.orthoLeft,
					camera.orthoRight,
					camera.orthoBottom,
					camera.orthoTop,
					camera.orthoNear,
					camera.orthoFar,
				);
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
						break;
					}
				}
			});
		}

		const rigidbody = rigidbodies.get(entity);
		if (rigidbody) {
			RigidbodyManager.Create(currEntity);
			RigidbodyManager.SetAngularDamping(currEntity, rigidbody.angularDamping);
			RigidbodyManager.SetIsKinematic(currEntity, rigidbody.isKinematic);
			RigidbodyManager.SetLinearDamping(currEntity, rigidbody.linearDamping);
			RigidbodyManager.SetMass(currEntity, rigidbody.mass);
			RigidbodyManager.SetUseGravity(currEntity, rigidbody.useGravity);
		}

		const grabble = grabbles.get(entity);
		if (grabble) {
			GrabInteractableManager.Create(currEntity);

			GrabInteractableManager.SetThrowOnDetach(
				currEntity,
				grabble.throwOnDetach,
			);
			GrabInteractableManager.SetTrackPosition(
				currEntity,
				grabble.trackPosition,
			);
			GrabInteractableManager.SetTrackRotation(
				currEntity,
				grabble.trackRotation,
			);
			GrabInteractableManager.SetTrackScale(currEntity, grabble.trackScale);

			if (grabble.attachEntity) {
				GrabInteractableManager.SetAttachEntity(
					currEntity,
					entityMap.get(grabble.attachEntity)!,
				);
			}
		}
	}

	return sceneGraph;
}
