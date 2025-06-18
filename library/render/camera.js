import { mat4, vec4, vec2, vec3 } from "../gl-matrix/esm/index.js";



export class CameraManager
{
    /**
     * 
     * @param {number} entity 
     * @returns {boolean} false if already created
     */
    static Create(entity) {
        return binding.CameraManager$Create(entity);
    }
    /**
     * 
     * @param {number} entity 
     */
    static Destroy(entity) {
        binding.CameraManager$Destroy(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {boolean}
     */
    static HasComponent(entity) {
        return binding.CameraManager$HasComponent(entity);
    }
    /**
     * 
     * @returns {mat4}
     */
    static ProjectionMatFromFov(entity, direction, fovInDegrees, aspect, near, far) {
        if (far == undefined)
            far = Number.MAX_VALUE;
        return binding.CameraManager$ProjectionMatFromFov(entity, 
            direction, fovInDegrees, aspect, near, far, 
            mat4.fromValues
        );
    }
    /**
     * 
     * @returns {mat4}
     */
    static ProjectionMatFromFocal(entity, focalInMillimeters, aspect, near, far) {
        if (far == undefined)
            far = Number.MAX_VALUE;
        return binding.CameraManager$ProjectionMatFromFocal(entity,
            focalInMillimeters, aspect, near, far,
            mat4.fromValues
        );
    }
    static SetProjectionFromFrustum(entity, projection, left, right, bottom, top, near, far) {
        binding.CameraManager$SetProjectionFromFrustum(entity,
            projection, left, right, bottom, top, near, far
        );
    }
    static SetProjectionFromFromFov(entity, fovInDegrees, aspect, near, far, direction) {
        if (direction == undefined)
            direction = this.Fov.VERTICAL;
        binding.CameraManager$SetProjectionFromFromFov(entity, fovInDegrees, aspect, near, far, direction);
    }
    static SetLensProjection(entity, focalInMillimeters, aspect, near, far) {
        binding.CameraManager$SetLensProjection(entity, focalInMillimeters, aspect, near, far);
    }
    /**
     * 
     * @param {number} entity 
     * @param {mat4} projection 
     * @param {number} near 
     * @param {number} far 
     */
    static SetCustomProjection(entity, projection, near, far) {
        binding.CameraManager$SetCustomProjection(entity, projection, near, far);
    }
    /**
     * 
     * @param {number} entity 
     * @param {vec2} scaling 
     */
    static SetScaling(entity, scaling) {
        binding.CameraManager$SetScaling(entity, scaling);
    }
    /**
     * 
     * @param {number} entity 
     * @param {vec2} shift 
     */
    static SetShift(entity, shift) {
        binding.CameraManager$SetShift(entity, shift);
    }
    /**
     * @param {number} entity
     * @returns {vec4} 
     */
    static GetScaling(entity) {
        return binding.CameraManager$GetScaling(entity, vec4.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {vec2}
     */
    static GetShift(entity) {
        return binding.CameraManager$GetShift(entity, vec2.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {mat4}
     */
    static GetProjectionMatrix(entity) {
        return binding.CameraManager$GetProjectionMatrix(entity, mat4.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {number}
     */
    static GetNear(entity) {
        return binding.CameraManager$GetNear(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {number}
     */
    static GetCullingFar(entity) {
        return binding.CameraManager$GetCullingFar(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {mat4} model 
     */
    static SetModelMatrix(entity, model) {
        binding.CameraManager$SetModelMatrix(entity, model);
    }
    /**
     * 
     * @param {number} entity 
     * @param {vec3} eye 
     * @param {vec3} center 
     * @param {vec3} up 
     */
    static LookAt(entity, eye, center, up) {
        if (up == undefined)
            up = vec3.fromValues(0, 1, 0);
        binding.CameraManager$LookAt(entity, eye, center, up);
    }
    static GetModelMatrix(entity) {
        return binding.CameraManager$GetModelMatrix(entity, mat4.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {mat4}
     */
    static GetViewMatrix(entity) {
        return binding.CameraManager$GetViewMatrix(entity, mat4.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {vec3}
     */
    static GetPosition(entity) {
        return binding.CameraManager$GetPosition(entity, vec3.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {vec3}
     */
    static GetLeftVector(entity) {
        return binding.CameraManager$GetLeftVector(entity, vec3.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {vec3}
     */
    static GetUpVector(entity) {
        return binding.CameraManager$GetUpVector(entity, vec3.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @returns {vec3}
     */
    static GetForwardVector(entity) {
        return binding.CameraManager$GetForwardVector(entity, vec3.fromValues);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} direction  Fov type
     * @returns {number}
     */
    static GetFieldOfViewInDegrees(entity, direction) {
        return binding.CameraManager$GetFieldOfViewInDegrees(entity, direction);
    }
    static GetFrustum(entity) {
        //TODO: frustum type
        return binding.CameraManager$GetFrustum(entity);
    }
    /**
     * 
     * @param {number} entity 
     * @param {number} aperture 
     * @param {number} shutterpeed 
     * @param {number} sensitivity 
     */
    static SetExposure(entity, aperture, shutterpeed, sensitivity) {
        binding.CameraManager$SetExposure(entity, aperture, shutterpeed, sensitivity);
    }
    static SetDirectExposure(entity, exposure) {
        binding.CameraManager$SetDirectExposure(entity, exposure);
    }
    static GetAperture(entity) {
        return binding.CameraManager$GetAperture(entity);
    }
    static GetShutterSpeed(entity) {
        return binding.CameraManager$GetShutterSpeed(entity);
    }
    static GetSensitivity(entity) {
        return binding.CameraManager$GetSensitivity(entity);
    }
    static GetFocalLength(entity) {
        return binding.CameraManager$GetFocalLength(entity);
    }
    static SetFocusDistance(entity, distance) {
        binding.CameraManager$SetFocusDistance(entity, distance);
    }
    static GetFocusDistance(entity) {
        return binding.CameraManager$GetFocusDistance(entity);
    }
    /**
     * 
     * @param {mat4} projection 
     * @returns {mat4}
     */
    static InverseProjectionMat(projection) {
        return binding.CameraManager$InverseProjectionMat(projection, mat4.fromValues);
    }

    static Projection = Object.freeze({
        PERSPECTIVE: 0,
        ORTHO: 1
    });

    static Fov = Object.freeze({
        VERTICAL: 0,
        HORIZONTAL: 1
    });
}