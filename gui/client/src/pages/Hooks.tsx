import { useState, useEffect } from "react";
import { Shield, ChevronDown, ChevronRight } from "lucide-react";
import type { HooksData, HookStatus, HookEvent } from "@/types";
import { useLang } from "@/i18n/context";

const API = "/api/hooks";

function HookRow({ hook }: { hook: HookStatus }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const hasEvents = hook.recentEvents.length > 0;

  return (
    <div className="border border-vf-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-vf-surface hover:bg-vf-bg transition-colors text-left"
        onClick={() => (hook.command || hasEvents) && setOpen((v) => !v)}
        aria-expanded={hook.command || hasEvents ? open : undefined}
      >
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            hook.defined ? "bg-vf-success" : "bg-vf-muted/30"
          }`}
        />
        <span className="flex-1 text-sm font-mono text-vf-text">{hook.name}</span>
        <span
          className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded ${
            hook.defined
              ? "bg-vf-success/10 text-vf-success border border-vf-success/20"
              : "bg-vf-muted/10 text-vf-muted border border-vf-muted/20"
          }`}
        >
          {hook.defined ? t.hooks.definedBadge : t.hooks.notSetBadge}
        </span>
        {(hook.command || hasEvents) && (
          <span className="text-vf-muted">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </button>

      {open && (
        <div className="px-4 pb-3 bg-vf-bg border-t border-vf-border space-y-3 pt-3">
          {hook.command && (
            <div>
              <p className="text-[10px] text-vf-muted uppercase tracking-wide mb-1">{t.hooks.command}</p>
              <code className="text-xs text-vf-text font-mono bg-vf-surface border border-vf-border px-2 py-1 rounded block break-all">
                {hook.command}
              </code>
            </div>
          )}
          {hasEvents && (
            <div>
              <p className="text-[10px] text-vf-muted uppercase tracking-wide mb-1">{t.hooks.recentEvents}</p>
              <ul className="space-y-1">
                {hook.recentEvents.map((e, i) => (
                  <li key={i} className="text-xs text-vf-muted font-mono flex gap-2">
                    <span className="text-vf-muted/50">{new Date(e.timestamp).toLocaleTimeString()}</span>
                    {e.outcome && <span className={e.outcome === "ok" ? "text-vf-success" : "text-vf-danger"}>{e.outcome}</span>}
                    {e.tool && <span>{e.tool}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EventFeed({ events }: { events: HookEvent[] }) {
  const { t } = useLang();
  if (events.length === 0) return null;
  return (
    <div className="bg-vf-surface border border-vf-border rounded-lg p-4">
      <p className="text-xs text-vf-muted uppercase tracking-wide font-medium mb-3">
        {t.hooks.recentActivity(events.length)}
      </p>
      <ul className="space-y-1.5">
        {[...events].reverse().map((e, i) => (
          <li key={i} className="flex items-center gap-3 text-xs font-mono">
            <span className="text-vf-muted/50 shrink-0">{new Date(e.timestamp).toLocaleTimeString()}</span>
            <span className="text-vf-accent shrink-0">{e.hook}</span>
            {e.tool && <span className="text-vf-muted">{e.tool}</span>}
            {e.outcome && (
              <span className={`ml-auto shrink-0 ${e.outcome === "ok" ? "text-vf-success" : "text-vf-danger"}`}>
                {e.outcome}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hooks() {
  const { t } = useLang();
  const [data, setData] = useState<HooksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(API);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setData(await r.json() as HooksData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(API)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((json) => { if (!cancelled) setData(json as HooksData); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield size={20} className="text-vf-accent" strokeWidth={1.5} />
        <h1 className="text-xl font-bold text-vf-ink">{t.hooks.title}</h1>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-vf-danger/10 border border-vf-danger/20 text-vf-danger text-sm">
          {error}
          <button
            onClick={load}
            className="block mt-2 text-sm font-medium text-vf-danger underline underline-offset-2 hover:opacity-70"
          >
            {t.common.retry}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <p className="text-vf-muted text-sm">{t.common.loading}</p>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="bg-vf-surface border border-vf-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold font-mono text-vf-success">{data.totalDefined}</div>
              <div className="text-xs text-vf-muted mt-1 uppercase tracking-wide">{t.hooks.statDefined}</div>
            </div>
            <div className="bg-vf-surface border border-vf-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold font-mono text-vf-muted">{data.totalKnown - data.totalDefined}</div>
              <div className="text-xs text-vf-muted mt-1 uppercase tracking-wide">{t.hooks.statNotSet}</div>
            </div>
            <div className="bg-vf-surface border border-vf-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold font-mono text-vf-accent">{data.recentEvents.length}</div>
              <div className="text-xs text-vf-muted mt-1 uppercase tracking-wide">{t.hooks.statEvents}</div>
            </div>
          </div>

          {!data.settingsFound && (
            <div className="p-4 rounded-lg bg-vf-warn/10 border border-vf-warn/20 text-vf-warn text-sm">
              {t.hooks.noSettings}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-vf-muted uppercase tracking-wide font-medium">{t.hooks.hookDefs}</p>
            {data.hooks.map((h) => (
              <HookRow key={h.name} hook={h} />
            ))}
          </div>

          <EventFeed events={data.recentEvents} />
        </>
      )}
    </div>
  );
}
