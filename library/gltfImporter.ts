import { NullEngine, Scene, SceneLoader, VertexBuffer } from "@babylonjs/core";
import "@babylonjs/loaders";
import * as fs from "fs/promises";
import { EntityManager }    from "./entity";
import { RenderableBuilder } from "./render";

export async function importGltfAndRender(path: string) {
  // 1) Headless engine + empty scene
  const engine = new NullEngine();
  const scene  = new Scene(engine);


  // 2) Read the file into a Node Buffer
  const nodeBuf = await fs.readFile(path);

  // 3) Directly append that buffer into scene
  await SceneLoader.AppendAsync("", nodeBuf, scene, undefined, ".glb");

  // 4) walk meshes
  // TODO: eventually need to have armerture data with hierarchy
  scene.meshes.forEach((mesh) => {
    if (!mesh.getTotalVertices() || !mesh.getIndices()) return;
    const positions = mesh.getVerticesData(VertexBuffer.PositionKind)!;
    const indices   = mesh.getIndices()!;

    // TODO: eventually delay to hidden entity creation until we have full mesh
    const e = EntityManager.Create(mesh.name || "gltf-mesh");
    new RenderableBuilder()
      .build(e)
      .geometry(Array.from(positions), Array.from(indices))
      .material("Universal Render Pipeline/Lit");
  });
}
