import { renderGltf } from "samples/rendering-sample";

renderGltf("rusk.glb");

console.log(process.cwd());
setInterval(() => {
	console.log("Ticked!");
}, 30000);
