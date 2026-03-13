import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { Texture } from "./texture";

export enum ProjectionType {
	Perspective = 0,
	Orthographic = 1,
}

export class CameraManager {
	/**
	 * Create a Camera component and attach it to the specified entity
	 * @param entity The entity to attach the camera to
	 * @returns boolean indicating success
	 */
	static Create(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Camera::Create", ...args);
	}

	/**
	 * Destroy the Camera component from the specified entity
	 * @param entity The entity to remove the camera from
	 * @returns boolean indicating success
	 */
	static Destroy(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Camera::Destroy", ...args);
	}

	/**
	 * Check if the entity has a Camera component
	 * @param entity The entity to check
	 * @returns boolean indicating if camera component exists
	 */
	static HasComponent(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Camera::HasComponent", ...args);
	}

	/**
	 * Set if the camera component is enabled
	 * @param entity The entity with the renderable component
	 * @param enabled If the camera component is enabled
	 */
	static SetEnabled(...args: [entity: Entity, enabled: boolean]) {
		return RpcClient.Call<void>("Camera::SetEnabled", ...args);
	}

	static GetEnabled(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Camera::GetEnabled", ...args);
	}

	/**
	 * Set the camera render target (targetTexture)
	 * @param entity The entity that owns the camera
	 * @param renderTexture RenderTexture handle
	 * @returns boolean indicating success
	 */
	static SetRenderTexture(...args: [entity: Entity, renderTexture: Texture]) {
		return RpcClient.Call<void>("Camera::SetRenderTexture", ...args);
	}

	/**
	 * Get the camera render target (targetTexture)
	 * @param entity The entity that owns the camera
	 * @returns RenderTexture handle, or -1 on failure
	 */
	static GetRenderTexture(...args: [entity: Entity]) {
		return RpcClient.Call<Texture>("Camera::GetRenderTexture", ...args);
	}

	/**
	 * Set the camera projection type
	 * @param entity The entity that owns the camera
	 * @param projectionType Projection type flag
	 */
	static SetProjectionType(
		...args: [entity: Entity, projectionType: ProjectionType]
	) {
		return RpcClient.Call<void>("Camera::SetProjectionType", ...args);
	}

	/**
	 * Get the camera projection type
	 * @param entity The entity that owns the camera
	 * @returns projection type flag: 0 = perspective, 1 = orthographic, -1 = failure
	 */
	static GetProjectionType(...args: [entity: Entity]) {
		return RpcClient.Call<ProjectionType>("Camera::GetProjectionType", ...args);
	}

	/**
	 * Set the camera field of view (degrees)
	 * @param entity The entity that owns the camera
	 * @param fov Field of view in degrees
	 */
	static SetFieldOfView(...args: [entity: Entity, fov: number]) {
		return RpcClient.Call<void>("Camera::SetFieldOfView", ...args);
	}

	/**
	 * Get the camera field of view (degrees)
	 * @param entity The entity that owns the camera
	 * @returns field of view in degrees, or -1 on failure
	 */
	static GetFieldOfView(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Camera::GetFieldOfView", ...args);
	}

	/**
	 * Set the camera orthographic size
	 * Only meaningful when the camera is orthographic
	 * @param entity The entity that owns the camera
	 * @param orthographicSize Orthographic size value
	 */
	static SetOrthographicSize(
		...args: [entity: Entity, orthographicSize: number]
	) {
		return RpcClient.Call<void>("Camera::SetOrthographicSize", ...args);
	}

	/**
	 * Get the camera orthographic size
	 * @param entity The entity that owns the camera
	 * @returns orthographic size, or -1 on failure
	 */
	static GetOrthographicSize(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Camera::GetOrthographicSize", ...args);
	}

	/**
	 * Set the camera near clip plane
	 * @param entity The entity that owns the camera
	 * @param nearClipPlane Near clip plane distance
	 */
	static SetNearClipPlane(...args: [entity: Entity, nearClipPlane: number]) {
		return RpcClient.Call<void>("Camera::SetNearClipPlane", ...args);
	}

	/**
	 * Get the camera near clip plane
	 * @param entity The entity that owns the camera
	 * @returns near clip plane distance, or -1 on failure
	 */
	static GetNearClipPlane(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Camera::GetNearClipPlane", ...args);
	}

	/**
	 * Set the camera far clip plane
	 * @param entity The entity that owns the camera
	 * @param farClipPlane Far clip plane distance
	 */
	static SetFarClipPlane(...args: [entity: Entity, farClipPlane: number]) {
		return RpcClient.Call<void>("Camera::SetFarClipPlane", ...args);
	}

	/**
	 * Get the camera far clip plane
	 * @param entity The entity that owns the camera
	 * @returns far clip plane distance, or -1 on failure
	 */
	static GetFarClipPlane(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Camera::GetFarClipPlane", ...args);
	}
}
