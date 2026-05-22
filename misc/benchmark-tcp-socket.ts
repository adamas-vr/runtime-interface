import { fork, type ChildProcess } from "node:child_process";
import { createServer, Socket } from "node:net";
import { hrtime } from "node:process";

type BenchmarkResult = {
	sizeBytes: number;
	iterations: number;
	averageRoundTripMs: number;
	throughputGiBPerSec: number;
};

type ControlMessage =
	| { type: "listening"; port: number }
	| { type: "connected" }
	| { type: "configure"; sizeBytes: number }
	| { type: "configured"; sizeBytes: number }
	| { type: "run"; sizeBytes: number; iterations: number }
	| { type: "result"; sizeBytes: number; iterations: number; averageRoundTripNs: number }
	| { type: "shutdown" }
	| { type: "error"; message: string };

const MIN_SIZE_BYTES = 64;
const MAX_SIZE_BYTES = 3840 * 2160 * 4;
const TARGET_BATCH_TIME_NS = 40_000_000;
const MAX_ITERATIONS = 250_000;
const MIN_ITERATIONS = 16;
const SAMPLES_PER_SIZE = 5;
const ACK_BYTE = 0x7f;

function buildSweepSizes(min: number, max: number): number[] {
	const sizes = new Set<number>([min, max]);
	let current = min;

	while (current < max) {
		sizes.add(current);
		current = Math.ceil(current * 1.5);
	}

	return [...sizes].sort((a, b) => a - b);
}

function median(values: number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 0) {
		return (sorted[middle - 1] + sorted[middle]) / 2;
	}

	return sorted[middle];
}

function formatBytes(sizeBytes: number): string {
	if (sizeBytes >= 1024 ** 2) {
		return `${(sizeBytes / (1024 ** 2)).toFixed(2)} MiB`;
	}

	if (sizeBytes >= 1024) {
		return `${(sizeBytes / 1024).toFixed(2)} KiB`;
	}

	return `${sizeBytes} B`;
}

function renderAsciiChart(results: BenchmarkResult[]): string {
	const width = 64;
	const maxTimeMs = Math.max(...results.map((result) => result.averageRoundTripMs));

	return results
		.map((result) => {
			const barLength = Math.max(1, Math.round((result.averageRoundTripMs / maxTimeMs) * width));
			return `${formatBytes(result.sizeBytes).padStart(10)} | ${"#".repeat(barLength)} ${result.averageRoundTripMs.toFixed(6)} ms`;
		})
		.join("\n");
}

class ChildMailbox {
	private readonly queue: ControlMessage[] = [];
	private pendingResolve: ((message: ControlMessage) => void) | null = null;

	constructor(
		private readonly child: ChildProcess,
		private readonly name: string,
	) {
		this.child.on("message", (message: ControlMessage) => {
			if (this.pendingResolve) {
				const resolve = this.pendingResolve;
				this.pendingResolve = null;
				resolve(message);
				return;
			}

			this.queue.push(message);
		});

		this.child.on("exit", (code, signal) => {
			const exitMessage = {
				type: "error",
				message: `${this.name} exited unexpectedly (code=${code}, signal=${signal})`,
			} satisfies ControlMessage;

			if (this.pendingResolve) {
				const resolve = this.pendingResolve;
				this.pendingResolve = null;
				resolve(exitMessage);
				return;
			}

			this.queue.push(exitMessage);
		});
	}

	send(message: ControlMessage): Promise<void> {
		return new Promise((resolve, reject) => {
			this.child.send(message, (error) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			});
		});
	}

	async receive(): Promise<ControlMessage> {
		if (this.queue.length > 0) {
			return this.queue.shift()!;
		}

		return new Promise<ControlMessage>((resolve) => {
			this.pendingResolve = resolve;
		});
	}
}

async function waitForType<TType extends ControlMessage["type"]>(
	mailbox: ChildMailbox,
	expectedType: TType,
): Promise<Extract<ControlMessage, { type: TType }>> {
	const message = await mailbox.receive();
	if (message.type === "error") {
		throw new Error(message.message);
	}

	if (message.type !== expectedType) {
		throw new Error(`Expected ${expectedType} message, received ${message.type}`);
	}

	return message as Extract<ControlMessage, { type: TType }>;
}

async function runCoordinator(): Promise<void> {
	const scriptPath = __filename;
	const serverProcess = fork(scriptPath, ["--role=server"], { stdio: ["inherit", "inherit", "inherit", "ipc"] });
	const serverMailbox = new ChildMailbox(serverProcess, "server");
	const serverListening = await waitForType(serverMailbox, "listening");

	const clientProcess = fork(scriptPath, ["--role=client", `--port=${serverListening.port}`], {
		stdio: ["inherit", "inherit", "inherit", "ipc"],
	});
	const clientMailbox = new ChildMailbox(clientProcess, "client");
	await waitForType(clientMailbox, "connected");

	const sizes = buildSweepSizes(MIN_SIZE_BYTES, MAX_SIZE_BYTES);
	const results: BenchmarkResult[] = [];

	try {
		for (const sizeBytes of sizes) {
			await serverMailbox.send({ type: "configure", sizeBytes });
			const configured = await waitForType(serverMailbox, "configured");
			if (configured.sizeBytes !== sizeBytes) {
				throw new Error(`Server configured wrong size: expected ${sizeBytes}, received ${configured.sizeBytes}`);
			}

			await clientMailbox.send({ type: "run", sizeBytes, iterations: 16 });
			const pilotResult = await waitForType(clientMailbox, "result");
			const pilotTimeNs = Math.max(pilotResult.averageRoundTripNs, 1);
			const iterations = Math.min(
				MAX_ITERATIONS,
				Math.max(MIN_ITERATIONS, Math.round(TARGET_BATCH_TIME_NS / pilotTimeNs)),
			);

			const sampleTimesNs: number[] = [];
			for (let sample = 0; sample < SAMPLES_PER_SIZE; sample += 1) {
				await clientMailbox.send({ type: "run", sizeBytes, iterations });
				const sampleResult = await waitForType(clientMailbox, "result");
				sampleTimesNs.push(sampleResult.averageRoundTripNs);
			}

			const averageRoundTripMs = median(sampleTimesNs) / 1e6;
			const throughputGiBPerSec = sizeBytes / averageRoundTripMs / (1024 ** 3) * 1e3;
			results.push({ sizeBytes, iterations, averageRoundTripMs, throughputGiBPerSec });
		}
	} finally {
		await Promise.allSettled([
			serverMailbox.send({ type: "shutdown" }),
			clientMailbox.send({ type: "shutdown" }),
		]);
	}

	console.log("Benchmarking TCP socket transfer across two processes");
	console.log(`Range: ${formatBytes(MIN_SIZE_BYTES)} -> ${formatBytes(MAX_SIZE_BYTES)}`);
	console.log("Assumption: a 4K image is a single 3840x2160 RGBA frame.");
	console.log("Timing metric: client-side average round-trip time for payload send + 1-byte ack.\n");

	console.table(
		results.map((result) => ({
			sizeBytes: result.sizeBytes,
			sizeLabel: formatBytes(result.sizeBytes),
			iterations: result.iterations,
			avgRoundTripMs: Number(result.averageRoundTripMs.toFixed(6)),
			throughputGiBPerSec: Number(result.throughputGiBPerSec.toFixed(2)),
		})),
	);

	console.log("ASCII plot");
	console.log("x-axis: buffer size, y-axis: average TCP round-trip time\n");
	console.log(renderAsciiChart(results));

	console.log("\nCSV");
	console.log("size_bytes,avg_round_trip_ms,throughput_gib_per_sec");
	for (const result of results) {
		console.log(
			`${result.sizeBytes},${result.averageRoundTripMs.toFixed(6)},${result.throughputGiBPerSec.toFixed(6)}`,
		);
	}
}

async function runServer(): Promise<void> {
	const server = createServer();
	const socket = await new Promise<Socket>((resolve, reject) => {
		server.once("connection", (clientSocket) => resolve(clientSocket));
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => {
			const address = server.address();
			if (!address || typeof address === "string") {
				reject(new Error("Failed to determine listening port"));
				return;
			}

			process.send?.({ type: "listening", port: address.port } satisfies ControlMessage);
		});
	});

	let configuredSizeBytes = 0;
	let bufferedBytes = 0;

	socket.on("data", (chunk) => {
		if (configuredSizeBytes <= 0) {
			return;
		}

		bufferedBytes += chunk.length;
		while (bufferedBytes >= configuredSizeBytes) {
			bufferedBytes -= configuredSizeBytes;
			socket.write(Buffer.from([ACK_BYTE]));
		}
	});

	socket.on("error", (error) => {
		process.send?.({ type: "error", message: error.message } satisfies ControlMessage);
	});

	server.on("error", (error) => {
		process.send?.({ type: "error", message: error.message } satisfies ControlMessage);
	});

	process.on("message", (message: ControlMessage) => {
		if (message.type === "configure") {
			configuredSizeBytes = message.sizeBytes;
			bufferedBytes = 0;
			process.send?.({ type: "configured", sizeBytes: configuredSizeBytes } satisfies ControlMessage);
			return;
		}

		if (message.type === "shutdown") {
			socket.destroy();
			server.close(() => process.exit(0));
		}
	});
}

async function runClient(port: number): Promise<void> {
	const socket = new Socket();

	await new Promise<void>((resolve, reject) => {
		socket.once("connect", () => resolve());
		socket.once("error", reject);
		socket.connect(port, "127.0.0.1");
	});

	socket.on("error", (error) => {
		process.send?.({ type: "error", message: error.message } satisfies ControlMessage);
	});

	process.send?.({ type: "connected" } satisfies ControlMessage);

	process.on("message", async (message: ControlMessage) => {
		if (message.type === "run") {
			try {
				const payload = Buffer.allocUnsafe(message.sizeBytes);
				for (let index = 0; index < payload.length; index += 1) {
					payload[index] = index & 0xff;
				}

				const totalTimeNs = await measureRoundTripBatch(socket, payload, message.iterations);
				process.send?.({
					type: "result",
					sizeBytes: message.sizeBytes,
					iterations: message.iterations,
					averageRoundTripNs: totalTimeNs / message.iterations,
				} satisfies ControlMessage);
			} catch (error) {
				const messageText = error instanceof Error ? error.message : String(error);
				process.send?.({ type: "error", message: messageText } satisfies ControlMessage);
			}
			return;
		}

		if (message.type === "shutdown") {
			socket.destroy();
			process.exit(0);
		}
	});
}

function measureRoundTripBatch(socket: Socket, payload: Buffer, iterations: number): Promise<number> {
	return new Promise((resolve, reject) => {
		let acknowledgements = 0;
		const start = hrtime.bigint();

		const handleData = (chunk: Buffer) => {
			for (const value of chunk) {
				if (value !== ACK_BYTE) {
					cleanup();
					reject(new Error(`Unexpected ack byte: ${value}`));
					return;
				}

				acknowledgements += 1;
				if (acknowledgements === iterations) {
					const elapsedNs = Number(hrtime.bigint() - start);
					cleanup();
					resolve(elapsedNs);
					return;
				}
			}
		};

		const handleError = (error: Error) => {
			cleanup();
			reject(error);
		};

		const handleClose = () => {
			cleanup();
			reject(new Error("Socket closed during benchmark"));
		};

		const cleanup = () => {
			socket.off("data", handleData);
			socket.off("error", handleError);
			socket.off("close", handleClose);
		};

		socket.on("data", handleData);
		socket.on("error", handleError);
		socket.on("close", handleClose);

		for (let index = 0; index < iterations; index += 1) {
			socket.write(payload);
		}
	});
}

async function main(): Promise<void> {
	const role = process.argv.find((argument) => argument.startsWith("--role="))?.split("=")[1];

	if (role === "server") {
		await runServer();
		return;
	}

	if (role === "client") {
		const portArgument = process.argv.find((argument) => argument.startsWith("--port="));
		if (!portArgument) {
			throw new Error("Missing --port for client role");
		}

		await runClient(Number(portArgument.split("=")[1]));
		return;
	}

	await runCoordinator();
}

void main().catch((error: unknown) => {
	const message = error instanceof Error ? error.stack ?? error.message : String(error);
	console.error(message);
	process.exit(1);
});
