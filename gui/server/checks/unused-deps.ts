import fs from "node:fs/promises";
import path from "node:path";
import { runCmd } from "../utils/health.js";
import type { HealthCheck } from "../utils/health.js";

export async function checkUnusedDeps(root: string): Promise<HealthCheck> {
  const start = Date.now();
  const hasPkg = await fs.access(path.join(root, "package.json")).then(() => true).catch(() => false);

  if (!hasPkg) {
    return { id: "unused-deps", name: "Unused deps", status: "skip", message: "No package.json found", msgKey: "common.noPkg", details: [], severity: "medium", durationMs: Date.now() - start };
  }

  const { stdout, timedOut } = await runCmd("npx depcheck --json 2>/dev/null", root, 30000);

  if (timedOut) {
    return { id: "unused-deps", name: "Unused deps", status: "skip", message: "Check timed out", msgKey: "common.timedOut", details: [], severity: "medium", durationMs: Date.now() - start };
  }

  try {
    const json = JSON.parse(stdout);
    const unused: string[] = json.dependencies ?? [];
    const missing: string[] = Object.keys(json.missing ?? {});

    const status = unused.length === 0 && missing.length === 0 ? "pass" : unused.length > 5 ? "warn" : "warn";
    const details = [
      ...unused.slice(0, 5).map((d) => `unused: ${d}`),
      ...missing.slice(0, 3).map((d) => `missing: ${d}`),
    ];

    const isClean = unused.length === 0 && missing.length === 0;
    return {
      id: "unused-deps",
      name: "Unused deps",
      status,
      message: isClean ? "All deps in use" : `${unused.length} unused, ${missing.length} missing`,
      msgKey: isClean ? "unusedDeps.pass" : "unusedDeps.issues",
      msgParams: isClean ? undefined : { unused: unused.length, missing: missing.length },
      details,
      severity: "medium",
      durationMs: Date.now() - start,
    };
  } catch {
    return { id: "unused-deps", name: "Unused deps", status: "skip", message: "depcheck not available", msgKey: "unusedDeps.notAvailable", details: [], severity: "medium", durationMs: Date.now() - start };
  }
}
