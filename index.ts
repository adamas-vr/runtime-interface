import { Device } from "@adamas/device";
import { Debug } from "@adamas/debug";
import { EntityManager, Entity } from "@adamas/entity";
import { RenderableBuilder} from "@adamas/render/renderable";
import { importGltfAndRender } from "@adamas/gltfImporter";

// let Device = require("@adamas/device")
console.log(process.cwd());
setInterval(() => {
	console.log("Ticked!");
}, 30000);

Debug.OnCmdCallback((command) => {
	console.log("COMMAND: ", command);
});

function logXRDeviceData() {
	console.log("GetLeftPosition()        ", Device.GetLeftPosition());
	console.log("GetLeftRotation()        ", Device.GetLeftRotation());
	console.log("GetLeftThumbstick()      ", Device.GetLeftThumbstick());
	console.log("GetLeftSelect()          ", Device.GetLeftSelect());
	console.log("GetLeftActivate()        ", Device.GetLeftActivate());
	console.log("GetLeftTurn()            ", Device.GetLeftTurn());
	console.log("GetLeftSnapTurn()        ", Device.GetLeftSnapTurn());
	console.log("GetLeftMove()            ", Device.GetLeftMove());
	console.log("GetLeftGrabMove()        ", Device.GetLeftGrabMove());
	console.log("GetRightPosition()       ", Device.GetRightPosition());
	console.log("GetRightRotation()       ", Device.GetRightRotation());
	console.log("GetRightThumbstick ()    ", Device.GetRightThumbstick());
	console.log("GetRightSelect()         ", Device.GetRightSelect());
	console.log("GetRightActivate()       ", Device.GetRightActivate());
	console.log("GetRightTurn()           ", Device.GetRightTurn());
	console.log("GetRightSnapTurn()       ", Device.GetRightSnapTurn());
	console.log("GetRightMove()           ", Device.GetRightMove());
	console.log("GetRightGrabMove()       ", Device.GetRightGrabMove());
	console.log("GetHeadPosition()        ", Device.GetHeadPosition());
	console.log("GetHeadRotation()        ", Device.GetHeadRotation());
}

// logXRDeviceData();

importGltfAndRender("./prefabs/rusk.glb").catch(console.error);

// // 8 vertices for a unit cube
// const cubeVertices = [
//   -0.5, -0.5, -0.5,  // 0: left-bottom-back
//    0.5, -0.5, -0.5,  // 1: right-bottom-back
//    0.5,  0.5, -0.5,  // 2: right-top-back
//   -0.5,  0.5, -0.5,  // 3: left-top-back
//   -0.5, -0.5,  0.5,  // 4: left-bottom-front
//    0.5, -0.5,  0.5,  // 5: right-bottom-front
//    0.5,  0.5,  0.5,  // 6: right-top-front
//   -0.5,  0.5,  0.5   // 7: left-top-front
// ];

// // 12 triangles = 36 indices for cube faces
// const cubeIndices = [
//   // back face
//   0, 2, 1,   0, 3, 2,
//   // front face
//   4, 5, 6,   4, 6, 7,
//   // bottom face
//   0, 1, 5,   0, 5, 4,
//   // top face
//   3, 7, 6,   3, 6, 2,
//   // left face
//   0, 4, 7,   0, 7, 3,
//   // right face
//   1, 2, 6,   1, 6, 5
// ];

// let entity: Entity = EntityManager.Create("test entity");
// console.log("entity handle", entity);

// new RenderableBuilder()
//   .build(entity)
//   .geometry(cubeVertices, cubeIndices) // make primitive objects so user doesn't have to construct these manually
//   .material("Universal Render Pipeline/Lit"); // should make aliases to make these calls easier


// setTimeout(() => {
// 	console.log("Entity name: ", EntityManager.GetName(entity));
// 	EntityManager.SetName(entity, "updated name");
// 	console.log("Updated name: ", EntityManager.GetName(entity));
// }, 10000);
