import { Entity } from "../entity";
import { User } from "../user";
import { RpcClient } from "../rpc";
import { vec3 } from "gl-matrix";

export type Collider = number;

export class ColliderManager {
	static CreateBox(...args: [entity: Entity]) {
		return RpcClient.Call<Collider>("Collider::CreateBox", ...args);
	}

	static CreateSphere(...args: [entity: Entity]) {
		return RpcClient.Call<Collider>("Collider::CreateSphere", ...args);
	}

	static CreateCapsule(...args: [entity: Entity]) {
		return RpcClient.Call<Collider>("Collider::CreateCapsule", ...args);
	}

	static Destroy(...args: [entity: Entity, collider: Collider]) {
		return RpcClient.Call<boolean>("Collider::Destroy", ...args);
	}

	static HasComponent(...args: [entity: Entity, collider: Collider]) {
		return RpcClient.Call<boolean>("Collider::HasComponent", ...args);
	}

	static GetEntity(...args: [collider: Collider]) {
		return RpcClient.Call<Entity>("Collider::GetEntity", ...args);
	}

	static GetAllColliders(...args: [entity: Entity]) {
		return RpcClient.Call<Collider[]>("Collider::GetAllColliders", ...args);
	}

	static GetBoxColliderCenter(...args: [collider: Collider]) {
		return RpcClient.Call<vec3>("Collider::GetBoxColliderCenter", ...args);
	}

	static SetBoxColliderCenter(...args: [collider: Collider, center: vec3]) {
		return RpcClient.Call<void>("Collider::SetBoxColliderCenter", ...args);
	}

	static GetBoxColliderSize(...args: [collider: Collider]) {
		return RpcClient.Call<vec3>("Collider::GetBoxColliderSize", ...args);
	}

	static SetBoxColliderSize(...args: [collider: Collider, size: vec3]) {
		return RpcClient.Call<void>("Collider::SetBoxColliderSize", ...args);
	}

	static async GetSphereColliderCenter(...args: [collider: Collider]) {
		return RpcClient.Call<vec3>("Collider::GetSphereColliderCenter", ...args);
	}

	static SetSphereColliderCenter(...args: [collider: Collider, center: vec3]) {
		return RpcClient.Call<void>("Collider::SetSphereColliderCenter", ...args);
	}

	static GetSphereColliderRadius(...args: [collider: Collider]) {
		return RpcClient.Call<number>("Collider::GetSphereColliderRadius", ...args);
	}

	static SetSphereColliderRadius(
		...args: [collider: Collider, radius: number]
	) {
		return RpcClient.Call<void>("Collider::SetSphereColliderRadius", ...args);
	}

	static GetCapsuleColliderCenter(...args: [collider: Collider]) {
		return RpcClient.Call<vec3>("Collider::GetCapsuleColliderCenter", ...args);
	}

	static SetCapsuleColliderCenter(...args: [collider: Collider, center: vec3]) {
		return RpcClient.Call<void>("Collider::SetCapsuleColliderCenter", ...args);
	}

	static GetCapsuleColliderRadius(...args: [collider: Collider]) {
		return RpcClient.Call<number>(
			"Collider::GetCapsuleColliderRadius",
			...args,
		);
	}

	static SetCapsuleColliderRadius(
		...args: [collider: Collider, radius: number]
	) {
		return RpcClient.Call<void>("Collider::SetCapsuleColliderRadius", ...args);
	}

	static GetCapsuleColliderHeight(...args: [collider: Collider]) {
		return RpcClient.Call<number>(
			"Collider::GetCapsuleColliderHeight",
			...args,
		);
	}

	static SetCapsuleColliderHeight(
		...args: [collider: Collider, height: number]
	) {
		return RpcClient.Call<void>("Collider::SetCapsuleColliderHeight", ...args);
	}

	static GetIsTrigger(...args: [collider: Collider]) {
		return RpcClient.Call<boolean>("Collider::GetIsTrigger", ...args);
	}

	static SetIsTrigger(...args: [collider: Collider, isTrigger: boolean]) {
		return RpcClient.Call<void>("Collider::SetIsTrigger", ...args);
	}

	static async OnTriggerEnter(
		...args: [
			entity: Entity,
			onTriggerEnter: (entity: Entity, collider: Collider) => void,
		]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnTriggerEnter",
			RpcClient.GetClientId(),
			...args,
		);
	}

	static async OnTriggerExit(
		...args: [
			entity: Entity,
			onTriggerExit: (entity: Entity, collider: Collider) => void,
		]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnTriggerExit",
			RpcClient.GetClientId(),
			...args,
		);
	}

	static async OnTriggerStay(
		...args: [
			entity: Entity,
			onTriggerStay: (entity: Entity, collider: Collider) => void,
		]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnTriggerStay",
			RpcClient.GetClientId(),
			...args,
		);
	}

	static async OnCollisionEnter(
		...args: [
			entity: Entity,
			onCollisionEnter: (entity: Entity, collider: Collider) => void,
		]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnCollisionEnter",
			RpcClient.GetClientId(),
			...args,
		);
	}

	static async OnCollisionExit(
		...args: [
			entity: Entity,
			onCollisionExit: (entity: Entity, collider: Collider) => void,
		]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnCollisionExit",
			RpcClient.GetClientId(),
			...args,
		);
	}

	static async OnCollisionStay(
		...args: [
			entity: Entity,
			onCollisionStay: (entity: Entity, collider: Collider) => void,
		]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnCollisionStay",
			RpcClient.GetClientId(),
			...args,
		);
	}

	static async OnUserTriggerEnter(
		...args: [entity: Entity, onUserTriggerEnter: (user: User) => void]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnUserTriggerEnter",
			RpcClient.GetClientId(),
			args[0],
			(userId: string) => args[1](new User(userId)),
		);
	}

	static async OnUserTriggerExit(
		...args: [entity: Entity, onUserTriggerExit: (user: User) => void]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnUserTriggerExit",
			RpcClient.GetClientId(),
			args[0],
			(userId: string) => args[1](new User(userId)),
		);
	}

	static async OnUserTriggerStay(
		...args: [entity: Entity, onUserTriggerStay: (user: User) => void]
	) {
		return RpcClient.Call<boolean>(
			"Collider::OnUserTriggerStay",
			RpcClient.GetClientId(),
			args[0],
			(userId: string) => args[1](new User(userId)),
		);
	}
}
