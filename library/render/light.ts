import { RpcClient } from "../rpc";
import { Entity } from "../entity";
import { vec3 } from "gl-matrix";

export enum LightShadowMode {
	NoShadows = 0,
	Hard = 1,
	Soft = 2,
}

export enum LightType {
	Spot = 0,
	Directional = 1,
	Point = 2,
}

export class LightManager {
	/**
	 * Create a Light component and attach it to the specified entity
	 * @param entity The entity to attach the light to
	 * @param type The type of light to create
	 * @returns boolean indicating success
	 */
	static Create(...args: [entity: Entity, type: LightType]) {
		return RpcClient.Call<boolean>("Light::Create", ...args);
	}

	/**
	 * Destroy the Light component from the specified entity
	 * @param entity The entity to remove the light from
	 * @returns boolean indicating success
	 */
	static Destroy(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Light::Destroy", ...args);
	}

	/**
	 * Check if the entity has a Light component
	 * @param entity The entity to check
	 * @returns boolean indicating if light component exists
	 */
	static HasComponent(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Light::HasComponent", ...args);
	}

	/**
	 * Set if the light component is enabled
	 * @param entity The entity with the renderable component
	 * @param enabled If the light component is enabled
	 */
	static SetEnabled(...args: [entity: Entity, enabled: boolean]) {
		return RpcClient.Call<void>("Light::SetEnabled", ...args);
	}

	static GetEnabled(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Light::GetEnabled", ...args);
	}

	/**
	 * Set the type of light
	 * @param entity The entity with the light component
	 * @param type The light type
	 */
	static SetType(...args: [entity: Entity, type: LightType]) {
		return RpcClient.Call<void>("Light::SetType", ...args);
	}

	static GetType(...args: [entity: Entity]) {
		return RpcClient.Call<LightType>("Light::GetType", ...args);
	}

	/**
	 * Set the color of the light
	 * @param entity The entity with the light component
	 * @param rgb color in range [0, 1]
	 */
	static SetColor(...args: [entity: Entity, rgb: vec3]) {
		return RpcClient.Call<void>("Light::SetColor", ...args);
	}

	static async GetColor(...args: [entity: Entity]) {
		return RpcClient.Call<vec3>("Light::GetColor", ...args);
	}

	/**
	 * Set the intensity of the light
	 * @param entity The entity with the light component
	 * @param intensity The light intensity
	 */
	static SetIntensity(...args: [entity: Entity, intensity: number]) {
		return RpcClient.Call<void>("Light::SetIntensity", ...args);
	}

	static GetIntensity(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Light::GetIntensity", ...args);
	}

	/**
	 * Set the range of the light
	 * @param entity The entity with the light component
	 * @param range The light range
	 */
	static SetRange(...args: [entity: Entity, range: number]) {
		return RpcClient.Call<void>("Light::SetRange", ...args);
	}

	static GetRange(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Light::GetRange", ...args);
	}

	/**
	 * Set the spot angle for spot lights
	 * @param entity The entity with the light component
	 * @param angle The spot angle in degree
	 */
	static SetSpotAngle(...args: [entity: Entity, angle: number]) {
		return RpcClient.Call<void>("Light::SetSpotAngle", ...args);
	}

	static GetSpotAngle(...args: [entity: Entity]) {
		return RpcClient.Call<number>("Light::GetSpotAngle", ...args);
	}

	/**
	 * Set the shadow mode for the light
	 * @param entity The entity with the light component
	 * @param mode The shadow mode
	 */
	static SetShadows(...args: [entity: Entity, mode: LightShadowMode]) {
		return RpcClient.Call<void>("Light::SetShadows", ...args);
	}

	static GetShadows(...args: [entity: Entity]) {
		return RpcClient.Call<LightShadowMode>("Light::GetShadows", ...args);
	}
}
