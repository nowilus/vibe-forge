import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import type { HealthCheck } from "../utils/health.js";

export async function checkTestCoverage(root: string): Promise<HealthCheck> {
  const start = Date.now();

  const testFiles = await glob("**/*.{test,spec}.{ts,tsx,js,jsx}", {
    cwd: root,
    ignore: ["node_modules/**", "dist/**"],
  }).catch(() => []);

  if (testFiles.length === 0) {
    return {
      id: "test-coverage",
      name: "Test coverage",
      status: "fail",
      message: "No test files found",
      msgKey: "testCoverage.noTests",
      details: ["Add tests: *.test.ts / *.spec.ts"],
      severity: "medium",
      durationMs: Date.now() - start,
    };
  }

  const coverageSummaryPath = path.join(root, "coverage", "coverage-summary.json");
  try {
    const raw = await fs.readFile(coverageSummaryPath, "utf-8");
    const json = JSON.parse(raw);
    const total = json.total?.lines?.pct ?? json.total?.statements?.pct ?? null;

    if (total !== null) {
      return {
        id: "test-coverage",
        name: "Test coverage",
        status: total >= 80 ? "pass" : total >= 50 ? "warn" : "fail",
        message: `${total}% line coverage (${testFiles.length} test files)`,
        msgKey: "testCoverage.coverage",
        msgParams: { pct: total, count: testFiles.length },
        details: total < 80 ? [`Coverage below 80% threshold`] : [],
        severity: "medium",
        durationMs: Date.now() - start,
      };
    }
  } catch {
    // no coverage report — just count test files
  }

  return {
    id: "test-coverage",
    name: "Test coverage",
    status: testFiles.length >= 5 ? "warn" : "warn",
    message: `${testFiles.length} test file(s) found — no coverage report`,
    msgKey: "testCoverage.noReport",
    msgParams: { count: testFiles.length },
    details: ["Run tests with --coverage to generate coverage report"],
    severity: "medium",
    durationMs: Date.now() - start,
  };
}
