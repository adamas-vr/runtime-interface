import * as glm from "./../gl-matrix/esm/index.js";

export class TransformManager {
	static HasComponent(entity) {
		return binding.TransformManager$HasComponent(entity);
	}
	static Create(entity, parentEntity, localTransform) {
		if (localTransform == undefined) {
			if (parentEntity == undefined) binding.TransformManager$Create(entity);
			else binding.TransformManager$Create(entity, parentEntity);
		} else {
			binding.TransformManager$Create(entity, parentEntity, localTransform);
		}
	}
	static Destroy(entity) {
		binding.TransformManager$Destroy(entity);
	}
	static SetParent(entity, parentEntity = undefined) {
		if (parentEntity) binding.TransformManager$SetParent(entity, parentEntity);
	}
	/**
	 * @param {Entity} entity The entity of the transform component to query.
	 * @returns {Entity} Returns the parent of a transform component, or the null entity if it is a root.
	 */
	static GetParent(entity) {
		return binding.TransformManager$GetParent(entity);
	}
	static GetChildCount(entity) {
		return binding.TransformManager$GetChildCount(entity);
	}
	/**
	 *
	 * @param {Entity} entity
	 * @returns {Entity[]}
	 */
	static GetChildren(entity) {
		return binding.TransformManager$GetChildren(entity);
	}
	static SetTransform(entity, transform) {
		binding.TransformManager$SetTransform(entity, transform);
	}
	static GetTransform(entity) {
		return binding.TransformManager$GetTransform(entity, glm.mat4.fromValues);
	}
	static GetWorldTransform(entity) {
		return binding.TransformManager$GetWorldTransform(
			entity,
			glm.mat4.fromValues,
		);
	}
}
