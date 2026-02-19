import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { TextureHandle } from "./texture";

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
	static Create(entity: Entity): boolean {
		return Boolean(RpcClient.Call("Camera::Create", { entityHandle: entity }));
	}

	/**
	 * Destroy the Camera component from the specified entity
	 * @param entity The entity to remove the camera from
	 * @returns boolean indicating success
	 */
	static Destroy(entity: Entity): boolean {
		return Boolean(RpcClient.Call("Camera::Destroy", { entityHandle: entity }));
	}

	/**
	 * Check if the entity has a Camera component
	 * @param entity The entity to check
	 * @returns boolean indicating if camera component exists
	 */
	static HasComponent(entity: Entity): boolean {
		return Boolean(
			RpcClient.Call("Camera::HasComponent", { entityHandle: entity }),
		);
	}

	/**
	 * Set the camera render target (targetTexture)
	 * @param entity The entity that owns the camera
	 * @param renderTexture RenderTexture handle
	 * @returns boolean indicating success
	 */
	static SetRenderTexture(
		entity: Entity,
		renderTexture: TextureHandle,
	): boolean {
		return Boolean(
			RpcClient.Call("Camera::SetRenderTexture", {
				entityHandle: entity,
				renderTextureHandle: renderTexture,
			}),
		);
	}

	/**
	 * Get the camera render target (targetTexture)
	 * @param entity The entity that owns the camera
	 * @returns RenderTexture handle, or -1 on failure
	 */
	static GetRenderTexture(entity: Entity): TextureHandle {
		return Number(
			RpcClient.Call("Camera::GetRenderTexture", { entityHandle: entity }),
		);
	}

	/**
	 * Set the camera projection type
	 * @param entity The entity that owns the camera
	 * @param projectionType Projection type flag
	 * @returns boolean indicating success
	 */
	static SetProjectionType(
		entity: Entity,
		projectionType: ProjectionType,
	): boolean {
		return Boolean(
			RpcClient.Call("Camera::SetProjectionType", {
				entityHandle: entity,
				projectionType,
			}),
		);
	}

	/**
	 * Get the camera projection type
	 * @param entity The entity that owns the camera
	 * @returns projection type flag: 0 = perspective, 1 = orthographic, -1 = failure
	 */
	static GetProjectionType(entity: Entity): ProjectionType {
		return Number(
			RpcClient.Call("Camera::GetProjectionType", { entityHandle: entity }),
		);
	}

	/**
	 * Set the camera field of view (degrees)
	 * @param entity The entity that owns the camera
	 * @param fov Field of view in degrees
	 * @returns boolean indicating success
	 */
	static SetFieldOfView(entity: Entity, fov: number): boolean {
		return Boolean(
			RpcClient.Call("Camera::SetFieldOfView", {
				entityHandle: entity,
				fov: fov,
			}),
		);
	}

	/**
	 * Get the camera field of view (degrees)
	 * @param entity The entity that owns the camera
	 * @returns field of view in degrees, or -1 on failure
	 */
	static GetFieldOfView(entity: Entity): number {
		return Number(
			RpcClient.Call("Camera::GetFieldOfView", { entityHandle: entity }),
		);
	}

	/**
	 * Set the camera orthographic size
	 * Only meaningful when the camera is orthographic
	 * @param entity The entity that owns the camera
	 * @param orthographicSize Orthographic size value
	 * @returns boolean indicating success
	 */
	static SetOrthographicSize(
		entity: Entity,
		orthographicSize: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Camera::SetOrthographicSize", {
				entityHandle: entity,
				orthographicSize: orthographicSize,
			}),
		);
	}

	/**
	 * Get the camera orthographic size
	 * @param entity The entity that owns the camera
	 * @returns orthographic size, or -1 on failure
	 */
	static GetOrthographicSize(entity: Entity): number {
		return Number(
			RpcClient.Call("Camera::GetOrthographicSize", { entityHandle: entity }),
		);
	}

	/**
	 * Set the camera near clip plane
	 * @param entity The entity that owns the camera
	 * @param nearClipPlane Near clip plane distance
	 * @returns boolean indicating success
	 */
	static SetNearClipPlane(entity: Entity, nearClipPlane: number): boolean {
		return Boolean(
			RpcClient.Call("Camera::SetNearClipPlane", {
				entityHandle: entity,
				nearClipPlane: nearClipPlane,
			}),
		);
	}

	/**
	 * Get the camera near clip plane
	 * @param entity The entity that owns the camera
	 * @returns near clip plane distance, or -1 on failure
	 */
	static GetNearClipPlane(entity: Entity): number {
		return Number(
			RpcClient.Call("Camera::GetNearClipPlane", { entityHandle: entity }),
		);
	}

	/**
	 * Set the camera far clip plane
	 * @param entity The entity that owns the camera
	 * @param farClipPlane Far clip plane distance
	 * @returns boolean indicating success
	 */
	static SetFarClipPlane(entity: Entity, farClipPlane: number): boolean {
		return Boolean(
			RpcClient.Call("Camera::SetFarClipPlane", {
				entityHandle: entity,
				farClipPlane: farClipPlane,
			}),
		);
	}

	/**
	 * Get the camera far clip plane
	 * @param entity The entity that owns the camera
	 * @returns far clip plane distance, or -1 on failure
	 */
	static GetFarClipPlane(entity: Entity): number {
		return Number(
			RpcClient.Call("Camera::GetFarClipPlane", { entityHandle: entity }),
		);
	}

	/**
	 * Set the camera culling mask
	 * @param entity The entity that owns the camera
	 * @param mask Unity layer mask bitfield
	 * @returns boolean indicating success
	 */
	static SetCullingMask(entity: Entity, mask: number): boolean {
		return Boolean(
			RpcClient.Call("Camera::SetCullingMask", {
				entityHandle: entity,
				mask: mask,
			}),
		);
	}
}
