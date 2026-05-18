import fs from "node:fs/promises";
import path from "node:path";
import { runCmd } from "../utils/health.js";
import type { HealthCheck } from "../utils/health.js";

export async function checkNpmAudit(root: string): Promise<HealthCheck> {
  const start = Date.now();
  const hasPkg = await fs.access(path.join(root, "package.json")).then(() => true).catch(() => false);

  if (!hasPkg) {
    return { id: "npm-audit", name: "npm audit", status: "skip", message: "No package.json found", msgKey: "common.noPkg", details: [], severity: "high", durationMs: Date.now() - start };
  }

  const { stdout, timedOut, failed } = await runCmd("npm audit --json 2>/dev/null || npm audit --json", root, 30000);

  if (timedOut) {
    return { id: "npm-audit", name: "npm audit", status: "skip", message: "Audit timed out", msgKey: "common.timedOut", details: [], severity: "high", durationMs: Date.now() - start };
  }

  try {
    const json = JSON.parse(stdout);
    const vulns = json.metadata?.vulnerabilities ?? json.vulnerabilities ?? {};
    const high = (vulns.high ?? 0) + (vulns.critical ?? 0);
    const moderate = vulns.moderate ?? 0;
    const total = Object.values(vulns).reduce((s: number, v) => s + (v as number), 0);

    return {
      id: "npm-audit",
      name: "npm audit",
      status: high > 0 ? "fail" : moderate > 0 ? "warn" : "pass",
      message: total === 0 ? "No vulnerabilities found" : `${total} vulnerability/vulnerabilities (${high} high/critical)`,
      msgKey: total === 0 ? "npmAudit.pass" : "npmAudit.vulns",
      msgParams: total === 0 ? undefined : { total, high },
      details: high > 0 ? [`${high} high/critical vulnerabilities — run npm audit fix`] : [],
      severity: "high",
      durationMs: Date.now() - start,
    };
  } catch {
    return { id: "npm-audit", name: "npm audit", status: "skip", message: failed ? "npm audit failed" : "Could not parse audit output", msgKey: failed ? "npmAudit.failed" : "npmAudit.parseError", details: [], severity: "high", durationMs: Date.now() - start };
  }
}
