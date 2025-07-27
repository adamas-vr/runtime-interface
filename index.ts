import { EntityManager } from "@adamas/entity";
import { CameraManager } from "@adamas/render/camera";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { NewQuadMesh } from "@adamas/render/primitives";
import { RenderableManager } from "@adamas/render/renderable";
import { TextureFormat, TextureManager } from "@adamas/render/texture";
import { TransformManager } from "@adamas/render/transform";
import { vec3 } from "gl-matrix";

console.log(process.cwd());
setInterval(() => {
	console.log("Ticked!");
}, 30000);

const camEntity = EntityManager.Create("camera");
TransformManager.SetLocalPosition(camEntity, vec3.fromValues(0, 2, -1));

const textureHandle = TextureManager.CreateRenderTexture(
	1920,
	1080,
	0,
	TextureFormat.RGBA32,
);

CameraManager.Create(camEntity);
CameraManager.SetRenderTexture(camEntity, textureHandle);

RenderableManager.Create(camEntity);
RenderableManager.SetMesh(camEntity, NewQuadMesh());

const materialHandle = MaterialManager.Create(ShaderType.URP_LIT);
RenderableManager.SetMaterial(camEntity, materialHandle);
MaterialManager.SetTexture(
	materialHandle,
	ShaderProperties.BaseMap,
	textureHandle,
);
