import fs from "node:fs/promises";
import path from "node:path";

export interface FileMeta {
  exists: boolean;
  lastModified: string | null;
  ageMs: number | null;
  content: string | null;
}

export async function readProjectFile(
  projectRoot: string,
  filename: string
): Promise<FileMeta> {
  const filePath = path.join(projectRoot, filename);
  try {
    const stat = await fs.stat(filePath);
    const content = await fs.readFile(filePath, "utf-8");
    const ageMs = Date.now() - stat.mtimeMs;
    return {
      exists: true,
      lastModified: stat.mtime.toISOString(),
      ageMs,
      content,
    };
  } catch {
    return { exists: false, lastModified: null, ageMs: null, content: null };
  }
}

export function ageToBadge(ageMs: number | null): {
  label: string;
  status: "fresh" | "stale" | "old" | "missing";
} {
  if (ageMs === null) return { label: "missing", status: "missing" };
  const hours = ageMs / (1000 * 60 * 60);
  if (hours < 24) return { label: "today", status: "fresh" };
  const days = Math.floor(hours / 24);
  if (days <= 3) return { label: `${days}d ago`, status: "stale" };
  return { label: `${days}d ago`, status: "old" };
}

export async function listMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir);
    return entries.filter((e) => e.endsWith(".md")).sort();
  } catch {
    return [];
  }
}
