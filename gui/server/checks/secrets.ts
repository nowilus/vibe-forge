import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import type { HealthCheck } from "../utils/health.js";

const PATTERNS = [
  /(?:api[_-]?key|api[_-]?secret|secret[_-]?key|auth[_-]?token|client[_-]?secret)\s*[=:]\s*(?:"|')?(?!process\.env|undefined|null|your[_-]|<|\{|\[)[^\s"']{8,}/gi,
  /(?:password|passwd)\s*=\s*(?:"|')?(?!process\.env|undefined|null|""|'')[^\s"']{6,}/gi,
  /sk-[a-zA-Z0-9]{20,}/g,
  /ghp_[a-zA-Z0-9]{36,}/g,
  /AKIA[0-9A-Z]{16}/g,
];

const IGNORE = ["node_modules/**", ".git/**", "dist/**", "build/**", ".vibe-forge/**", "*.lock"];
const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".env", ".sh"]);

export async function checkSecrets(root: string): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const files = await glob("**/*", { cwd: root, nodir: true, ignore: IGNORE });
    const sources = files.filter(
      (f) => EXTS.has(path.extname(f)) || path.basename(f).startsWith(".env")
    );

    const findings: string[] = [];
    for (const file of sources.slice(0, 600)) {
      const content = await fs.readFile(path.join(root, file), "utf-8").catch(() => "");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        for (const p of PATTERNS) {
          p.lastIndex = 0;
          if (p.test(lines[i])) {
            findings.push(`${file}:${i + 1}`);
            break;
          }
        }
      }
    }

    return {
      id: "secrets",
      name: "Secret scan",
      status: findings.length === 0 ? "pass" : "fail",
      message: findings.length === 0 ? "No secrets detected" : `${findings.length} potential secret(s) found`,
      msgKey: findings.length === 0 ? "secrets.pass" : "secrets.fail",
      msgParams: findings.length === 0 ? undefined : { count: findings.length },
      details: findings.slice(0, 10),
      severity: "high",
      durationMs: Date.now() - start,
    };
  } catch {
    return { id: "secrets", name: "Secret scan", status: "skip", message: "Scan failed", msgKey: "common.scanFailed", details: [], severity: "high", durationMs: Date.now() - start };
  }
}
