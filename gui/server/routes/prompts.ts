import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { FastifyInstance } from "fastify";

interface PromptFile {
  filename: string;
  title: string;
  status: "draft" | "executed" | "in-progress" | string;
  excerpt: string;
  content: string;
  lastModified: string | null;
}

async function readPromptsDir(root: string): Promise<PromptFile[]> {
  const dir = path.join(root, "atomic-prompts");
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const mdFiles = entries.filter((e) => e.endsWith(".md")).sort();

  return Promise.all(
    mdFiles.map(async (filename): Promise<PromptFile> => {
      const filePath = path.join(dir, filename);
      const [raw, stat] = await Promise.all([
        fs.readFile(filePath, "utf-8").catch(() => ""),
        fs.stat(filePath).catch(() => null),
      ]);
      const parsed = matter(raw);
      const title = (parsed.data.title as string | undefined) ?? filename.replace(/\.md$/, "").replace(/[-_]/g, " ");
      const status = (parsed.data.status as string | undefined) ?? "draft";
      const excerpt = parsed.content.trim().slice(0, 200);
      return {
        filename,
        title,
        status,
        excerpt,
        content: parsed.content,
        lastModified: stat ? stat.mtime.toISOString() : null,
      };
    })
  );
}

export async function promptsRoutes(app: FastifyInstance) {
  const root = (app as any).projectRoot as string;

  app.get("/prompts", async () => {
    const prompts = await readPromptsDir(root);
    return { prompts };
  });

  app.get<{ Params: { file: string } }>("/prompts/:file", async (req, reply) => {
    const { file } = req.params;
    if (file.includes("..") || file.includes("/") || file.includes("\\")) {
      return reply.code(400).send({ error: "Invalid filename" });
    }
    const filePath = path.join(root, "atomic-prompts", file);
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = matter(raw);
      const title = (parsed.data.title as string | undefined) ?? file.replace(/\.md$/, "").replace(/[-_]/g, " ");
      const status = (parsed.data.status as string | undefined) ?? "draft";
      return { filename: file, title, status, content: parsed.content, frontmatter: parsed.data };
    } catch {
      return reply.code(404).send({ error: "Not found" });
    }
  });

  app.post<{ Body: { filename: string; title?: string; status?: string; content: string } }>(
    "/prompts",
    async (req, reply) => {
      const { filename, title, status = "draft", content } = req.body ?? {};
      if (!filename || !content) {
        return reply.code(400).send({ error: "filename and content required" });
      }
      if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
        return reply.code(400).send({ error: "Invalid filename" });
      }
      const safe = filename.endsWith(".md") ? filename : `${filename}.md`;
      const dir = path.join(root, "atomic-prompts");
      await fs.mkdir(dir, { recursive: true });
      const frontmatter = matter.stringify(content, { title: title ?? safe.replace(/\.md$/, ""), status });
      await fs.writeFile(path.join(dir, safe), frontmatter, "utf-8");
      return { ok: true, filename: safe };
    }
  );

  app.put<{ Params: { file: string }; Body: { title?: string; status?: string; content: string } }>(
    "/prompts/:file",
    async (req, reply) => {
      const { file } = req.params;
      if (file.includes("..") || file.includes("/") || file.includes("\\")) {
        return reply.code(400).send({ error: "Invalid filename" });
      }
      const { title, status = "draft", content } = req.body ?? {};
      if (content === undefined) {
        return reply.code(400).send({ error: "content required" });
      }
      const filePath = path.join(root, "atomic-prompts", file);
      try {
        await fs.access(filePath);
      } catch {
        return reply.code(404).send({ error: "Not found" });
      }
      const frontmatter = matter.stringify(content, { title: title ?? file.replace(/\.md$/, ""), status });
      await fs.writeFile(filePath, frontmatter, "utf-8");
      return { ok: true, filename: file };
    }
  );

  app.delete<{ Params: { file: string } }>("/prompts/:file", async (req, reply) => {
    const { file } = req.params;
    if (file.includes("..") || file.includes("/") || file.includes("\\")) {
      return reply.code(400).send({ error: "Invalid filename" });
    }
    const filePath = path.join(root, "atomic-prompts", file);
    try {
      await fs.unlink(filePath);
      return { ok: true };
    } catch {
      return reply.code(404).send({ error: "Not found" });
    }
  });
}
