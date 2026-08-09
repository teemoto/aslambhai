import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/client", { recursive: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await cp(".astro-dist", "dist/client", { recursive: true });
await cp(".openai/hosting.json", "dist/.openai/hosting.json");

const worker = `export default { async fetch(request, env) {
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) return response;
  const url = new URL(request.url);
  if (!url.pathname.includes(".")) {
    url.pathname = url.pathname.replace(/\\/$/, "") + "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  }
  return response;
}};\n`;
await writeFile("dist/server/index.js", worker);

const hosting = JSON.parse(await readFile("dist/.openai/hosting.json", "utf8"));
if (!hosting.project_id) throw new Error("Missing Sites project identity");
console.log("Packaged static Astro site for hosting.");
