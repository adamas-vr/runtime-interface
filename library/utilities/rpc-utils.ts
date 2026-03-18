type BinaryRef = {
	__bufferType: "Uint8Array" | "Uint16Array" | "Float32Array";
	offset: number;
	length: number;
};

function packBinary(view: Uint8Array | Uint16Array | Float32Array) {
	return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}

export function createAssetBinaryReplacer() {
	const chunks: Uint8Array[] = [];
	let offset = 0;

	const replacer = (_key: string, value: unknown): unknown => {
		if (
			value instanceof Uint8Array ||
			value instanceof Uint16Array ||
			value instanceof Float32Array
		) {
			const bytes = new Uint8Array(packBinary(value));
			const ref: BinaryRef = {
				__bufferType: value.constructor.name as BinaryRef["__bufferType"],
				offset,
				length: value.length,
			};

			chunks.push(bytes);
			offset += bytes.byteLength;
			return ref;
		}

		return value;
	};

	const getBinaryBuffer = (): Uint8Array => {
		const out = new Uint8Array(offset);
		let cursor = 0;

		for (const chunk of chunks) {
			out.set(chunk, cursor);
			cursor += chunk.byteLength;
		}

		return out;
	};

	return { replacer, getBinaryBuffer };
}

export function createAssetBinaryReviver(binary: Uint8Array | ArrayBuffer) {
	const buffer = binary instanceof Uint8Array ? binary : new Uint8Array(binary);

	return (_key: string, value: unknown): unknown => {
		if (
			!value ||
			typeof value !== "object" ||
			!("__bufferType" in value) ||
			!("offset" in value) ||
			!("length" in value)
		) {
			return value;
		}

		const ref = value as BinaryRef;

		switch (ref.__bufferType) {
			case "Uint8Array":
				return new Uint8Array(
					buffer.buffer,
					buffer.byteOffset + ref.offset,
					ref.length,
				);

			case "Uint16Array":
				return new Uint16Array(
					buffer.buffer,
					buffer.byteOffset + ref.offset,
					ref.length,
				);

			case "Float32Array":
				return new Float32Array(
					buffer.buffer,
					buffer.byteOffset + ref.offset,
					ref.length,
				);

			default:
				return value;
		}
	};
}
