import { EntityManager, Entity } from "@adamas/entity";
import { RenderableManager } from "@adamas/render/renderable";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { importGltfAndRender } from "@adamas/utilities/gltfImporter";
import { TransformManager } from "@adamas/render/transform";
import { NewCubeMesh, NewQuadMesh } from "@adamas/render/primitives";
import { CameraManager } from "@adamas/render/camera";
import { TextureFormat, TextureManager } from "@adamas/render/texture";
import { quat, vec3, vec4 } from "gl-matrix";
import { RigidbodyManager } from "@adamas/physics/rigidbody";
import { ColliderManager } from "@adamas/physics/collider";
import { GrabInteractableManager } from "@adamas/interaction/interaction";

export const renderGltf = async (path: string = "./rusk.glb") => {
	return await importGltfAndRender(path);
};

export const renderCube = () => {
	let entity: Entity = EntityManager.Create("test entity");
	console.log("entity handle", entity);

	// Create renderable component
	RenderableManager.Create(entity);

	// Create mesh and attach to renderable
	const meshHandle = NewCubeMesh();
	RenderableManager.SetMesh(entity, meshHandle);

	// Create material and attach to renderable
	const materialHandle = MaterialManager.Create(ShaderType.URP_LIT, entity);
	MaterialManager.SetColor(
		materialHandle,
		ShaderProperties.BaseColor,
		vec4.fromValues(1.0, 1.0, 1.0, 1.0),
	);

	// Play around with the transform of the entity
	TransformManager.SetLocalPosition(entity, vec3.fromValues(0, 1, 0));
	TransformManager.SetLocalScale(entity, vec3.fromValues(2, 1, 2));

	setTimeout(() => {
		console.log("Entity name: ", EntityManager.GetName(entity));
		EntityManager.SetName(entity, "updated name");
		console.log("Updated name: ", EntityManager.GetName(entity));
	}, 10000);
};

export const cameraRenderTexture = () => {
	const camEntity = EntityManager.Create("camera");
	const textureHandle = TextureManager.CreateRenderTexture(
		1920,
		1080,
		0,
		TextureFormat.RGBA32,
	);

	CameraManager.Create(camEntity);
	CameraManager.SetRenderTexture(camEntity, textureHandle);

	const displayEntity = EntityManager.Create("display");
	RenderableManager.Create(displayEntity);
	RenderableManager.SetMesh(displayEntity, NewQuadMesh());
	const materialHandle = MaterialManager.Create(ShaderType.URP_LIT);
	RenderableManager.SetMaterial(displayEntity, materialHandle);
	MaterialManager.SetTexture(
		materialHandle,
		ShaderProperties.BaseMap,
		textureHandle,
	);

	RigidbodyManager.Create(displayEntity);
	RigidbodyManager.SetIsKinematic(displayEntity, true);
	RigidbodyManager.SetUseGravity(displayEntity, false);
	const collider = ColliderManager.CreateBox(displayEntity);
	// ColliderManager.Setboxs(collider, 1.0);
	GrabInteractableManager.Create(displayEntity);

	TransformManager.SetParent(camEntity, displayEntity);
	TransformManager.SetLocalRotation(
		camEntity,
		quat.fromEuler(quat.fromValues(1, 0, 0, 0), 0, 180, 0),
	);
	TransformManager.SetLocalPosition(displayEntity, vec3.fromValues(0, 2, -1));
};
