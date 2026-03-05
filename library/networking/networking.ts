import { RpcClient } from "../rpc";
import { Project } from "../project";
import { Entity } from "../entity";
import { User } from "../user";

export type StateRef<T> = { value: T };

//TODO: missing onPlayerJoined and onPlayerLeaving
// network sync entity state authority
// API call OnSetup check

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
		RpcClient.Call("Networking::NewChannel", {
			networkId: Networking.GetNetworkID(),
			channelId,
			onReceived: ({ sender, data }: { sender: number; data: string }) => {
				onReceived(sender, data);
			},
		});
	}

	static #SendMessageTo(playerId: number, channelId: number, payload: string) {
		RpcClient.Call("Networking::SendMessageTo", {
			networkId: Networking.GetNetworkID(),
			playerId,
			channelId,
			payload,
		});
	}

	static #BroadcastMessage(channelId: number, payload: string) {
		RpcClient.Call("Networking::BroadcastMessage", {
			networkId: Networking.GetNetworkID(),
			channelId,
			payload,
		});
	}

	static GetNetworkID(): string {
		return Project.GetProjectId();
	}

	static IsLocalMode(): boolean {
		return RpcClient.Call("Networking::IsLocalMode", {}) as boolean;
	}

	static IsMasterClient(): boolean {
		return RpcClient.Call("Networking::IsMasterClient", {}) as boolean;
	}

	static GetClientId(): number {
		return RpcClient.Call("Networking::GetClientId", {}) as number;
	}

	static GetMasterClientId(): number {
		return RpcClient.Call("Networking::GetMasterClientId", {
			networkId: Networking.GetNetworkID(),
		}) as number;
	}

	static MakeNetworkTransform(entityHandle: Entity) {
		return RpcClient.Call("Networking::MakeNetworkTransform", {
			networkId: Networking.GetNetworkID(),
			entityHandle,
			syncKey: this.#KeyGen(),
		}) as boolean;
	}

	static IsNetworkTransform(entityHandle: Entity) {
		return RpcClient.Call("Networking::IsNetworkTransform", {
			networkId: Networking.GetNetworkID(),
			entityHandle,
		}) as boolean;
	}

	static SyncLocalTransform(entityHandle: Entity) {
		return RpcClient.Call("Networking::SyncLocalTransform", {
			networkId: Networking.GetNetworkID(),
			entityHandle,
		}) as boolean;
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
	): StateRef<T> {
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

		if (Networking.IsMasterClient()) {
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

		return proxy;
	}

	static NewFunction<F extends (...args: any[]) => any>(func: F) {
		const key = Networking.#KeyGen();

		const callFunction = (...args: Parameters<F>) => {
			func(...args);
			Networking.#BroadcastMessage(key, JSON.stringify(args));
		};

		this.#NewChannel(key, (_, payload) => {
			console.log("NewFuction onReceived: " + payload);
			const received = JSON.parse(payload) as Parameters<F>;
			func(...received);
		});

		return callFunction;
	}

	static OnUserJoined(onUserJoined: (user: User) => void): boolean {
		return RpcClient.Call("Networking::OnUserJoined", {
			onUserJoined: ({ userId }: { userId: string }) => {
				onUserJoined(new User(userId));
			},
		}) as boolean;
	}
	static OnUserLeft(onUserLeft: (user: User) => void): boolean {
		return RpcClient.Call("Networking::OnUserLeft", {
			onUserLeft: ({ userId }: { userId: string }) => {
				onUserLeft(new User(userId));
			},
		}) as boolean;
	}
}
