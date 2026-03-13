import { RpcClient } from "./rpc";
import { Project } from "./project";
import { Entity } from "./entity";
import { User } from "./user";

export interface NetworkState<T> {
	value: T;
}

//TODO: API call OnSetup check

export class Networking {
	static #stateKey = 0;
	static #KeyGen() {
		return Networking.#stateKey++;
	}
	static #channelNameMap = new Map<string, number>();

	static #NewChannel(
		...args: [
			channelId: number,
			onReceived: (sender: number, payload: string) => void,
		]
	) {
		return RpcClient.Call<void>(
			"Networking::NewChannel",
			Networking.GetNetworkID(),
			...args,
		);
	}

	static #SendMessageTo(
		...args: [playerId: number, channelId: number, payload: string]
	) {
		return RpcClient.Call<void>(
			"Networking::SendMessageTo",
			Networking.GetNetworkID(),
			...args,
		);
	}

	static #BroadcastMessage(...args: [channelId: number, payload: string]) {
		return RpcClient.Call<void>(
			"Networking::BroadcastMessage",
			Networking.GetNetworkID(),
			...args,
		);
	}

	static GetNetworkID() {
		return Project.GetProjectId();
	}

	static IsLocalMode(...args: []) {
		return RpcClient.Call<boolean>("Networking::IsLocalMode", ...args);
	}

	static IsMasterClient(...args: []) {
		return RpcClient.Call<boolean>("Networking::IsMasterClient", ...args);
	}

	static GetClientId(...args: []) {
		return RpcClient.Call<number>("Networking::GetClientId", ...args);
	}

	static GetMasterClientId(...args: []) {
		return RpcClient.Call<number>(
			"Networking::GetMasterClientId",
			Networking.GetNetworkID(),
			...args,
		);
	}

	static MakeNetworkTransform(...args: [entityHandle: Entity]) {
		return RpcClient.Call<boolean>(
			"Networking::MakeNetworkTransform",
			Networking.GetNetworkID(),
			...args,
			this.#KeyGen(),
		);
	}

	static IsNetworkTransform(...args: [entityHandle: Entity]) {
		return RpcClient.Call<boolean>(
			"Networking::IsNetworkTransform",
			Networking.GetNetworkID(),
			...args,
		);
	}

	static SyncLocalTransform(...args: [entityHandle: Entity]) {
		return RpcClient.Call<boolean>(
			"Networking::SyncLocalTransform",
			Networking.GetNetworkID(),
			...args,
		);
	}

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

	static SendMessageTo(playerId: number, channelName: string, payload: string) {
		const channelId = this.#channelNameMap.get(channelName);
		if (channelId === undefined) {
			throw `Failed to send message: channel ${channelName} cannot be found`;
		}

		this.#SendMessageTo(playerId, channelId, payload);
	}

	static BroadcastMessage(channelName: string, payload: string) {
		const channelId = this.#channelNameMap.get(channelName);
		if (channelId === undefined) {
			throw `Failed to broadcast message: channel ${channelName} cannot be found`;
		}

		this.#BroadcastMessage(channelId, payload);
	}

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

	static OnUserJoined(onUserJoined: (user: User) => void) {
		return RpcClient.Call<void>(
			"Networking::OnUserJoined",
			RpcClient.GetClientId(),
			(userId: string) => onUserJoined(new User(userId)),
		);
	}
	static OnUserLeft(onUserLeft: (user: User) => void) {
		return RpcClient.Call<void>(
			"Networking::OnUserLeft",
			RpcClient.GetClientId(),
			(userId: string) => onUserLeft(new User(userId)),
		);
	}
}
