import { randomUUID } from "crypto";
import { RpcClient } from "../rpc";
import { Project } from "../project";

export class Networking {
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
	static NewState<T extends object>(): [T, (state: T) => void];
	static NewState<T extends object>(initialState: T): [T, (state: T) => void];
	static NewState<T extends object>(
		onStateChange: (state: T) => void,
	): [T, (state: T) => void];
	static NewState<T extends object>(
		initialState: T,
		onStateChange: (state: T) => void,
	): [T, (state: T) => void];
	static NewState<T extends object>(
		arg0?: T | ((state: T) => void),
		arg1?: (state: T) => void,
	): [T, (state: T) => void] {
		const onStateChange = typeof arg0 === "function" ? arg0 : arg1;
		const initialState =
			typeof arg0 === "function" ? ({} as T) : (arg0 ?? ({} as T));
		const internalState = structuredClone(initialState); // deep clone to decouple

		const key = randomUUID();
		const proxy = new Proxy(internalState, {
			get(target, prop) {
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				Reflect.set(target, prop, value);
				onStateChange?.(internalState);
				RpcClient.Call("_RPC::BroadcastState", {
					networkId: Networking.GetNetworkID(),
					key: key,
					payload: JSON.stringify({ [prop]: value }),
				});
				return value;
			},
		});

		const setState = (newState: T) => {
			Object.assign(internalState, newState);
			onStateChange?.(internalState);
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
				onStateChange?.(internalState);
			},
		});

		return [proxy as T, setState];
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
