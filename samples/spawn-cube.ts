import { Device } from "@adamas/device";
import { Debug } from "@adamas/debug";
import { EntityManager, Entity } from "@adamas/entity";
import { RenderableManager } from "@adamas/render/renderable";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { TransformManager } from "@adamas/render/transform";
import { vec3, vec4 } from "gl-matrix";
import { NewCubeMesh } from "@adamas/render/primitives";

// Prefab system state
interface PrefabSystem {
	leftPreviewCube: Entity | null;
	rightPreviewCube: Entity | null;
	leftButtonPrevState: number;
	rightButtonPrevState: number;
	spawnedCubes: Entity[];
}

const prefabSystem: PrefabSystem = {
	leftPreviewCube: null,
	rightPreviewCube: null,
	leftButtonPrevState: 0,
	rightButtonPrevState: 0,
	spawnedCubes: [],
};

console.log(process.cwd());

// Debug command handler
Debug.OnCmdCallback((command) => {
	console.log("COMMAND: ", command);

	// Handle debug commands for the prefab system
	if (command === "clear_cubes") {
		clearAllSpawnedCubes();
		console.log("Cleared all spawned cubes");
	} else if (command === "count_cubes") {
		console.log(`Total spawned cubes: ${prefabSystem.spawnedCubes.length}`);
	}
});

/**
 * Creates a red cube prefab at the specified position
 */
function createRedCubePrefab(position: vec3): Entity {
	const entity = EntityManager.Create("Red Cube");

	// Create renderable component
	RenderableManager.Create(entity);
	RenderableManager.SetMesh(entity, NewCubeMesh());

	// Create red material
	const materialHandle = MaterialManager.Create(ShaderType.URP_LIT, entity);
	MaterialManager.SetColor(
		materialHandle,
		ShaderProperties.BaseColor,
		vec4.fromValues(1.0, 0.2, 0.2, 1.0),
	); // Bright red

	// Set position and scale
	TransformManager.SetLocalPosition(entity, position);
	TransformManager.SetLocalScale(entity, vec3.fromValues(0.3, 0.3, 0.3));

	return entity;
}

/**
 * Creates a blue cube prefab at the specified position
 */
function createBlueCubePrefab(position: vec3): Entity {
	const entity = EntityManager.Create("Blue Cube");

	// Create renderable component
	RenderableManager.Create(entity);
	RenderableManager.SetMesh(entity, NewCubeMesh());

	// Create red material
	const materialHandle = MaterialManager.Create(ShaderType.URP_LIT, entity);
	MaterialManager.SetColor(
		materialHandle,
		ShaderProperties.BaseColor,
		vec4.fromValues(0.2, 0.2, 1.0, 1.0),
	); // Bright red

	// Set position and scale
	TransformManager.SetLocalPosition(entity, position);
	TransformManager.SetLocalScale(entity, vec3.fromValues(0.3, 0.3, 0.3));

	return entity;
}

/**
 * Creates a semi-transparent preview cube
 */
function createPreviewCube(color: "red" | "blue", name: string): Entity {
	const entity = EntityManager.Create(name);

	// Create renderable component
	RenderableManager.Create(entity);
	RenderableManager.SetMesh(entity, NewCubeMesh());

	// Create semi-transparent material
	const materialHandle = MaterialManager.Create(ShaderType.URP_LIT, entity);
	if (color === "red") {
		MaterialManager.SetColor(
			materialHandle,
			ShaderProperties.BaseColor,
			vec4.fromValues(1.0, 0.2, 0.2, 0.5),
		); // Semi-transparent red
	} else {
		MaterialManager.SetColor(
			materialHandle,
			ShaderProperties.BaseColor,
			vec4.fromValues(0.2, 0.2, 1.0, 0.5),
		); // Semi-transparent blue
	}

	// Set scale to be slightly smaller for previews
	TransformManager.SetLocalScale(entity, vec3.fromValues(0.2, 0.2, 0.2));

	return entity;
}

/**
 * Initialize the preview cubes that float above controllers
 */
function initializePreviewSystem() {
	console.log("Initializing prefab preview system...");

	// Wait a bit for the VR system to initialize, then create preview cubes
	setTimeout(() => {
		try {
			// Test if we can get controller world positions
			const leftPos = Device.GetLeftWorldPosition();
			const rightPos = Device.GetRightWorldPosition();

			console.log("Controller world position test:", { leftPos, rightPos });

			// Create preview cubes
			prefabSystem.leftPreviewCube = createPreviewCube(
				"red",
				"Left Preview (Red)",
			);
			prefabSystem.rightPreviewCube = createPreviewCube(
				"blue",
				"Right Preview (Blue)",
			);

			// Set initial positions if available
			if (leftPos && Array.isArray(leftPos) && leftPos.length >= 3) {
				TransformManager.SetLocalPosition(
					prefabSystem.leftPreviewCube,
					vec3.fromValues(
						Number(leftPos[0]),
						Number(leftPos[1]) + 0.2,
						Number(leftPos[2]),
					),
				);
			} else {
				// Fallback position for left preview
				TransformManager.SetLocalPosition(
					prefabSystem.leftPreviewCube,
					vec3.fromValues(-0.3, 1.5, 0),
				);
			}

			if (rightPos && Array.isArray(rightPos) && rightPos.length >= 3) {
				TransformManager.SetLocalPosition(
					prefabSystem.rightPreviewCube,
					vec3.fromValues(
						Number(rightPos[0]),
						Number(rightPos[1]) + 0.2,
						Number(rightPos[2]),
					),
				);
			} else {
				// Fallback position for right preview
				TransformManager.SetLocalPosition(
					prefabSystem.rightPreviewCube,
					vec3.fromValues(0.3, 1.5, 0),
				);
			}

			console.log(
				"Preview cubes created - Red cube above left controller, Blue cube above right controller",
			);
		} catch (error) {
			console.error("Error initializing preview system:", error);
			// Create preview cubes at fallback positions
			prefabSystem.leftPreviewCube = createPreviewCube(
				"red",
				"Left Preview (Red)",
			);
			prefabSystem.rightPreviewCube = createPreviewCube(
				"blue",
				"Right Preview (Blue)",
			);
			TransformManager.SetLocalPosition(
				prefabSystem.leftPreviewCube,
				vec3.fromValues(-0.3, 1.5, 0),
			);
			TransformManager.SetLocalPosition(
				prefabSystem.rightPreviewCube,
				vec3.fromValues(0.3, 1.5, 0),
			);
		}
	}, 2000); // Wait 2 seconds for VR system to initialize
}

/**
 * Update preview cube positions to follow controllers
 */
function updatePreviewPositions() {
	try {
		// Get controller WORLD positions (absolute in world space)
		const leftPos = Device.GetLeftWorldPosition();
		const rightPos = Device.GetRightWorldPosition();

		// Update left preview cube (red) position - offset upward
		if (
			prefabSystem.leftPreviewCube &&
			leftPos &&
			Array.isArray(leftPos) &&
			leftPos.length >= 3
		) {
			TransformManager.SetLocalPosition(
				prefabSystem.leftPreviewCube,
				vec3.fromValues(
					Number(leftPos[0]),
					Number(leftPos[1]) + 0.2, // Float 20cm above controller
					Number(leftPos[2]),
				),
			);
		}

		// Update right preview cube (blue) position - offset upward
		if (
			prefabSystem.rightPreviewCube &&
			rightPos &&
			Array.isArray(rightPos) &&
			rightPos.length >= 3
		) {
			TransformManager.SetLocalPosition(
				prefabSystem.rightPreviewCube,
				vec3.fromValues(
					Number(rightPos[0]),
					Number(rightPos[1]) + 0.2, // Float 20cm above controller
					Number(rightPos[2]),
				),
			);
		}
	} catch (error) {
		// Silently handle cases where controllers aren't available
		console.warn("Error updating preview positions:", error);
	}
}

/**
 * Handle controller input for spawning cubes
 */
function handleControllerInput() {
	try {
		// Get current button states
		const leftSelectValue = Device.GetLeftSelect();
		const rightSelectValue = Device.GetRightSelect();

		// Convert to simple pressed state (> 0.5 threshold)
		// Handle both direct numbers and nested result objects
		const leftSelectNum =
			typeof leftSelectValue === "number" ? leftSelectValue : 0;
		const rightSelectNum =
			typeof rightSelectValue === "number" ? rightSelectValue : 0;

		const leftPressed = leftSelectNum > 0.5 ? 1 : 0;
		const rightPressed = rightSelectNum > 0.5 ? 1 : 0;

		// Check for button press events (transition from not pressed to pressed)
		if (leftPressed && !prefabSystem.leftButtonPrevState) {
			spawnRedCube();
		}

		if (rightPressed && !prefabSystem.rightButtonPrevState) {
			spawnBlueCube();
		}

		// Update previous states
		prefabSystem.leftButtonPrevState = leftPressed;
		prefabSystem.rightButtonPrevState = rightPressed;
	} catch (error) {
		// Silently handle cases where controllers aren't available
		console.warn("Error handling controller input:", error);
	}
}

/**
 * Spawn a red cube at the left controller position
 */
function spawnRedCube() {
	try {
		const leftPos = Device.GetLeftWorldPosition();
		if (leftPos && Array.isArray(leftPos) && leftPos.length >= 3) {
			// Spawn slightly forward from the controller
			const spawnPos = vec3.fromValues(
				Number(leftPos[0]),
				Number(leftPos[1]),
				Number(leftPos[2]) + 0.5, // 50cm forward
			);

			const newCube = createRedCubePrefab(spawnPos);
			prefabSystem.spawnedCubes.push(newCube);

			console.log(
				`Spawned red cube #${prefabSystem.spawnedCubes.length} at world position:`,
				spawnPos,
			);
		}
	} catch (error) {
		console.error("Error spawning red cube:", error);
	}
}

/**
 * Spawn a blue cube at the right controller position
 */
function spawnBlueCube() {
	try {
		const rightPos = Device.GetRightWorldPosition();
		if (rightPos && Array.isArray(rightPos) && rightPos.length >= 3) {
			// Spawn slightly forward from the controller
			const spawnPos = vec3.fromValues(
				Number(rightPos[0]),
				Number(rightPos[1]),
				Number(rightPos[2]) + 0.5, // 50cm forward
			);

			const newCube = createBlueCubePrefab(spawnPos);
			prefabSystem.spawnedCubes.push(newCube);

			console.log(
				`Spawned blue cube #${prefabSystem.spawnedCubes.length} at world position:`,
				spawnPos,
			);
		}
	} catch (error) {
		console.error("Error spawning blue cube:", error);
	}
}

/**
 * Clear all spawned cubes from the scene
 */
function clearAllSpawnedCubes() {
	prefabSystem.spawnedCubes.forEach((entity) => {
		EntityManager.Destroy(entity);
	});
	prefabSystem.spawnedCubes = [];
}

/**
 * Main update loop
 */
function update() {
	updatePreviewPositions();
	handleControllerInput();
}

// Initialize the prefab system
initializePreviewSystem();

// Set up update loop (60 FPS) - start after initialization delay
setTimeout(() => {
	setInterval(update, 16); // ~60 FPS
	console.log("Update loop started");
}, 3000);

// Heartbeat for debugging
setInterval(() => {
	console.log(
		`Prefab System Status - Spawned cubes: ${prefabSystem.spawnedCubes.length}`,
	);

	// Log controller states for debugging
	try {
		// Local positions (relative to XR Origin)
		const leftPos = Device.GetLeftPosition();
		const rightPos = Device.GetRightPosition();
		// World positions (absolute in world space)
		const leftWorldPos = Device.GetLeftWorldPosition();
		const rightWorldPos = Device.GetRightWorldPosition();
		const leftSelect = Device.GetLeftSelect();
		const rightSelect = Device.GetRightSelect();

		console.log("Controller Debug:", {
			leftLocalPos: leftPos,
			rightLocalPos: rightPos,
			leftWorldPos: leftWorldPos,
			rightWorldPos: rightWorldPos,
			leftSelect: leftSelect,
			rightSelect: rightSelect,
			leftWorldFormatted: Array.isArray(leftWorldPos)
				? `[${leftWorldPos[0]}, ${leftWorldPos[1]}, ${leftWorldPos[2]}]`
				: "Invalid",
			rightWorldFormatted: Array.isArray(rightWorldPos)
				? `[${rightWorldPos[0]}, ${rightWorldPos[1]}, ${rightWorldPos[2]}]`
				: "Invalid",
		});
	} catch (error) {
		console.log("Controller data not available:", error);
	}
}, 30000);

console.log("VR Cube Prefab System initialized!");
console.log("- Red cube preview above left controller (press select to spawn)");
console.log(
	"- Blue cube preview above right controller (press select to spawn)",
);
console.log("- Debug commands: 'clear_cubes', 'count_cubes'");
console.log("- Using WORLD positions for accurate placement in VR space");
