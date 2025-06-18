import {vec3} from "../gl-matrix/esm/index.js"

export class LightManager
{
    /**
     * 
     * @param {Entity} entity 
     * @param {LightManager.Type} type 
     * @returns {boolean} if successfully created
     */
    static Create(entity, type) {
        return binding.LightManager$Create(entity, type);
    }
    /**
     * 
     * @param {number} entity 
     */
    static Destroy(entity) {
        binding.LightManager$Destroy(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {boolean}
     */
    static HasComponent(entity) {
        return binding.LightManager$HasComponent(entity);
    }
    /**
     * 
     * @param {Entity} entity 
     * @returns {LightManager.Type}
     */
    static GetType(entity) {
        return binding.LightManager$GetType(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {LightManager.Type}
     */
    static IsDirectional(entity) {
        return binding.LightManager$IsDirectional(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {boolean}
     */
    static IsPointLight(entity) {
        return binding.LightManager$IsPointLight(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {boolean}
     */
    static IsSpotLight(entity) {
        return binding.LightManager$IsSpotLight(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} channel integer
     * @param {boolean} enable 
     */
    static SetLightChannel(entity, channel, enable) {
        binding.LightManager$SetLightChannel(entity, channel, enable);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} channel integer
     * @returns {boolean}
     */
    static GetLightChannel(entity, channel) {
        return binding.LightManager$GetLightChannel(entity, channel);
    }
    /**
     * 
     * @param {number} entity 
     * @param {vec3} position 
     */
    static SetPosition(entity, position) {
        binding.LightManager$SetPosition(entity, position);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {vec3}
     */
    static GetPosition(entity) {
        return binding.LightManager$GetPosition(entity, vec3.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @param {vec3} direction 
     */
    static SetDirection(entity, direction) {
        binding.LightManager$SetDirection(entity, direction);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {vec3}
     */
    static GetDirection(entity) {
        return binding.LightManager$GetDirection(entity, vec3.fromValues);
    }
    /**
     * 
     * @param {Entity} entity 
     * @param {vec3} color 
     */
    static SetColor(entity, color) {
        binding.LightManager$SetColor(entity, color);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {vec3}
     */
    static GetColor(entity) {
        return binding.LightManager$GetColor(entity, vec3.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} intensity 
     */
    static SetIntensity(entity, intensity) {
        binding.LightManager$SetIntensity(entity, intensity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} watts 
     * @param {number} efficiency 
     */
    static SetIntensityWatts(entity, watts, efficiency) {
        binding.LightManager$SetIntensityWatts(entity, watts, efficiency);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} intensity 
     */
    static SetIntensityCandela(entity, intensity) {
        binding.LightManager$SetIntensityCandela(entity, intensity);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {number}
     */
    static GetIntensity(entity) {
        return binding.LightManager$GetIntensity(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} radius 
     */
    static SetFalloff(entity, radius) {
        binding.LightManager$SetFalloff(entity, radius);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {number}
     */
    static GetFalloff(entity) {
        return binding.LightManager$GetFalloff(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} angularRadius 
     */
    static SetSunAngularRadius(entity, angularRadius) {
        binding.LightManager$SetSunAngularRadius(entity, angularRadius);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {number}
     */
    static GetSunAngularRadius(entity) {
        return binding.LightManager$GetSunAngularRadius(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} haloSize 
     */
    static SetSunHaloSize(entity, haloSize) {
        binding.LightManager$SetSunHaloSize(entity, haloSize);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {number}
     */
    static GetSunHaloSize(entity) {
        return binding.LightManager$GetSunHaloSize(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} haloFalloff 
     */
    static SetSunHaloFalloff(entity, haloFalloff) {
        binding.LightManager$SetSunHaloFalloff(entity, haloFalloff);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {number}
     */
    static GetSunHaloFalloff(entity) {
        return binding.LightManager$GetSunHaloFalloff(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {boolean} shadowCaster 
     */
    static SetShadowCaster(entity, shadowCaster) {
        binding.LightManager$SetShadowCaster(entity, shadowCaster);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {boolean}
     */
    static IsShadowCaster(entity) {
        return binding.LightManager$IsShadowCaster(entity);
    }

    static Type = Object.freeze({
        SUN:            0,
        DIRECTIONAL:    1,
        POINT:          2,
        FOCUSED_SPOT:   3,
        SPOT:           4
    });
}