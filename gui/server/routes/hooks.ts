import fs from "node:fs/promises";
import path from "node:path";
import { FastifyInstance } from "fastify";

const KNOWN_HOOKS = [
  "PreToolUse:Bash",
  "PreToolUse:Write",
  "PreToolUse:Edit",
  "PostToolUse:Bash",
  "PostToolUse:Write",
  "PostToolUse:Edit",
  "Stop",
] as const;

interface HookEvent {
  hook: string;
  timestamp: string;
  tool?: string;
  outcome?: string;
}

interface HookStatus {
  name: string;
  defined: boolean;
  command: string | null;
  recentEvents: HookEvent[];
}

async function readClaudeSettings(root: string): Promise<Record<string, unknown>> {
  const p = path.join(root, ".claude", "settings.json");
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function readHookEvents(root: string): Promise<HookEvent[]> {
  const p = path.join(root, ".vibe-forge", "hook-events.json");
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw) as HookEvent[];
  } catch {
    return [];
  }
}

function extractHookCommand(settings: Record<string, unknown>, hookName: string): string | null {
  const hooks = settings.hooks as Record<string, unknown> | undefined;
  if (!hooks) return null;

  const [type, tool] = hookName.split(":");
  if (!tool) {
    const entry = hooks[type];
    if (typeof entry === "string") return entry;
    if (Array.isArray(entry)) {
      const cmd = (entry[0] as Record<string, unknown>)?.command;
      return typeof cmd === "string" ? cmd : null;
    }
    return null;
  }

  const typeHooks = hooks[type] as Record<string, unknown> | undefined;
  if (!typeHooks) return null;
  const toolEntry = typeHooks[tool] ?? typeHooks["*"];
  if (typeof toolEntry === "string") return toolEntry;
  if (Array.isArray(toolEntry)) {
    const cmd = (toolEntry[0] as Record<string, unknown>)?.command;
    return typeof cmd === "string" ? cmd : null;
  }
  return null;
}

export async function hooksRoutes(app: FastifyInstance) {
  const root = (app as any).projectRoot as string;

  app.get("/hooks", async () => {
    const [settings, events] = await Promise.all([
      readClaudeSettings(root),
      readHookEvents(root),
    ]);

    const hookStatuses: HookStatus[] = KNOWN_HOOKS.map((name) => {
      const command = extractHookCommand(settings, name);
      const recentEvents = events
        .filter((e) => e.hook === name)
        .slice(-5);
      return { name, defined: command !== null, command, recentEvents };
    });

    const totalDefined = hookStatuses.filter((h) => h.defined).length;
    const recentAll = events.slice(-20);

    return {
      hooks: hookStatuses,
      totalDefined,
      totalKnown: KNOWN_HOOKS.length,
      recentEvents: recentAll,
      settingsFound: Object.keys(settings).length > 0,
    };
  });
}
