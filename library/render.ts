import { RpcClient } from "./rpc";
import { Entity }    from "./entity";

export class RenderableBuilder {
  private entityHandle!: Entity;
  private meshHandle!: number;

  /**
   * Associate this builder with an entity and add the Renderable component.
   */
  build(entity: Entity): this {
    this.entityHandle = entity;
    RpcClient.Call("Renderable_Create", { entityHandle: entity });
    return this;
  }

  /**
   * Uploads a mesh and wires it up to the entity’s Renderable.
   * @param vertices raw [x,y,z,…] array
   * @param indices  triangle indices
   */
  geometry(vertices: number[], indices: number[]): this {
    // 1) create mesh
    this.meshHandle = Number(RpcClient.Call("Mesh_Create", {}));

    // 2) upload vertex data
    RpcClient.Call("Mesh_SetVertices", {
      meshHandle:    this.meshHandle,
      verticesJson:  JSON.stringify(vertices),
    });

    // 3) upload index data
    RpcClient.Call("Mesh_SetTriangles", {
      meshHandle:    this.meshHandle,
      trianglesJson: JSON.stringify(indices),
    });

    // 4) attach it
    RpcClient.Call("Renderable_SetMesh", {
      entityHandle: this.entityHandle,
      meshHandle:   this.meshHandle,
    });

    // 5) make sure mesh is calculated correctly
    RpcClient.Call("Mesh_RecalculateNormals", { meshHandle: this.meshHandle });
    RpcClient.Call("Mesh_RecalculateBounds", { meshHandle: this.meshHandle });

    return this;
  }

  /**
   * Creates or reuses a material and binds it to submesh 0. 
   * TODO: do we support multiple submeshes?
   */
  material(shaderName: string): this {
    const matHandle = Number(RpcClient.Call("Material_Create", { shaderName }));
    RpcClient.Call("Renderable_SetMaterial", {
      entityHandle:    this.entityHandle,
      materialHandle:  matHandle,
      index:           0,
    });
    return this;
  }
}
