import { quat, vec3 } from "gl-matrix";
import { Entity } from "./entity";
import { RpcClient } from "./rpc";

/**
 * TODO: need tests: here, and collider user trigger, and networking user joined/left
 */
export class User {
	constructor(private userId: string) {}

	/**
	 * Get local user that logs into the account.
	 * @returns local user ID
	 */
	static GetLocalUser(): User {
		return new User(RpcClient.Call("UserAPI::GetLocalUser", {}));
	}

	static GetUsers(): User[] {
		const userIds = RpcClient.Call("UserAPI::GetUsers", {}) as string[];
		return userIds.map((userId) => new User(userId));
	}

	GetUserId(): string {
		return this.userId;
	}

	GetHeadEntity(): Entity {
		return 0;
	}
	GetLeftHandEntity(): Entity {
		return 0;
	}
	GetRightHandEntity(): Entity {
		return 0;
	}
	GetUserRootEntity(): Entity {
		return 0;
	}

	SetEnableLocomotion(value: boolean): void {
		RpcClient.Call("UserAPI::SetEnableLocomotion", {
			userId: this.userId,
			value,
		});
	}
	GetEnableLocomotion(): boolean {
		return RpcClient.Call("UserAPI::GetEnableLocomotion", {
			userId: this.userId,
		}) as boolean;
	}
	TeleportTo(worldPosition: vec3, worldRotation: quat): void {
		RpcClient.Call("UserAPI::TeleportTo", {
			userId: this.userId,
			worldPosition: JSON.stringify(worldPosition),
			worldRotation: JSON.stringify(worldRotation),
		});
	}
	GetUserWorldPosition(): vec3 {
		const pos = RpcClient.Call("UserAPI::GetUserWorldPosition", {
			userId: this.userId,
		});
		return pos.fromValues(pos[0], pos[1], pos[2]);
	}
	GetUserWorldRotation(): quat {
		const rot = RpcClient.Call("UserAPI::GetUserWorldRotation", {
			userId: this.userId,
		});
		return quat.fromValues(rot[0], rot[1], rot[2], rot[3]);
	}

	IsValid(): boolean {
		return RpcClient.Call("UserAPI::IsValid", {
			userId: this.userId,
		}) as boolean;
	}
	IsLocal(): boolean {
		return RpcClient.Call("UserAPI::IsLocal", {
			userId: this.userId,
		}) as boolean;
	}
	IsVRMode(): boolean {
		return RpcClient.Call("UserAPI::IsVRMode", {
			userId: this.userId,
		}) as boolean;
	}
	IsMenuOpen(): boolean {
		return RpcClient.Call("UserAPI::IsMenuOpen", {
			userId: this.userId,
		}) as boolean;
	}
	IsGrounded(): boolean {
		return RpcClient.Call("UserAPI::IsGrounded", {
			userId: this.userId,
		}) as boolean;
	}
	IsFlying(): boolean {
		return RpcClient.Call("UserAPI::IsFlying", {
			userId: this.userId,
		}) as boolean;
	}

	GetMoveSpeed(): number {
		return RpcClient.Call("UserAPI::GetMoveSpeed", {
			userId: this.userId,
		}) as number;
	}
	SetMoveSpeed(speed: number): void {
		RpcClient.Call("UserAPI::SetMoveSpeed", {
			userId: this.userId,
			speed,
		});
	}
	GetJumpVelocity(): number {
		return RpcClient.Call("UserAPI::GetJumpVelocity", {
			userId: this.userId,
		}) as number;
	}
	SetJumpVelocity(velocity: number) {
		RpcClient.Call("UserAPI::GetJumpVelocity", {
			userId: this.userId,
			velocity,
		});
	}
	GetGravityStrength(): number {
		return RpcClient.Call("UserAPI::GetGravityStrength", {
			userId: this.userId,
		}) as number;
	}
	SetGravityStrength(strength: number) {
		RpcClient.Call("UserAPI::SetGravityStrength", {
			userId: this.userId,
			strength,
		});
	}
}
