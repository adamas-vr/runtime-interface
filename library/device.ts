import { vec2 } from "gl-matrix";
import { RpcClient } from "./rpc";

export type ValueChangeHandler = number;

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
			clientId: RpcClient.GetClientId(),
			devicePath,
		});
	}

	static SubscribeValueChange(
		devicePath: string,
		callback: (value: number | vec2 | undefined) => void,
	): ValueChangeHandler {
		return RpcClient.Call("Device::SubscribeValueChange", {
			clientId: RpcClient.GetClientId(),
			devicePath,
			callback: (args: any) => callback(args),
		});
	}

	static UnsubscribeValueChange(handle: ValueChangeHandler): boolean {
		return false;
	}

	static PublishValueChange(devicePath: string, value: number | vec2): boolean {
		return false;
	}
}

export class VRDevice {
	static GetLeftPrimaryButton(): boolean {
		return false;
	}
	static GetLeftSecondaryButton(): boolean {
		return false;
	}
	static GetLeftPrimary2DAxis(): vec2 {
		return vec2.fromValues(0, 0);
	}
	static GetLeftPrimary2DAxisButton(): boolean {
		return false;
	}
	static GetLeftGrip(): number {
		return 0;
	}
	static GetLeftTrigger(): number {
		return 0;
	}

	static GetRightPrimaryButton(): boolean {
		return false;
	}
	static GetRightSecondaryButton(): boolean {
		return false;
	}
	static GetRightPrimary2DAxis(): vec2 {
		return vec2.fromValues(0, 0);
	}
	static GetRightPrimary2DAxisButton(): boolean {
		return false;
	}
	static GetRightGrip(): number {
		return 0;
	}
	static GetRightTrigger(): number {
		return 0;
	}

	static OnLeftPrimaryButtonChange(): boolean {
		return false;
	}
	static OnLeftSecondaryButtonChange(): boolean {
		return false;
	}
	static OnLeftPrimary2DAxisChange(): vec2 {
		return vec2.fromValues(0, 0);
	}
	static OnLeftPrimary2DAxisButtonChange(): boolean {
		return false;
	}
	static OnLeftGripChange(): number {
		return 0;
	}
	static OnLeftTriggerChange(): number {
		return 0;
	}

	static OnRightPrimaryButtonChange(): boolean {
		return false;
	}
	static OnRightSecondaryButtonChange(): boolean {
		return false;
	}
	static OnRightPrimary2DAxisChange(): vec2 {
		return vec2.fromValues(0, 0);
	}
	static OnRightPrimary2DAxisButtonChange(): boolean {
		return false;
	}
	static OnRightGripChange(): number {
		return 0;
	}
	static OnRightTriggerChange(): number {
		return 0;
	}
}
