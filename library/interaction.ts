import { Entity, EntityManager } from "./entity";
import { Networking } from "./networking";
import { RigidbodyManager } from "./physics/rigidbody";
import { RpcClient } from "./rpc";

export enum MovementType {
	VelocityTracking = 0,
	Kinematic = 1,
	Instantaneous = 2,
}

export class GrabInteractableManager {
	/**
	 * Creates a grab interactable component for the specified entity.
	 * All colliders added before this component is add are used to detect grabbing
	 * @param entity The entity to attach the grab interactable to.
	 * @returns A handle representing the newly created grab interactable.
	 */
	static Create(...args: [entity: Entity]) {
		if (!RigidbodyManager.HasComponent(args[0])) {
			RigidbodyManager.Create(args[0]);
		}

		return RpcClient.Call<boolean>("Grab::Create", ...args);
	}

	static async MakeNetworkGrabble(...args: [entity: Entity]) {
		if (
			!(await Networking.IsLocalMode()) &&
			!(await Networking.IsNetworkTransform(args[0]))
		) {
			//TODO: async
			const name = EntityManager.GetName(args[0]);
			throw `Entity ${name} must have network transform to make network grabble`;
		}

		const networkValue = Networking.NewVariable(
			await Networking.GetMasterClientId(),
			async (playerId) => {
				if (playerId == (await Networking.GetClientId())) {
					await Networking.SyncLocalTransform(args[0]);
				} else {
					await GrabInteractableManager.CancelSelect(args[0]);
				}
			},
		);

		await GrabInteractableManager.AddSelectEnteredCallback(
			args[0],
			async () => (networkValue.value = await Networking.GetClientId()),
		);
		await GrabInteractableManager.AddSelectExitedCallback(
			args[0],
			() => (networkValue.value = -1),
		);
	}

	/**
	 * Destroys the grab interactable component on the given entity.
	 * @param entity The entity whose grab interactable should be destroyed.
	 * @returns True if the component was successfully destroyed.
	 */
	static Destroy(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Grab::Destroy", ...args);
	}

	/**
	 * Checks if the specified entity has a grab interactable component.
	 * @param entity The entity to check.
	 * @returns True if the component exists.
	 */
	static HasComponent(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Grab::HasComponent", ...args);
	}

	/**
	 * Set if the GrabInteractable component is enabled
	 * @param entity The entity with the renderable component
	 * @param enabled If the GrabInteractable component is enabled
	 * @returns boolean indicating success
	 */
	static SetEnabled(...args: [entity: Entity, enabled: boolean]) {
		return RpcClient.Call<void>("Grab::SetEnabled", ...args);
	}

	static GetEnabled(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Grab::GetEnabled", ...args);
	}

	/**
	 * Gets whether the grab interactable tracks position.
	 * @param entity The target entity.
	 * @returns True if position tracking is enabled.
	 */
	static GetTrackPosition(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Grab::GetTrackPosition", ...args);
	}

	/**
	 * Enables or disables position tracking on the grab interactable.
	 * @param entity The target entity.
	 * @param isTracking Whether to enable position tracking.
	 * @returns True if the change was applied.
	 */
	static SetTrackPosition(...args: [entity: Entity, isTracking: boolean]) {
		return RpcClient.Call<void>("Grab::SetTrackPosition", ...args);
	}

	/**
	 * Gets whether the grab interactable tracks rotation.
	 * @param entity The target entity.
	 * @returns True if rotation tracking is enabled.
	 */
	static GetTrackRotation(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Grab::GetTrackRotation", ...args);
	}

	/**
	 * Enables or disables rotation tracking on the grab interactable.
	 * @param entity The target entity.
	 * @param isTracking Whether to enable rotation tracking.
	 * @returns True if the change was applied.
	 */
	static SetTrackRotation(...args: [entity: Entity, isTracking: boolean]) {
		return RpcClient.Call<void>("Grab::SetTrackRotation", ...args);
	}

	/**
	 * Gets whether the object should apply physics-based throw on detach.
	 * @param entity The target entity.
	 * @returns True if throw-on-detach is enabled.
	 */
	static GetThrowOnDetach(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Grab::GetThrowOnDetach", ...args);
	}

	/**
	 * Enables or disables physics-based throwing on detach.
	 * @param entity The target entity.
	 * @param enable Whether to enable throw-on-detach.
	 * @returns True if the setting was successfully changed.
	 */
	static SetThrowOnDetach(...args: [entity: Entity, enable: boolean]) {
		return RpcClient.Call<void>("Grab::SetThrowOnDetach", ...args);
	}

	/**
	 * Gets the currently attached entity handle, if any.
	 * @param entity The entity whose attachment is being queried.
	 * @returns True if the query was successful. The actual value is assumed returned via RPC side effect or callback.
	 */
	static GetAttachEntity(...args: [entity: Entity]) {
		return RpcClient.Call<Entity>("Grab::GetAttachEntity", ...args);
	}

	/**
	 * Sets the entity that should be used as the attachment target for this grab interactable.
	 * @param entity The source grab interactable entity.
	 * @param attachentity The target entity to attach to.
	 * @returns True if the attachment was successfully updated.
	 */
	static SetAttachEntity(...args: [entity: Entity, attachentity: Entity]) {
		return RpcClient.Call<void>("Grab::SetAttachEntity", ...args);
	}

	static SetAllowHoverActivate(
		...args: [entity: Entity, allowHoverActivate: boolean]
	) {
		return RpcClient.Call<void>("Grab::SetAllowHoverActivate", ...args);
	}

	static GetAllowHoverActivate(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Grab::GetAllowHoverActivate", ...args);
	}

	static SetDynamicAttach(...args: [entity: Entity, dynamicAttach: boolean]) {
		return RpcClient.Call<void>("Grab::SetDynamicAttach", ...args);
	}

	static GetDynamicAttach(...args: [entity: Entity]) {
		return RpcClient.Call<boolean>("Grab::GetDynamicAttach", ...args);
	}

	static SetMovementType(
		...args: [entity: Entity, movementType: MovementType]
	) {
		return RpcClient.Call<void>("Grab::SetMovementType", ...args);
	}

	static GetMovementType(...args: [entity: Entity]) {
		return RpcClient.Call<MovementType>("Grab::GetMovementType", ...args);
	}

	static CancelSelect(...args: [entity: Entity]) {
		return RpcClient.Call<void>("Grab::CancelSelect", ...args);
	}

	/**
	 * Registers a callback to be invoked when the object is hovered.
	 * @param entity The entity to observe.
	 * @param onHoverEntered Callback function to invoke on hover enter.
	 * @returns True if the callback was registered successfully.
	 */
	static AddHoverEnteredCallback(
		...args: [
			entity: Entity,
			onHoverEntered: (
				interactableEntity: Entity,
				interactorEntity: Entity,
			) => void,
		]
	) {
		return RpcClient.Call<void>(
			"Grab::AddHoverEnteredCallback",
			RpcClient.GetClientId(),
			...args,
		);
	}

	/**
	 * Registers a callback to be invoked when the object is unhovered.
	 * @param entity The entity to observe.
	 * @param onHoverExited Callback function to invoke on hover exit.
	 * @returns True if the callback was registered successfully.
	 */
	static AddHoverExitedCallback(
		...args: [
			entity: Entity,
			onHoverExited: (
				interactableEntity: Entity,
				interactorEntity: Entity,
			) => void,
		]
	) {
		return RpcClient.Call<void>(
			"Grab::AddHoverExitedCallback",
			RpcClient.GetClientId(),
			...args,
		);
	}

	/**
	 * Registers a callback to be invoked when the object is selected (grabbed).
	 * @param entity The entity to observe.
	 * @param onSelectEntered Callback function to invoke on select enter.
	 * @returns True if the callback was registered successfully.
	 */
	static AddSelectEnteredCallback(
		...args: [
			entity: Entity,
			onSelectEntered: (
				interactableEntity: Entity,
				interactorEntity: Entity,
			) => void,
		]
	) {
		return RpcClient.Call<void>(
			"Grab::AddSelectEnteredCallback",
			RpcClient.GetClientId(),
			...args,
		);
	}

	/**
	 * Registers a callback to be invoked when the object is released (deselected).
	 * @param entity The entity to observe.
	 * @param onSelectExited Callback function to invoke on select exit.
	 * @returns True if the callback was registered successfully.
	 */
	static AddSelectExitedCallback(
		...args: [
			entity: Entity,
			onSelectExited: (
				interactableEntity: Entity,
				interactorEntity: Entity,
			) => void,
		]
	) {
		return RpcClient.Call<void>(
			"Grab::AddSelectExitedCallback",
			RpcClient.GetClientId(),
			...args,
		);
	}

	/**
	 * Registers a callback to be invoked when the object is activated (e.g. trigger pressed).
	 * @param entity The entity to observe.
	 * @param onActivated Callback function to invoke on activation.
	 * @returns True if the callback was registered successfully.
	 */
	static AddActivatedCallback(
		...args: [
			entity: Entity,
			onActivated: (
				interactableEntity: Entity,
				interactorEntity: Entity,
			) => void,
		]
	) {
		return RpcClient.Call<void>(
			"Grab::AddActivatedCallback",
			RpcClient.GetClientId(),
			...args,
		);
	}

	/**
	 * Registers a callback to be invoked when the object is deactivated (e.g. trigger released).
	 * @param entity The entity to observe.
	 * @param onDeactivated Callback function to invoke on deactivation.
	 * @returns True if the callback was registered successfully.
	 */
	static AddDeactivatedCallback(
		...args: [
			entity: Entity,
			onDeactivated: (
				interactableEntity: Entity,
				interactorEntity: Entity,
			) => void,
		]
	) {
		return RpcClient.Call<void>(
			"Grab::AddDeactivatedCallback",
			RpcClient.GetClientId(),
			...args,
		);
	}
}
