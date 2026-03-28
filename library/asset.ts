/**
 * Asset and project data types.
 *
 * @module asset
 */
import { vec2, vec3, vec4 } from "gl-matrix";
import { AlphaMode } from "./render/material";
import { TextureFilterMode, TextureWrapMode } from "./render/texture";
import { UUID } from "crypto";
import { ShadowCastingMode } from "./render/renderable";
import { MovementType } from "./interaction";
import { ProjectionType } from "./render/camera";
import { LightShadowMode, LightType } from "./render/light";

/**
 * Supported asset types.
 */
export enum AssetType {
	/** Material asset. */
	Material = "Material",
	/** Texture asset. */
	Texture = "Texture",
	/** Mesh asset. */
	Mesh = "Mesh",
	/** Prefab asset. */
	Prefab = "Prefab",
}

/**
 * Supported component types.
 */
export enum ComponentType {
	/** Property component. */
	Property = "Property",
	/** Transform component. */
	Transform = "Transform",
	/** Renderable component. */
	Renderable = "Renderable",
	/** Camera component. */
	Camera = "Camera",
	/** Light component. */
	Light = "Light",
	/** Rigidbody component. */
	Rigidbody = "Rigid Body",
	/** Collider component. */
	Collider = "Collider",
	/** Grabble component. */
	Grabble = "Grabble",
}

/**
 * Texture transform data.
 */
export interface TextureTransform {
	/** Texture offset. */
	offset: vec2;
	/** Texture scale. */
	scale: vec2;
	/** Texture rotation. */
	rotation: number;
}

/**
 * Sparse morph target data.
 */
export interface SparseMorphData {
	/** Total array size. */
	arraySize: number;
	/** Indices of sparse entries. */
	sparseIndices: Uint16Array;
	/** Values of sparse entries. */
	sparseValues: Float32Array;
}

/**
 * Mesh primitive data.
 */
export interface MeshPrimitive {
	/** Triangle indices. */
	indices: Uint16Array;
	/** Vertex positions. */
	vertices: Float32Array;
	/** Vertex normals. */
	normals?: Float32Array;
	/** Vertex UV coordinates. */
	uvs?: Float32Array;
	/** Morph target position data. */
	morphPosition?: (Float32Array | SparseMorphData)[];
	/** Morph target normal data. */
	morphNormal?: (Float32Array | SparseMorphData)[];
}

/**
 * Base asset data.
 */
export interface Asset {
	/** Asset name. */
	name: string;
	/** Asset UUID. */
	uuid: UUID;
	/** Asset type. */
	assetType: AssetType;
}

/**
 * Texture asset data.
 */
export interface TextureAsset extends Asset {
	/** Encoded image data. */
	image: Uint8Array;
	/** Image MIME type. */
	mimeType: string;
	/** Texture filter mode. */
	filterMode: TextureFilterMode;
	/** Texture wrap mode on the U axis. */
	wrapModeU: TextureWrapMode;
	/** Texture wrap mode on the V axis. */
	wrapModeV: TextureWrapMode;
}

/**
 * Material asset data.
 */
export interface MaterialAsset extends Asset {
	/** Base color as an RGBA `vec4`. */
	baseColor: vec4;
	/** Base color texture UUID. */
	baseColorMap?: UUID;
	/** Base color texture transform. */
	baseColorTransform: TextureTransform;

	/** Normal scale. */
	normalScale: number;
	/** Normal texture UUID. */
	normalMap?: UUID;
	/** Normal texture transform. */
	normalTransform: TextureTransform;

	/** Emission color as an RGB `vec3`. */
	emission: vec3;
	/** Emission intensity. */
	emissionIntensity: number;
	/** Emission texture UUID. */
	emissionMap?: UUID;
	/** Emission texture transform. */
	emissionTransform: TextureTransform;

	/** Metalness value. */
	metalness: number;
	/** Roughness value. */
	roughness: number;
	/** Metallic-roughness texture UUID. */
	metallicRoughnessMap?: UUID;
	/** Metallic-roughness texture transform. */
	metallicRoughnessTransform: TextureTransform;

	/** Occlusion strength. */
	occlusionStrength: number;
	/** Occlusion texture UUID. */
	occlusionMap?: UUID;
	/** Occlusion texture transform. */
	occlusionTransform: TextureTransform;

	/** Alpha mode. */
	alphaMode: AlphaMode;
	/** Alpha cutoff value. */
	alphaCutoff: number;
}

/**
 * Mesh asset data.
 */
export interface MeshAsset extends Asset {
	/** Mesh primitives. */
	meshPrimitives: MeshPrimitive[];
	/** Morph target names. */
	morphTargets?: string[];
	/** Morph target weights. */
	morphWeights?: number[];
}

/**
 * Base component data.
 */
export interface Component {
	/** Component type. */
	componentType: ComponentType;
	/** Whether the component is enabled. */
	enabled: boolean;
}

/**
 * Property component data.
 */
export interface PropertyComponent extends Component {
	/** Entity name. */
	name: string;
	/** Entity layer. */
	layer: number;
	/** Whether the entity is active. */
	activeEntity: boolean;
}

/**
 * Transform component data.
 */
export interface TransformComponent extends Component {
	/** Parent entity UUID. */
	parent: UUID;
	/** Child entity UUIDs. */
	children: UUID[];
	/** Local position. */
	localPosition: vec3;
	/** Local rotation. */
	localRotation: vec3;
	/** Local scale. */
	localScale: vec3;
	/** Whether transform sync is enabled. */
	isTransformSync: boolean;
}

/**
 * Renderable component data.
 */
export interface RenderableComponent extends Component {
	/** Mesh UUID. */
	mesh?: UUID;
	/** Material UUIDs by slot. */
	materialList: (UUID | undefined)[];
	/** Whether the renderable receives shadows. */
	receiveShadows: boolean;
	/** Shadow casting mode. */
	castShadows: ShadowCastingMode;
	/** Whether culling is enabled. */
	culling: boolean;
}

/**
 * Grabble component data.
 */
export interface GrabbleComponent extends Component {
	/** Movement type. */
	movementType: MovementType;
	/** Whether dynamic attach is enabled. */
	dynamicAttach: boolean;
	/** Attach entity UUID. */
	attachEntity?: UUID;
	/** Whether hover activate is allowed. */
	allowHoverActivate: boolean;
	/** Whether position tracking is enabled. */
	trackPosition: boolean;
	/** Whether rotation tracking is enabled. */
	trackRotation: boolean;
	/** Whether throw-on-detach is enabled. */
	throwOnDetach: boolean;
}

/**
 * Rigidbody component data.
 */
export interface RigidbodyComponent extends Component {
	/** Whether the rigidbody is kinematic. */
	isKinematic: boolean;
	/** Angular damping. */
	angularDamping: number;
	/** Linear damping. */
	linearDamping: number;
	/** Mass. */
	mass: number;
	/** Whether gravity is enabled. */
	useGravity: boolean;
}

/**
 * Camera component data.
 */
export interface CameraComponent extends Component {
	/** Projection type. */
	projectionType: ProjectionType;
	/** Perspective field of view. */
	perspectiveFov: number;
	/** Orthographic size. */
	orthographicSize: number;
	/** Near clipping plane distance. */
	clippingNear: number;
	/** Far clipping plane distance. */
	clippingFar: number;
	/** Camera culling mask. */
	cullingMask: number;
}

/**
 * Light component data.
 */
export interface LightComponent extends Component {
	/** Light type. */
	lightType: LightType;
	/** Light color. */
	color: vec3;
	/** Light intensity. */
	intensity: number;
	/** Light range. */
	range: number;
	/** Spot lights angle in degree. Only valid for spot lights. */
	spotAngle: number;
	/** Shadow mode. */
	shadows: LightShadowMode;
	/** Light culling mask. */
	cullingMask: number;
}

/**
 * Supported collider types.
 */
export enum ColliderType {
	/** Box collider. */
	Box = "Box",
	/** Capsule collider. */
	Capsule = "Capsule",
	/** Sphere collider. */
	Sphere = "Sphere",
}

/**
 * Base collider data.
 */
export interface ColliderBase {
	/** Whether the collider is a trigger. */
	isTrigger: boolean;
	/** Collider type. */
	colliderType: ColliderType;
	/** Collider center. */
	center: vec3;
}

/**
 * Box collider data.
 */
export interface BoxCollider extends ColliderBase {
	/** Box size. */
	size: vec3;
}

/**
 * Sphere collider data.
 */
export interface SphereCollider extends ColliderBase {
	/** Sphere radius. */
	radius: number;
}

/**
 * Capsule collider data.
 */
export interface CapsuleCollider extends ColliderBase {
	/** Capsule height. */
	height: number;
	/** Capsule radius. */
	radius: number;
}

/**
 * Collider component data.
 */
export interface ColliderComponent extends Component {
	/** Collider list. */
	colliders: (CapsuleCollider | SphereCollider | BoxCollider)[];
}

/**
 * Prefab asset data.
 */
export interface PrefabAsset extends Asset {
	/** Root entity UUID. */
	rootEntity?: UUID;
	/** Entity UUIDs. */
	entities: Set<UUID>;
	/** Property components by entity UUID. */
	properties: Map<UUID, PropertyComponent>;
	/** Transform components by entity UUID. */
	transforms: Map<UUID, TransformComponent>;
	/** Renderable components by entity UUID. */
	renderables: Map<UUID, RenderableComponent>;
	/** Grabble components by entity UUID. */
	grabbles: Map<UUID, GrabbleComponent>;
	/** Rigidbody components by entity UUID. */
	rigidbodies: Map<UUID, RigidbodyComponent>;
	/** Light components by entity UUID. */
	lights: Map<UUID, LightComponent>;
	/** Camera components by entity UUID. */
	cameras: Map<UUID, CameraComponent>;
	/** Collider components by entity UUID. */
	colliders: Map<UUID, ColliderComponent>;
}

/**
 * World-level project settings.
 */
export interface WorldProperty {
	/** Tracked entity UUID. */
	trackedEntity?: UUID;
	/** Whether the world has an entrance. */
	worldEntrance: boolean;
	/** Spawn rotation. */
	spawnRotation: vec3;
	/** Spawn position. */
	spawnPosition: vec3;
}

/**
 * Semantic version string.
 */
export type Version = `${number}.${number}.${number}`;

/**
 * Project metadata.
 */
export interface ProjectMetadata {
	/** Project identifier. */
	projectId: string;
	/** Project name. */
	name: string;
	/** Project author. */
	author: string;
	/** Project version. */
	version: Version;
	/** Preview image path. */
	previewImagePath?: string;
}

/**
 * Project description data.
 */
export interface ProjectDescription {
	/** Project metadata. */
	metadata: ProjectMetadata;
	/** World settings. */
	world: WorldProperty;
	/** Scene data. */
	scene: {
		/** Entity UUIDs. */
		entities: Set<UUID>;
		/** Property components by entity UUID. */
		properties: Map<UUID, PropertyComponent>;
		/** Transform components by entity UUID. */
		transforms: Map<UUID, TransformComponent>;
		/** Renderable components by entity UUID. */
		renderables: Map<UUID, RenderableComponent>;
		/** Grabble components by entity UUID. */
		grabbles: Map<UUID, GrabbleComponent>;
		/** Rigidbody components by entity UUID. */
		rigidbodies: Map<UUID, RigidbodyComponent>;
		/** Light components by entity UUID. */
		lights: Map<UUID, LightComponent>;
		/** Camera components by entity UUID. */
		cameras: Map<UUID, CameraComponent>;
		/** Collider components by entity UUID. */
		colliders: Map<UUID, ColliderComponent>;
	};
}

/**
 * Project bundle data.
 */
export interface ProjectBundle {
	/** Project description. */
	project: ProjectDescription;
	/** Assets by UUID. */
	assets: Map<UUID, Asset>;
}
