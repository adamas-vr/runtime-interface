const chars =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Use a lookup table to find the index.
const lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
	lookup[chars.charCodeAt(i)] = i;
}

export const base64Encode = (input: ArrayBuffer | ArrayBufferView): string => {
	const bytes =
		input instanceof ArrayBuffer
			? new Uint8Array(input)
			: new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
	const len = bytes.length;
	let base64 = "";

	for (let i = 0; i < len; i += 3) {
		base64 += chars[bytes[i] >> 2];
		base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
		base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
		base64 += chars[bytes[i + 2] & 63];
	}

	if (len % 3 === 2) {
		base64 = base64.substring(0, base64.length - 1) + "=";
	} else if (len % 3 === 1) {
		base64 = base64.substring(0, base64.length - 2) + "==";
	}

	return base64;
};
export const base64EncodeAsync = async (
	input: ArrayBuffer | ArrayBufferView,
): Promise<string> => {
	await Promise.resolve();
	return base64Encode(input);
};

export const base64Decode = (base64: string): ArrayBuffer => {
	let bufferLength = base64.length * 0.75;
	const len = base64.length;
	let i;
	let p = 0;
	let encoded1;
	let encoded2;
	let encoded3;
	let encoded4;

	if (base64[base64.length - 1] === "=") {
		bufferLength--;
		if (base64[base64.length - 2] === "=") {
			bufferLength--;
		}
	}

	const arraybuffer = new ArrayBuffer(bufferLength),
		bytes = new Uint8Array(arraybuffer);

	for (i = 0; i < len; i += 4) {
		encoded1 = lookup[base64.charCodeAt(i)];
		encoded2 = lookup[base64.charCodeAt(i + 1)];
		encoded3 = lookup[base64.charCodeAt(i + 2)];
		encoded4 = lookup[base64.charCodeAt(i + 3)];

		bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
		bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
		bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	}

	return arraybuffer;
};

export const base64DecodeAsync = async (
	base64: string,
): Promise<ArrayBuffer> => {
	await Promise.resolve();
	return base64Decode(base64);
};
