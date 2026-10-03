import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const source = resolve("labs/ai-command-center");
const destination = resolve("dist/labs/ai-command-center");

await mkdir(resolve("dist/labs"), { recursive: true });
await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });

console.log("Motion Lab copied to dist/labs/ai-command-center/");
