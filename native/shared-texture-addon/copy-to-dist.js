const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const sourcePath = path.join(
	__dirname,
	"build",
	"Release",
	"adamas_shared_texture.node",
);
const distDir = path.join(repoRoot, "dist");
const addonFileName = `adamas_shared_texture-${process.platform}-${process.arch}.node`;
const targetPath = path.join(distDir, addonFileName);

fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(sourcePath, targetPath);

console.log(`[shared-texture] Copied addon to ${targetPath}`);
