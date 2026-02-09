import { RpcClient } from "../rpc";
import { Project } from "../project";

export type Serializable = number | string | boolean | object | [];
export type OnStateChange<T> = (state: T | null) => void;
export type StateRef<T> = { value: T | null };

export class Networking {
	static #stateKey = 0;
	static GetNetworkID(): string {
		return Project.GetProjectId();
	}

	/**
	 * Does not call onChange after being initialized.
	 * After function returns, state is always the latest value (or initial value?)
	 * When no initial value is given, key's values are all undefined (TODO: follow react for typing)
	 *
	 * maybe need mode.RPC and mode.variable ??
	 * RPC: callback executed on the caller, late joiners trigger callback
	 * Variable: callback not executed on the caller, late don't triger callback
	 *
	 * Right now: callback executed on the caller, late joiners dont triger CB
	 * @param initial
	 */
	static NewState<T extends Serializable>(): [StateRef<T>, OnStateChange<T>];
	static NewState<T extends Serializable>(
		initialState: T,
	): [StateRef<T>, OnStateChange<T>];
	static NewState<T extends Serializable>(
		onStateChange: OnStateChange<T>,
	): [StateRef<T>, OnStateChange<T>];
	static NewState<T extends Serializable>(
		initialState: T,
		onStateChange: OnStateChange<T>,
	): [StateRef<T>, OnStateChange<T>];
	static NewState<T extends Serializable>(
		arg0?: T | OnStateChange<T>,
		arg1?: OnStateChange<T>,
	): [StateRef<T>, OnStateChange<T>] {
		const onStateChange = typeof arg0 === "function" ? arg0 : arg1;
		const initialValue = typeof arg0 === "function" ? null : (arg0 ?? null);
		const internalState = { value: initialValue }; // deep clone to decouple

		const key = (Networking.#stateKey++).toString();
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
					payload: JSON.stringify({ [prop]: value }),
				});
				return true;
			},
		});

		const setState = (newState: T | null) => {
			Object.assign(internalState, newState);
			onStateChange?.(internalState.value);
			RpcClient.Call("_RPC::BroadcastState", {
				networkId: Networking.GetNetworkID(),
				key: key,
				payload: JSON.stringify(internalState),
			});
		};

		// Subscribe to external changes
		RpcClient.Call("_RPC::AddNewState", {
			networkId: Networking.GetNetworkID(),
			key: key,
			onReceived: (jsonObject: any) => {
				console.log("onReceived: " + jsonObject.data);

				const received = JSON.parse(jsonObject.data);
				Object.assign(internalState, received);
				onStateChange?.(internalState.value);
			},
		});

		return [proxy, setState];
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
