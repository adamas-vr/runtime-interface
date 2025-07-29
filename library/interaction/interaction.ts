import { Entity } from "@adamas/entity";
import { RpcClient } from "../rpc";

export type GrabbleHandle = number;

export class GrabInteractableManager {
	static Create(entityHandle: Entity): GrabbleHandle {
		return Number(
			RpcClient.Call("GrabInteractableAPI_Create", {
				entityHandle,
			}),
		);
	}

	static Destroy(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_Destroy", {
				entityHandle,
			}),
		);
	}

	static HasComponent(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_HasComponent", {
				entityHandle,
			}),
		);
	}

	static GetTrackPosition(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetTrackPosition", {
				entityHandle,
			}),
		);
	}

	static SetTrackPosition(entityHandle: Entity, isTracking: boolean): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_SetTrackPosition", {
				entityHandle,
				isTracking,
			}),
		);
	}

	static GetTrackRotation(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetTrackRotation", {
				entityHandle,
			}),
		);
	}

	static SetTrackRotation(entityHandle: Entity, isTracking: boolean): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_SetTrackRotation", {
				entityHandle,
				isTracking,
			}),
		);
	}

	static GetTrackScale(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetTrackScale", {
				entityHandle,
			}),
		);
	}

	static SetTrackScale(entityHandle: Entity, isTracking: boolean): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_SetTrackScale", {
				entityHandle,
				isTracking,
			}),
		);
	}

	static GetThrowOnDetach(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetThrowOnDetach", {
				entityHandle,
			}),
		);
	}

	static SetThrowOnDetach(entityHandle: Entity, enable: boolean): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_SetThrowOnDetach", {
				entityHandle,
				enable,
			}),
		);
	}

	static GetAttachEntity(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetAttachEntity", {
				entityHandle,
			}),
		);
	}

	static SetAttachEntity(
		entityHandle: Entity,
		attachEntityHandle: Entity,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_SetAttachEntity", {
				entityHandle,
				attachEntityHandle,
			}),
		);
	}

	static AddSelectEnteredCallback(
		entityHandle: Entity,
		onSelectEntered: () => void,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_AddSelectEnteredCallback", {
				entityHandle,
				onSelectEntered,
			}),
		);
	}

	static AddSelectExitedCallback(
		entityHandle: Entity,
		onSelectExited: () => void,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_AddSelectExitedCallback", {
				entityHandle,
				onSelectExited,
			}),
		);
	}

	static AddActivatedCallback(
		entityHandle: Entity,
		onActivated: () => void,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_AddActivatedCallback", {
				entityHandle,
				onActivated,
			}),
		);
	}

	static AddDeactivatedCallback(
		entityHandle: Entity,
		onDeactivated: () => void,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_AddDeactivatedCallback", {
				entityHandle,
				onDeactivated,
			}),
		);
	}
}
