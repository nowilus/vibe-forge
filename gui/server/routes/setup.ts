import fs from "node:fs/promises";
import path from "node:path";
import { FastifyInstance } from "fastify";
import { generateFiles, WizardAnswers } from "../utils/setup-templates.js";

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

export async function setupRoutes(app: FastifyInstance) {
  const root = (app as any).projectRoot as string;

  app.get("/setup/status", async () => {
    const [stateExists, projectMapExists] = await Promise.all([
      fileExists(path.join(root, "STATE.md")),
      fileExists(path.join(root, "PROJECT_MAP.md")),
    ]);
    return {
      setupNeeded: !stateExists && !projectMapExists,
      stateExists,
      projectMapExists,
    };
  });

  app.post<{ Body: WizardAnswers }>("/setup/preview", async (req, reply) => {
    const answers = req.body;
    if (!answers?.projectName) {
      return reply.code(400).send({ error: "projectName required" });
    }
    const files = generateFiles(answers);
    return { files };
  });

  app.post<{ Body: WizardAnswers & { overwrite?: boolean } }>(
    "/setup/generate",
    async (req, reply) => {
      const { overwrite = false, ...answers } = req.body ?? {};
      if (!answers?.projectName) {
        return reply.code(400).send({ error: "projectName required" });
      }

      const files = generateFiles(answers as WizardAnswers);
      const created: string[] = [];
      const skipped: string[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const dest = path.join(root, file.path);
        const dir = path.dirname(dest);
        try {
          await fs.mkdir(dir, { recursive: true });
          const exists = await fileExists(dest);
          if (exists && !overwrite) {
            skipped.push(file.path);
            continue;
          }
          await fs.writeFile(dest, file.content, "utf-8");
          created.push(file.path);
        } catch (err) {
          errors.push(`${file.path}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      return { created, skipped, errors };
    }
  );
}
