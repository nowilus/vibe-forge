import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projectRoutes } from "./routes/project.js";
import { docsRoutes } from "./routes/docs.js";
import { healthRoutes } from "./routes/health.js";
import { promptsRoutes } from "./routes/prompts.js";
import { hooksRoutes } from "./routes/hooks.js";
import { setupRoutes } from "./routes/setup.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_ROOT = process.env.VF_PROJECT_ROOT ?? process.cwd();
const PORT = Number(process.env.VF_PORT ?? 7432);

const app = Fastify({ logger: false });

await app.register(cors, { origin: true });

app.decorate("projectRoot", PROJECT_ROOT);

await app.register(projectRoutes, { prefix: "/api" });
await app.register(docsRoutes, { prefix: "/api" });
await app.register(healthRoutes, { prefix: "/api" });
await app.register(promptsRoutes, { prefix: "/api" });
await app.register(hooksRoutes, { prefix: "/api" });
await app.register(setupRoutes, { prefix: "/api" });

const clientDist = path.resolve(__dirname, "../client/dist");
try {
  await app.register(fastifyStatic, { root: clientDist, wildcard: false });
  app.setNotFoundHandler((_req, reply) => {
    reply.sendFile("index.html");
  });
} catch {
  console.log("[vibe-forge-ui] No client build found — API-only mode");
}

await app.listen({ port: PORT, host: "127.0.0.1" });
console.log(`\n  vibe-forge dashboard → http://localhost:${PORT}\n`);
console.log(`  Project root: ${PROJECT_ROOT}\n`);
