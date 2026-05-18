import fs from "node:fs/promises";
import path from "node:path";
import { FastifyInstance } from "fastify";
import { calcScore, type HealthCheck } from "../utils/health.js";
import { checkSecrets } from "../checks/secrets.js";
import { checkTypescript } from "../checks/typescript.js";
import { checkNpmAudit } from "../checks/npm-audit.js";
import { checkUnusedDeps } from "../checks/unused-deps.js";
import { checkDocsFreshness } from "../checks/docs-freshness.js";
import { checkTestCoverage } from "../checks/test-coverage.js";
import { checkBuildHealth } from "../checks/build-health.js";
import { checkDeadExports } from "../checks/dead-exports.js";
import { checkBundleSize } from "../checks/bundle-size.js";
import { checkLessonsActivity } from "../checks/lessons-activity.js";

const HISTORY_FILE = ".vibe-forge/health-history.json";
const MAX_HISTORY = 90;

interface HistoryEntry {
  runAt: string;
  score: number;
}

async function readHistory(root: string): Promise<HistoryEntry[]> {
  try {
    const raw = await fs.readFile(path.join(root, HISTORY_FILE), "utf-8");
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

async function appendHistory(root: string, entry: HistoryEntry): Promise<void> {
  const history = await readHistory(root);
  history.push(entry);
  const trimmed = history.slice(-MAX_HISTORY);
  const dir = path.join(root, ".vibe-forge");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(root, HISTORY_FILE), JSON.stringify(trimmed, null, 2));
}

export async function healthRoutes(app: FastifyInstance) {
  const root = (app as any).projectRoot as string;

  app.get("/health", async () => {
    const checks: HealthCheck[] = await Promise.all([
      checkSecrets(root),
      checkTypescript(root),
      checkNpmAudit(root),
      checkUnusedDeps(root),
      checkDocsFreshness(root),
      checkTestCoverage(root),
      checkBuildHealth(root),
      checkDeadExports(root),
      checkBundleSize(root),
      checkLessonsActivity(root),
    ]);

    const score = calcScore(checks);
    const runAt = new Date().toISOString();

    await appendHistory(root, { runAt, score }).catch(() => {});

    const history = await readHistory(root);

    return { score, checks, runAt, history };
  });
}
