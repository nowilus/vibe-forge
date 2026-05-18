import { useState, useEffect, useMemo } from "react";
import { Zap, Plus, X, FileText, Pencil, Trash2 } from "lucide-react";
import type { PromptsData, PromptFile } from "@/types";
import { useLang } from "@/i18n/context";

const API = "/api/prompts";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-vf-muted/10 text-vf-muted border border-vf-muted/20",
  "in-progress": "bg-vf-warn/10 text-vf-warn border border-vf-warn/20",
  executed: "bg-vf-success/10 text-vf-success border border-vf-success/20",
};

function statusStyle(s: string) {
  return STATUS_STYLES[s] ?? STATUS_STYLES.draft;
}

function PromptCard({ prompt, onSelect }: { prompt: PromptFile; onSelect: (p: PromptFile) => void }) {
  return (
    <button
      className="text-left w-full bg-vf-surface border border-vf-border rounded-lg p-4 hover:border-vf-accent/40 hover:bg-vf-accent/5 transition-colors"
      onClick={() => onSelect(prompt)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-vf-ink leading-snug">{prompt.title}</span>
        <span className={`shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded ${statusStyle(prompt.status)}`}>
          {prompt.status}
        </span>
      </div>
      {prompt.excerpt && (
        <p className="text-xs text-vf-muted leading-relaxed line-clamp-3">{prompt.excerpt}</p>
      )}
      {prompt.lastModified && (
        <p className="text-[10px] text-vf-muted/60 font-mono mt-2">
          {new Date(prompt.lastModified).toLocaleDateString()}
        </p>
      )}
    </button>
  );
}

interface NewPromptForm {
  title: string;
  filename: string;
  status: string;
  content: string;
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { t } = useLang();
  const [form, setForm] = useState<NewPromptForm>({ title: "", filename: "", status: "draft", content: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function patch(field: keyof NewPromptForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.filename.trim() || !form.content.trim()) {
      setErr(t.prompts.modal.validationError);
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      onCreated();
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-vf-ink/30 z-50 flex items-center justify-center p-4">
      <div className="bg-vf-surface border border-vf-border rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-vf-border">
          <h2 className="text-sm font-semibold text-vf-ink">{t.prompts.modal.title}</h2>
          <button onClick={onClose} aria-label={t.common.close} className="text-vf-muted hover:text-vf-text transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          {err && <p className="text-xs text-vf-danger bg-vf-danger/10 border border-vf-danger/20 rounded p-2">{err}</p>}
          <div>
            <label className="block text-xs font-medium text-vf-text mb-1">{t.prompts.modal.labelTitle}</label>
            <input
              className="w-full bg-vf-bg border border-vf-border rounded-md px-3 py-2 text-sm text-vf-text focus:outline-none focus:border-vf-accent"
              placeholder={t.prompts.modal.placeholderTitle}
              value={form.title}
              onChange={(e) => patch("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-vf-text mb-1">
              {t.prompts.modal.labelFilename} <span className="text-vf-danger">*</span>
            </label>
            <input
              className="w-full bg-vf-bg border border-vf-border rounded-md px-3 py-2 text-sm text-vf-text font-mono focus:outline-none focus:border-vf-accent"
              placeholder={t.prompts.modal.placeholderFilename}
              value={form.filename}
              onChange={(e) => patch("filename", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-vf-text mb-1">{t.prompts.modal.labelStatus}</label>
            <select
              className="w-full bg-vf-bg border border-vf-border rounded-md px-3 py-2 text-sm text-vf-text focus:outline-none focus:border-vf-accent"
              value={form.status}
              onChange={(e) => patch("status", e.target.value)}
            >
              <option value="draft">{t.prompts.modal.optDraft}</option>
              <option value="in-progress">{t.prompts.modal.optInProgress}</option>
              <option value="executed">{t.prompts.modal.optExecuted}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-vf-text mb-1">
              {t.prompts.modal.labelContent} <span className="text-vf-danger">*</span>
            </label>
            <textarea
              className="w-full bg-vf-bg border border-vf-border rounded-md px-3 py-2 text-sm text-vf-text font-mono focus:outline-none focus:border-vf-accent resize-none"
              rows={6}
              placeholder={t.prompts.modal.placeholderContent}
              value={form.content}
              onChange={(e) => patch("content", e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-vf-muted hover:text-vf-text transition-colors">
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-vf-accent hover:bg-vf-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? t.common.saving : t.common.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailModal({ prompt, onClose, onSaved, onDeleted }: {
  prompt: PromptFile;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const { t } = useLang();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(prompt.title);
  const [status, setStatus] = useState(prompt.status);
  const [content, setContent] = useState(prompt.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(`${API}/${encodeURIComponent(prompt.filename)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status, content }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      setEditing(false);
      onSaved();
    } catch {
      setErr(t.prompts.modal.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(t.prompts.modal.deleteConfirm)) return;
    setDeleting(true);
    setErr(null);
    try {
      const res = await fetch(`${API}/${encodeURIComponent(prompt.filename)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onDeleted();
      onClose();
    } catch {
      setErr(t.prompts.modal.deleteError);
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-vf-ink/30 z-50 flex items-center justify-center p-4">
      <div className="bg-vf-surface border border-vf-border rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-vf-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileText size={16} className="text-vf-accent shrink-0" strokeWidth={1.5} />
            {editing ? (
              <input
                className="bg-vf-bg border border-vf-border rounded-md px-2 py-1 text-sm font-semibold text-vf-ink focus:outline-none focus:border-vf-accent min-w-0 flex-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <h2 className="text-sm font-semibold text-vf-ink truncate">{title}</h2>
            )}
            {editing ? (
              <select
                className="bg-vf-bg border border-vf-border rounded-md px-2 py-1 text-xs text-vf-text focus:outline-none focus:border-vf-accent shrink-0"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">{t.prompts.modal.optDraft}</option>
                <option value="in-progress">{t.prompts.modal.optInProgress}</option>
                <option value="executed">{t.prompts.modal.optExecuted}</option>
              </select>
            ) : (
              <span className={`shrink-0 text-[10px] font-mono uppercase px-2 py-0.5 rounded ${statusStyle(status)}`}>
                {status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                aria-label={t.prompts.modal.editTitle}
                className="text-vf-muted hover:text-vf-accent transition-colors"
              >
                <Pencil size={14} />
              </button>
            )}
            <button
              onClick={remove}
              disabled={deleting}
              aria-label={t.prompts.modal.delete}
              className="text-vf-muted hover:text-vf-danger transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
            </button>
            <button onClick={onClose} aria-label={t.common.close} className="text-vf-muted hover:text-vf-text transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {err && (
          <div className="mx-5 mt-3 text-xs text-vf-danger bg-vf-danger/10 border border-vf-danger/20 rounded p-2">{err}</div>
        )}

        <div className="p-5 overflow-y-auto flex-1">
          {editing ? (
            <textarea
              className="w-full h-full min-h-[240px] bg-vf-bg border border-vf-border rounded-md px-3 py-2 text-xs text-vf-text font-mono focus:outline-none focus:border-vf-accent resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <pre className="text-xs text-vf-text font-mono whitespace-pre-wrap leading-relaxed">{content}</pre>
          )}
        </div>

        <div className="px-5 py-3 border-t border-vf-border shrink-0 flex items-center justify-between">
          <p className="text-[10px] text-vf-muted font-mono">{prompt.filename}</p>
          {editing && (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(false); setTitle(prompt.title); setStatus(prompt.status); setContent(prompt.content); setErr(null); }}
                className="px-3 py-1.5 text-xs text-vf-muted hover:text-vf-text transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-3 py-1.5 bg-vf-accent hover:bg-vf-accent-hover text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? t.common.saving : t.prompts.modal.save}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Prompts() {
  const { t } = useLang();
  const [data, setData] = useState<PromptsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PromptFile | null>(null);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json() as PromptsData);
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
      .then((json) => { if (!cancelled) setData(json as PromptsData); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const prompts = data?.prompts ?? [];
  const filtered = filter === "all" ? prompts : prompts.filter((p) => p.status === filter);
  const counts = useMemo(() => ({
    all: prompts.length,
    draft: prompts.filter((p) => p.status === "draft").length,
    "in-progress": prompts.filter((p) => p.status === "in-progress").length,
    executed: prompts.filter((p) => p.status === "executed").length,
  }), [prompts]);

  const filterLabels: Record<string, string> = {
    all: t.prompts.all,
    draft: t.prompts.draft,
    "in-progress": t.prompts.inProgress,
    executed: t.prompts.executed,
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-vf-accent" strokeWidth={1.5} />
          <h1 className="text-xl font-bold text-vf-ink">{t.prompts.title}</h1>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-vf-accent hover:bg-vf-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={14} strokeWidth={2} />
          {t.prompts.newPrompt}
        </button>
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

      {!loading && prompts.length > 0 && (
        <div className="flex gap-2">
          {(["all", "draft", "in-progress", "executed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-vf-accent text-white"
                  : "bg-vf-surface border border-vf-border text-vf-muted hover:text-vf-text"
              }`}
            >
              {filterLabels[s]} ({counts[s]})
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <p className="text-vf-muted text-sm">{t.common.loading}</p>
        </div>
      )}

      {!loading && prompts.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Zap size={40} className="text-vf-muted/30 mb-4" strokeWidth={1} />
          <p className="text-vf-muted text-sm mb-1">{t.prompts.empty}</p>
          <p className="text-vf-muted/60 text-xs">
            {t.prompts.emptyHint}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <PromptCard key={p.filename} prompt={p} onSelect={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <DetailModal
          prompt={selected}
          onClose={() => setSelected(null)}
          onSaved={() => { load(); }}
          onDeleted={() => { setSelected(null); load(); }}
        />
      )}
      {creating && <CreateModal onClose={() => setCreating(false)} onCreated={load} />}
    </div>
  );
}
