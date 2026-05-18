import fs from "node:fs/promises";
import path from "node:path";
import { runCmd } from "../utils/health.js";
import type { HealthCheck } from "../utils/health.js";

export async function checkTypescript(root: string): Promise<HealthCheck> {
  const start = Date.now();
  const hasTsConfig = await fs.access(path.join(root, "tsconfig.json")).then(() => true).catch(() => false);

  if (!hasTsConfig) {
    return { id: "typescript", name: "TypeScript errors", status: "skip", message: "No tsconfig.json found", msgKey: "common.noTsConfig", details: [], severity: "high", durationMs: Date.now() - start };
  }

  const { stdout, stderr, timedOut } = await runCmd("npx tsc --noEmit 2>&1", root, 45000);
  if (timedOut) {
    return { id: "typescript", name: "TypeScript errors", status: "skip", message: "Check timed out", msgKey: "common.timedOut", details: [], severity: "high", durationMs: Date.now() - start };
  }

  const output = stdout + stderr;
  const errorLines = output.split("\n").filter((l) => l.includes(" error TS"));
  const count = errorLines.length;

  return {
    id: "typescript",
    name: "TypeScript errors",
    status: count === 0 ? "pass" : count <= 5 ? "warn" : "fail",
    message: count === 0 ? "No TypeScript errors" : `${count} error(s) found`,
    msgKey: count === 0 ? "typescript.pass" : "typescript.errors",
    msgParams: count === 0 ? undefined : { count },
    details: errorLines.slice(0, 8),
    severity: "high",
    durationMs: Date.now() - start,
  };
}
