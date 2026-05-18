import fs from "node:fs/promises";
import path from "node:path";
import type { HealthCheck } from "../utils/health.js";

export async function checkBuildHealth(root: string): Promise<HealthCheck> {
  const start = Date.now();

  let pkg: Record<string, unknown> = {};
  try {
    const raw = await fs.readFile(path.join(root, "package.json"), "utf-8");
    pkg = JSON.parse(raw);
  } catch {
    return { id: "build-health", name: "Build health", status: "skip", message: "No package.json found", msgKey: "common.noPkg", details: [], severity: "medium", durationMs: Date.now() - start };
  }

  const scripts = (pkg.scripts as Record<string, string>) ?? {};
  const hasBuildScript = "build" in scripts;

  if (!hasBuildScript) {
    return {
      id: "build-health",
      name: "Build health",
      status: "warn",
      message: "No build script in package.json",
      msgKey: "buildHealth.noBuildScript",
      details: ['Add "build" script to package.json'],
      severity: "medium",
      durationMs: Date.now() - start,
    };
  }

  const distPath = path.join(root, "dist");
  let distStat: import("node:fs").Stats | null = null;
  try {
    distStat = await fs.stat(distPath);
  } catch {
    // dist doesn't exist
  }

  if (!distStat) {
    return {
      id: "build-health",
      name: "Build health",
      status: "warn",
      message: "Build script exists but dist/ not found",
      msgKey: "buildHealth.noDistDir",
      details: ["Run npm run build to create dist/"],
      severity: "medium",
      durationMs: Date.now() - start,
    };
  }

  const ageMs = Date.now() - distStat.mtimeMs;
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));

  return {
    id: "build-health",
    name: "Build health",
    status: ageDays > 14 ? "warn" : "pass",
    message: ageDays === 0 ? "Build up to date (today)" : `Build last updated ${ageDays}d ago`,
    msgKey: ageDays === 0 ? "buildHealth.today" : "buildHealth.daysAgo",
    msgParams: ageDays === 0 ? undefined : { days: ageDays },
    details: ageDays > 14 ? [`dist/ is ${ageDays} days old — rebuild recommended`] : [],
    severity: "medium",
    durationMs: Date.now() - start,
  };
}
