/**
 * APIs for creating and updating camera components.
 *
 * @module camera
 */
import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { Texture } from "./texture";

/**
 * Supported camera projection types.
 */
export enum ProjectionType {
	/** Perspective projection. */
	Perspective = 0,
	/** Orthographic projection. */
	Orthographic = 1,
}

/**
 * Creates and updates camera components.
 */
export class CameraManager {
	/**
	 * Creates a camera component on an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the camera component was
	 * created, or `false` otherwise.
	 */
	static Create(entity: Entity) {
		return RpcClient.Call<boolean>("Camera::Create", entity);
	}

	/**
	 * Removes a camera component from an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the camera component was
	 * removed, or `false` otherwise.
	 */
	static Destroy(entity: Entity) {
		return RpcClient.Call<boolean>("Camera::Destroy", entity);
	}

	/**
	 * Checks whether an entity has a camera component.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the entity has a camera
	 * component, or `false` otherwise.
	 */
	static HasComponent(entity: Entity) {
		return RpcClient.Call<boolean>("Camera::HasComponent", entity);
	}

	/**
	 * Sets whether a camera component is enabled.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param enabled - Whether the camera component is enabled.
	 * @returns A promise that resolves when the enabled state has been changed.
	 */
	static SetEnabled(entity: Entity, enabled: boolean) {
		return RpcClient.Call<void>("Camera::SetEnabled", entity, enabled);
	}

	/**
	 * Gets whether a camera component is enabled.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the camera component is
	 * enabled, or `false` otherwise.
	 */
	static GetEnabled(entity: Entity) {
		return RpcClient.Call<boolean>("Camera::GetEnabled", entity);
	}

	/**
	 * Sets the render texture of a camera.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param renderTexture - The {@link Texture} to assign as the render texture;
	 * it must be a render texture.
	 * @returns A promise that resolves when the render texture has been changed.
	 */
	static SetRenderTexture(entity: Entity, renderTexture: Texture) {
		return RpcClient.Call<void>("Camera::SetRenderTexture", entity, renderTexture);
	}

	/**
	 * Gets the render texture of a camera.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the assigned {@link Texture}.
	 */
	static GetRenderTexture(entity: Entity) {
		return RpcClient.Call<Texture>("Camera::GetRenderTexture", entity);
	}

	/**
	 * Sets the projection type of a camera.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param projectionType - The projection type to assign.
	 * @returns A promise that resolves when the projection type has been changed.
	 */
	static SetProjectionType(entity: Entity, projectionType: ProjectionType) {
		return RpcClient.Call<void>(
			"Camera::SetProjectionType",
			entity,
			projectionType,
		);
	}

	/**
	 * Gets the projection type of a camera.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the projection type.
	 */
	static GetProjectionType(entity: Entity) {
		return RpcClient.Call<ProjectionType>("Camera::GetProjectionType", entity);
	}

	/**
	 * Sets the field of view of a camera in degrees.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param fov - The field of view in degrees.
	 * @returns A promise that resolves when the field of view has been changed.
	 */
	static SetFieldOfView(entity: Entity, fov: number) {
		return RpcClient.Call<void>("Camera::SetFieldOfView", entity, fov);
	}

	/**
	 * Gets the field of view of a camera in degrees.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the field of view in degrees.
	 */
	static GetFieldOfView(entity: Entity) {
		return RpcClient.Call<number>("Camera::GetFieldOfView", entity);
	}

	/**
	 * Sets the orthographic size of a camera.
	 *
	 * This value is used when the projection type is
	 * {@link ProjectionType.Orthographic}.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param orthographicSize - The orthographic size.
	 * @returns A promise that resolves when the orthographic size has been
	 * changed.
	 */
	static SetOrthographicSize(entity: Entity, orthographicSize: number) {
		return RpcClient.Call<void>(
			"Camera::SetOrthographicSize",
			entity,
			orthographicSize,
		);
	}

	/**
	 * Gets the orthographic size of a camera.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the orthographic size.
	 */
	static GetOrthographicSize(entity: Entity) {
		return RpcClient.Call<number>("Camera::GetOrthographicSize", entity);
	}

	/**
	 * Sets the near clip plane distance of a camera.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param nearClipPlane - The near clip plane distance.
	 * @returns A promise that resolves when the near clip plane has been changed.
	 */
	static SetNearClipPlane(entity: Entity, nearClipPlane: number) {
		return RpcClient.Call<void>(
			"Camera::SetNearClipPlane",
			entity,
			nearClipPlane,
		);
	}

	/**
	 * Gets the near clip plane distance of a camera.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the near clip plane distance.
	 */
	static GetNearClipPlane(entity: Entity) {
		return RpcClient.Call<number>("Camera::GetNearClipPlane", entity);
	}

	/**
	 * Sets the far clip plane distance of a camera.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param farClipPlane - The far clip plane distance.
	 * @returns A promise that resolves when the far clip plane has been changed.
	 */
	static SetFarClipPlane(entity: Entity, farClipPlane: number) {
		return RpcClient.Call<void>("Camera::SetFarClipPlane", entity, farClipPlane);
	}

	/**
	 * Gets the far clip plane distance of a camera.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the far clip plane distance.
	 */
	static GetFarClipPlane(entity: Entity) {
		return RpcClient.Call<number>("Camera::GetFarClipPlane", entity);
	}
}
