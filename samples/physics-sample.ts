import { Entity, EntityManager } from "@adamas/entity";
import { ColliderManager, ColliderHandle } from "@adamas/physics/collider";
import { RigidbodyManager } from "@adamas/physics/rigidbody";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { NewCubeMesh } from "@adamas/render/primitives";
import { RenderableManager } from "@adamas/render/renderable";
import { TransformManager } from "@adamas/render/transform";
import { quat, vec3, vec4 } from "gl-matrix";

export const createColliders = () => {
	const entity = EntityManager.Create("Box collider test");
	TransformManager.SetLocalPosition(entity, vec3.fromValues(0, 2, 0));

	RenderableManager.Create(entity);
	RenderableManager.SetMesh(entity, NewCubeMesh());
	const material = MaterialManager.Create(ShaderType.URP_LIT);
	RenderableManager.SetMaterial(entity, material);
	MaterialManager.SetColor(
		material,
		ShaderProperties.BaseColor,
		vec4.fromValues(0.2, 0.6, 0.6, 1.0),
	);

	const collider: ColliderHandle = ColliderManager.CreateCapsule(entity);
	RigidbodyManager.Create(entity);
	RigidbodyManager.SetIsKinematic(entity, true);
	RigidbodyManager.SetUseGravity(entity, false);

	setInterval(() => {
		const center = ColliderManager.GetCapsuleColliderCenter(collider);
		console.log("GetcolliderCenter", center);
		center[1] += 1.4;
		ColliderManager.SetCapsuleColliderCenter(collider, center);
	}, 3000);
};
