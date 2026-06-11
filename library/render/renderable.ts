/**
 * APIs for creating and updating renderable components.
 *
 * @module renderable
 */
import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { Material } from "./material";
import { Mesh } from "./mesh";

/**
 * Supported shadow casting modes for a renderable component.
 */
export enum ShadowCastingMode {
	/** No shadows are cast from this object. */
	Off = 0,
	/** Shadows are cast from this object. */
	On = 1,
	/** Shadows are cast from this object, treating it as two-sided. */
	TwoSided = 2,
	/** Object casts shadows, but is otherwise invisible in the Scene. */
	ShadowsOnly = 3,
}

/**
 * Creates and updates renderable components.
 *
 * Because runtime calls are performed asynchronously over IPC, procedurally
 * building a renderable through a sequence of API calls can span multiple
 * frames. To avoid exposing partially initialized content, such as placeholder
 * shaders or incomplete meshes, keep the component disabled until setup is
 * complete, then enable it once the renderable is ready.
 */
export class RenderableManager {
	/**
	 * Creates a renderable component on an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param isSkinnedMesh - Whether the renderable should be created as a skinned
	 * mesh. Defaults to `false`. Blend shapes only work when this is `true`.
	 * @returns A promise that resolves to `true` if the renderable component was
	 * created, or `false` otherwise.
	 */
	static Create(entity: Entity, isSkinnedMesh?: boolean) {
		return RpcClient.Call<boolean>(
			"Renderable::Create",
			entity,
			isSkinnedMesh ?? false,
		);
	}

	/**
	 * Removes a renderable component from an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the renderable component was
	 * removed, or `false` otherwise.
	 */
	static Destroy(entity: Entity) {
		return RpcClient.Call<boolean>("Renderable::Destroy", entity);
	}

	/**
	 * Checks whether an entity has a renderable component.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the entity has a renderable
	 * component, or `false` otherwise.
	 */
	static HasComponent(entity: Entity) {
		return RpcClient.Call<boolean>("Renderable::HasComponent", entity);
	}

	/**
	 * Sets whether a renderable component is enabled.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param enabled - Whether the renderable component is enabled.
	 * @returns A promise that resolves when the enabled state has been changed.
	 */
	static SetEnabled(entity: Entity, enabled: boolean) {
		return RpcClient.Call<void>("Renderable::SetEnabled", entity, enabled);
	}

	/**
	 * Gets whether a renderable component is enabled.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the renderable component is
	 * enabled, or `false` otherwise.
	 */
	static GetEnabled(entity: Entity) {
		return RpcClient.Call<boolean>("Renderable::GetEnabled", entity);
	}

	/**
	 * Sets the mesh of a renderable component.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param mesh - The {@link Mesh} to assign.
	 * @returns A promise that resolves when the mesh has been changed.
	 */
	static SetMesh(entity: Entity, mesh: Mesh) {
		return RpcClient.Call<void>("Renderable::SetMesh", entity, mesh);
	}

	/**
	 * Gets the mesh of a renderable component.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the assigned {@link Mesh}.
	 * @throws An error if no mesh is assigned to the renderable component.
	 */
	static GetMesh(entity: Entity) {
		return RpcClient.Call<Mesh>("Renderable::GetMesh", entity);
	}

	/**
	 * Sets the weight of a blend shape.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param index - The blend shape index.
	 * @param weight - The blend shape weight in the range `[0.0, 1.0]`.
	 * @returns A promise that resolves when the blend shape weight has been
	 * changed.
	 */
	static SetBlendShapeWeight(entity: Entity, index: number, weight: number) {
		return RpcClient.Call<void>(
			"Renderable::SetBlendShapeWeight",
			entity,
			index,
			weight,
		);
	}

	/**
	 * Gets the weight of a blend shape.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @param index - The blend shape index.
	 * @returns A promise that resolves to the blend shape weight.
	 */
	static GetBlendShapeWeight(entity: Entity, index: number) {
		return RpcClient.Call<number>(
			"Renderable::GetBlendShapeWeight",
			entity,
			index,
		);
	}

	/**
	 * Sets the material of a renderable component.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param material - The {@link Material} to assign.
	 * @param index - The material index. Defaults to `0`.
	 * @returns A promise that resolves when the material has been changed.
	 */
	static SetMaterial(entity: Entity, material: Material, index?: number) {
		return RpcClient.Call<void>(
			"Renderable::SetMaterial",
			entity,
			material,
			index ?? 0,
		);
	}

	/**
	 * Gets the material of a renderable component.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @param index - The material index. Defaults to `0`.
	 * @returns A promise that resolves to the assigned {@link Material}.
	 * @throws An error if no material is assigned to the renderable component at the given index.
	 */
	static GetMaterial(entity: Entity, index?: number) {
		return RpcClient.Call<Material>(
			"Renderable::GetMaterial",
			entity,
			index ?? 0,
		);
	}

	/**
	 * Sets whether a renderable component receives shadows.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param receive - Whether the renderable component receives shadows.
	 * @returns A promise that resolves when the receive-shadows setting has been
	 * changed.
	 */
	static SetReceiveShadows(entity: Entity, receive: boolean) {
		return RpcClient.Call<void>(
			"Renderable::SetReceiveShadows",
			entity,
			receive,
		);
	}

	/**
	 * Gets whether a renderable component receives shadows.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the renderable component
	 * receives shadows, or `false` otherwise.
	 */
	static GetReceiveShadows(entity: Entity) {
		return RpcClient.Call<boolean>("Renderable::GetReceiveShadows", entity);
	}

	/**
	 * Sets the shadow casting mode of a renderable component.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param shadowMode - The shadow casting mode to assign.
	 * @returns A promise that resolves when the shadow casting mode has been
	 * changed.
	 */
	static SetShadowMode(entity: Entity, shadowMode: ShadowCastingMode) {
		return RpcClient.Call<void>(
			"Renderable::SetShadowMode",
			entity,
			shadowMode,
		);
	}

	/**
	 * Gets the shadow casting mode of a renderable component.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the shadow casting mode.
	 */
	static GetShadowMode(entity: Entity) {
		return RpcClient.Call<ShadowCastingMode>(
			"Renderable::GetShadowMode",
			entity,
		);
	}
}
