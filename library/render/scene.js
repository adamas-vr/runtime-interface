import { Skybox } from "./skybox.js";
import { IndirectLight } from "./indirect-light.js";

export class Scene
{
    //TODO: needs wrapper for multi-app support
    constructor(internal) {
        this.internal = internal;
    }

    /**
     * Sets the Skybox.
     *
     * The Skybox is drawn last and covers all pixels not touched by geometry.
     *
     * @param {Skybox} skybox The Skybox to use to fill untouched pixels, or nullptr to unset the Skybox.
     */
    SetSkybox(skybox) {
        binding.Scene$SetSkybox(this.internal, skybox? skybox.internal: undefined);
    }

    /**
     * Returns the Skybox associated with the Scene.
     *
     * @return {Skybox} The associated Skybox, or nullptr if there is none.
     */
    GetSkybox() {
        let skyboxInternal = binding.Scene$GetSkybox(this.internal);
        if (skyboxInternal == undefined)
            return undefined;
        return new Skybox(skyboxInternal);
    }

    /**
     * Set the IndirectLight to use when rendering the Scene.
     *
     * Currently, a Scene may only have a single IndirectLight. This call replaces the current
     * IndirectLight.
     *
     * @param {IndirectLight} ibl The IndirectLight to use when rendering the Scene or nullptr to unset.
     */
    SetIndirectLight(ibl) {
        binding.Scene$SetIndirectLight(this.internal, ibl? ibl.internal: undefined);
    }

    /**
     * Get the IndirectLight or nullptr if none is set.
     *
     * @return {IndirectLight} the the IndirectLight or nullptr if none is set
     */
    GetIndirectLight() {
        let iblInternal = binding.Scene$GetIndirectLight(this.internal);
        if (iblInternal == undefined)
            return undefined;
        return new IndirectLight(iblInternal);
    }

    /**
     * 
     * @param {Entity} entity 
     */
    AddEntity(entity) {
        binding.Scene$AddEntity(this.internal, entity);
    }
    RemoveEntity(entity) {
        binding.Scene$RemoveEntity(this.internal, entity);
    }
}