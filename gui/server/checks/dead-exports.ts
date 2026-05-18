import fs from "node:fs/promises";
import path from "node:path";
import { runCmd } from "../utils/health.js";
import type { HealthCheck } from "../utils/health.js";

export async function checkDeadExports(root: string): Promise<HealthCheck> {
  const start = Date.now();
  const hasTsConfig = await fs.access(path.join(root, "tsconfig.json")).then(() => true).catch(() => false);

  if (!hasTsConfig) {
    return { id: "dead-exports", name: "Dead exports", status: "skip", message: "No tsconfig.json found", msgKey: "common.noTsConfig", details: [], severity: "low", durationMs: Date.now() - start };
  }

  const { stdout, timedOut } = await runCmd("npx ts-prune 2>/dev/null", root, 30000);

  if (timedOut) {
    return { id: "dead-exports", name: "Dead exports", status: "skip", message: "Check timed out", msgKey: "common.timedOut", details: [], severity: "low", durationMs: Date.now() - start };
  }

  if (!stdout.trim()) {
    return { id: "dead-exports", name: "Dead exports", status: "skip", message: "ts-prune not available or no output", msgKey: "deadExports.notAvailable", details: [], severity: "low", durationMs: Date.now() - start };
  }

  const lines = stdout.trim().split("\n").filter(Boolean);
  const count = lines.length;

  return {
    id: "dead-exports",
    name: "Dead exports",
    status: count === 0 ? "pass" : count <= 10 ? "warn" : "warn",
    message: count === 0 ? "No unused exports" : `${count} potentially unused export(s)`,
    msgKey: count === 0 ? "deadExports.pass" : "deadExports.count",
    msgParams: count === 0 ? undefined : { count },
    details: lines.slice(0, 8),
    severity: "low",
    durationMs: Date.now() - start,
  };
}
