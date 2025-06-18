import { vec4 } from "../gl-matrix/esm/index.js";
import { Texture } from "./texture.js";

export class Skybox
{
    constructor(internal) {
        this.internal = internal;
    }

    /**
     * 
     * @param {SkyboxBuilder} builder 
     * @returns {Skybox}
     */
    static Create(builder) {
        return new Skybox(binding.Skybox$Create(
            builder.cubemap? builder.cubemap.internal: undefined,
            builder.showSun,
            builder.envIntensity,
            builder.color
        ));
    }
    /**
     * 
     * @param {Skybox} skybox 
     * @returns {boolean}
     */
    static Destroy(skybox) {
        return binding.Skybox$Destroy(skybox.internal);
    }
    /**
     * 
     * @param {vec4} color 
     */
    SetColor(color) {
        binding.Skybox$SetColor(this.internal, color);
    }
    /**
     * 
     * @param {uint8} select the set of bits to affect 
     * @param {uint8} values the replacement values for the affected bits
     */
    SetLayerMask(select, values) {
        binding.Skybox$SetLayerMask(this.internal, select, values);
    }
    /**
     * 
     * @returns {uint8}
     */
    GetLayerMask() {
        return binding.Skybox$GetLayerMask(this.internal);
    }
    /**
     * 
     * @returns {number}
     */
    GetIntensity() {
        return binding.Skybox$GetIntensity(this.internal);
    }
    GetTexture() {
        let internal = binding.Skybox$GetTexture(this.internal);
        if (internal)
            return new Texture(internal);
        else
            return undefined;
    }
}

export class SkyboxBuilder
{

    /**
     * 
     * @returns {Skybox}
     */
    Build() {
        return new Skybox(binding.Skybox$Create(
            this.cubemap? this.cubemap.internal: undefined,
            this.showSun,
            this.envIntensity,
            this.color
        ));
    }

    /**
     * 
     * @param {Texture} cubemap 
     */
    Environment(cubemap) {
        this.cubemap = cubemap;
        return this;
    }
    ShowSun(show) {
        this.showSun = show;
        return this;
    }
    Intensity(envIntensity) {
        this.envIntensity = envIntensity;
        return this;
    }
    Color(color) {
        this.color = color;
        return this;
    }

    cubemap = undefined;
    showSun = false;
    envIntensity = 30000;
    color = vec4.fromValues(0,0,0,1);
}