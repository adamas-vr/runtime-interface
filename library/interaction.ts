/**
 * APIs for creating and updating grab interactables.
 *
 * @module interaction
 */
import { Entity, EntityManager } from "./entity";
import { Networking } from "./networking";
import { RigidbodyManager } from "./physics/rigidbody";
import { RpcClient } from "./rpc";

/**
 * Supported movement types for grab interactions.
 */
export enum MovementType {
	/** Velocity-tracked movement. */
	VelocityTracking = 0,
	/** Kinematic movement. */
	Kinematic = 1,
	/** Instantaneous movement. */
	Instantaneous = 2,
}

/**
 * Creates and updates grab interactable components.
 */
export class GrabInteractableManager {
	/**
	 * Creates a grab interactable component on an entity.
	 *
	 * Colliders added before the component is created are used for interaction
	 * detection. Interaction states include hover, select, and activate.
	 * Hover begins when a user's hand touches or points at the
	 * collider, select begins when the user presses the grip input to grab the
	 * entity, and activate begins when the user presses the trigger input.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the grab interactable
	 * component was created, or `false` otherwise.
	 */
	static Create(entity: Entity) {
		if (!RigidbodyManager.HasComponent(entity)) {
			RigidbodyManager.Create(entity);
		}

		return RpcClient.Call<boolean>("Grab::Create", entity);
	}

	/**
	 * Makes a grab interactable network-aware.
	 *
	 * The grab interactable can then be used by network users, and its transform
	 * is synchronized across the network session. An error is thrown in local mode
	 * or when the entity does not use a network transform.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves when network grab behavior has been
	 * configured.
	 */
	static async MakeNetworkGrabble(entity: Entity) {
		if (
			!(await Networking.IsLocalMode()) &&
			!(await Networking.IsNetworkTransform(entity))
		) {
			const name = await EntityManager.GetName(entity);
			throw `Entity ${name} must have network transform to make network grabble`;
		}

		const networkValue = Networking.NewVariable(
			await Networking.GetMasterClientId(),
			async (playerId) => {
				if (playerId == (await Networking.GetClientId())) {
					await Networking.SyncLocalTransform(entity);
				} else {
					await GrabInteractableManager.CancelSelect(entity);
				}
			},
		);

		await GrabInteractableManager.AddSelectEnteredCallback(
			entity,
			async () => (networkValue.value = await Networking.GetClientId()),
		);
		await GrabInteractableManager.AddSelectExitedCallback(
			entity,
			() => (networkValue.value = -1),
		);
	}

	/**
	 * Removes a grab interactable component from an entity.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the component was removed, or
	 * `false` otherwise.
	 */
	static Destroy(entity: Entity) {
		return RpcClient.Call<boolean>("Grab::Destroy", entity);
	}

	/**
	 * Checks whether an entity has a grab interactable component.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the component exists, or
	 * `false` otherwise.
	 */
	static HasComponent(entity: Entity) {
		return RpcClient.Call<boolean>("Grab::HasComponent", entity);
	}

	/**
	 * Sets whether a grab interactable component is enabled.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param enabled - Whether the grab interactable component is enabled.
	 * @returns A promise that resolves when the enabled state has been changed.
	 */
	static SetEnabled(entity: Entity, enabled: boolean) {
		return RpcClient.Call<void>("Grab::SetEnabled", entity, enabled);
	}

	/**
	 * Gets whether a grab interactable component is enabled.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the component is enabled, or
	 * `false` otherwise.
	 */
	static GetEnabled(entity: Entity) {
		return RpcClient.Call<boolean>("Grab::GetEnabled", entity);
	}

	/**
	 * Gets whether the grab interactable tracks position.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if position tracking is enabled,
	 * or `false` otherwise.
	 */
	static GetTrackPosition(entity: Entity) {
		return RpcClient.Call<boolean>("Grab::GetTrackPosition", entity);
	}

	/**
	 * Sets whether a grab interactable tracks position.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param isTracking - Whether position tracking is enabled.
	 * @returns A promise that resolves when the setting has been changed.
	 */
	static SetTrackPosition(entity: Entity, isTracking: boolean) {
		return RpcClient.Call<void>("Grab::SetTrackPosition", entity, isTracking);
	}

	/**
	 * Gets whether the grab interactable tracks rotation.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if rotation tracking is enabled,
	 * or `false` otherwise.
	 */
	static GetTrackRotation(entity: Entity) {
		return RpcClient.Call<boolean>("Grab::GetTrackRotation", entity);
	}

	/**
	 * Sets whether a grab interactable tracks rotation.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param isTracking - Whether rotation tracking is enabled.
	 * @returns A promise that resolves when the setting has been changed.
	 */
	static SetTrackRotation(entity: Entity, isTracking: boolean) {
		return RpcClient.Call<void>("Grab::SetTrackRotation", entity, isTracking);
	}

	/**
	 * Gets whether a grab interactable applies physics-based throwing on detach.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if throw-on-detach is enabled, or
	 * `false` otherwise.
	 */
	static GetThrowOnDetach(entity: Entity) {
		return RpcClient.Call<boolean>("Grab::GetThrowOnDetach", entity);
	}

	/**
	 * Sets whether a grab interactable applies physics-based throwing on detach.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param enable - Whether throw-on-detach is enabled.
	 * @returns A promise that resolves when the setting has been changed.
	 */
	static SetThrowOnDetach(entity: Entity, enable: boolean) {
		return RpcClient.Call<void>("Grab::SetThrowOnDetach", entity, enable);
	}

	/**
	 * Gets the attach entity of a grab interactable.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the attached {@link Entity}.
	 */
	static GetAttachEntity(entity: Entity) {
		return RpcClient.Call<Entity>("Grab::GetAttachEntity", entity);
	}

	/**
	 * Sets the attach entity of a grab interactable.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param attachEntity - The target {@link Entity} to attach to.
	 * @returns A promise that resolves when the attach entity has been changed.
	 */
	static SetAttachEntity(entity: Entity, attachEntity: Entity) {
		return RpcClient.Call<void>("Grab::SetAttachEntity", entity, attachEntity);
	}

	/**
	 * Sets whether hover activation is allowed.
	 *
	 * When enabled, the object can be activated with the trigger input while it is
	 * hovered, without being selected first.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param allowHoverActivate - Whether hover activation is allowed.
	 * @returns A promise that resolves when the setting has been changed.
	 */
	static SetAllowHoverActivate(entity: Entity, allowHoverActivate: boolean) {
		return RpcClient.Call<void>(
			"Grab::SetAllowHoverActivate",
			entity,
			allowHoverActivate,
		);
	}

	/**
	 * Gets whether hover activation is allowed.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if hover activation is allowed,
	 * or `false` otherwise.
	 */
	static GetAllowHoverActivate(entity: Entity) {
		return RpcClient.Call<boolean>("Grab::GetAllowHoverActivate", entity);
	}

	/**
	 * Sets whether dynamic attach is enabled.
	 *
	 * When enabled, the object can be grabbed directly at the collider contact
	 * point, and the attach anchor does not move to the hand transform.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param dynamicAttach - Whether dynamic attach is enabled.
	 * @returns A promise that resolves when the setting has been changed.
	 */
	static SetDynamicAttach(entity: Entity, dynamicAttach: boolean) {
		return RpcClient.Call<void>(
			"Grab::SetDynamicAttach",
			entity,
			dynamicAttach,
		);
	}

	/**
	 * Gets whether dynamic attach is enabled.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if dynamic attach is enabled, or
	 * `false` otherwise.
	 */
	static GetDynamicAttach(entity: Entity) {
		return RpcClient.Call<boolean>("Grab::GetDynamicAttach", entity);
	}

	/**
	 * Sets the movement type of a grab interactable.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @param movementType - The movement type to assign.
	 * @returns A promise that resolves when the movement type has been changed.
	 */
	static SetMovementType(entity: Entity, movementType: MovementType) {
		return RpcClient.Call<void>("Grab::SetMovementType", entity, movementType);
	}

	/**
	 * Gets the movement type of a grab interactable.
	 *
	 * @param entity - The {@link Entity} to inspect.
	 * @returns A promise that resolves to the movement type.
	 */
	static GetMovementType(entity: Entity) {
		return RpcClient.Call<MovementType>("Grab::GetMovementType", entity);
	}

	/**
	 * Cancels the current select state of a grab interactable.
	 *
	 * @param entity - The {@link Entity} to update.
	 * @returns A promise that resolves when the select state has been canceled.
	 */
	static CancelSelect(entity: Entity) {
		return RpcClient.Call<void>("Grab::CancelSelect", entity);
	}

	/**
	 * Registers a callback for hover enter events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onHoverEntered - The callback invoked when hover begins.
	 * @returns A promise that resolves when the callback has been registered.
	 */
	static AddHoverEnteredCallback(
		entity: Entity,
		onHoverEntered: (
			interactableEntity: Entity,
			interactorEntity: Entity,
		) => void,
	) {
		return RpcClient.Call<void>(
			"Grab::AddHoverEnteredCallback",
			RpcClient.GetClientId(),
			entity,
			onHoverEntered,
		);
	}

	/**
	 * Registers a callback for hover exit events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onHoverExited - The callback invoked when hover ends.
	 * @returns A promise that resolves when the callback has been registered.
	 */
	static AddHoverExitedCallback(
		entity: Entity,
		onHoverExited: (
			interactableEntity: Entity,
			interactorEntity: Entity,
		) => void,
	) {
		return RpcClient.Call<void>(
			"Grab::AddHoverExitedCallback",
			RpcClient.GetClientId(),
			entity,
			onHoverExited,
		);
	}

	/**
	 * Registers a callback for select enter events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onSelectEntered - The callback invoked when selection begins.
	 * @returns A promise that resolves when the callback has been registered.
	 */
	static AddSelectEnteredCallback(
		entity: Entity,
		onSelectEntered: (
			interactableEntity: Entity,
			interactorEntity: Entity,
		) => void,
	) {
		return RpcClient.Call<void>(
			"Grab::AddSelectEnteredCallback",
			RpcClient.GetClientId(),
			entity,
			onSelectEntered,
		);
	}

	/**
	 * Registers a callback for select exit events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onSelectExited - The callback invoked when selection ends.
	 * @returns A promise that resolves when the callback has been registered.
	 */
	static AddSelectExitedCallback(
		entity: Entity,
		onSelectExited: (
			interactableEntity: Entity,
			interactorEntity: Entity,
		) => void,
	) {
		return RpcClient.Call<void>(
			"Grab::AddSelectExitedCallback",
			RpcClient.GetClientId(),
			entity,
			onSelectExited,
		);
	}

	/**
	 * Registers a callback for activate events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onActivated - The callback invoked when activation begins.
	 * @returns A promise that resolves when the callback has been registered.
	 */
	static AddActivatedCallback(
		entity: Entity,
		onActivated: (interactableEntity: Entity, interactorEntity: Entity) => void,
	) {
		return RpcClient.Call<void>(
			"Grab::AddActivatedCallback",
			RpcClient.GetClientId(),
			entity,
			onActivated,
		);
	}

	/**
	 * Registers a callback for deactivate events.
	 *
	 * @param entity - The {@link Entity} to observe.
	 * @param onDeactivated - The callback invoked when activation ends.
	 * @returns A promise that resolves when the callback has been registered.
	 */
	static AddDeactivatedCallback(
		entity: Entity,
		onDeactivated: (
			interactableEntity: Entity,
			interactorEntity: Entity,
		) => void,
	) {
		return RpcClient.Call<void>(
			"Grab::AddDeactivatedCallback",
			RpcClient.GetClientId(),
			entity,
			onDeactivated,
		);
	}
}
