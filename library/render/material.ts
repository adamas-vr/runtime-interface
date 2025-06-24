import { RpcClient } from "@adamas/rpc";

export class Material {
	constructor(public handle: number) {}

	static create(shaderName: string): number {
		return Number(RpcClient.Call("Material_Create", { shaderName }));
	}

	static destroy(handle: number): boolean {
		return Boolean(
			RpcClient.Call("Material_Destroy", { materialHandle: handle }),
		);
	}

	static createInstance(handle: number): number {
		return Number(
			RpcClient.Call("Material_CreateInstance", { materialHandle: handle }),
		);
	}

	static setFloat(handle: number, prop: string, value: number): boolean {
		return Boolean(
			RpcClient.Call("Material_SetFloat", {
				materialHandle: handle,
				propertyName: prop,
				value,
			}),
		);
	}

	static setVector(
		handle: number,
		prop: string,
		x: number,
		y: number,
		z: number,
		w: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Material_SetVector", {
				materialHandle: handle,
				propertyName: prop,
				x,
				y,
				z,
				w,
			}),
		);
	}

	static setColor(
		handle: number,
		prop: string,
		r: number,
		g: number,
		b: number,
		a: number,
	): boolean {
		return Boolean(
			RpcClient.Call("Material_SetColor", {
				materialHandle: handle,
				propertyName: prop,
				r,
				g,
				b,
				a,
			}),
		);
	}

	static setTexture(handle: number, prop: string, tex: number): boolean {
		return Boolean(
			RpcClient.Call("Material_SetTexture", {
				materialHandle: handle,
				propertyName: prop,
				textureHandle: tex,
			}),
		);
	}

	static getFloat(handle: number, prop: string): number {
		return Number(
			RpcClient.Call("Material_GetFloat", {
				materialHandle: handle,
				propertyName: prop,
			}),
		);
	}

	static getColor(handle: number, prop: string): string {
		return RpcClient.Call("Material_GetColor", {
			materialHandle: handle,
			propertyName: prop,
		});
	}
}
