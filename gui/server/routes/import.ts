import path from "node:path";
import { FastifyInstance } from "fastify";
import { getImportStatus, extractFromImportDir } from "../utils/import-extractor.js";

export async function importRoutes(app: FastifyInstance) {
  const root = (app as any).projectRoot as string;
  const importDir = path.join(root, "import");

  app.get("/import/status", async () => {
    return getImportStatus(importDir);
  });

  app.post("/import/extract", async () => {
    return extractFromImportDir(importDir);
  });
}
