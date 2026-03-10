import net from "node:net";

type CallbackFn = (...args: any[]) => any;

interface RpcRequestHeader {
	requestId: number;
	functionName: string;
	bufferSize: number;
}

interface ResponseHeader {
	clientId: number;
	msgType: number;
	requestId: number;
	statusCodeOrCallbackId: number;
	bufferSize: number;
}

interface PendingCall {
	resolve: (value: any) => void;
	reject: (reason?: unknown) => void;
	funcName: string;
	requestId: number;
}

export class RpcClient {
	private static socket: net.Socket | null = null;
	private static recvBuffer = Buffer.alloc(0);

	private static clientId = -1;
	private static requestCounter = 1;
	private static pendingCalls = new Map<number, PendingCall>();

	private static callbackRegistry: Record<number, CallbackFn> = {};
	private static callbackCounter = 1;

	static Connect(host = "127.0.0.1", port = 6969): void {
		if (this.socket) return;

		const socket = new net.Socket();
		this.socket = socket;
		socket.setNoDelay(true);

		socket.on("connect", () => {
			// wait for handshake packet from server
		});

		socket.on("data", (chunk: Buffer) => {
			this.recvBuffer = Buffer.concat([this.recvBuffer, chunk]);

			try {
				while (true) {
					const headerSize = 20;
					if (this.recvBuffer.length < headerSize) break;

					const header = this.decodeResponseHeader(
						this.recvBuffer.subarray(0, headerSize),
					);
					const totalSize = headerSize + header.bufferSize;

					if (this.recvBuffer.length < totalSize) break;

					const payloadBuffer = this.recvBuffer.subarray(headerSize, totalSize);
					this.recvBuffer = this.recvBuffer.subarray(totalSize);

					this.handlePacket(header, payloadBuffer);
				}
			} catch (error) {
				this.failAllPending(error);
			}
		});

		socket.on("error", (error) => {
			this.failAllPending(error);
		});

		socket.on("close", () => {
			this.socket = null;
			this.failAllPending(new Error("RPC socket closed"));
		});

		socket.connect(port, host);
	}

	static async Close(): Promise<void> {
		const socket = this.socket;

		this.socket = null;
		this.recvBuffer = Buffer.alloc(0);

		if (!socket) return;

		await new Promise<void>((resolve) => {
			socket.end(() => resolve());
		});
	}

	static async Call(funcName: string, args: Record<string, any>): Promise<any> {
		this.Connect();

		if (!this.socket) {
			throw new Error("RPC client is not connected");
		}

		const processedArgs: Record<string, any> = {};
		for (const [key, value] of Object.entries(args)) {
			if (typeof value === "function") {
				processedArgs[key] = this.RegisterCallback(value);
			} else {
				processedArgs[key] = value;
			}
		}

		const requestId = this.requestCounter++;
		const payloadJson = JSON.stringify(processedArgs);
		const payloadBuffer = Buffer.from(payloadJson, "utf8");
		const headerBuffer = this.encodeRequestHeader({
			requestId,
			functionName: funcName,
			bufferSize: payloadBuffer.length,
		});

		const promise = new Promise<any>((resolve, reject) => {
			this.pendingCalls.set(requestId, {
				resolve,
				reject,
				funcName,
				requestId,
			});
		});

		try {
			await this.writeAsync(Buffer.concat([headerBuffer, payloadBuffer]));
		} catch (error) {
			const pending = this.pendingCalls.get(requestId);
			this.pendingCalls.delete(requestId);
			pending?.reject(error);
			throw error;
		}

		return promise;
	}

	private static RegisterCallback(callback: CallbackFn): number {
		const callbackId = this.callbackCounter++;
		this.callbackRegistry[callbackId] = callback;
		return callbackId;
	}

	private static handlePacket(
		header: ResponseHeader,
		payloadBuffer: Buffer,
	): void {
		if (header.msgType === 0) {
			this.handleCallbackPacket(header, payloadBuffer);
			return;
		}

		if (
			header.requestId === 0 &&
			header.statusCodeOrCallbackId === 0 &&
			header.bufferSize === 0
		) {
			this.clientId = header.clientId;
			return;
		}

		const pending = this.pendingCalls.get(header.requestId);
		this.pendingCalls.delete(header.requestId);
		if (!pending) {
			throw new Error(
				`Received RPC response for unknown requestId ${header.requestId}`,
			);
		}

		const payloadText = payloadBuffer.toString("utf8");
		let parsed = JSON.parse(payloadText);

		if (parsed?.error) {
			const remoteError = new Error(parsed.error.message ?? "Remote RPC error");
			(remoteError as any).remoteType = parsed.error.type;
			(remoteError as any).remoteStackTrace = parsed.error.stackTrace;
			(remoteError as any).requestId = header.requestId;
			(remoteError as any).funcName = pending.funcName;
			pending.reject(remoteError);
			return;
		}

		pending.resolve(parsed?.result);
	}

	private static handleCallbackPacket(
		header: ResponseHeader,
		payloadBuffer: Buffer,
	): void {
		const callbackId = header.statusCodeOrCallbackId;
		const callback = this.callbackRegistry[callbackId];
		if (!callback) {
			console.warn(`RPC callback ${callbackId} not found`);
			return;
		}

		const payloadText = payloadBuffer.toString("utf8");
		let callbackArg = JSON.parse(payloadText);

		try {
			callback(callbackArg);
		} catch (error) {
			console.error(`Error in registered callback ${callbackId}:`, error);
		}
	}

	private static failAllPending(error: unknown): void {
		const err = error instanceof Error ? error : new Error(String(error));

		for (const [requestId, pending] of this.pendingCalls.entries()) {
			pending.reject(err);
			this.pendingCalls.delete(requestId);
		}
	}

	private static async writeAsync(buffer: Buffer): Promise<void> {
		const socket = this.socket;
		if (!socket) throw new Error("RPC socket is not connected");

		await new Promise<void>((resolve, reject) => {
			socket.write(buffer, (error?: Error | null) => {
				if (error) reject(error);
				else resolve();
			});
		});
	}

	private static encodeRequestHeader(header: RpcRequestHeader): Buffer {
		// C# layout:
		// int request_id         @ 0
		// char functionName[64]  @ 4
		// int bufferSize         @ 68
		// total size = 72
		const buf = Buffer.alloc(72);

		buf.writeInt32LE(header.requestId, 0);

		const fnBytes = Buffer.from(header.functionName, "ascii");
		if (fnBytes.length >= 64) {
			throw new Error(
				`RPC function name too long (${fnBytes.length} bytes). Max is 63 ASCII bytes.`,
			);
		}

		fnBytes.copy(buf, 4);
		buf[4 + fnBytes.length] = 0;

		buf.writeInt32LE(header.bufferSize, 68);

		return buf;
	}

	private static decodeResponseHeader(buf: Buffer): ResponseHeader {
		// C# layout:
		// int clientId               @ 0
		// int msgType                @ 4
		// int requestId              @ 8
		// int statusCodeOrCallbackId @ 12
		// int bufferSize             @ 16
		if (buf.length < 20) {
			throw new Error("ResponseHeader buffer too small");
		}

		return {
			clientId: buf.readInt32LE(0),
			msgType: buf.readInt32LE(4),
			requestId: buf.readInt32LE(8),
			statusCodeOrCallbackId: buf.readInt32LE(12),
			bufferSize: buf.readInt32LE(16),
		};
	}
}
