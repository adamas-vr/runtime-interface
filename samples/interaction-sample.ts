import { EntityManager } from "@adamas/entity";
import { GrabInteractableManager } from "@adamas/interaction/interaction";
import { StateSync } from "@adamas/networking/state-sync";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { NewCubeMesh } from "@adamas/render/primitives";
import { RenderableManager } from "@adamas/render/renderable";
import { TransformManager } from "@adamas/render/transform";
import { quat, vec3, vec4 } from "gl-matrix";

export const createLocalGrabble = () => {
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

	GrabInteractableManager.AddActivatedCallback(
		entity,
		(interactableEntity, interactorEntity) => {
			console.log(
				"AddActivatedCallback called",
				"interactableEntity",
				interactableEntity,
				"interactorEntity",
				interactorEntity,
			);
		},
	);

	GrabInteractableManager.AddDeactivatedCallback(
		entity,
		(interactableEntity, interactorEntity) => {
			console.log(
				"AddDeactivatedCallback called",
				"interactableEntity",
				interactableEntity,
				"interactorEntity",
				interactorEntity,
			);
		},
	);
	GrabInteractableManager.AddSelectEnteredCallback(
		entity,
		(interactableEntity, interactorEntity) => {
			console.log(
				"AddSelectEnteredCallback called",
				"interactableEntity",
				interactableEntity,
				"interactorEntity",
				interactorEntity,
			);
		},
	);
	GrabInteractableManager.AddSelectExitedCallback(
		entity,
		(interactableEntity, interactorEntity) => {
			console.log(
				"AddSelectExitedCallback called",
				"interactableEntity",
				interactableEntity,
				"interactorEntity",
				interactorEntity,
			);
		},
	);
};

export const createNetworkGrabble = () => {
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

	const playerId = StateSync.GetPlayerId();
	let networkProp = StateSync.CreateNetworkState(
		"_internal::networkFollower",
		{
			grabbingClient: -1,
			position: vec3.fromValues(0, 0, 0),
			rotation: quat.identity(quat.fromValues(1, 0, 0, 0)),
			time: "",
		},
		(prop, value) => {
			if (networkProp.grabbingClient != playerId) {
				console.log(`prop: ${prop}; value: ${value}`);
				TransformManager.SetLocalPosition(entity, networkProp.position);
				TransformManager.SetLocalRotation(entity, networkProp.rotation);
			}
		},
	);

	GrabInteractableManager.AddSelectEnteredCallback(
		entity,
		(interactable, interactor) => {
			networkProp.grabbingClient = playerId;
		},
	);

	GrabInteractableManager.AddSelectExitedCallback(
		entity,
		(interactable, interactor) => {
			if (networkProp.grabbingClient == playerId) {
				networkProp.grabbingClient = -1;
			}
		},
	);

	setInterval(() => {
		if (networkProp.grabbingClient == playerId) {
			networkProp.position = TransformManager.GetLocalPosition(entity);
			networkProp.rotation = TransformManager.GetLocalRotation(entity);
			networkProp.time = new Date().toISOString();
		}
	}, 200);
};
