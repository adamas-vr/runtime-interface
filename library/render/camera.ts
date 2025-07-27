import { RpcClient } from "@adamas/rpc";
import { Entity } from "@adamas/entity";
import { TextureHandle } from "./texture";

export class CameraManager {
	/**
	 * Create a Camera component and attach it to the specified entity
	 * @param entity The entity to attach the camera to
	 * @returns boolean indicating success
	 */
	static Create(entity: Entity): boolean {
		return Boolean(RpcClient.Call("Camera_Create", { entityHandle: entity }));
	}

	/**
	 * Destroy the Camera component from the specified entity
	 * @param entity The entity to remove the camera from
	 * @returns boolean indicating success
	 */
	static Destroy(entity: Entity): boolean {
		return Boolean(RpcClient.Call("Camera_Destroy", { entityHandle: entity }));
	}

	/**
	 * Check if the entity has a Camera component
	 * @param entity The entity to check
	 * @returns boolean indicating if camera component exists
	 */
	static HasComponent(entity: Entity): boolean {
		return Boolean(
			RpcClient.Call("Camera_HasComponent", { entityHandle: entity }),
		);
	}

	/**
	 * Set the projection parameters for the camera
	 * @param entity The entity with the camera component
	 * @param projectionType Type of projection
	 * @param fov Field of view
	 * @param aspect Aspect ratio
	 * @param near Near plane
	 * @param far Far plane
	 * @returns boolean indicating success
	 */
	static SetProjection(
		entity: Entity,
		projectionType: number,
		fov: number,
		aspect: number,
		near: number,
		far: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Camera_SetProjection", {
				entityHandle: entity,
				projectionType,
				fov,
				aspect,
				near,
				far,
			}),
		);
	}

	/**
	 * Set orthographic projection parameters
	 * @param entity The entity with the camera component
	 * @param left Left plane
	 * @param right Right plane
	 * @param bottom Bottom plane
	 * @param top Top plane
	 * @param near Near plane
	 * @param far Far plane
	 * @returns boolean indicating success
	 */
	static SetOrthographic(
		entity: Entity,
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Camera_SetOrthographic", {
				entityHandle: entity,
				left,
				right,
				bottom,
				top,
				near,
				far,
			}),
		);
	}

	/**
	 * Make the camera look at a target point
	 * @param entity The entity with the camera component
	 * @param targetX Target X coordinate
	 * @param targetY Target Y coordinate
	 * @param targetZ Target Z coordinate
	 * @param upX Up vector X
	 * @param upY Up vector Y
	 * @param upZ Up vector Z
	 * @param worldUpX World up X
	 * @param worldUpY World up Y
	 * @param worldUpZ World up Z
	 * @returns boolean indicating success
	 */
	static LookAt(
		entity: Entity,
		targetX: number,
		targetY: number,
		targetZ: number,
		upX: number,
		upY: number,
		upZ: number,
		worldUpX: number,
		worldUpY: number,
		worldUpZ: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Camera_LookAt", {
				entityHandle: entity,
				targetX,
				targetY,
				targetZ,
				upX,
				upY,
				upZ,
				worldUpX,
				worldUpY,
				worldUpZ,
			}),
		);
	}

	/**
	 * Set the culling mask for the camera
	 * @param entity The entity with the camera component
	 * @param mask The culling mask
	 * @returns boolean indicating success
	 */
	static SetCullingMask(entity: Entity, mask: number): boolean {
		return Boolean(
			RpcClient.Call("Camera_SetCullingMask", {
				entityHandle: entity,
				mask,
			}),
		);
	}

	/**
	 * Set the render texture for the camera
	 * @param entity The entity with the camera component
	 * @param textureHandle The render texture handle
	 * @returns boolean indicating success
	 */
	static SetRenderTexture(
		entity: Entity,
		textureHandle: TextureHandle,
	): boolean {
		return Boolean(
			RpcClient.Call("Camera_SetRenderTexture", {
				entityHandle: entity,
				renderTextureHandle: textureHandle,
			}),
		);
	}
}
