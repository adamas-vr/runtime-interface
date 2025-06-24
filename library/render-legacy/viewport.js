export class Viewport {
	constructor(left, bottom, width, height) {
		this.left = Math.floor(left);
		this.bottom = Math.floor(bottom);
		this.width = Math.floor(width);
		this.height = Math.floor(height);
	}

	static Build(left, bottom, width, height) {
		return new Viewport(left, bottom, width, height);
	}

	Empty() {
		return !this.width || !this.height;
	}
}
