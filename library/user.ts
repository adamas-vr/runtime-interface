/**
 * APIs for working with users.
 *
 * @module user
 */
import { quat, vec3 } from "gl-matrix";
import { Entity } from "./entity";
import { RpcClient } from "./rpc";

/**
 * Represents a user.
 */
export class User {
	/**
	 * Creates a user instance.
	 *
	 * @param userId - The user ID.
	 */
	constructor(private userId: string) {}

	/**
	 * Gets the local user.
	 *
	 * @returns A promise that resolves to the local {@link User}.
	 */
	static async GetLocalUser() {
		return new User(await RpcClient.Call<string>("UserAPI::GetLocalUser"));
	}

	/**
	 * Gets all users.
	 *
	 * @returns A promise that resolves to the list of {@link User} instances.
	 */
	static async GetUsers() {
		const userIds = await RpcClient.Call<string[]>("UserAPI::GetUsers");
		return userIds.map((userId) => new User(userId));
	}

	/**
	 * Gets the user ID.
	 *
	 * @returns The user ID.
	 */
	GetUserId(): string {
		return this.userId;
	}

	/**
	 * Gets the head entity of the user.
	 *
	 * @returns A promise that resolves to the head {@link Entity}.
	 */
	GetHeadEntity() {
		return RpcClient.Call<Entity>("UserAPI::GetHeadEntity", this.userId);
	}

	/**
	 * Gets the left hand entity of the user.
	 *
	 * @returns A promise that resolves to the left hand {@link Entity}.
	 */
	GetLeftHandEntity() {
		return RpcClient.Call<Entity>("UserAPI::GetLeftHandEntity", this.userId);
	}

	/**
	 * Gets the right hand entity of the user.
	 *
	 * @returns A promise that resolves to the right hand {@link Entity}.
	 */
	GetRightHandEntity() {
		return RpcClient.Call<Entity>("UserAPI::GetRightHandEntity", this.userId);
	}

	/**
	 * Gets the origin entity of the user.
	 *
	 * @returns A promise that resolves to the origin {@link Entity}.
	 */
	GetOriginEntity() {
		return RpcClient.Call<Entity>("UserAPI::GetOriginEntity", this.userId);
	}

	/**
	 * Sets whether locomotion is enabled for the user.
	 *
	 * @param value - Whether locomotion is enabled.
	 * @returns A promise that resolves when the locomotion setting has been
	 * changed.
	 */
	SetEnableLocomotion(value: boolean) {
		return RpcClient.Call<void>(
			"UserAPI::SetEnableLocomotion",
			this.userId,
			value,
		);
	}

	/**
	 * Gets whether locomotion is enabled for the user.
	 *
	 * @returns A promise that resolves to `true` if locomotion is enabled, or
	 * `false` otherwise.
	 */
	GetEnableLocomotion() {
		return RpcClient.Call<boolean>("UserAPI::GetEnableLocomotion", this.userId);
	}

	/**
	 * Teleports the user to a world position and rotation.
	 *
	 * @param worldPosition - The destination world position.
	 * @param worldRotation - The destination world rotation.
	 * @returns A promise that resolves when the user has been teleported.
	 */
	TeleportTo(worldPosition: vec3, worldRotation: quat) {
		return RpcClient.Call<void>(
			"UserAPI::TeleportTo",
			this.userId,
			worldPosition,
			worldRotation,
		);
	}

	/**
	 * Gets the world position of the user.
	 *
	 * @returns A promise that resolves to the user world position.
	 */
	GetUserWorldPosition() {
		return RpcClient.Call<vec3>("UserAPI::GetUserWorldPosition", this.userId);
	}

	/**
	 * Gets the world rotation of the user as a quaternion.
	 *
	 * @returns A promise that resolves to the user world rotation.
	 */
	GetUserWorldRotation() {
		return RpcClient.Call<quat>("UserAPI::GetUserWorldRotation", this.userId);
	}

	/**
	 * Checks whether the user is valid.
	 *
	 * A referenced user may become invalid after leaving a network session.
	 *
	 * @returns A promise that resolves to `true` if the user is valid, or `false`
	 * otherwise.
	 */
	IsValid() {
		return RpcClient.Call<boolean>("UserAPI::IsValid", this.userId);
	}

	/**
	 * Checks whether the user is the local user.
	 *
	 * Remote users in a network session are not local users.
	 *
	 * @returns A promise that resolves to `true` if the user is the local user, or
	 * `false` otherwise.
	 */
	IsLocal() {
		return RpcClient.Call<boolean>("UserAPI::IsLocal", this.userId);
	}

	/**
	 * Checks whether the user is in VR mode.
	 *
	 * Users in PC mode return `false`.
	 *
	 * @returns A promise that resolves to `true` if the user is in VR mode, or
	 * `false` otherwise.
	 */
	IsVRMode() {
		return RpcClient.Call<boolean>("UserAPI::IsVRMode", this.userId);
	}

	/**
	 * Checks whether the user menu is open.
	 *
	 * @returns A promise that resolves to `true` if the user menu is open, or
	 * `false` otherwise.
	 */
	IsMenuOpen() {
		return RpcClient.Call<boolean>("UserAPI::IsMenuOpen", this.userId);
	}

	/**
	 * Checks whether the user is grounded.
	 *
	 * @returns A promise that resolves to `true` if the user is grounded, or
	 * `false` otherwise.
	 */
	IsGrounded() {
		return RpcClient.Call<boolean>("UserAPI::IsGrounded", this.userId);
	}

	/**
	 * Checks whether the user is flying.
	 *
	 * @returns A promise that resolves to `true` if the user is flying, or `false`
	 * otherwise.
	 */
	IsFlying() {
		return RpcClient.Call<boolean>("UserAPI::IsFlying", this.userId);
	}

	/**
	 * Gets the move speed of the user.
	 *
	 * @returns A promise that resolves to the move speed in meters per second.
	 */
	GetMoveSpeed() {
		return RpcClient.Call<number>("UserAPI::GetMoveSpeed", this.userId);
	}

	/**
	 * Sets the move speed of the user.
	 *
	 * @param speed - The move speed in meters per second.
	 * @returns A promise that resolves when the move speed has been changed.
	 */
	SetMoveSpeed(speed: number) {
		return RpcClient.Call<void>("UserAPI::SetMoveSpeed", this.userId, speed);
	}

	/**
	 * Gets the jump velocity of the user.
	 *
	 * @returns A promise that resolves to the jump velocity in meters per second.
	 */
	GetJumpVelocity() {
		return RpcClient.Call<number>("UserAPI::GetJumpVelocity", this.userId);
	}

	/**
	 * Sets the jump velocity of the user.
	 *
	 * @param velocity - The jump velocity in meters per second.
	 * @returns A promise that resolves when the jump velocity has been changed.
	 */
	SetJumpVelocity(velocity: number) {
		return RpcClient.Call<void>(
			"UserAPI::SetJumpVelocity",
			this.userId,
			velocity,
		);
	}

	/**
	 * Gets the gravity strength of the user.
	 *
	 * The final gravity applied to the user is calculated by multiplying this
	 * value by the default Earth gravity.
	 *
	 * @returns A promise that resolves to the gravity strength.
	 */
	GetGravityStrength() {
		return RpcClient.Call<number>("UserAPI::GetGravityStrength", this.userId);
	}

	/**
	 * Sets the gravity strength of the user.
	 *
	 * The final gravity applied to the user is calculated by multiplying this
	 * value by the default Earth gravity.
	 *
	 * @param strength - The gravity strength.
	 * @returns A promise that resolves when the gravity strength has been changed.
	 */
	SetGravityStrength(strength: number) {
		return RpcClient.Call<void>(
			"UserAPI::SetGravityStrength",
			this.userId,
			strength,
		);
	}
}
