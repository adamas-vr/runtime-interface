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
const targetPath = path.join(distDir, "adamas_shared_texture.node");

fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(sourcePath, targetPath);

console.log(`[shared-texture] Copied addon to ${targetPath}`);
