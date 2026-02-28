import { vec2 } from "gl-matrix";
import { RpcClient } from "./rpc";

export type ValueChangeHandler = number;

export const DevicePath = {
	LEFT_GRIP: "XRI Left Interaction/Select Value",
	LEFT_TRIGGER: "XRI Left Interaction/Activate Value",
	LEFT_PRIMARY_2D_AXIS: "XRI Left/Thumbstick",
	LEFT_PRIMARY_2D_AXIS_BUTTON: "",
	LEFT_PRIMARY_BUTTON: "",
	LEFT_SECONDARY_BUTTON: "",

	RIGHT_GRIP: "XRI Right Interaction/Select Value",
	RIGHT_TRIGGER: "XRI Right Interaction/Activate Value",
	RIGHT_PRIMARY_2D_AXIS: "XRI Right/Thumbstick",
	RIGHT_PRIMARY_2D_AXIS_BUTTON: "",
	RIGHT_PRIMARY_BUTTON: "",
	RIGHT_SECONDARY_BUTTON: "",
};

export class Device {
	static GetValue(devicePath: string): number | vec2 | boolean | undefined {
		return RpcClient.Call("Device::GetValue", {
			clientId: RpcClient.GetClientId(),
			devicePath,
		});
	}

	static SubscribeValueChange(
		devicePath: string,
		callback: (value: number | vec2 | boolean | undefined) => void,
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

	static PublishValueChange(
		devicePath: string,
		value: number | vec2 | boolean,
	): boolean {
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
