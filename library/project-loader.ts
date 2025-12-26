import { quat, vec3, vec4 } from "gl-matrix";
import { TransformManager } from "./render/transform";
import { Entity, EntityManager } from "./entity";
import { MeshManager } from "./render/mesh";
import { RenderableManager } from "./render/renderable";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "./render/material";
import { TextureFormat, TextureManager } from "./render/texture";
import { LightManager, LightType } from "./render/light";
import { ColliderManager } from "./physics/collider";
import { CameraManager } from "./render/camera";
import { RigidbodyManager } from "./physics/rigidbody";
import { GrabInteractableManager } from "./interaction/interaction";
import { RpcClient } from "./rpc";

export const LoadProject = async (
	assetRecord: Map<string, object>,
	projectFile: any,
) => {
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

	type Properties = {
		componentType: string;
		name: string;
	};
	type Transforms = {
		componentType: string;
		parent: string;
		children: string[];
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
						x: number;
						y: number;
						z: number;
					};
					size: {
						x: number;
						y: number;
						z: number;
					};
					radius?: undefined;
					height?: undefined;
			  }
			| {
					isTrigger: boolean;
					colliderType: string;
					center: {
						x: number;
						y: number;
						z: number;
					};
					radius: number;
					size?: undefined;
					height?: undefined;
			  }
			| {
					isTrigger: boolean;
					colliderType: string;
					center: {
						x: number;
						y: number;
						z: number;
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

	const scene = projectFile.scene;
	const properties = new Map(scene.properties.value as [string, Properties][]);
	const transforms = new Map(scene.transforms.value as [string, Transforms][]);
	const renderables = new Map(
		scene.renderables.value as [string, Renderables][],
	);
	const lights = new Map(scene.lights.value as [string, Lights][]);
	const cameras = new Map(scene.cameras.value as [string, Cameras][]);
	const colliders = new Map(scene.colliders.value as [string, Colliders][]);
	const rigidbodies = new Map(
		scene.rigidbodies.value as [string, Rigidbodies][],
	);
	const grabbles = new Map(scene.grabbles.value as [string, Grabbles][]);

	const entityMap = new Map<string, Entity>();
	for (const entity of scene.entities.value) {
		const property = properties.get(entity)!;
		const entityId = EntityManager.Create(property.name);
		entityMap.set(entity, entityId);
	}

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
					transform.localRotation.value.x,
					transform.localRotation.value.y,
					transform.localRotation.value.z,
					"xyz", // TODO: needs to be tested
				),
			);
		} else {
			throw Error(`Data corrupted. Entity ${entity} has no transform`);
		}

		const applyMaterial = (materialAsset: any, index: number) => {
			const matHandle = MaterialManager.Create(ShaderType.URP_LIT);
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
				const texHandle = TextureManager.Create2D(1, 1, TextureFormat.RGBA32);
				const texAsset = assetRecord.get(materialAsset.baseColorMap) as any;

				TextureManager.LoadImageBase64(texHandle, texAsset.base64Image);
				MaterialManager.SetTexture(
					matHandle,
					ShaderProperties.BaseColorMap,
					texHandle,
				);
			}

			if (materialAsset.normalMap) {
				const texHandle = TextureManager.Create2D(1, 1, TextureFormat.RGBA32);
				const texAsset = assetRecord.get(materialAsset.normalMap) as any;

				TextureManager.LoadImageBase64(texHandle, texAsset.base64Image);
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

			MaterialManager.SetColor(
				matHandle,
				ShaderProperties.Emission,
				vec4.fromValues(
					materialAsset.emissionColor.x,
					materialAsset.emissionColor.y,
					materialAsset.emissionColor.z,
					1,
				),
			);
			if (materialAsset.emissionMap) {
				const texHandle = TextureManager.Create2D(1, 1, TextureFormat.RGBA32);
				const texAsset = assetRecord.get(materialAsset.emissionMap) as any;

				TextureManager.LoadImageBase64(texHandle, texAsset.base64Image);
				MaterialManager.SetTexture(
					matHandle,
					ShaderProperties.EmissionMap,
					texHandle,
				);
			}

			if (materialAsset.occlusionMap) {
				const texHandle = TextureManager.Create2D(1, 1, TextureFormat.RGBA32);
				const texAsset = assetRecord.get(materialAsset.occlusionMap) as any;

				TextureManager.LoadImageBase64(texHandle, texAsset.base64Image);
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

			RenderableManager.SetMaterial(currEntity, matHandle);

			if (materialAsset.roughnessMap || materialAsset.metalnessMap) {
				const texHandle = TextureManager.Create2D(1, 1, TextureFormat.RGBA32);
				const texAsset = assetRecord.get(
					materialAsset.roughnessMap || materialAsset.metalnessMap,
				) as any;

				TextureManager.LoadImageBase64(texHandle, texAsset.base64Image);
				MaterialManager.SetTexture(
					matHandle,
					ShaderProperties.RoughnessMap,
					texHandle,
				);
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

			RenderableManager.SetMaterial(currEntity, matHandle, index);
		};

		const renderable = renderables.get(entity);
		if (renderable && renderable.mesh) {
			RenderableManager.Create(currEntity);

			const meshAsset = assetRecord.get(renderable.mesh) as any;

			if (meshAsset) {
				const mesh = RpcClient.Call("Internal:Mesh_Create", {
					clientId: RpcClient.GetClientId(),
					meshAsset: JSON.stringify(meshAsset),
				});

				RenderableManager.SetMesh(currEntity, mesh);
				RenderableManager.SetCulling(currEntity, renderable.culling);
			}

			renderable.materialList.forEach((m, idx) => {
				const material = assetRecord.get(m) as any;
				if (material) applyMaterial(material, idx);
			});
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
							vec3.fromValues(c.center.x, c.center.y, c.center.z),
						);
						ColliderManager.SetBoxColliderSize(
							handle,
							vec3.fromValues(c.size!.x, c.size!.y, c.size!.z),
						);
						break;
					}
					case "Sphere": {
						const handle = ColliderManager.CreateSphere(currEntity);
						ColliderManager.SetSphereColliderCenter(
							handle,
							vec3.fromValues(c.center.x, c.center.y, c.center.z),
						);
						ColliderManager.SetSphereColliderRadius(handle, c.radius!);
						break;
					}
					case "Capsule": {
						const handle = ColliderManager.CreateCapsule(currEntity);
						ColliderManager.SetCapsuleColliderCenter(
							handle,
							vec3.fromValues(c.center.x, c.center.y, c.center.z),
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
};
