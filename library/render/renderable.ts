import { RpcClient } from "@adamas/rpc";
import { Entity } from "@adamas/entity";

// NOTE: the following are not supported compared to legacy code:
// - Filament’s RenderableBuilder.Geometry(index,type,vertices,indices,offset,count)
// - RenderableBuilder.Material(index,materialInstance)
// - BoundingBox(...), SetBlendOrderAt

export class RenderableBuilder {
	public meshHandle!: number; // expose for skinning support
	private entityHandle!: Entity;
	private materialHandles: number[] = [];

	build(entity: Entity): this {
		this.entityHandle = entity;
		RpcClient.Call("Renderable_Create", { entityHandle: entity });
		return this;
	}

	geometry(vertices: number[], indices: number[]): this {
		this.meshHandle = Number(RpcClient.Call("Mesh_Create", {}));
		RpcClient.Call("Mesh_SetVertices", {
			meshHandle: this.meshHandle,
			verticesJson: JSON.stringify(vertices),
		});
		RpcClient.Call("Mesh_SetTriangles", {
			meshHandle: this.meshHandle,
			trianglesJson: JSON.stringify(indices),
		});
		RpcClient.Call("Mesh_RecalculateNormals", { meshHandle: this.meshHandle });
		RpcClient.Call("Mesh_RecalculateBounds", { meshHandle: this.meshHandle });

		RpcClient.Call("Renderable_SetMesh", {
			entityHandle: this.entityHandle,
			meshHandle: this.meshHandle,
		});
		return this;
	}

	/**
	 * Create (or reuse) a URP-lit material and bind to submesh 0.
	 * Uses Unity’s “Universal Render Pipeline/Lit” shader.
	 */
	materialURPLit(): this {
		const matHandle = Number(
			RpcClient.Call("Material_Create", {
				shaderName: "Universal Render Pipeline/Lit",
			}),
		);
		this.materialHandles[0] = matHandle;
		RpcClient.Call("Renderable_SetMaterial", {
			entityHandle: this.entityHandle,
			materialHandle: matHandle,
			index: 0,
		});
		return this;
	}

	/** PBR parameters on URP-lit */
	setBaseColor(red: number, green: number, blue: number, alpha: number): this {
		const matHandle = this.materialHandles[0];
		RpcClient.Call("Material_SetColor", {
			materialHandle: matHandle,
			propertyName: "_BaseColor",
			r: red,
			g: green,
			b: blue,
			a: alpha,
		});
		return this;
	}

	setBaseTexture(textureHandle: number): this {
		const matHandle = this.materialHandles[0];
		RpcClient.Call("Material_SetTexture", {
			materialHandle: matHandle,
			propertyName: "_BaseMap",
			textureHandle,
		});
		return this;
	}

	setMetallic(metal: number): this {
		const matHandle = this.materialHandles[0];
		RpcClient.Call("Material_SetFloat", {
			materialHandle: matHandle,
			propertyName: "_Metallic",
			value: metal,
		});
		return this;
	}

	setSmoothness(smooth: number): this {
		const matHandle = this.materialHandles[0];
		RpcClient.Call("Material_SetFloat", {
			materialHandle: matHandle,
			propertyName: "_Smoothness",
			value: smooth,
		});
		return this;
	}
}

export class RenderableManager {
	/** Destroy the Renderable component on this entity. */
	static destroy(entityHandle: number): boolean {
		return Boolean(RpcClient.Call("Renderable_Destroy", { entityHandle }));
	}

	/** Returns whether this entity currently has a Renderable. */
	static hasComponent(entityHandle: number): boolean {
		return Boolean(RpcClient.Call("Renderable_HasComponent", { entityHandle }));
	}

	/** Set the layer mask on this Renderable (bitmask of visible layers). */
	static setLayerMask(entityHandle: number, layerMask: number): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetLayerMask", {
				entityHandle,
				layerMask,
			}),
		);
	}

	/** Enable or disable receiving shadows on this Renderable. */
	static setReceiveShadows(entityHandle: number, receive: boolean): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetReceiveShadows", {
				entityHandle,
				receive,
			}),
		);
	}

	/** Control shadow‐casting mode.
	 *   0 = Off, 1 = On, 2 = TwoSided, 3 = ShadowsOnly
	 */
	static setCastShadows(entityHandle: number, shadowMode: number): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetCastShadows", {
				entityHandle,
				shadowMode,
			}),
		);
	}

	/** Enable or disable frustum‐culling on this Renderable. */
	static setCulling(entityHandle: number, enabled: boolean): boolean {
		return Boolean(
			RpcClient.Call("Renderable_SetCulling", {
				entityHandle,
				enabled,
			}),
		);
	}
}
