import { RpcClient } from "./rpc";

export class Debug {
	static OnCmdCallback(fn: (...args: any[]) => any) {
		return RpcClient.Call("DebugWindow::GetCommand", { callback: fn });
	}
}
