import { useState } from "react";
import { Activity, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import type { HealthData, HealthCheck, CheckStatus } from "@/types";
import { useLang } from "@/i18n/context";

const API = "/api/health";

function statusColor(s: CheckStatus) {
  if (s === "pass") return "text-vf-success";
  if (s === "warn") return "text-vf-warn";
  if (s === "fail") return "text-vf-danger";
  return "text-vf-muted";
}

function statusBg(s: CheckStatus) {
  if (s === "pass") return "bg-vf-success/10 text-vf-success border border-vf-success/20";
  if (s === "warn") return "bg-vf-warn/10 text-vf-warn border border-vf-warn/20";
  if (s === "fail") return "bg-vf-danger/10 text-vf-danger border border-vf-danger/20";
  return "bg-vf-muted/10 text-vf-muted border border-vf-muted/20";
}

function scoreBg(score: number) {
  if (score >= 80) return "text-vf-success";
  if (score >= 50) return "text-vf-warn";
  return "text-vf-danger";
}

function CheckRow({ check }: { check: HealthCheck }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const hasDetails = check.details.length > 0;

  const statusLabel: Record<CheckStatus, string> = {
    pass: t.health.pass,
    warn: t.health.warn,
    fail: t.health.fail,
    skip: t.health.skip,
  };

  const displayName = t.checks.names[check.id] ?? check.name;
  const msgFn = check.msgKey ? t.checks.messages[check.msgKey] : undefined;
  const displayMessage = msgFn ? msgFn(check.msgParams) : check.message;

  return (
    <div className="border border-vf-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-vf-surface hover:bg-vf-bg transition-colors text-left"
        onClick={() => hasDetails && setOpen((v) => !v)}
        aria-expanded={hasDetails ? open : undefined}
      >
        <span className={`text-xs font-mono uppercase tracking-wide px-2 py-0.5 rounded ${statusBg(check.status)}`}>
          {statusLabel[check.status]}
        </span>
        <span className="flex-1 text-sm font-medium text-vf-text" title={displayMessage}>{displayName}</span>
        <span className="text-xs text-vf-muted font-mono">{check.durationMs}ms</span>
        {hasDetails && (
          <span className={`${statusColor(check.status)} transition-transform`}>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </button>

      <div className="px-4 pb-2 bg-vf-surface">
        <p className="text-xs text-vf-muted">{displayMessage}</p>
      </div>

      {open && hasDetails && (
        <div className="px-4 pb-3 bg-vf-bg border-t border-vf-border">
          <ul className="mt-2 space-y-1">
            {check.details.map((d, i) => (
              <li key={i} className="text-xs text-vf-text font-mono leading-relaxed">
                → {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScoreHistoryChart({ history }: { history: { runAt: string; score: number }[] }) {
  const { t } = useLang();
  const last10 = history.slice(-10);
  const LM = 28;   // left margin (Y-axis labels)
  const CW = 292;  // chart width
  const HP = 12;   // horizontal padding — dots don't touch axis edges
  const TP = 14;   // top padding (score labels above top dot)
  const CH = 68;   // chart height
  const XLH = 14;  // X-axis label row height
  const totalW = LM + CW;
  const totalH = TP + CH;
  const mono = "'JetBrains Mono', 'Fira Code', ui-monospace, monospace";
  const halo = { paintOrder: "stroke", stroke: "#faf8f3", strokeWidth: "3px", strokeLinejoin: "round" } as React.CSSProperties;

  const sy = (score: number) => TP + (1 - score / 100) * CH;
  const sx = (i: number) =>
    last10.length > 1
      ? LM + HP + (i / (last10.length - 1)) * (CW - 2 * HP)
      : LM + CW / 2;

  const pts = last10.map((e, i) => `${sx(i).toFixed(1)},${sy(e.score).toFixed(1)}`).join(" ");
  const y80 = sy(80);
  const y50 = sy(50);

  // X-axis labels: first shown run, multiples of 5 (by global run number), last shown run
  const histLen = history.length;
  const startIdx = histLen - last10.length;
  const xLabels: { i: number; label: number }[] = [];
  let prevX = -Infinity;
  for (let li = 0; li < last10.length; li++) {
    const runNum = startIdx + li + 1;
    const isFirst = li === 0;
    const isLast = li === last10.length - 1;
    const isMult5 = runNum % 5 === 0;
    if (isFirst || isLast || isMult5) {
      const xPos = sx(li);
      if (xPos - prevX >= 22 || isLast) {
        xLabels.push({ i: li, label: runNum });
        prevX = xPos;
      }
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-vf-muted leading-relaxed">{t.health.historyExplain}</p>
      <svg viewBox={`0 0 ${totalW} ${totalH + XLH + 2}`} width="100%" className="overflow-visible" aria-hidden="true">
        {/* Threshold zones */}
        <rect x={LM} y={TP} width={CW} height={y80 - TP} className="fill-vf-success" opacity="0.06" />
        <rect x={LM} y={y80} width={CW} height={y50 - y80} className="fill-vf-warn" opacity="0.06" />
        <rect x={LM} y={y50} width={CW} height={totalH - y50} className="fill-vf-danger" opacity="0.06" />

        {/* Reference lines */}
        <line x1={LM} y1={y80} x2={totalW} y2={y80} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" className="text-vf-success" opacity="0.5" />
        <line x1={LM} y1={y50} x2={totalW} y2={y50} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2" className="text-vf-warn" opacity="0.5" />

        {/* X-axis baseline */}
        <line x1={LM} y1={totalH} x2={totalW} y2={totalH} stroke="currentColor" strokeWidth="0.5" className="text-vf-border" opacity="0.5" />

        {/* Y-axis labels */}
        <text x={LM - 3} y={TP + 4} textAnchor="end" fontSize="7" fill="currentColor" className="text-vf-muted" fontFamily={mono}>100</text>
        <text x={LM - 3} y={y80 + 3} textAnchor="end" fontSize="7" fill="currentColor" className="text-vf-success" fontFamily={mono}>80</text>
        <text x={LM - 3} y={y50 + 3} textAnchor="end" fontSize="7" fill="currentColor" className="text-vf-warn" fontFamily={mono}>50</text>
        <text x={LM - 3} y={totalH} textAnchor="end" fontSize="7" fill="currentColor" className="text-vf-muted" fontFamily={mono}>0</text>

        {/* X-axis ticks + run number labels */}
        {xLabels.map(({ i, label }) => {
          const x = sx(i);
          const anchor = i === 0 && last10.length > 1 ? "start" : i === last10.length - 1 && last10.length > 1 ? "end" : "middle";
          return (
            <g key={i}>
              <line x1={x} y1={totalH} x2={x} y2={totalH + 3} stroke="currentColor" strokeWidth="0.5" className="text-vf-muted" opacity="0.6" />
              <text x={x} y={totalH + 11} textAnchor={anchor} fontSize="7" fill="currentColor" className="text-vf-muted" fontFamily={mono}>{label}</text>
            </g>
          );
        })}

        {/* Data line */}
        {last10.length > 1 && (
          <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-vf-accent" strokeLinejoin="round" strokeLinecap="round" />
        )}

        {/* Data points + score labels (all points) */}
        {last10.map((e, i) => {
          const cx = sx(i);
          const cy = sy(e.score);
          const labelY = cy < TP + 13 ? cy + 12 : cy - 5;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="2.5" className="fill-vf-accent" />
              <text
                x={cx} y={labelY}
                textAnchor="middle"
                fontSize="8" fontWeight="700"
                fill="currentColor" className="text-vf-accent"
                style={halo}
                fontFamily={mono}
              >
                {e.score}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Run list */}
      <div className="divide-y divide-vf-border/40">
        {[...last10].reverse().map((run, i) => {
          const dt = new Date(run.runAt);
          const timeStr = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const dateStr = dt.toLocaleDateString([], { month: "short", day: "numeric" });
          return (
            <div key={i} className={`flex items-center justify-between py-1.5 ${i > 0 ? "opacity-60" : ""}`}>
              <span className="text-xs text-vf-muted font-mono">{dateStr} · {timeStr}</span>
              <span className={`text-xs font-mono font-semibold ${scoreBg(run.score)}`}>{run.score} / 100</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Health() {
  const { t } = useLang();
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ran, setRan] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  async function runAudit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as HealthData;
      setData(json);
      setRan(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const passCount = data?.checks.filter((c) => c.status === "pass").length ?? 0;
  const warnCount = data?.checks.filter((c) => c.status === "warn").length ?? 0;
  const failCount = data?.checks.filter((c) => c.status === "fail").length ?? 0;
  const skipCount = data?.checks.filter((c) => c.status === "skip").length ?? 0;

  function scoreLabel(score: number) {
    if (score >= 80) return t.health.healthy;
    if (score >= 50) return t.health.needsAttention;
    return t.health.critical;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={20} className="text-vf-accent" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-vf-ink">{t.health.title}</h1>
        </div>
        <button
          onClick={runAudit}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-vf-accent hover:bg-vf-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} strokeWidth={2} className={loading ? "animate-spin" : ""} />
          {loading ? t.health.running : ran ? t.health.rerun : t.health.run}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-vf-danger/10 border border-vf-danger/20 text-vf-danger text-sm">
          {error}
          <button
            onClick={runAudit}
            className="block mt-2 text-sm font-medium text-vf-danger underline underline-offset-2 hover:opacity-70"
          >
            {t.common.retry}
          </button>
        </div>
      )}

      {!ran && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity size={40} className="text-vf-muted/30 mb-4" strokeWidth={1} />
          <p className="text-vf-muted text-sm">{t.health.idleHint}</p>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-vf-surface border border-vf-border rounded-lg p-4 text-center">
              <div className={`text-3xl font-bold font-mono ${scoreBg(data.score)}`}>{data.score}</div>
              <div className="text-xs text-vf-muted mt-1 uppercase tracking-wide">{scoreLabel(data.score)}</div>
            </div>
            <div className="bg-vf-surface border border-vf-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold font-mono text-vf-success">{passCount}</div>
              <div className="text-xs text-vf-muted mt-1 uppercase tracking-wide">{t.health.pass}</div>
            </div>
            <div className="bg-vf-surface border border-vf-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold font-mono text-vf-warn">{warnCount}</div>
              <div className="text-xs text-vf-muted mt-1 uppercase tracking-wide">{t.health.warn}</div>
            </div>
            <div className="bg-vf-surface border border-vf-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold font-mono text-vf-danger">{failCount}</div>
              <div className="text-xs text-vf-muted mt-1 uppercase tracking-wide">{t.health.fail}</div>
            </div>
          </div>

          {data.history.length >= 1 && (
            <div className="bg-vf-surface border border-vf-border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-vf-bg transition-colors"
                onClick={() => setHistoryOpen((v) => !v)}
                aria-expanded={historyOpen}
              >
                <p className="text-xs text-vf-muted uppercase tracking-wide font-medium">
                  {t.health.scoreHistory(data.history.length)}
                </p>
                {historyOpen ? <ChevronDown size={14} className="text-vf-muted" /> : <ChevronRight size={14} className="text-vf-muted" />}
              </button>
              {historyOpen && (
                <div className="px-4 pb-4">
                  <ScoreHistoryChart history={data.history} />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-vf-muted uppercase tracking-wide font-medium">
              {skipCount > 0
                ? t.health.checksSkipped(data.checks.length, skipCount)
                : t.health.checksAll(data.checks.length)}
            </p>
            {data.checks.map((check) => (
              <CheckRow key={check.id} check={check} />
            ))}
          </div>

          <p className="text-xs text-vf-muted font-mono text-right">
            {t.health.runAt} {new Date(data.runAt).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}
