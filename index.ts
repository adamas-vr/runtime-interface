import { EntityManager } from "@adamas/entity";
import { GrabInteractableManager } from "@adamas/interaction/interaction";
import { StateSync } from "@adamas/networking/state-sync";
import { CameraManager } from "@adamas/render/camera";
import {
	MaterialManager,
	ShaderProperties,
	ShaderType,
} from "@adamas/render/material";
import { NewCubeMesh, NewQuadMesh } from "@adamas/render/primitives";
import { RenderableManager } from "@adamas/render/renderable";
import { TextureFormat, TextureManager } from "@adamas/render/texture";
import { TransformManager } from "@adamas/render/transform";
import { vec3, vec4 } from "gl-matrix";
import { createLocalGrabble } from "samples/interaction-sample";

console.log(process.cwd());
setInterval(() => {
	console.log("Ticked!");
}, 30000);

createLocalGrabble();
