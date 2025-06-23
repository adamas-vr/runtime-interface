import { RpcClient } from "./rpc";
import { Entity }    from "./entity";

export class RenderableBuilder {
  public meshHandle!: number;      // expose for skinning support
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
      meshHandle:   this.meshHandle,
      verticesJson: JSON.stringify(vertices),
    });
    RpcClient.Call("Mesh_SetTriangles", {
      meshHandle:     this.meshHandle,
      trianglesJson:  JSON.stringify(indices),
    });
    RpcClient.Call("Mesh_RecalculateNormals", { meshHandle: this.meshHandle });
    RpcClient.Call("Mesh_RecalculateBounds",  { meshHandle: this.meshHandle });

    RpcClient.Call("Renderable_SetMesh", {
      entityHandle: this.entityHandle,
      meshHandle:   this.meshHandle,
    });
    return this;
  }

  /**  
   * Create (or reuse) a URP-lit material and bind to submesh 0.  
   * Uses Unity’s “Universal Render Pipeline/Lit” shader.  
   */
  materialURPLit(): this {
    const matHandle = Number(RpcClient.Call("Material_Create", {
      shaderName: "Universal Render Pipeline/Lit"
    }));
    this.materialHandles[0] = matHandle;
    RpcClient.Call("Renderable_SetMaterial", {
      entityHandle:   this.entityHandle,
      materialHandle: matHandle,
      index:          0,
    });
    return this;
  }

  /** PBR parameters on URP-lit */
  setBaseColor(red: number, green: number, blue: number, alpha: number): this {
    const matHandle = this.materialHandles[0];
    RpcClient.Call("Material_SetColor", {
      materialHandle: matHandle,
      propertyName:   "_BaseColor",
      r: red,
      g: green,
      b: blue,
      a: alpha
    });
    return this;
  }

  setBaseTexture(textureHandle: number): this {
    const matHandle = this.materialHandles[0];
    RpcClient.Call("Material_SetTexture", {
      materialHandle: matHandle,
      propertyName:   "_BaseMap",
      textureHandle
    });
    return this;
  }

  setMetallic(metal: number): this {
    const matHandle = this.materialHandles[0];
    RpcClient.Call("Material_SetFloat", {
      materialHandle: matHandle,
      propertyName:   "_Metallic",
      value:          metal
    });
    return this;
  }

  setSmoothness(smooth: number): this {
    const matHandle = this.materialHandles[0];
    RpcClient.Call("Material_SetFloat", {
      materialHandle: matHandle,
      propertyName:   "_Smoothness",
      value:          smooth
    });
    return this;
  }
}
