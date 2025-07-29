import { EntityManager } from "@adamas/entity";
import { GrabInteractableManager } from "@adamas/interaction/interaction";
import { StateSync } from "@adamas/networking/state-sync";
import { CameraManager } from "@adamas/render/camera";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { NewCubeMesh, NewQuadMesh } from "@adamas/render/primitives";
import { RenderableManager } from "@adamas/render/renderable";
import { TextureFormat, TextureManager } from "@adamas/render/texture";
import { TransformManager } from "@adamas/render/transform";
import { vec3, vec4 } from "gl-matrix";

console.log(process.cwd());
setInterval(() => {
	console.log("Ticked!");
}, 30000);

const createLocalGrabble = () => {
	const entity = EntityManager.Create("network interactable");
	TransformManager.SetLocalPosition(entity, vec3.fromValues(0, 3, 0));
	const grabComp = GrabInteractableManager.Create(entity);
	const renderComp = RenderableManager.Create(entity);
	RenderableManager.SetMesh(entity, NewCubeMesh());
	const material = MaterialManager.Create(ShaderType.URP_LIT);
	RenderableManager.SetMaterial(entity, material);
	MaterialManager.SetColor(
		material,
		ShaderProperties.BaseColor,
		vec4.fromValues(0.2, 1.0, 0.2, 1.0),
	);

	GrabInteractableManager.AddActivatedCallback(entity, () => {
		console.log("AddActivatedCallback called");
	});

	GrabInteractableManager.AddDeactivatedCallback(entity, () => {
		console.log("AddDeactivatedCallback called");
	});
	GrabInteractableManager.AddSelectEnteredCallback(entity, () => {
		console.log("AddSelectEnteredCallback called");
	});
	GrabInteractableManager.AddSelectExitedCallback(entity, () => {
		console.log("AddSelectExitedCallback called");
	});
};

createLocalGrabble();
