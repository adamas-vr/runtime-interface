import { hrtime } from "node:process";

type BenchmarkResult = {
	sizeBytes: number;
	iterations: number;
	averageTimeMs: number;
	throughputGiBPerSec: number;
};

const MIN_SIZE_BYTES = 64;
const MAX_SIZE_BYTES = 3840 * 2160 * 4;
const TARGET_BATCH_TIME_NS = 25_000_000;
const MAX_ITERATIONS = 2_000_000;
const MIN_ITERATIONS = 32;
const SAMPLES_PER_SIZE = 7;

function buildSweepSizes(min: number, max: number): number[] {
	const sizes = new Set<number>([min, max]);
	let current = min;

	while (current < max) {
		sizes.add(current);
		current = Math.ceil(current * 1.5);
	}

	return [...sizes].sort((a, b) => a - b);
}

function measureCopyBatch(source: Uint8Array, destination: Uint8Array, iterations: number): bigint {
	const start = hrtime.bigint();

	for (let index = 0; index < iterations; index += 1) {
		destination.set(source);
	}

	return hrtime.bigint() - start;
}

function median(values: number[]): number {
	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 0) {
		return (sorted[middle - 1] + sorted[middle]) / 2;
	}

	return sorted[middle];
}

function benchmarkSize(sizeBytes: number): BenchmarkResult {
	const source = new Uint8Array(sizeBytes);
	const destination = new Uint8Array(sizeBytes);

	for (let index = 0; index < source.length; index += 1) {
		source[index] = index & 0xff;
	}

	// Warm up JIT and allocation paths before measuring.
	destination.set(source);
	measureCopyBatch(source, destination, 16);

	const pilotIterations = 64;
	const pilotTimeNs = Number(measureCopyBatch(source, destination, pilotIterations));
	const timePerCopyNs = Math.max(pilotTimeNs / pilotIterations, 1);
	const iterations = Math.min(
		MAX_ITERATIONS,
		Math.max(MIN_ITERATIONS, Math.round(TARGET_BATCH_TIME_NS / timePerCopyNs)),
	);

	const sampleDurationsNs: number[] = [];

	for (let sample = 0; sample < SAMPLES_PER_SIZE; sample += 1) {
		sampleDurationsNs.push(Number(measureCopyBatch(source, destination, iterations)));
	}

	const medianBatchTimeNs = median(sampleDurationsNs);
	const averageTimeMs = medianBatchTimeNs / iterations / 1e6;
	const throughputGiBPerSec = sizeBytes / averageTimeMs / (1024 ** 3) * 1e3;

	return {
		sizeBytes,
		iterations,
		averageTimeMs,
		throughputGiBPerSec,
	};
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
	const maxTimeMs = Math.max(...results.map((result) => result.averageTimeMs));

	return results
		.map((result) => {
			const barLength = Math.max(1, Math.round((result.averageTimeMs / maxTimeMs) * width));
			return `${formatBytes(result.sizeBytes).padStart(10)} | ${"#".repeat(barLength)} ${result.averageTimeMs.toFixed(6)} ms`;
		})
		.join("\n");
}

function main(): void {
	const sizes = buildSweepSizes(MIN_SIZE_BYTES, MAX_SIZE_BYTES);

	console.log("Benchmarking Uint8Array copy with destination.set(source)");
	console.log(`Range: ${formatBytes(MIN_SIZE_BYTES)} -> ${formatBytes(MAX_SIZE_BYTES)}`);
	console.log("Assumption: a 4K image is a single 3840x2160 RGBA frame.\n");

	const results = sizes.map((sizeBytes) => benchmarkSize(sizeBytes));

	console.table(
		results.map((result) => ({
			sizeBytes: result.sizeBytes,
			sizeLabel: formatBytes(result.sizeBytes),
			iterations: result.iterations,
			avgTimeMs: Number(result.averageTimeMs.toFixed(6)),
			throughputGiBPerSec: Number(result.throughputGiBPerSec.toFixed(2)),
		})),
	);

	console.log("ASCII plot");
	console.log("x-axis: buffer size, y-axis: average copy time\n");
	console.log(renderAsciiChart(results));

	console.log("\nCSV");
	console.log("size_bytes,avg_copy_time_ms,throughput_gib_per_sec");
	for (const result of results) {
		console.log(
			`${result.sizeBytes},${result.averageTimeMs.toFixed(6)},${result.throughputGiBPerSec.toFixed(6)}`,
		);
	}
}

main();
