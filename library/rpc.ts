import { platform } from "node:os";

const addon =
	platform() === "darwin"
		? require("./native-bindings-osx.node")
		: require("./native-bindings-win.node");

export class RpcClient {
	static Init() {
		addon.Rpc_RegisterCbHandler((callbackId: number, argsJson: string) => {
			let kvJson = JSON.parse(argsJson);
			let objJson = RpcClient.keyValueToObject(
				kvJson["keys"],
				kvJson["values"],
			);
			try {
				RpcClient.callbackRegistry[callbackId](objJson);
			} catch (error) {
				console.error(`${error}`);
			}
		});
	}

	static RegisterCallback(callback: (...args: any[]) => any): number {
		let callbackId: number = Number(
			RpcClient.Call("_RPC::AllocateCallback", {
				clientId: RpcClient.GetClientId(),
			}),
		);
		RpcClient.callbackRegistry[callbackId] = callback;
		return callbackId;
	}

	/**
	 *
	 * @param funcName RPC function name to call
	 * @param args Arguments of RPC in the format: `{parameter0: value0, parameter1: value1}`
	 * @returns The value returned from RPC function in string type
	 */
	static Call(funcName: string, args: object): any {
		if (!this.initialized) {
			this.initialized = true;
			RpcClient.Init();
		}
		const processedArgs: Record<string, any> = {};
		for (const [key, value] of Object.entries(args)) {
			if (typeof value === "function") {
				processedArgs[key] = RpcClient.RegisterCallback(value);
			} else {
				processedArgs[key] = value;
			}
		}
		return JSON.parse(
			addon.Rpc_Call(
				funcName,
				JSON.stringify(this.objectToKeyValue(processedArgs)),
			),
		).result;
	}

	static GetClientId(): number {
		return Number(addon.Rpc_GetClientId());
	}

	static objectToKeyValue(obj: Record<string, any>) {
		const keys = Object.keys(obj);
		const values = keys.map((key) => obj[key]);
		return { keys, values };
	}

	static keyValueToObject(keys: string[], values: any[]): Record<string, any> {
		const obj: Record<string, any> = {};
		keys.forEach((key, index) => {
			obj[key] = values[index];
		});
		return obj;
	}

	static callbackRegistry: { [key: number]: (...args: any[]) => any } = {};
	static initialized = false;
}
