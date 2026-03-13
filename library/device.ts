import { vec2 } from "gl-matrix";
import { RpcClient } from "./rpc";
import { Project } from "./project";

export type DeviceSubscription = number;

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
	static GetValue(...args: [devicePath: string]) {
		return RpcClient.Call<number | vec2 | undefined>(
			"Device::GetValue",
			...args,
		);
	}

	static async SubscribeValueChange(
		...args: [devicePath: string, callback: (value: number | vec2) => void]
	) {
		return RpcClient.Call<DeviceSubscription>(
			"Device::SubscribeValueChange",
			RpcClient.GetClientId(),
			...args,
		);
	}

	static async UnsubscribeValueChange(...args: [handle: DeviceSubscription]) {
		return RpcClient.Call<boolean>(
			"Device::UnsubscribeValueChange",
			RpcClient.GetClientId(),
			...args,
		);
	}
}
