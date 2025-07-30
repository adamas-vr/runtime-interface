import { Entity } from "@adamas/entity";
import { RpcClient } from "@adamas/rpc";

/**
 * Provides a static interface for managing XR grab interactable components
 * on entities via RPC. This includes lifecycle management, configuration of
 * grab behaviors (position, rotation, scale), and interaction event callbacks.
 */
export class GrabInteractableManager {
	/**
	 * Creates a grab interactable component for the specified entity.
	 * All colliders added before this component is add are used to detect grabbing
	 * @param entityHandle The entity to attach the grab interactable to.
	 * @returns A handle representing the newly created grab interactable.
	 */
	static Create(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_Create", {
				entityHandle,
			}),
		);
	}

	/**
	 * Destroys the grab interactable component on the given entity.
	 * @param entityHandle The entity whose grab interactable should be destroyed.
	 * @returns True if the component was successfully destroyed.
	 */
	static Destroy(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_Destroy", {
				entityHandle,
			}),
		);
	}

	/**
	 * Checks if the specified entity has a grab interactable component.
	 * @param entityHandle The entity to check.
	 * @returns True if the component exists.
	 */
	static HasComponent(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_HasComponent", {
				entityHandle,
			}),
		);
	}

	/**
	 * Gets whether the grab interactable tracks position.
	 * @param entityHandle The target entity.
	 * @returns True if position tracking is enabled.
	 */
	static GetTrackPosition(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetTrackPosition", {
				entityHandle,
			}),
		);
	}

	/**
	 * Enables or disables position tracking on the grab interactable.
	 * @param entityHandle The target entity.
	 * @param isTracking Whether to enable position tracking.
	 * @returns True if the change was applied.
	 */
	static SetTrackPosition(entityHandle: Entity, isTracking: boolean): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_SetTrackPosition", {
				entityHandle,
				isTracking,
			}),
		);
	}

	/**
	 * Gets whether the grab interactable tracks rotation.
	 * @param entityHandle The target entity.
	 * @returns True if rotation tracking is enabled.
	 */
	static GetTrackRotation(entityHandle: Entity): boolean {
		return JSON.parse(
			RpcClient.Call("GrabInteractableAPI_GetTrackRotation", {
				entityHandle,
			}),
		);
	}

	/**
	 * Enables or disables rotation tracking on the grab interactable.
	 * @param entityHandle The target entity.
	 * @param isTracking Whether to enable rotation tracking.
	 * @returns True if the change was applied.
	 */
	static SetTrackRotation(entityHandle: Entity, isTracking: boolean): boolean {
		return JSON.parse(
			RpcClient.Call("GrabInteractableAPI_SetTrackRotation", {
				entityHandle,
				isTracking,
			}),
		);
	}

	/**
	 * Gets whether the grab interactable tracks scale.
	 * @param entityHandle The target entity.
	 * @returns True if scale tracking is enabled.
	 */
	static GetTrackScale(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetTrackScale", {
				entityHandle,
			}),
		);
	}

	/**
	 * Enables or disables scale tracking on the grab interactable.
	 * @param entityHandle The target entity.
	 * @param isTracking Whether to enable scale tracking.
	 * @returns True if the change was applied.
	 */
	static SetTrackScale(entityHandle: Entity, isTracking: boolean): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_SetTrackScale", {
				entityHandle,
				isTracking,
			}),
		);
	}

	/**
	 * Gets whether the object should apply physics-based throw on detach.
	 * @param entityHandle The target entity.
	 * @returns True if throw-on-detach is enabled.
	 */
	static GetThrowOnDetach(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetThrowOnDetach", {
				entityHandle,
			}),
		);
	}

	/**
	 * Enables or disables physics-based throwing on detach.
	 * @param entityHandle The target entity.
	 * @param enable Whether to enable throw-on-detach.
	 * @returns True if the setting was successfully changed.
	 */
	static SetThrowOnDetach(entityHandle: Entity, enable: boolean): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_SetThrowOnDetach", {
				entityHandle,
				enable,
			}),
		);
	}

	/**
	 * Gets the currently attached entity handle, if any.
	 * @param entityHandle The entity whose attachment is being queried.
	 * @returns True if the query was successful. The actual value is assumed returned via RPC side effect or callback.
	 */
	static GetAttachEntity(entityHandle: Entity): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_GetAttachEntity", {
				entityHandle,
			}),
		);
	}

	/**
	 * Sets the entity that should be used as the attachment target for this grab interactable.
	 * @param entityHandle The source grab interactable entity.
	 * @param attachEntityHandle The target entity to attach to.
	 * @returns True if the attachment was successfully updated.
	 */
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

	/**
	 * Registers a callback to be invoked when the object is selected (grabbed).
	 * @param entityHandle The entity to observe.
	 * @param onSelectEntered Callback function to invoke on select enter.
	 * @returns True if the callback was registered successfully.
	 */
	static AddSelectEnteredCallback(
		entityHandle: Entity,
		onSelectEntered: (
			interactableEntity: Entity,
			interactorEntity: Entity,
		) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_AddSelectEnteredCallback", {
				entityHandle,
				onSelectEntered: (args: any) => {
					onSelectEntered(args.interactableEntity, args.interactorEntity);
				},
			}),
		);
	}

	/**
	 * Registers a callback to be invoked when the object is released (deselected).
	 * @param entityHandle The entity to observe.
	 * @param onSelectExited Callback function to invoke on select exit.
	 * @returns True if the callback was registered successfully.
	 */
	static AddSelectExitedCallback(
		entityHandle: Entity,
		onSelectExited: (
			interactableEntity: Entity,
			interactorEntity: Entity,
		) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_AddSelectExitedCallback", {
				entityHandle,
				onSelectExited: (args: any) => {
					onSelectExited(args.interactableEntity, args.interactorEntity);
				},
			}),
		);
	}

	/**
	 * Registers a callback to be invoked when the object is activated (e.g. trigger pressed).
	 * @param entityHandle The entity to observe.
	 * @param onActivated Callback function to invoke on activation.
	 * @returns True if the callback was registered successfully.
	 */
	static AddActivatedCallback(
		entityHandle: Entity,
		onActivated: (interactableEntity: Entity, interactorEntity: Entity) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_AddActivatedCallback", {
				entityHandle,
				onActivated: (args: any) => {
					onActivated(args.interactableEntity, args.interactorEntity);
				},
			}),
		);
	}

	/**
	 * Registers a callback to be invoked when the object is deactivated (e.g. trigger released).
	 * @param entityHandle The entity to observe.
	 * @param onDeactivated Callback function to invoke on deactivation.
	 * @returns True if the callback was registered successfully.
	 */
	static AddDeactivatedCallback(
		entityHandle: Entity,
		onDeactivated: (
			interactableEntity: Entity,
			interactorEntity: Entity,
		) => void,
	): boolean {
		return Boolean(
			RpcClient.Call("GrabInteractableAPI_AddDeactivatedCallback", {
				entityHandle,
				onDeactivated: (args: any) => {
					onDeactivated(args.interactableEntity, args.interactorEntity);
				},
			}),
		);
	}
}
