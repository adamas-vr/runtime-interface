import { EntityManager, Entity } from "@adamas/entity";
import { RenderableManager } from "@adamas/render/renderable";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { importGltfAndRender } from "@adamas/utilities/gltfImporter";
import { TransformManager } from "@adamas/render/transform";
import { NewCubeMesh } from "@adamas/render/primitives";
import { vec3, vec4 } from "gl-matrix";

export const renderGltf = (path: string = "./prefabs/rusk.glb") => {
	importGltfAndRender(path).catch(console.error);
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
