/**
 * APIs for creating and updating light components.
 *
 * @module light
 */
import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { vec3 } from "gl-matrix";

/**
 * Supported shadow modes for a light.
 */
export enum LightShadowMode {
	/** Shadow casting is disabled. */
	NoShadows = 0,
	/** Cast hard shadows. */
	Hard = 1,
	/** Cast soft shadows. */
	Soft = 2,
}

/**
 * Supported light types.
 */
export enum LightType {
	/** Spot light. */
	Spot = 0,
	/** Directional light. */
	Directional = 1,
	/** Point light. */
	Point = 2,
}

/**
 * Creates and updates light components.
 */
export class LightManager {
	/**
	 * Creates a light component on an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param type - The light type to create.
	 * @returns A promise that resolves to `true` if the light component was
	 * created, or `false` otherwise.
	 */
	static Create(entity: Entity, type: LightType) {
		return RpcClient.Call<boolean>("Light::Create", entity, type);
	}

	/**
	 * Removes a light component from an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the light component was
	 * removed, or `false` otherwise.
	 */
	static Destroy(entity: Entity) {
		return RpcClient.Call<boolean>("Light::Destroy", entity);
	}

	/**
	 * Checks whether an entity has a light component.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the entity has a light
	 * component, or `false` otherwise.
	 */
	static HasComponent(entity: Entity) {
		return RpcClient.Call<boolean>("Light::HasComponent", entity);
	}

	/**
	 * Sets whether a light component is enabled.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param enabled - Whether the light component is enabled.
	 * @returns A promise that resolves when the enabled state has been changed.
	 */
	static SetEnabled(entity: Entity, enabled: boolean) {
		return RpcClient.Call<void>("Light::SetEnabled", entity, enabled);
	}

	/**
	 * Gets whether a light component is enabled.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the light component is
	 * enabled, or `false` otherwise.
	 */
	static GetEnabled(entity: Entity) {
		return RpcClient.Call<boolean>("Light::GetEnabled", entity);
	}

	/**
	 * Sets the light type.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param type - The light type to assign.
	 * @returns A promise that resolves when the light type has been changed.
	 */
	static SetType(entity: Entity, type: LightType) {
		return RpcClient.Call<void>("Light::SetType", entity, type);
	}

	/**
	 * Gets the light type.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the light type.
	 */
	static GetType(entity: Entity) {
		return RpcClient.Call<LightType>("Light::GetType", entity);
	}

	/**
	 * Sets the light color.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param rgb - The RGB color as a `vec3`, with each channel in the range
	 * `[0.0, 1.0]`.
	 * @returns A promise that resolves when the color has been changed.
	 */
	static SetColor(entity: Entity, rgb: vec3) {
		return RpcClient.Call<void>("Light::SetColor", entity, rgb);
	}

	/**
	 * Gets the light color.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the RGB color as a `vec3`, with each
	 * channel in the range `[0.0, 1.0]`.
	 */
	static async GetColor(entity: Entity) {
		return RpcClient.Call<vec3>("Light::GetColor", entity);
	}

	/**
	 * Sets the light intensity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param intensity - The light intensity.
	 * @returns A promise that resolves when the intensity has been changed.
	 */
	static SetIntensity(entity: Entity, intensity: number) {
		return RpcClient.Call<void>("Light::SetIntensity", entity, intensity);
	}

	/**
	 * Gets the light intensity.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the light intensity.
	 */
	static GetIntensity(entity: Entity) {
		return RpcClient.Call<number>("Light::GetIntensity", entity);
	}

	/**
	 * Sets the light range.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param range - The light range.
	 * @returns A promise that resolves when the range has been changed.
	 */
	static SetRange(entity: Entity, range: number) {
		return RpcClient.Call<void>("Light::SetRange", entity, range);
	}

	/**
	 * Gets the light range.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the light range.
	 */
	static GetRange(entity: Entity) {
		return RpcClient.Call<number>("Light::GetRange", entity);
	}

	/**
	 * Sets the spot angle in degrees.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param angle - The spot angle in degrees.
	 * @returns A promise that resolves when the spot angle has been changed.
	 */
	static SetSpotAngle(entity: Entity, angle: number) {
		return RpcClient.Call<void>("Light::SetSpotAngle", entity, angle);
	}

	/**
	 * Gets the spot angle in degrees.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the spot angle in degrees.
	 */
	static GetSpotAngle(entity: Entity) {
		return RpcClient.Call<number>("Light::GetSpotAngle", entity);
	}

	/**
	 * Sets the shadow mode of a light.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param mode - The shadow mode to assign.
	 * @returns A promise that resolves when the shadow mode has been changed.
	 */
	static SetShadows(entity: Entity, mode: LightShadowMode) {
		return RpcClient.Call<void>("Light::SetShadows", entity, mode);
	}

	/**
	 * Gets the shadow mode of a light.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the shadow mode.
	 */
	static GetShadows(entity: Entity) {
		return RpcClient.Call<LightShadowMode>("Light::GetShadows", entity);
	}
}
