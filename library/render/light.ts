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
	static Create(entity: Entity, type: LightType): boolean {
		return Boolean(
			RpcClient.Call("Light::Create", {
				entityHandle: entity,
				lightType: type, // 0=Spot,1=Directional,2=Point
			}),
		);
	}

	/**
	 * Destroy the Light component from the specified entity
	 * @param entity The entity to remove the light from
	 * @returns boolean indicating success
	 */
	static Destroy(entity: Entity): boolean {
		return Boolean(RpcClient.Call("Light::Destroy", { entityHandle: entity }));
	}

	/**
	 * Check if the entity has a Light component
	 * @param entity The entity to check
	 * @returns boolean indicating if light component exists
	 */
	static HasComponent(entity: Entity): boolean {
		return Boolean(
			RpcClient.Call("Light::HasComponent", { entityHandle: entity }),
		);
	}

	/**
	 * Set if the light component is enabled
	 * @param entityHandle The entity with the renderable component
	 * @param enabled If the light component is enabled
	 * @returns boolean indicating success
	 */
	static SetEnabled(entityHandle: Entity, enabled: boolean): boolean {
		return Boolean(
			RpcClient.Call("Light::SetEnabled", {
				entityHandle,
				enabled,
			}),
		);
	}

	static GetEnabled(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("Light::GetEnabled", {
				entityHandle,
			}),
		);
	}

	/**
	 * Set the type of light
	 * @param entity The entity with the light component
	 * @param type The light type
	 * @returns boolean indicating success
	 */
	static SetType(entity: Entity, type: LightType): boolean {
		return Boolean(
			RpcClient.Call("Light::SetType", {
				entityHandle: entity,
				lightType: type, // 0=Spot,1=Directional,2=Point
			}),
		);
	}

	static GetType(entity: Entity): LightType {
		return Number(
			RpcClient.Call("Light::GetType", {
				entityHandle: entity,
			}),
		);
	}

	/**
	 * Set the color of the light
	 * @param entity The entity with the light component
	 * @param rgb color in range [0, 1]
	 * @returns boolean indicating success
	 */
	static SetColor(entity: Entity, rgb: vec3): boolean {
		return Boolean(
			RpcClient.Call("Light::SetColor", {
				entityHandle: entity,
				r: rgb[0],
				g: rgb[1],
				b: rgb[2],
			}),
		);
	}

	static GetColor(entity: Entity): vec3 {
		const val = JSON.parse(
			RpcClient.Call("Light::GetColor", { entityHandle: entity }),
		);
		return vec3.fromValues(val[0], val[1], val[2]);
	}

	/**
	 * Set the intensity of the light
	 * @param entity The entity with the light component
	 * @param intensity The light intensity
	 * @returns boolean indicating success
	 */
	static SetIntensity(entity: Entity, intensity: number): boolean {
		return Boolean(
			RpcClient.Call("Light::SetIntensity", {
				entityHandle: entity,
				intensity,
			}),
		);
	}

	static GetIntensity(entity: Entity): number {
		return Number(
			RpcClient.Call("Light::GetIntensity", {
				entityHandle: entity,
			}),
		);
	}

	/**
	 * Set the range of the light
	 * @param entity The entity with the light component
	 * @param range The light range
	 * @returns boolean indicating success
	 */
	static SetRange(entity: Entity, range: number): boolean {
		return Boolean(
			RpcClient.Call("Light::SetRange", {
				entityHandle: entity,
				range,
			}),
		);
	}

	static GetRange(entity: Entity): number {
		return Number(
			RpcClient.Call("Light::GetRange", {
				entityHandle: entity,
			}),
		);
	}

	/**
	 * Set the spot angle for spot lights
	 * @param entity The entity with the light component
	 * @param angle The spot angle in degree
	 * @returns boolean indicating success
	 */
	static SetSpotAngle(entity: Entity, angle: number): boolean {
		return Boolean(
			RpcClient.Call("Light::SetSpotAngle", {
				entityHandle: entity,
				angle,
			}),
		);
	}

	static GetSpotAngle(entity: Entity): number {
		return Number(
			RpcClient.Call("Light::GetSpotAngle", {
				entityHandle: entity,
			}),
		);
	}

	/**
	 * Set the shadow mode for the light
	 * @param entity The entity with the light component
	 * @param mode The shadow mode
	 * @returns boolean indicating success
	 */
	static SetShadows(entity: Entity, mode: LightShadowMode): boolean {
		return Boolean(
			RpcClient.Call("Light::SetShadows", {
				entityHandle: entity,
				shadowType: mode, // 0=NoShadows,1=Hard,2=Soft
			}),
		);
	}

	static GetShadows(entity: Entity): LightShadowMode {
		return Number(
			RpcClient.Call("Light:GetShadows", {
				entityHandle: entity,
			}),
		);
	}
}
