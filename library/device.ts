/**
 * APIs for reading and subscribing to device input values.
 *
 * @module device
 */
import { vec2 } from "gl-matrix";
import { RpcClient } from "./rpc";

/**
 * Opaque numeric handle that identifies a device subscription.
 */
export type DeviceSubscription = number;

/**
 * Built-in device input paths.
 */
export const DevicePath = {
	/** Left grip value in the range `[0.0, 1.0]`. */
	LEFT_GRIP: "XRI Left Interaction/Select Value",
	/** Left trigger value in the range `[0.0, 1.0]`. */
	LEFT_TRIGGER: "XRI Left Interaction/Activate Value",
	/** Left primary 2D axis as a `vec2`, with each component in the range `[-1, 1]`. */
	LEFT_PRIMARY_2D_AXIS: "XRI Left/Thumbstick",
	/** Left primary 2D axis button value, either `0` or `1`. */
	LEFT_PRIMARY_2D_AXIS_BUTTON: "KBM/Left Primary 2DAxis Button",
	/** Left primary button value, either `0` or `1`. */
	LEFT_PRIMARY_BUTTON: "KBM/Left Primary Button",
	/** Left secondary button value, either `0` or `1`. */
	LEFT_SECONDARY_BUTTON: "KBM/Left Secondary Button",

	/** Right grip value in the range `[0.0, 1.0]`. */
	RIGHT_GRIP: "XRI Right Interaction/Select Value",
	/** Right trigger value in the range `[0.0, 1.0]`. */
	RIGHT_TRIGGER: "XRI Right Interaction/Activate Value",
	/** Right primary 2D axis as a `vec2`, with each component in the range `[-1, 1]`. */
	RIGHT_PRIMARY_2D_AXIS: "XRI Right/Thumbstick",
	/** Right primary 2D axis button value, either `0` or `1`. */
	RIGHT_PRIMARY_2D_AXIS_BUTTON: "KBM/Right Primary 2DAxis Button",
	/** Right primary button value, either `0` or `1`. */
	RIGHT_PRIMARY_BUTTON: "KBM/Right Primary Button",
	/** Right secondary button value, either `0` or `1`. */
	RIGHT_SECONDARY_BUTTON: "KBM/Right Secondary Button",
};

/**
 * Reads and subscribes to device input values.
 */
export class Device {
	/**
	 * Gets the current value of a device path.
	 *
	 * @param devicePath - The device path to read.
	 * @returns A promise that resolves to the current input value, or `undefined`
	 * if no value is available.
	 */
	static GetValue(devicePath: string) {
		return RpcClient.Call<number | vec2 | undefined>(
			"Device::GetValue",
			devicePath,
		);
	}

	/**
	 * Subscribes to value changes for a device path.
	 *
	 * @param devicePath - The device path to observe.
	 * @param callback - The callback that receives updated input values.
	 * @returns A promise that resolves to the {@link DeviceSubscription} handle.
	 */
	static async SubscribeValueChange(
		devicePath: string,
		callback: (value: number | vec2) => void,
	) {
		return RpcClient.Call<DeviceSubscription>(
			"Device::SubscribeValueChange",
			RpcClient.GetClientId(),
			devicePath,
			callback,
		);
	}

	/**
	 * Unsubscribes from a device value change subscription.
	 *
	 * @param handle - The {@link DeviceSubscription} handle to remove.
	 * @returns A promise that resolves to `true` if the subscription was removed,
	 * or `false` otherwise.
	 */
	static async UnsubscribeValueChange(handle: DeviceSubscription) {
		return RpcClient.Call<boolean>(
			"Device::UnsubscribeValueChange",
			RpcClient.GetClientId(),
			handle,
		);
	}
}
