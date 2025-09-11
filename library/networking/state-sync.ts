import { RpcClient } from "../rpc";

export class StateSync {
	static stateMap = new Map<string, object>(); // holds all proxies by key

	static GetNetworkID(): string {
		return RpcClient.Call("_Main::GetNetworkPrefabIdByPid", {
			pid: process.pid,
		});
	}

	static CreateNetworkState<T extends object>(
		key: string,
		initial: T,
		onStateChange: (prop: string, value: any) => void = () => {},
	): T {
		const internalState = structuredClone(initial); // deep clone to decouple

		StateSync.stateMap.set(key, internalState);
		const proxy = new Proxy(internalState, {
			get(target, prop) {
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				Reflect.set(target, prop, value);
				RpcClient.Call("_RPC::BroadcastState", {
					networkId: StateSync.GetNetworkID(),
					key: key,
					payload: JSON.stringify({ prop, value }),
				});
				return true;
			},
		});

		// Subscribe to external changes
		RpcClient.Call("_RPC::AddNewState", {
			networkId: StateSync.GetNetworkID(),
			key: key,
			onReceived: (jsonObject: any) => {
				console.log("onReceived: " + jsonObject.data);
				const internalState = StateSync.stateMap.get(key);
				if (!internalState) return;

				const { prop, value } = JSON.parse(jsonObject.data);
				(internalState as any)[prop] = value;
				onStateChange(prop, value);
			},
		});

		return proxy as T;
	}

	static IsStateAuthority(): boolean {
		return RpcClient.Call("_RPC:IsStateAuthority", {
			networkId: StateSync.GetNetworkID(),
		}) as boolean;
	}

	static GetPlayerId(): number {
		return RpcClient.Call("Multiplayer_GetPlayerId", {}) as number;
	}
}
