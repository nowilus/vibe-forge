import { exec } from "node:child_process";

export interface HealthCheck {
  id: string;
  name: string;
  status: "pass" | "warn" | "fail" | "skip";
  message: string;
  msgKey?: string;
  msgParams?: Record<string, string | number>;
  details: string[];
  severity: "high" | "medium" | "low";
  durationMs: number;
}

export function calcScore(checks: HealthCheck[]): number {
  const active = checks.filter((c) => c.status !== "skip");
  if (active.length === 0) return 0;
  const points = active.reduce((sum, c) => {
    if (c.status === "pass") return sum + 1;
    if (c.status === "warn") return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((points / active.length) * 100);
}

export function runCmd(
  cmd: string,
  cwd: string,
  timeoutMs = 30000
): Promise<{ stdout: string; stderr: string; timedOut: boolean; failed: boolean }> {
  return new Promise((resolve) => {
    const child = exec(
      cmd,
      { cwd, maxBuffer: 2 * 1024 * 1024 },
      (error, stdout, stderr) => {
        clearTimeout(timer);
        resolve({
          stdout: stdout ?? "",
          stderr: stderr ?? "",
          timedOut: false,
          failed: !!error,
        });
      }
    );
    const timer = setTimeout(() => {
      child.kill();
      resolve({ stdout: "", stderr: "", timedOut: true, failed: true });
    }, timeoutMs);
  });
}
