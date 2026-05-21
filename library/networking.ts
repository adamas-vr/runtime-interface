/**
 * APIs for network state, messaging, and user session events.
 *
 * @module networking
 */
import { RpcClient } from "./rpc";
import { Project } from "./project";
import { Entity } from "./entity";
import { User } from "./user";

/**
 * Network state.
 */
export interface NetworkState<T> {
	/** Current state value. */
	value: T;
}

/**
 * Provides networking utilities for state synchronization, messaging, and user
 * session events.
 */
export class Networking {
	static #stateKey = 0;
	static #KeyGen() {
		return Networking.#stateKey++;
	}
	static #channelNameMap = new Map<string, number>();

	static #NewChannel(
		channelId: number,
		onReceived: (sender: number, payload: string) => void,
	) {
		return RpcClient.Call<void>(
			"Networking::NewChannel",
			RpcClient.GetClientId(),
			Networking.GetNetworkID(),
			channelId,
			onReceived,
		);
	}

	static #SendMessageTo(playerId: number, channelId: number, payload: string) {
		return RpcClient.Call<void>(
			"Networking::SendMessageTo",
			Networking.GetNetworkID(),
			playerId,
			channelId,
			payload,
		);
	}

	static #BroadcastMessage(channelId: number, payload: string) {
		return RpcClient.Call<void>(
			"Networking::BroadcastMessage",
			Networking.GetNetworkID(),
			channelId,
			payload,
		);
	}

	/**
	 * Gets the network identifier for the current project session.
	 *
	 * @returns The network identifier.
	 */
	static GetNetworkID() {
		return Project.GetProjectId();
	}

	/**
	 * Checks whether networking is running in local mode.
	 *
	 * @returns A promise that resolves to `true` if local mode is enabled, or
	 * `false` otherwise.
	 */
	static IsLocalMode() {
		return RpcClient.Call<boolean>("Networking::IsLocalMode");
	}

	/**
	 * Checks whether the current client is the master client.
	 *
	 * @returns A promise that resolves to `true` if the current client is the
	 * master client, or `false` otherwise.
	 */
	static IsMasterClient() {
		return RpcClient.Call<boolean>("Networking::IsMasterClient");
	}

	/**
	 * Gets the current client ID.
	 *
	 * @returns A promise that resolves to the current client ID.
	 */
	static GetClientId() {
		return RpcClient.Call<number>("Networking::GetClientId");
	}

	/**
	 * Gets the master client ID.
	 *
	 * @returns A promise that resolves to the master client ID.
	 */
	static GetMasterClientId() {
		return RpcClient.Call<number>(
			"Networking::GetMasterClientId",
			Networking.GetNetworkID(),
		);
	}

	/**
	 * Makes an entity use a network transform.
	 *
	 * The transform is synchronized across clients that have joined the same
	 * network session.
	 *
	 * @param entityHandle - The {@link Entity} to update.
	 * @returns A promise that resolves to `true` if the network transform was
	 * created, or `false` otherwise.
	 */
	static MakeNetworkTransform(entityHandle: Entity) {
		return RpcClient.Call<boolean>(
			"Networking::MakeNetworkTransform",
			Networking.GetNetworkID(),
			entityHandle,
			this.#KeyGen(),
		);
	}

	/**
	 * Checks whether an entity uses a network transform.
	 *
	 * @param entityHandle - The {@link Entity} to inspect.
	 * @returns A promise that resolves to `true` if the entity uses a network
	 * transform, or `false` otherwise.
	 */
	static IsNetworkTransform(entityHandle: Entity) {
		return RpcClient.Call<boolean>(
			"Networking::IsNetworkTransform",
			Networking.GetNetworkID(),
			entityHandle,
		);
	}

	/**
	 * Synchronizes the local transform of an entity to the network session.
	 *
	 * The client that calls this method updates the local entity transform for all
	 * clients in the same network session.
	 *
	 * @param entityHandle - The {@link Entity} to synchronize.
	 * @returns A promise that resolves to `true` if the transform was
	 * synchronized, or `false` otherwise.
	 */
	static SyncLocalTransform(entityHandle: Entity) {
		return RpcClient.Call<boolean>(
			"Networking::SyncLocalTransform",
			Networking.GetNetworkID(),
			entityHandle,
		);
	}

	/**
	 * Creates a named message channel.
	 *
	 * @param channelName - The channel name.
	 * @param onReceived - The callback invoked when a message is received.
	 */
	static NewChannel(
		channelName: string,
		onReceived: (sender: number, payload: string) => void,
	) {
		if (this.#channelNameMap.has(channelName)) {
			throw `Failed to create channel: Channel ${channelName} has already been created`;
		}

		const channelId = this.#KeyGen();
		this.#channelNameMap.set(channelName, channelId);
		this.#NewChannel(channelId, onReceived);
	}

	/**
	 * Sends a message to a specific player on a named channel.
	 *
	 * @param playerId - The target player ID.
	 * @param channelName - The channel name.
	 * @param payload - The message payload.
	 */
	static SendMessageTo(playerId: number, channelName: string, payload: string) {
		const channelId = this.#channelNameMap.get(channelName);
		if (channelId === undefined) {
			throw `Failed to send message: channel ${channelName} cannot be found`;
		}

		this.#SendMessageTo(playerId, channelId, payload);
	}

	/**
	 * Broadcasts a message to all players on a named channel.
	 *
	 * @param channelName - The channel name.
	 * @param payload - The message payload.
	 */
	static BroadcastMessage(channelName: string, payload: string) {
		const channelId = this.#channelNameMap.get(channelName);
		if (channelId === undefined) {
			throw `Failed to broadcast message: channel ${channelName} cannot be found`;
		}

		this.#BroadcastMessage(channelId, payload);
	}

	/**
	 * Creates a synchronized network variable.
	 *
	 * The returned state object holds the same value for all clients in the same
	 * network session. Changes to `value` are broadcast to the session.
	 *
	 * @param initialValue - The initial state value.
	 * @param onStateChange - The callback invoked when the state value changes.
	 * It is also invoked when the initial value is first assigned to the network
	 * state.
	 * @returns The synchronized {@link NetworkState}.
	 */
	static NewVariable<T>(
		initialValue: T,
		onStateChange?: (state: T) => void,
	): NetworkState<T> {
		const internalState = { value: initialValue };
		const syncKey = Networking.#KeyGen();
		const initKey = Networking.#KeyGen();
		let initialized = false;

		const proxy = new Proxy(internalState, {
			get(target, prop) {
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				Reflect.set(target, prop, value);
				onStateChange?.(internalState.value);
				Networking.#BroadcastMessage(syncKey, JSON.stringify(value));
				return true;
			},
		});

		Networking.#NewChannel(syncKey, (_, payload) => {
			console.log("NewVariable onReceived: " + payload);
			const received = JSON.parse(payload);
			internalState.value = received;
			onStateChange?.(internalState.value);
		});

		Networking.#NewChannel(initKey, (playerId, payload) => {
			const { msgType, msg } = JSON.parse(payload);
			if (msgType === "req" && initialized) {
				Networking.#SendMessageTo(
					playerId,
					initKey,
					JSON.stringify({ msgType: "rsp", msg: internalState.value }),
				);
			} else if (msgType === "rsp" && !initialized) {
				internalState.value = msg;
				initialized = true;
				onStateChange?.(internalState.value);
			}
		});

		Networking.IsMasterClient().then((isMaster) => {
			if (isMaster) {
				initialized = true;
				onStateChange?.(internalState.value);
			} else {
				// Not very efficient
				this.#BroadcastMessage(
					initKey,
					JSON.stringify({ msgType: "req", msg: "" }),
				);
				setTimeout(() => {
					if (!initialized) {
						initialized = true;
						onStateChange?.(internalState.value);
					}
				}, 2000);
			}
		});

		return proxy;
	}

	/**
	 * Creates a synchronized network function.
	 *
	 * Calling the returned function locally broadcasts the call arguments to the
	 * network session.
	 *
	 * @param func - The function to synchronize.
	 * @returns The synchronized function.
	 */
	static NewFunction<F extends (...args: any[]) => any>(func: F) {
		const key = Networking.#KeyGen();

		const callFunction = (...args: Parameters<F>) => {
			func(...args);
			Networking.#BroadcastMessage(key, JSON.stringify(args));
		};

		this.#NewChannel(key, (_, payload) => {
			console.log("NewFunction onReceived: " + payload);
			const received = JSON.parse(payload) as Parameters<F>;
			func(...received);
		});

		return callFunction;
	}

	/**
	 * Registers a callback for user join events.
	 *
	 * @param onUserJoined - The callback invoked when a user joins.
	 * @returns A promise that resolves when the callback has been registered.
	 */
	static OnUserJoined(onUserJoined: (user: User) => void) {
		return RpcClient.Call<void>(
			"Networking::OnUserJoined",
			RpcClient.GetClientId(),
			(userId: string) => onUserJoined(new User(userId)),
		);
	}

	/**
	 * Registers a callback for user leave events.
	 *
	 * @param onUserLeft - The callback invoked when a user leaves.
	 * @returns A promise that resolves when the callback has been registered.
	 */
	static OnUserLeft(onUserLeft: (user: User) => void) {
		return RpcClient.Call<void>(
			"Networking::OnUserLeft",
			RpcClient.GetClientId(),
			(userId: string) => onUserLeft(new User(userId)),
		);
	}
}
