import { RpcClient } from "./rpc";
import { Entity }    from "./entity";

export class Camera {
  constructor(public entity: Entity) {}

  static create(entity: Entity): void {
    RpcClient.Call("Camera_Create", { entityHandle: entity });
  }

  static destroy(entity: Entity): boolean {
    return Boolean(RpcClient.Call("Camera_Destroy", { entityHandle: entity }));
  }

  static hasComponent(entity: Entity): boolean {
    return Boolean(RpcClient.Call("Camera_HasComponent", { entityHandle: entity }));
  }

  static setProjection(
    entity: Entity,
    projectionType: number,
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): boolean {
    return Boolean(RpcClient.Call("Camera_SetProjection", {
      entityHandle:  entity,
      projectionType,
      fov,
      aspect,
      near,
      far
    }));
  }

  static setOrthographic(
    entity: Entity,
    left: number, right: number,
    bottom: number, top: number,
    near: number, far: number
  ): boolean {
    return Boolean(RpcClient.Call("Camera_SetOrthographic", {
      entityHandle: entity,
      left, right, bottom, top, near, far
    }));
  }

  static lookAt(
    entity: Entity,
    targetX: number, targetY: number, targetZ: number,
    upX: number, upY: number, upZ: number,
    worldUpX: number, worldUpY: number, worldUpZ: number
  ): boolean {
    return Boolean(RpcClient.Call("Camera_LookAt", {
      entityHandle: entity,
      targetX, targetY, targetZ,
      upX, upY, upZ,
      worldUpX, worldUpY, worldUpZ
    }));
  }

  static setCullingMask(entity: Entity, mask: number): boolean {
    return Boolean(RpcClient.Call("Camera_SetCullingMask", {
      entityHandle: entity,
      mask
    }));
  }

  static setRenderTexture(entity: Entity, textureHandle: number): boolean {
    return Boolean(RpcClient.Call("Camera_SetRenderTexture", {
      entityHandle:   entity,
      renderTexture: textureHandle
    }));
  }
}
