import { RpcClient } from "./rpc";
import { Material }  from "./material";
import { Texture }   from "./texture";
import { Scene }     from "./scene";


export class Renderer {
  // ------------------------------------------------------------
  // Camera / XR
  // ------------------------------------------------------------

  /**
   * Filament: Renderer::getDefaultCameraEntity()
   * Unity RPC not yet implemented; please register a CameraManager method.
   */
  static getDefaultCameraEntity(): number {
    console.warn("getDefaultCameraEntity(): Unity RPC not available");
    return -1;
  }

  /**
   * Filament: Renderer::getXRCameras()
   * Unity RPC not yet implemented.
   */
  static getXRCameras(): number[] {
    console.warn("getXRCameras(): Unity RPC not available");
    return [];
  }


  // ------------------------------------------------------------
  // Material / Skybox / Indirect Light
  // ------------------------------------------------------------

  /**
   * Destroy a material instance (mimics Filament::Renderer::destroyMaterialInstance)
   */
  static destroyMaterialInstance(instanceHandle: number): boolean {
    return Material.destroy(instanceHandle);
  }

  /**
   * Destroy a render-target (in Unity, render textures)
   */
  static destroyRenderTarget(rtHandle: number): boolean {
    return Texture.destroy(rtHandle);
  }

  /**
   * Destroy a skybox (in Unity, just a material)
   */
  static destroySkybox(skyboxMatHandle: number): boolean {
    return Material.destroy(skyboxMatHandle);
  }

  /**
   * Destroy an indirect light (no direct Unity equivalent)
   */
  static destroyIndirectLight(ilHandle: number): boolean {
    console.warn("destroyIndirectLight(): no Unity RPC equivalent");
    return false;
  }


  // ------------------------------------------------------------
  // Scene-level convenience
  // ------------------------------------------------------------

  /**
   * Wraps Scene_SetSkybox
   */
  static setSkybox(sceneHandle: number, skyboxMatHandle: number): boolean {
    return Scene.setSkybox(sceneHandle, skyboxMatHandle);
  }

  /**
   * Wraps Scene_SetAmbientLight
   */
  static setAmbientLight(
    sceneHandle: number,
    r: number,
    g: number,
    b: number,
    intensity: number
  ): boolean {
    return Scene.setAmbientLight(sceneHandle, r, g, b, intensity);
  }

  /**
   * Wraps Scene_SetFog
   */
  static setFog(
    sceneHandle: number,
    enabled: boolean,
    mode: number,
    density: number,
    start: number,
    end: number
  ): boolean {
    return Scene.setFog(sceneHandle, enabled, mode, density, start, end);
  }
}
