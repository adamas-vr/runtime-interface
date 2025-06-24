import { RpcClient } from "@adamas/rpc";
import { Entity } from "@adamas/entity";

export class Light {
	constructor(public entity: Entity) {}

	static create(entity: Entity, type: number): boolean {
		return Boolean(
			RpcClient.Call("Light_Create", {
				entityHandle: entity,
				lightType: type, // 0=Spot,1=Directional,2=Point,3=Area
			}),
		);
	}

	static destroy(entity: Entity): boolean {
		return Boolean(RpcClient.Call("Light_Destroy", { entityHandle: entity }));
	}

	static hasComponent(entity: Entity): boolean {
		return Boolean(
			RpcClient.Call("Light_HasComponent", { entityHandle: entity }),
		);
	}

	static setColor(entity: Entity, r: number, g: number, b: number): boolean {
		return Boolean(
			RpcClient.Call("Light_SetColor", {
				entityHandle: entity,
				r,
				g,
				b,
			}),
		);
	}

	static setIntensity(entity: Entity, intensity: number): boolean {
		return Boolean(
			RpcClient.Call("Light_SetIntensity", {
				entityHandle: entity,
				intensity,
			}),
		);
	}

	static setRange(entity: Entity, range: number): boolean {
		return Boolean(
			RpcClient.Call("Light_SetRange", {
				entityHandle: entity,
				range,
			}),
		);
	}

	static setSpotAngle(
		entity: Entity,
		angle: number,
		asDegrees = true,
	): boolean {
		return Boolean(
			RpcClient.Call("Light_SetSpotAngle", {
				entityHandle: entity,
				angle,
				// third param “bool” unused in bridge—always true
				value: asDegrees,
			}),
		);
	}

	static setShadows(entity: Entity, mode: number): boolean {
		return Boolean(
			RpcClient.Call("Light_SetShadows", {
				entityHandle: entity,
				shadowType: mode, // 0=NoShadows,1=Hard,2=Soft
			}),
		);
	}

	static setCullingMask(entity: Entity, mask: number): boolean {
		return Boolean(
			RpcClient.Call("Light_SetCullingMask", {
				entityHandle: entity,
				mask,
			}),
		);
	}
}
