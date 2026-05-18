import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import type { HealthCheck } from "../utils/health.js";

const WARN_MB = 2;
const FAIL_MB = 5;

export async function checkBundleSize(root: string): Promise<HealthCheck> {
  const start = Date.now();
  const distPath = path.join(root, "dist");

  try {
    await fs.access(distPath);
  } catch {
    return { id: "bundle-size", name: "Bundle size", status: "skip", message: "No dist/ directory found", msgKey: "bundleSize.noDistDir", details: [], severity: "low", durationMs: Date.now() - start };
  }

  const files = await glob("**/*", { cwd: distPath, nodir: true }).catch(() => []);
  let totalBytes = 0;
  for (const file of files) {
    const stat = await fs.stat(path.join(distPath, file)).catch(() => null);
    if (stat) totalBytes += stat.size;
  }

  const mb = totalBytes / (1024 * 1024);
  const label = mb < 1 ? `${Math.round(mb * 1024)} KB` : `${mb.toFixed(1)} MB`;

  return {
    id: "bundle-size",
    name: "Bundle size",
    status: mb >= FAIL_MB ? "fail" : mb >= WARN_MB ? "warn" : "pass",
    message: `dist/ is ${label} (${files.length} files)`,
    msgKey: "bundleSize.size",
    msgParams: { label, count: files.length },
    details: mb >= WARN_MB ? [`Consider code splitting or tree shaking to reduce bundle size`] : [],
    severity: "low",
    durationMs: Date.now() - start,
  };
}
