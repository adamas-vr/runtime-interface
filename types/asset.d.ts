declare module "*.mat" {
	const value: import("./lib").MaterialAsset;
	export default value;
}

declare module "*.tex" {
	const value: import("./lib").TextureAsset;
	export default value;
}

declare module "*.mesh" {
	const value: import("./lib").MeshAsset;
	export default value;
}

declare module "*.prefab" {
	const value: import("./lib").PrefabAsset;
	export default value;
}

declare module "adamas:project" {
	import { UUID } from "crypto";
	export const assetRecord: Map<UUID, import("./lib").Asset>;
	export const projectDescription: import("./lib").ProjectDescription;
}
