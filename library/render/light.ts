import { RpcClient } from "../rpc";
import { Entity } from "../entity";

export class LightManager {
	/**
	 * Create a Light component and attach it to the specified entity
	 * @param entity The entity to attach the light to
	 * @param type The type of light to create
	 * @returns boolean indicating success
	 */
	static Create(entity: Entity, type: LightType): boolean {
		return Boolean(
			RpcClient.Call("Light_Create", {
				entityHandle: entity,
				lightType: type, // 0=Spot,1=Directional,2=Point,3=Area
			}),
		);
	}

	/**
	 * Destroy the Light component from the specified entity
	 * @param entity The entity to remove the light from
	 * @returns boolean indicating success
	 */
	static Destroy(entity: Entity): boolean {
		return Boolean(RpcClient.Call("Light_Destroy", { entityHandle: entity }));
	}

	/**
	 * Check if the entity has a Light component
	 * @param entity The entity to check
	 * @returns boolean indicating if light component exists
	 */
	static HasComponent(entity: Entity): boolean {
		return Boolean(
			RpcClient.Call("Light_HasComponent", { entityHandle: entity }),
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
			RpcClient.Call("Light_SetType", {
				entityHandle: entity,
				lightType: type, // 0=Spot,1=Directional,2=Point,3=Area
			}),
		);
	}

	/**
	 * Set the color of the light
	 * @param entity The entity with the light component
	 * @param r Red component (0-1)
	 * @param g Green component (0-1)
	 * @param b Blue component (0-1)
	 * @returns boolean indicating success
	 */
	static SetColor(entity: Entity, r: number, g: number, b: number): boolean {
		return Boolean(
			RpcClient.Call("Light_SetColor", {
				entityHandle: entity,
				r,
				g,
				b,
			}),
		);
	}

	/**
	 * Set the intensity of the light
	 * @param entity The entity with the light component
	 * @param intensity The light intensity
	 * @returns boolean indicating success
	 */
	static SetIntensity(entity: Entity, intensity: number): boolean {
		return Boolean(
			RpcClient.Call("Light_SetIntensity", {
				entityHandle: entity,
				intensity,
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
			RpcClient.Call("Light_SetRange", {
				entityHandle: entity,
				range,
			}),
		);
	}

	/**
	 * Set the spot angle for spot lights
	 * @param entity The entity with the light component
	 * @param angle The spot angle
	 * @param asDegrees Whether the angle is in degrees (default: true)
	 * @returns boolean indicating success
	 */
	static SetSpotAngle(
		entity: Entity,
		angle: number,
		asDegrees = true,
	): boolean {
		return Boolean(
			RpcClient.Call("Light_SetSpotAngle", {
				entityHandle: entity,
				angle,
				// third param "bool" unused in bridge—always true
				value: asDegrees,
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
			RpcClient.Call("Light_SetShadows", {
				entityHandle: entity,
				shadowType: mode, // 0=NoShadows,1=Hard,2=Soft
			}),
		);
	}

	/**
	 * Set the culling mask for the light
	 * @param entity The entity with the light component
	 * @param mask The culling mask
	 * @returns boolean indicating success
	 */
	static SetCullingMask(entity: Entity, mask: number): boolean {
		return Boolean(
			RpcClient.Call("Light_SetCullingMask", {
				entityHandle: entity,
				mask,
			}),
		);
	}
}

export enum LightShadowMode {
	NoShadows = 0,
	Hard = 1,
	Soft = 2,
}

export enum LightType {
	Spot = 0,
	Directional = 1,
	Point = 2,
	Area = 3,
}
