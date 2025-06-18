import { Scene } from "./scene.js"
import { View } from "./view.js";
import { VertexBuffer } from "./vertex-buffer.js";
import { IndexBuffer } from "./index-buffer.js";

export class Renderer
{
    static GetDefaultCameraEntity() {
        return binding.Renderer$GetDefaultCameraEntity()
    }
    /**
     * 
     * @returns {Entity[]}
     */
    static GetXRCameras() {
        return binding.Renderer$GetXRCameras();
    }
    static GetDefaultScene() {
        return new Scene(binding.Renderer$GetDefaultScene());
    }
    static GetSwapchainView() {
        return new View(binding.Renderer$GetSwapchainView());
    }

    static AddOffscreenView(view) {
        binding.Renderer$AddOffscreenView(view.internal);
    }
    static RemoveOffscreenView(view) {
        binding.Renderer$RemoveOffscreenView(view.internal);
    }

    static CreateView() {
        return new View(binding.Renderer$CreateView());
    }
    static CreateScene() {
        return new Scene(binding.Renderer$CreateScene());
    }

    static DestroyView(view) {
        return binding.Renderer$DestroyView(view.internal);
    }
    static DestroyScene(scene) {
        return binding.Renderer$DestroyScene(scene.internal);
    }
    static DestroyIndexBuffer(indexBuffer) {
        if (indexBuffer == undefined)
            return;
        return binding.Renderer$DestroyIndexBuffer(indexBuffer.internal);
    }
    static DestroyVertexBuffer(vertexBuffer) {
        if (vertexBuffer == undefined)
                return;
        return binding.Renderer$DestroyVertexBuffer(vertexBuffer.internal);
    }
    static DestroyTexture(texture) {
        if (texture == undefined)
            return;
        return binding.Renderer$DestroyTexture(texture.internal);
    }
    static DestroyMaterial(material) {
        if (material == undefined)
            return;
        return binding.Renderer$DestroyMaterial(material.internal);
    }
    static DestroyMaterialInstance(materialInstance) {
        if (materialInstance == undefined)
            return;
        return binding.Renderer$DestroyMaterialInstance(materialInstance.internal);
    }
    static DestroyRenderTarget(renderTarget) {
        if (renderTarget == undefined)
            return;
        return binding.Renderer$DestroyRenderTarget(renderTarget.internal);
    }
    static DestroySkybox(skybox) {
        if (skybox == undefined)
            return;
        return binding.Renderer$DestroySkybox(skybox.internal);
    }
    static DestroyIndirectLight(indirectLight) {
        if (indirectLight == undefined)
            return;
        return binding.Renderer$DestroyIndirectLight(indirectLight.internal);
    }
}