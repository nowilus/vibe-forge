import { readProjectFile } from "../utils/files.js";
import type { HealthCheck } from "../utils/health.js";

const STALE_DAYS = 30;
const WARN_DAYS = 14;

export async function checkLessonsActivity(root: string): Promise<HealthCheck> {
  const start = Date.now();
  const meta = await readProjectFile(root, "LESSONS.md");

  if (!meta.exists) {
    return {
      id: "lessons-activity",
      name: "LESSONS.md activity",
      status: "fail",
      message: "LESSONS.md not found",
      msgKey: "lessonsActivity.notFound",
      details: ["Create LESSONS.md to record project learnings"],
      severity: "low",
      durationMs: Date.now() - start,
    };
  }

  const content = meta.content ?? "";
  const sectionCount = (content.match(/^#{2,3}\s+/gm) ?? []).length;

  if (sectionCount === 0) {
    return {
      id: "lessons-activity",
      name: "LESSONS.md activity",
      status: "warn",
      message: "LESSONS.md exists but has no entries",
      msgKey: "lessonsActivity.empty",
      details: ["Add lessons with ## headings"],
      severity: "low",
      durationMs: Date.now() - start,
    };
  }

  const ageMs = meta.ageMs ?? Infinity;
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));

  return {
    id: "lessons-activity",
    name: "LESSONS.md activity",
    status: ageDays >= STALE_DAYS ? "warn" : "pass",
    message: `${sectionCount} lesson(s) — last updated ${ageDays === 0 ? "today" : `${ageDays}d ago`}`,
    msgKey: "lessonsActivity.activity",
    msgParams: { count: sectionCount, days: ageDays },
    details: ageDays >= WARN_DAYS ? [`No new lessons in ${ageDays} days — review learnings after each sprint`] : [],
    severity: "low",
    durationMs: Date.now() - start,
  };
}
