import { vec2, vec3, vec4 } from "gl-matrix";
import { AlphaMode } from "./render/material";
import { TextureFilterMode, TextureWrapMode } from "./render/texture";
import { UUID } from "crypto";
import { ShadowCastingMode } from "./render/renderable";
import { MovementType } from "./interaction";
import { ProjectionType } from "./render/camera";
import { LightShadowMode, LightType } from "./render/light";

export enum AssetType {
	Material = "Material",
	Texture = "Texture",
	Mesh = "Mesh",
	Prefab = "Prefab",
}

export enum ComponentType {
	Property = "Property",
	Transform = "Transform",
	Renderable = "Renderable",
	Camera = "Camera",
	Light = "Light",
	Rigidbody = "Rigid Body",
	Collider = "Collider",
	Grabble = "Grabble",
}

export interface TextureTransform {
	offset: vec2;
	scale: vec2;
	rotation: number;
}

export interface SparseMorphData {
	arraySize: number;
	sparseIndices: Uint16Array;
	sparseValues: Float32Array;
}

export interface MeshPrimitive {
	indices: Uint16Array;
	vertices: Float32Array;
	normals?: Float32Array;
	uvs?: Float32Array;
	morphPosition?: (Float32Array | SparseMorphData)[];
	morphNormal?: (Float32Array | SparseMorphData)[];
}

export interface Asset {
	name: string;
	uuid: UUID;
	assetType: AssetType;
}

export interface TextureAsset extends Asset {
	image: Uint8Array;
	mimeType: string;
	filterMode: TextureFilterMode;
	wrapModeU: TextureWrapMode;
	wrapModeV: TextureWrapMode;
}

export interface MaterialAsset extends Asset {
	baseColor: vec4;
	baseColorMap?: UUID;
	baseColorTransform: TextureTransform;

	normalScale: number;
	normalMap?: UUID;
	normalTransform: TextureTransform;

	emission: vec3;
	emissionIntensity: number;
	emissionMap?: UUID;
	emissionTransform: TextureTransform;

	metalness: number;
	roughness: number;
	metallicRoughnessMap?: UUID;
	metallicRoughnessTransform: TextureTransform;

	occlusionStrength: number;
	occlusionMap?: UUID;
	occlusionTransform: TextureTransform;

	alphaMode: AlphaMode;
	alphaCutoff: number;
}

export interface MeshAsset extends Asset {
	meshPrimitives: MeshPrimitive[];
	morphTargets?: string[];
	morphWeights?: number[];
}

export interface Component {
	componentType: ComponentType;
	enabled: boolean;
}

export interface PropertyComponent extends Component {
	name: string;
	layer: number;
	activeEntity: boolean;
}

export interface TransformComponent extends Component {
	parent: UUID;
	children: UUID[];
	localPosition: vec3;
	localRotation: vec3;
	localScale: vec3;
	isTransformSync: boolean;
}

export interface RenderableComponent extends Component {
	mesh?: UUID;
	materialList: (UUID | undefined)[];
	receiveShadows: boolean;
	castShadows: ShadowCastingMode;
	culling: boolean;
}

export interface GrabbleComponent extends Component {
	movementType: MovementType;
	dynamicAttach: boolean;
	attachEntity?: UUID;
	allowHoverActivate: boolean;
	trackPosition: boolean;
	trackRotation: boolean;
	throwOnDetach: boolean;
}

export interface RigidbodyComponent extends Component {
	isKinematic: boolean;
	angularDamping: number;
	linearDamping: number;
	mass: number;
	useGravity: boolean;
}

export interface CameraComponent extends Component {
	projectionType: ProjectionType;
	perspectiveFov: number;
	orthographicSize: number;
	clippingNear: number;
	clippingFar: number;
	cullingMask: number;
}

export interface LightComponent extends Component {
	lightType: LightType;
	color: vec3;
	intensity: number;
	range: number;
	/** only valid for Spot lights (unit: degree) */
	spotAngle: number;
	shadows: LightShadowMode;
	cullingMask: number;
}

export enum ColliderType {
	Box = "Box",
	Capsule = "Capsule",
	Sphere = "Sphere",
}

export interface ColliderBase {
	isTrigger: boolean;
	colliderType: ColliderType;
	center: vec3;
}

export interface BoxCollider extends ColliderBase {
	size: vec3;
}

export interface SphereCollider extends ColliderBase {
	radius: number;
}

export interface CapsuleCollider extends ColliderBase {
	height: number;
	radius: number;
}

export interface ColliderComponent extends Component {
	colliders: (CapsuleCollider | SphereCollider | BoxCollider)[];
}

export interface PrefabAsset extends Asset {
	rootEntity?: UUID;
	entities: Set<UUID>;
	properties: Map<UUID, PropertyComponent>;
	transforms: Map<UUID, TransformComponent>;
	renderables: Map<UUID, RenderableComponent>;
	grabbles: Map<UUID, GrabbleComponent>;
	rigidbodies: Map<UUID, RigidbodyComponent>;
	lights: Map<UUID, LightComponent>;
	cameras: Map<UUID, CameraComponent>;
	colliders: Map<UUID, ColliderComponent>;
}

export interface WorldProperty {
	trackedEntity?: UUID;
	worldEntrance: boolean;
	spawnRotation: vec3;
	spawnPosition: vec3;
}

export type Version = `${number}.${number}.${number}`;

export interface ProjectMetadata {
	name: string;
	projectId: string;
	author: string;
	version: Version;
	previewImagePath?: string;
}

export interface ProjectDescription {
	metadata: ProjectMetadata;
	world: WorldProperty;
	scene: {
		entities: Set<UUID>;
		properties: Map<UUID, PropertyComponent>;
		transforms: Map<UUID, TransformComponent>;
		renderables: Map<UUID, RenderableComponent>;
		grabbles: Map<UUID, GrabbleComponent>;
		rigidbodies: Map<UUID, RigidbodyComponent>;
		lights: Map<UUID, LightComponent>;
		cameras: Map<UUID, CameraComponent>;
		colliders: Map<UUID, ColliderComponent>;
	};
}

export interface ProjectBundle {
	project: ProjectDescription;
	assets: Map<UUID, Asset>;
}
