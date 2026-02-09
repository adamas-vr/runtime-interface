import { RpcClient } from "../rpc";
import { Project } from "../project";

export type StateRef<T> = { value: T };

export class Networking {
	static #stateKey = 0;
	static #KeyGen() {
		return (Networking.#stateKey++).toString();
	}

	static GetNetworkID(): string {
		return Project.GetProjectId();
	}

	/**
	 * Does not call onChange after being initialized.
	 * After function returns, state is always the latest value (or initial value?)
	 * When no initial value is given, key's values are all undefined (TODO: follow react for typing)
	 *
	 * Right now: callback executed on the caller, late joiners triger CB
	 * @param initial
	 */
	static NewVariable<T>(
		initialValue: T,
		onStateChange?: (state: T) => void,
	): StateRef<T> {
		const internalState = { value: initialValue };
		const key = Networking.#KeyGen();

		const proxy = new Proxy(internalState, {
			get(target, prop) {
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				Reflect.set(target, prop, value);
				onStateChange?.(internalState.value);
				RpcClient.Call("_RPC::BroadcastState", {
					networkId: Networking.GetNetworkID(),
					key: key,
					payload: JSON.stringify(value),
				});
				return true;
			},
		});

		RpcClient.Call("_RPC::AddNewState", {
			networkId: Networking.GetNetworkID(),
			key: key,
			onReceived: (jsonObject: any) => {
				const received = JSON.parse(jsonObject.data);
				internalState.value = received;
				onStateChange?.(internalState.value);
			},
		});

		return proxy;
	}

	static NewFunction<F extends (...args: any[]) => any>(func: F) {
		const key = Networking.#KeyGen();

		const callFunction = (...args: Parameters<F>) => {
			func(...args);
			RpcClient.Call("_RPC::BroadcastState", {
				networkId: Networking.GetNetworkID(),
				key: key,
				payload: JSON.stringify(args),
			});
		};

		RpcClient.Call("_RPC::AddNewState", {
			networkId: Networking.GetNetworkID(),
			key: key,
			onReceived: (jsonObject: any) => {
				console.log("onReceived: " + jsonObject.data);

				const received = JSON.parse(jsonObject.data) as Parameters<F>;
				func(...received);
			},
		});

		return callFunction;
	}

	static IsStateAuthority(): boolean {
		return RpcClient.Call("_RPC:IsStateAuthority", {
			networkId: Networking.GetNetworkID(),
		}) as boolean;
	}

	static GetPlayerId(): number {
		return RpcClient.Call("Multiplayer_GetPlayerId", {}) as number;
	}
}
