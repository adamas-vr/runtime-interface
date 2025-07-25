import { StateSync } from "@adamas/networking/state-sync";

export const stateSyncExample = (): void => {
	interface vec3 {
		x: number;
		y: number;
		z: number;
	}

	const defaultVec3: vec3 = { x: 0, y: 0, z: 0 };
	let variable = StateSync.CreateNetworkState<vec3>("ce", defaultVec3);
	variable.x = 3;

	console.log("GetNetworkID", StateSync.GetNetworkID());
	let i = 0;

	setInterval(() => {
		if (StateSync.IsStateAuthority()) {
			variable.x = i++;
			console.log("[StateAuth TRUE] variable.x", variable.x);
		} else {
			console.log("[StateAuth FALSE] variable.x", variable.x);
		}
	}, 2000);
};
