import { Link } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { ProjectData } from "@/types";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { RefreshCw, BookOpen, Lightbulb, Wand2 } from "lucide-react";
import { useLang } from "@/i18n/context";

export function Home() {
  const { t } = useLang();
  const { data, loading, error, refetch } = useApi<ProjectData>("/api/project");

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <p className="text-vf-danger font-medium">{t.home.loadError} {error}</p>
          <p className="text-vf-muted text-sm mt-2">{t.home.loadErrorHint}</p>
          <button
            onClick={refetch}
            className="mt-4 text-sm font-medium text-vf-accent hover:underline"
          >
            {t.common.retry}
          </button>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const existingDocs = data.freshness.filter((f) => f.exists).length;
  const totalDocs = data.freshness.length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Hero header */}
      <div className="relative rounded-lg border border-vf-border bg-vf-surface p-6 overflow-hidden shadow-sm">
        <img
          src="/banner_hero.png"
          alt=""
          className="absolute right-0 top-0 h-full w-auto opacity-[0.07] pointer-events-none select-none translate-x-1/4"
        />
        <div className="relative flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-vf-ink">{data.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-vf-muted font-mono">
                {t.home.stack}: <span className="text-vf-text font-medium">{data.stack === "unknown" ? t.home.unknown : data.stack}</span>
              </span>
              <span className="text-vf-border">|</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-vf-muted font-mono">
                {t.home.tdd}: <span className="text-vf-text font-medium">{data.tddTier === "unknown" ? t.home.unknown : data.tddTier}</span>
              </span>
            </div>
          </div>
          <button
            onClick={refetch}
            className="p-2 rounded-lg hover:bg-vf-accent/10 transition-colors text-vf-muted hover:text-vf-accent"
            title={t.common.refresh}
          >
            <RefreshCw size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Doc freshness */}
      <Card title={t.home.freshness}>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl font-bold text-vf-accent font-mono">
            {existingDocs}/{totalDocs}
          </div>
          <span className="text-sm text-vf-muted">{t.home.docsPresent}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {data.freshness.map((doc) => {
            const badgeLabel =
              doc.badge.status === "missing" ? t.home.badgeMissing
              : doc.badge.status === "fresh" ? t.home.badgeToday
              : (() => {
                  const m = doc.badge.label.match(/^(\d+)/);
                  return m ? t.home.badgeDaysAgo(parseInt(m[1], 10)) : doc.badge.label;
                })();
            return (
              <div
                key={doc.file}
                className="flex items-center justify-between rounded-md border border-vf-border/60 bg-vf-bg px-3 py-2.5"
              >
                <span className="text-sm font-mono text-vf-text">{doc.file.replace(".md", "")}</span>
                <StatusBadge status={doc.badge.status} label={badgeLabel} />
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent changes */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-vf-accent" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold text-vf-ink font-mono">{t.home.recentChanges}</h2>
          </div>
          {data.recentChanges.length === 0 ? (
            <p className="text-vf-muted text-sm italic pl-5">{t.home.noChangelog}</p>
          ) : (
            <ul className="space-y-0 divide-y divide-vf-border/40">
              {data.recentChanges.map((entry, i) => (
                <li key={i} className="py-2.5 pl-5">
                  {entry.date && (
                    <span className="text-xs text-vf-muted mr-2 font-mono">{entry.date}</span>
                  )}
                  <span className="text-sm text-vf-text">{entry.text}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Latest lessons */}
        <section className="rounded-lg bg-vf-accent-light border border-vf-accent/15 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={14} className="text-vf-warn" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold text-vf-ink font-mono">{t.home.latestLessons}</h2>
          </div>
          {data.recentLessons.length === 0 ? (
            <p className="text-vf-muted text-sm italic">{t.home.noLessons}</p>
          ) : (
            <ul className="space-y-3">
              {data.recentLessons.map((lesson, i) => (
                <li key={i} className="rounded-md bg-vf-surface/70 border border-vf-border/40 p-3">
                  <span className="text-sm font-semibold text-vf-ink block mb-1">
                    {lesson.title}
                  </span>
                  {lesson.body && (
                    <p className="text-xs text-vf-muted leading-relaxed">{lesson.body}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Setup banner */}
      {!data.hasState && !data.hasProjectMap && (
        <div className="relative rounded-lg border border-vf-accent/25 bg-vf-accent-light p-5 overflow-hidden shadow-sm">
          <img
            src="/guided_interview.png"
            alt=""
            className="absolute right-4 top-1/2 -translate-y-1/2 h-20 w-auto opacity-[0.12] pointer-events-none select-none"
          />
          <p className="text-sm text-vf-accent font-medium relative">
            {t.home.setupBanner}{" "}
            <Link
              to="/setup"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity inline-flex items-center gap-1"
            >
              <Wand2 size={13} strokeWidth={1.5} />
              {t.home.setupLink}
            </Link>{" "}
            {t.home.setupSuffix}
          </p>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="h-24 bg-vf-surface rounded-lg border border-vf-border" />
      <div className="h-40 bg-vf-surface rounded-lg border border-vf-border" />
      <div className="grid grid-cols-2 gap-6">
        <div className="h-48 bg-vf-surface rounded-lg border border-vf-border" />
        <div className="h-48 bg-vf-surface rounded-lg border border-vf-border" />
      </div>
    </div>
  );
}
