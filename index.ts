import { Entity } from "@adamas/entity";

import { GrabInteractableManager } from "@adamas/interaction/interaction";
import { ColliderManager, ColliderHandle } from "@adamas/physics/collider";
import { RigidbodyManager } from "@adamas/physics/rigidbody";
import { TransformManager } from "@adamas/render/transform";
import { vec3 } from "@adamas/gl-matrix";
import { cameraRenderTexture, renderGltf } from "samples/rendering-sample";

const heartModel = async () => {
	const modelEntity: Entity = await renderGltf("realistic_human_heart.glb");
	TransformManager.SetLocalPosition(modelEntity, vec3.fromValues(1, 1, 0));
	TransformManager.SetLocalScale(modelEntity, vec3.fromValues(0.2, 0.2, 0.2));
	RigidbodyManager.Create(modelEntity);
	RigidbodyManager.SetIsKinematic(modelEntity, true);
	RigidbodyManager.SetUseGravity(modelEntity, false);
	const collider = ColliderManager.CreateCapsule(modelEntity);
	ColliderManager.SetCapsuleColliderRadius(collider, 1.0);
	ColliderManager.SetCapsuleColliderHeight(collider, 3.0);
	GrabInteractableManager.Create(modelEntity);
};

const surgerySim = async () => {
	const modelEntity: Entity = await renderGltf("hospital-bed.glb");
	TransformManager.SetLocalPosition(modelEntity, vec3.fromValues(0, 0.5, 0));
};

surgerySim();

// cameraRenderTexture();
// heartModel();

console.log(process.cwd());
setInterval(() => {
	console.log("Ticked!");
}, 30000);
