import { readProjectFile, ageToBadge } from "../utils/files.js";
import type { HealthCheck } from "../utils/health.js";

const CRITICAL_DOCS = ["STATE.md", "CHANGELOG.md", "PROJECT_MAP.md"];
const ALL_DOCS = [...CRITICAL_DOCS, "CLIENT_DOCS.md", "LESSONS.md", "PROJECT_RULES.md"];

export async function checkDocsFreshness(root: string): Promise<HealthCheck> {
  const start = Date.now();

  const results = await Promise.all(
    ALL_DOCS.map(async (file) => {
      const meta = await readProjectFile(root, file);
      return { file, exists: meta.exists, badge: ageToBadge(meta.ageMs) };
    })
  );

  const missing = results.filter((r) => !r.exists);
  const old = results.filter((r) => r.exists && r.badge.status === "old");
  const criticalMissing = missing.filter((r) => CRITICAL_DOCS.includes(r.file));

  let status: "pass" | "warn" | "fail";
  if (criticalMissing.length > 0) status = "fail";
  else if (missing.length > 0 || old.length > 0) status = "warn";
  else status = "pass";

  const details = [
    ...criticalMissing.map((r) => `MISSING: ${r.file}`),
    ...missing.filter((r) => !CRITICAL_DOCS.includes(r.file)).map((r) => `missing: ${r.file}`),
    ...old.map((r) => `stale: ${r.file} (${r.badge.label})`),
  ];

  const isPass = status === "pass";
  return {
    id: "docs-freshness",
    name: "Docs freshness",
    status,
    message: isPass ? "All docs present and recent" : `${missing.length} missing, ${old.length} stale`,
    msgKey: isPass ? "docsFreshness.pass" : "docsFreshness.issues",
    msgParams: isPass ? undefined : { missing: missing.length, old: old.length },
    details,
    severity: "medium",
    durationMs: Date.now() - start,
  };
}
