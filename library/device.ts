import { RpcClient } from "@adamas/rpc";

export class Device {
	// Local positions (relative to XR Origin)
	static GetLeftPosition() {
		return JSON.parse(RpcClient.Call("XRI Left/Position", {}));
	}
	static GetLeftRotation() {
		return JSON.parse(RpcClient.Call("XRI Left/Rotation", {}));
	}
	static GetLeftThumbstick() {
		return JSON.parse(RpcClient.Call("XRI Left/Thumbstick", {}));
	}
	static GetLeftSelect() {
		return JSON.parse(RpcClient.Call("XRI Left Interaction/Select Value", {}));
	}
	static GetLeftActivate() {
		return JSON.parse(
			RpcClient.Call("XRI Left Interaction/Activate Value", {}),
		);
	}
	static GetLeftTurn() {
		return JSON.parse(RpcClient.Call("XRI Left Locomotion/Turn", {}));
	}
	static GetLeftSnapTurn() {
		return JSON.parse(RpcClient.Call("XRI Left Locomotion/Snap Turn", {}));
	}
	static GetLeftMove() {
		return JSON.parse(RpcClient.Call("XRI Left Locomotion/Move", {}));
	}
	static GetLeftGrabMove() {
		return JSON.parse(RpcClient.Call("XRI Left Locomotion/Grab Move", {}));
	}
	static GetRightPosition() {
		return JSON.parse(RpcClient.Call("XRI Right/Position", {}));
	}
	static GetRightRotation() {
		return JSON.parse(RpcClient.Call("XRI Right/Rotation", {}));
	}
	static GetRightThumbstick() {
		return JSON.parse(RpcClient.Call("XRI Right/Thumbstick", {}));
	}
	static GetRightSelect() {
		return JSON.parse(RpcClient.Call("XRI Right Interaction/Select Value", {}));
	}
	static GetRightActivate() {
		return JSON.parse(
			RpcClient.Call("XRI Right Interaction/Activate Value", {}),
		);
	}
	static GetRightTurn() {
		return JSON.parse(RpcClient.Call("XRI Right Locomotion/Turn", {}));
	}
	static GetRightSnapTurn() {
		return JSON.parse(RpcClient.Call("XRI Right Locomotion/Snap Turn", {}));
	}
	static GetRightMove() {
		return JSON.parse(RpcClient.Call("XRI Right Locomotion/Move", {}));
	}
	static GetRightGrabMove() {
		return JSON.parse(RpcClient.Call("XRI Right Locomotion/Grab Move", {}));
	}
	static GetHeadPosition() {
		return JSON.parse(RpcClient.Call("XRI Head/Position", {}));
	}
	static GetHeadRotation() {
		return JSON.parse(RpcClient.Call("XRI Head/Rotation", {}));
	}

	// World positions (absolute positions in world space)
	static GetLeftWorldPosition() {
		return JSON.parse(RpcClient.Call("XRI Left/WorldPosition", {}));
	}
	static GetLeftWorldRotation() {
		return JSON.parse(RpcClient.Call("XRI Left/WorldRotation", {}));
	}
	static GetRightWorldPosition() {
		return JSON.parse(RpcClient.Call("XRI Right/WorldPosition", {}));
	}
	static GetRightWorldRotation() {
		return JSON.parse(RpcClient.Call("XRI Right/WorldRotation", {}));
	}
	static GetHeadWorldPosition() {
		return JSON.parse(RpcClient.Call("XRI Head/WorldPosition", {}));
	}
	static GetHeadWorldRotation() {
		return JSON.parse(RpcClient.Call("XRI Head/WorldRotation", {}));
	}
}

export class XRSystem {
	static KEYCODE = Object.freeze({
		/* pose type */
		LEFT_EYE: "Left Eye",
		RIGHT_EYE: "Right Eye",

		LEFT_AIM: "Left Aim",
		RIGHT_AIM: "Right Aim",
		LEFT_GRIP: "Left Grip",
		RIGHT_GRIP: "Right Grip",

		/* number type */
		LEFT_SQUEEZE: "Left Squeeze",
		RIGHT_SQUEEZE: "Right Squeeze",
		LEFT_TRIGGER: "Left Trigger",
		RIGHT_TRIGGER: "Right Trigger",

		LEFT_THUMBSTICK_X: "Left Thumbstick X",
		RIGHT_THUMBSTICK_X: "Right Thumbstick X",
		LEFT_THUMBSTICK_Y: "Left Thumbstick Y",
		RIGHT_THUMBSTICK_Y: "Right Thumbstick Y",

		/* boolean type */
		LEFT_TRIGGER_TOUCH: "Left Trigger Touch",
		RIGHT_TRIGGER_TOUCH: "Right Trigger Touch",
		LEFT_THUMBSTICK_CLICK: "Left Thumbstick Click",
		RIGHT_THUMBSTICK_CLICK: "Right Thumbstick Click",
		LEFT_THUMBSTICK_TOUCH: "Left Thumbstick Touch",
		RIGHT_THUMBSTICK_TOUCH: "Right Thumbstick Touch",

		LEFT_X_CLICK: "Left X Click",
		LEFT_X_TOUCH: "Left X Touch",
		LEFT_Y_CLICK: "Left Y Click",
		LEFT_Y_TOUCH: "Left Y Touch",
		LEFT_MENU_CLICK: "Left Menu Click",

		RIGHT_A_CLICK: "Right A Click",
		RIGHT_A_TOUCH: "Right A Touch",
		RIGHT_B_CLIKC: "Right B Click",
		RIGHT_B_TOUCH: "Right B Touch",
		RIGHT_SYSTEM_CLICK: "Right System Click",
	});
}

export class Keyboard {
	static MOUSE = Object.freeze({
		BUTTON_LEFT: 0,
		BUTTON_RIGHT: 1,
		BUTTON_MIDDLE: 2,
	});

	static KEYCODE = Object.freeze({
		SPACE: 32,
		APOSTROPHE: 39 /* ' */,
		COMMA: 44 /* , */,
		MINUS: 45 /* - */,
		PERIOD: 46 /* . */,
		SLASH: 47 /* / */,
		NUM_0: 48,
		NUM_1: 49,
		NUM_2: 50,
		NUM_3: 51,
		NUM_4: 52,
		NUM_5: 53,
		NUM_6: 54,
		NUM_7: 55,
		NUM_8: 56,
		NUM_9: 57,
		SEMICOLON: 59 /* ; */,
		EQUAL: 61 /* = */,
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		LEFT_BRACKET: 91 /* [ */,
		BACKSLASH: 92 /* \ */,
		RIGHT_BRACKET: 93 /* ] */,
		GRAVE_ACCENT: 96 /* ` */,
		WORLD_1: 161 /* non-US #1 */,
		WORLD_2: 162 /* non-US #2 */,
		ESCAPE: 256,
		ENTER: 257,
		TAB: 258,
		BACKSPACE: 259,
		INSERT: 260,
		DELETE: 261,
		RIGHT: 262,
		LEFT: 263,
		DOWN: 264,
		UP: 265,
		PAGE_UP: 266,
		PAGE_DOWN: 267,
		HOME: 268,
		END: 269,
		CAPS_LOCK: 280,
		SCROLL_LOCK: 281,
		NUM_LOCK: 282,
		PRINT_SCREEN: 283,
		PAUSE: 284,
		F1: 290,
		F2: 291,
		F3: 292,
		F4: 293,
		F5: 294,
		F6: 295,
		F7: 296,
		F8: 297,
		F9: 298,
		F10: 299,
		F11: 300,
		F12: 301,
		F13: 302,
		F14: 303,
		F15: 304,
		F16: 305,
		F17: 306,
		F18: 307,
		F19: 308,
		F20: 309,
		F21: 310,
		F22: 311,
		F23: 312,
		F24: 313,
		F25: 314,
		KP_0: 320,
		KP_1: 321,
		KP_2: 322,
		KP_3: 323,
		KP_4: 324,
		KP_5: 325,
		KP_6: 326,
		KP_7: 327,
		KP_8: 328,
		KP_9: 329,
		KP_DECIMAL: 330,
		KP_DIVIDE: 331,
		KP_MULTIPLY: 332,
		KP_SUBTRACT: 333,
		KP_ADD: 334,
		KP_ENTER: 335,
		KP_EQUAL: 336,
		LEFT_SHIFT: 340,
		LEFT_CONTROL: 341,
		LEFT_ALT: 342,
		LEFT_SUPER: 343,
		RIGHT_SHIFT: 344,
		RIGHT_CONTROL: 345,
		RIGHT_ALT: 346,
		RIGHT_SUPER: 347,
		MENU: 348,
	});

	static ACTION = Object.freeze({
		RELEASE: 0,
		PRESS: 1,
		REPEAT: 2,
	});

	static MODIFIER = Object.freeze({
		SHIFT: 1,
		CONTROL: 2,
		ALT: 4,
		SUPER: 8,
		CAPS_LOCK: 16,
		NUM_LOCK: 32,
	});
}