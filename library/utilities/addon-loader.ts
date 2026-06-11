const addonCache = new Map<string, unknown>();

interface NativeAddonLoadOptions {
	addonFileName: string;
	debugLabel?: string;
	nonNodeErrorMessage?: string;
}

function logAddonDebug(
	debugLabel: string | undefined,
	label: string,
	value: string,
): void {
	if (!debugLabel) {
		return;
	}
	console.debug(`[${debugLabel}]`, label, value);
}

function getCurrentModulePath(): string {
	const stack = new Error().stack;
	if (!stack) {
		throw new Error("Unable to determine current module path.");
	}

	const fileUrlMatch = stack.match(/file:\/\/\/[^\s)]+/);
	if (fileUrlMatch) {
		const fileUrl = fileUrlMatch[0];
		const url = new URL(fileUrl);
		const decodedPath = decodeURIComponent(url.pathname);
		return decodedPath.replace(/^\/([A-Za-z]:\/)/, "$1");
	}

	const pathMatch = stack.match(/\/[^\s):]+(?:\:\d+){1,2}/);
	if (pathMatch) {
		return pathMatch[0].replace(/\:\d+(?:\:\d+)?$/, "");
	}

	throw new Error(`Unable to parse current module path from stack: ${stack}`);
}

function isNodeRuntime(): boolean {
	return typeof process !== "undefined" && !!process.versions?.node;
}

async function dynamicImport(
	specifier: string,
): Promise<Record<string, unknown>> {
	const importer = new Function(
		"moduleSpecifier",
		"return import(moduleSpecifier);",
	) as (moduleSpecifier: string) => Promise<Record<string, unknown>>;
	return importer(specifier);
}

async function getCreateRequire(): Promise<
	(filename: string) => NodeJS.Require
> {
	const nodeProcess =
		typeof process !== "undefined"
			? (process as typeof process & {
					getBuiltinModule?: (id: string) => unknown;
				})
			: undefined;
	const builtinModule: {
		createRequire?: (filename: string) => NodeJS.Require;
	} | null =
		nodeProcess?.getBuiltinModule?.("node:module") ??
		(nodeProcess?.getBuiltinModule?.("module") as {
			createRequire?: (filename: string) => NodeJS.Require;
		} | null);
	if (typeof builtinModule?.createRequire === "function") {
		return builtinModule.createRequire;
	}

	const moduleNamespace = await dynamicImport("node:module");
	if (typeof moduleNamespace.createRequire !== "function") {
		throw new Error('Unable to access "node:module.createRequire".');
	}
	return moduleNamespace.createRequire as (filename: string) => NodeJS.Require;
}

async function resolveAddonPath(
	currentModulePath: string,
	addonFileName: string,
	debugLabel?: string,
): Promise<string> {
	const pathModule = await dynamicImport("node:path");
	const processModule = await dynamicImport("node:process");
	const dirname = pathModule.dirname as (path: string) => string;
	const join = pathModule.join as (...paths: string[]) => string;
	const cwd = processModule.cwd as () => string;

	const moduleCandidatePath = join(dirname(currentModulePath), addonFileName);
	const sourceCandidatePath = join(cwd(), "../../../../", addonFileName);

	logAddonDebug(debugLabel, "moduleCandidatePath", moduleCandidatePath);
	logAddonDebug(debugLabel, "sourceCandidatePath", sourceCandidatePath);

	const fsModule = await dynamicImport("node:fs");
	const existsSync = fsModule.existsSync as (path: string) => boolean;
	if (existsSync(moduleCandidatePath)) {
		return moduleCandidatePath;
	}
	if (existsSync(sourceCandidatePath)) {
		return sourceCandidatePath;
	}

	throw new Error(
		`Unable to locate native addon "${addonFileName}" from "${currentModulePath}".`,
	);
}

export async function loadNativeAddon<T>(
	options: NativeAddonLoadOptions,
): Promise<T> {
	if (!isNodeRuntime()) {
		throw new Error(
			options.nonNodeErrorMessage ??
				"Native addons are only available in a Node.js runtime.",
		);
	}

	const currentModulePath = getCurrentModulePath();
	logAddonDebug(options.debugLabel, "currentModulePath", currentModulePath);

	const resolvedAddonPath = await resolveAddonPath(
		currentModulePath,
		options.addonFileName,
		options.debugLabel,
	);
	logAddonDebug(options.debugLabel, "resolvedAddonPath", resolvedAddonPath);

	const cachedAddon = addonCache.get(resolvedAddonPath);
	if (cachedAddon) {
		return cachedAddon as T;
	}

	const createRequire = await getCreateRequire();
	const localRequire = createRequire(currentModulePath);

	try {
		const addon = localRequire(resolvedAddonPath) as T;
		addonCache.set(resolvedAddonPath, addon);
		return addon;
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Unknown native addon load error.";
		throw new Error(
			`Failed to load native addon "${options.addonFileName}": ${message}`,
		);
	}
}
