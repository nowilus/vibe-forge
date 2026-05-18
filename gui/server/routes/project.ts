import { FastifyInstance } from "fastify";
import { readProjectFile, ageToBadge } from "../utils/files.js";

const DOC_FILES = [
  "STATE.md",
  "CHANGELOG.md",
  "CLIENT_DOCS.md",
  "PROJECT_MAP.md",
  "RELEASE_NOTES.md",
  "LESSONS.md",
] as const;

interface DocFreshness {
  file: string;
  exists: boolean;
  lastModified: string | null;
  badge: { label: string; status: string };
}

interface ChangelogEntry {
  date: string;
  text: string;
}

interface LessonEntry {
  title: string;
  body: string;
}

export async function projectRoutes(app: FastifyInstance) {
  const root = (app as any).projectRoot as string;

  app.get("/project", async () => {
    const projectMap = await readProjectFile(root, "PROJECT_MAP.md");
    const state = await readProjectFile(root, "STATE.md");

    const name = extractField(projectMap.content, "Project") ?? extractField(state.content, "Project") ?? "vibe-forge project";
    const stack = extractField(projectMap.content, "Stack") ?? extractField(state.content, "Stack") ?? "unknown";
    const tddTier = extractField(projectMap.content, "TDD") ?? extractField(state.content, "Testing") ?? "unknown";

    const freshness: DocFreshness[] = await Promise.all(
      DOC_FILES.map(async (file) => {
        const meta = await readProjectFile(root, file);
        return {
          file,
          exists: meta.exists,
          lastModified: meta.lastModified,
          badge: ageToBadge(meta.ageMs),
        };
      })
    );

    const changelog = await readProjectFile(root, "CHANGELOG.md");
    const recentChanges = parseChangelogEntries(changelog.content, 5);

    const lessons = await readProjectFile(root, "LESSONS.md");
    const recentLessons = parseLessonEntries(lessons.content, 3);

    return {
      name,
      stack,
      tddTier,
      freshness,
      recentChanges,
      recentLessons,
      hasProjectMap: projectMap.exists,
      hasState: state.exists,
    };
  });
}

function extractField(content: string | null, field: string): string | null {
  if (!content) return null;
  const pattern = new RegExp(`^[#*_\\s]*${field}[:\\s]*[|]?\\s*(.+)`, "im");
  const match = content.match(pattern);
  return match?.[1]?.replace(/[*_|`]/g, "").trim() ?? null;
}

function parseChangelogEntries(content: string | null, limit: number): ChangelogEntry[] {
  if (!content) return [];
  const entries: ChangelogEntry[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^[-*]\s+\*?\*?\[?([\d\-/.]+)\]?\*?\*?\s*[–—:-]?\s*(.+)/);
    if (match) {
      entries.push({ date: match[1], text: match[2].trim() });
      if (entries.length >= limit) break;
    }
  }
  if (entries.length === 0) {
    const headerPattern = /^#{2,3}\s+(.+)/;
    for (const line of lines) {
      const match = line.match(headerPattern);
      if (match && !match[1].toLowerCase().includes("changelog")) {
        entries.push({ date: "", text: match[1].trim() });
        if (entries.length >= limit) break;
      }
    }
  }
  return entries;
}

function parseLessonEntries(content: string | null, limit: number): LessonEntry[] {
  if (!content) return [];
  const entries: LessonEntry[] = [];
  const sections = content.split(/^#{2,3}\s+/m).slice(1);
  for (const section of sections) {
    const [title, ...body] = section.split("\n");
    if (title && !title.toLowerCase().includes("lessons")) {
      entries.push({
        title: title.trim(),
        body: body.join("\n").trim().slice(0, 200),
      });
      if (entries.length >= limit) break;
    }
  }
  return entries;
}
