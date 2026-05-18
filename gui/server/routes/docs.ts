import { exec } from "node:child_process";
import path from "node:path";
import { FastifyInstance } from "fastify";
import { readProjectFile } from "../utils/files.js";

const ALLOWED_FILES = new Set([
  "STATE.md",
  "CHANGELOG.md",
  "CLIENT_DOCS.md",
  "PROJECT_MAP.md",
  "RELEASE_NOTES.md",
  "LESSONS.md",
  "PROJECT_RULES.md",
  "CODING_RULES.md",
  "DESIGN.md",
  "PRODUCT.md",
  "DATABASE.md",
  "DEPLOYMENT.md",
]);

export async function docsRoutes(app: FastifyInstance) {
  const root = (app as any).projectRoot as string;

  app.get<{ Params: { file: string } }>("/docs/:file", async (request, reply) => {
    const { file } = request.params;

    if (!ALLOWED_FILES.has(file)) {
      reply.code(403);
      return { error: "File not in allowed list" };
    }

    const meta = await readProjectFile(root, file);

    if (!meta.exists) {
      reply.code(404);
      return { error: `${file} not found` };
    }

    return {
      file,
      content: meta.content,
      lastModified: meta.lastModified,
    };
  });

  app.post<{ Params: { file: string } }>("/docs/:file/open", async (request, reply) => {
    const { file } = request.params;
    if (!ALLOWED_FILES.has(file)) {
      reply.code(403);
      return { error: "File not in allowed list" };
    }
    const meta = await readProjectFile(root, file);
    if (!meta.exists) {
      reply.code(404);
      return { error: "File not found" };
    }
    const filePath = path.join(root, file);
    const cmd =
      process.platform === "win32"
        ? `start "" "${filePath}"`
        : process.platform === "darwin"
          ? `open "${filePath}"`
          : `xdg-open "${filePath}"`;
    exec(cmd);
    return { ok: true };
  });

  app.get("/docs", async () => {
    const results = await Promise.all(
      [...ALLOWED_FILES].map(async (file) => {
        const meta = await readProjectFile(root, file);
        return {
          file,
          exists: meta.exists,
          lastModified: meta.lastModified,
        };
      })
    );
    return results.filter((r) => r.exists);
  });
}
