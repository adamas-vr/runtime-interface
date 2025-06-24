import { vec3 } from "../gl-matrix/esm/index.js";

export class Box {
	constructor(center, halfExtent) {
		this.center = center;
		this.halfExtent = halfExtent;
	}
	/**
	 * Computes the lowest coordinates corner of the box.
	 * @return center - halfExtent
	 */
	GetMin() {
		return vec3.subtract(vec3.create(), this.center, this.halfExtent);
	}

	/**
	 * Computes the largest coordinates corner of the box.
	 * @return center + halfExtent
	 */
	GetMax() {
		return vec3.add(vec3.create(), this.center, this.halfExtent);
	}

	center;
	halfExtent;
}
