import { quat, vec3 } from "gl-matrix";
import { Entity } from "./entity";

/**
 * TODO: need to return player?
 * grabble on select
 * trigger: on collider
 */

export class Player {
	#playerId: number = -1;

	GetHeadEntity(): Entity {
		return 0;
	}
	GetLeftHandEntity(): Entity {
		return 0;
	}
	GetRightHandEntity(): Entity {
		return 0;
	}
	GetPlayerRootEntity(): Entity {
		return 0;
	}

	GetPlayerWorldPosition(): vec3 {
		return vec3.fromValues(0, 0, 0);
	}
	GetPlayerWorldRotation(): quat {
		return quat.fromValues(0, 0, 0, 0);
	}

	IsValid(): boolean {
		return false;
	}
	IsLocal(): boolean {
		return true;
	}
	IsUserInVR(): boolean {
		return false;
	}
	IsMenuOpen(): boolean {
		return false;
	}
	IsGrounded(): boolean {
		return false;
	}
	IsFlying(): boolean {
		return false;
	}

	SetEnableFly(value: boolean) {}
	GetEnableFly(): boolean {
		return false;
	}

	SetEnableLocomotion(value: boolean) {}
	GetEnableLocomotion(): boolean {
		return false;
	}
	TeleportTo(worldPosition: vec3, worldRotation: quat): void {}

	GetMoveSpeed(): number {
		return 0;
	}
	SetMoveSpeed(speed: number): void {}

	GetJumpImpulse(): number {
		return 0;
	}
	SetJumpImpulse(impulse: number) {}

	GetGravityStrength(): number {
		return 0;
	}
	SetGravityStrength(strength: number) {}

	GetPlayerInfo() {}
	GetPlayerId(): number {
		return this.#playerId;
	}

	OnPlayerTriggerEnter() {}
	OnPlayerTriggerStay() {}
	OnPlayerTriggerExit() {}

	static GetPlayers(): Player[] {
		return [];
	}
	static GetPlayerById(playerId: number): Player | undefined {
		return undefined;
	}
}
