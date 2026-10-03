import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const source = resolve("labs/ai-command-center");
const compatibilityDestination = resolve("dist/labs/ai-command-center");
const destination = resolve("dist/labs/interactive-component-lab");
const routeIndex = resolve("labs/interactive-component-lab/index.html");

await mkdir(resolve("dist/labs"), { recursive: true });
await rm(compatibilityDestination, { recursive: true, force: true });
await rm(destination, { recursive: true, force: true });
await cp(source, compatibilityDestination, { recursive: true });
await cp(source, destination, { recursive: true });
await copyFile(routeIndex, resolve(destination, "index.html"));

console.log("Interactive Component Lab copied to dist/labs/interactive-component-lab/");
