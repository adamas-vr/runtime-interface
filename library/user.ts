import { quat, vec3 } from "gl-matrix";
import { Entity } from "./entity";
import { RpcClient } from "./rpc";

export class User {
	constructor(private userId: string) {}

	/**
	 * Get local user that logs into the account.
	 * @returns local user ID
	 */
	static async GetLocalUser() {
		return new User(await RpcClient.Call<string>("UserAPI::GetLocalUser"));
	}

	static async GetUsers() {
		const userIds = await RpcClient.Call<string[]>("UserAPI::GetUsers");
		return userIds.map((userId) => new User(userId));
	}

	GetUserId(): string {
		return this.userId;
	}

	GetHeadEntity() {
		return RpcClient.Call<Entity>("UserAPI::GetHeadEntity", this.userId);
	}

	GetLeftHandEntity() {
		return RpcClient.Call<Entity>("UserAPI::GetLeftHandEntity", this.userId);
	}

	GetRightHandEntity() {
		return RpcClient.Call<Entity>("UserAPI::GetRightHandEntity", this.userId);
	}

	GetOriginEntity() {
		return RpcClient.Call<Entity>("UserAPI::GetOriginEntity", this.userId);
	}

	SetEnableLocomotion(value: boolean) {
		return RpcClient.Call<void>(
			"UserAPI::SetEnableLocomotion",
			this.userId,
			value,
		);
	}

	GetEnableLocomotion() {
		return RpcClient.Call<boolean>("UserAPI::GetEnableLocomotion", this.userId);
	}

	TeleportTo(...args: [worldPosition: vec3, worldRotation: quat]) {
		return RpcClient.Call<void>("UserAPI::TeleportTo", this.userId, ...args);
	}

	GetUserWorldPosition() {
		return RpcClient.Call<vec3>("UserAPI::GetUserWorldPosition", this.userId);
	}

	GetUserWorldRotation() {
		return RpcClient.Call<quat>("UserAPI::GetUserWorldRotation", this.userId);
	}

	IsValid() {
		return RpcClient.Call<boolean>("UserAPI::IsValid", this.userId);
	}

	IsLocal() {
		return RpcClient.Call<boolean>("UserAPI::IsLocal", this.userId);
	}

	IsVRMode() {
		return RpcClient.Call<boolean>("UserAPI::IsVRMode", this.userId);
	}

	IsMenuOpen() {
		return RpcClient.Call<boolean>("UserAPI::IsMenuOpen", this.userId);
	}

	IsGrounded() {
		return RpcClient.Call<boolean>("UserAPI::IsGrounded", this.userId);
	}

	IsFlying() {
		return RpcClient.Call<boolean>("UserAPI::IsFlying", this.userId);
	}

	GetMoveSpeed() {
		return RpcClient.Call<number>("UserAPI::GetMoveSpeed", this.userId);
	}

	SetMoveSpeed(...args: [speed: number]) {
		return RpcClient.Call<void>("UserAPI::SetMoveSpeed", this.userId, ...args);
	}

	GetJumpVelocity() {
		return RpcClient.Call<number>("UserAPI::GetJumpVelocity", this.userId);
	}

	SetJumpVelocity(...args: [velocity: number]) {
		return RpcClient.Call<void>(
			"UserAPI::SetJumpVelocity",
			this.userId,
			...args,
		);
	}

	GetGravityStrength() {
		return RpcClient.Call<number>("UserAPI::GetGravityStrength", this.userId);
	}

	SetGravityStrength(strength: number) {
		return RpcClient.Call<void>(
			"UserAPI::SetGravityStrength",
			this.userId,
			strength,
		);
	}
}
