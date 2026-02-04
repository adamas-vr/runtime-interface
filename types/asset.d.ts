declare module "*.mat" {
	import { UUID } from "crypto";
	const value: {
		assetType: "Material";

		baseMap?: UUID;
		baseColor: { x: number; y: number; z: number; w: number };

		cutoff: number;

		smoothness: number;
		smoothnessTextureChannel: number;

		metallic: number;
		metallicGlossMap?: UUID;

		specColor: { x: number; y: number; z: number };
		specGlossMap?: UUID;

		specularHighlights: number;
		environmentReflections: number;

		bumpScale: number;
		bumpMap?: UUID;

		parallax: number;
		parallaxMap?: UUID;

		occlusionStrength: number;
		occlusionMap?: UUID;

		emissionColor: { x: number; y: number; z: number };
		emissionMap?: UUID;

		detailMask?: UUID;
		detailAlbedoMapScale: number;
		detailAlbedoMap?: UUID;

		detailNormalMapScale: number;
		detailNormalMap?: UUID;
	};
	export default value;
}

declare module "*.tex" {
	const value: {
		assetType: "Texture";

		base64Image: string;
		mineType: string;
		filterMode: number;
		wrapMode: number;
	};
	export default value;
}

declare module "*.mesh" {
	const value: {
		assetType: "Mesh";

		base64Vertices: string;
		base64Indices: string;
		base64Normals?: string;
		base64Uvs?: string;
	};
	export default value;
}

declare module "adamas:project" {
	import { UUID } from "crypto";
	export const assetRecord: Map<UUID, object>;
	export const projectFile: any;
}
