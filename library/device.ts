import { vec2 } from "gl-matrix";
import { RpcClient } from "./rpc";

export type SubscriptionHandle = number;

export const DevicePath = {
	/** float, range [0.0, 1.0] */
	LEFT_GRIP: "XRI Left Interaction/Select Value",
	/** float, range [0.0, 1.0] */
	LEFT_TRIGGER: "XRI Left Interaction/Activate Value",
	/** vec2 [x-axis, y-axis], range: [-1, 1] */
	LEFT_PRIMARY_2D_AXIS: "XRI Left/Thumbstick",
	/** float, 0 or 1 */
	LEFT_PRIMARY_2D_AXIS_BUTTON: "KBM/Left Primary 2DAxis Button",
	/** float, 0 or 1 */
	LEFT_PRIMARY_BUTTON: "KBM/Left Primary Button",
	/** float, 0 or 1 */
	LEFT_SECONDARY_BUTTON: "KBM/Left Secondary Button",

	RIGHT_GRIP: "XRI Right Interaction/Select Value",
	RIGHT_TRIGGER: "XRI Right Interaction/Activate Value",
	RIGHT_PRIMARY_2D_AXIS: "XRI Right/Thumbstick",
	RIGHT_PRIMARY_2D_AXIS_BUTTON: "KBM/Right Primary 2DAxis Button",
	RIGHT_PRIMARY_BUTTON: "KBM/Right Primary Button",
	RIGHT_SECONDARY_BUTTON: "KBM/Right Secondary Button",
};

export class Device {
	static GetValue(devicePath: string): number | vec2 | undefined {
		return RpcClient.Call("Device::GetValue", {
			devicePath,
		});
	}

	static SubscribeValueChange(
		devicePath: string,
		callback: (value: number | vec2) => void,
	): SubscriptionHandle {
		return RpcClient.Call("Device::SubscribeValueChange", {
			clientId: RpcClient.GetClientId(),
			devicePath,
			callback: (value: { change: string }) =>
				callback(JSON.parse(value.change)),
		});
	}

	static UnsubscribeValueChange(handle: SubscriptionHandle): boolean {
		return RpcClient.Call("Device::UnsubscribeValueChange", {
			clientId: RpcClient.GetClientId(),
			handle,
		});
	}
}
