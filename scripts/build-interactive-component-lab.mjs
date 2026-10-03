import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const source = resolve("labs/interactive-component-lab");
const destination = resolve("dist/labs/interactive-component-lab");
const legacyDestination = resolve("dist/labs/ai-command-center");

await mkdir(resolve("dist/labs"), { recursive: true });
await rm(destination, { recursive: true, force: true });
await rm(legacyDestination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });

await mkdir(legacyDestination, { recursive: true });
await writeFile(
  resolve(legacyDestination, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/labs/interactive-component-lab/"><link rel="canonical" href="/labs/interactive-component-lab/"><title>Interactive Component Lab</title></head><body><p>This Lab moved to <a href="/labs/interactive-component-lab/">Interactive Component Lab</a>.</p></body></html>`,
  "utf8",
);

console.log("Interactive Component Lab copied to dist/labs/interactive-component-lab/");
