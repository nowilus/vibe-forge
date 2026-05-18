import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { DocFile, DocListItem } from "@/types";
import ReactMarkdown from "react-markdown";
import { FileText, Clock, ExternalLink } from "lucide-react";
import { useLang } from "@/i18n/context";

const DOC_FILES = [
  "STATE.md",
  "CHANGELOG.md",
  "CLIENT_DOCS.md",
  "PROJECT_MAP.md",
  "LESSONS.md",
  "PROJECT_RULES.md",
] as const;

export function Docs() {
  const { t } = useLang();
  const [activeFile, setActiveFile] = useState("STATE.md");
  const { data: docList } = useApi<DocListItem[]>("/api/docs");
  const { data: doc, loading } = useApi<DocFile>(`/api/docs/${activeFile}`);

  const existingFiles = new Set(docList?.filter((d) => d.exists).map((d) => d.file) ?? []);

  async function openInEditor() {
    await fetch(`/api/docs/${activeFile}/open`, { method: "POST" });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-4 pt-4 pb-2 overflow-x-auto border-b border-vf-border/50">
        {DOC_FILES.map((file) => {
          const label = t.docs.tabs[file] ?? file;
          const exists = existingFiles.size === 0 || existingFiles.has(file);
          return (
            <button
              key={file}
              onClick={() => exists && setActiveFile(file)}
              disabled={!exists}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeFile === file
                  ? "bg-vf-accent/15 text-vf-accent border border-vf-accent/20"
                  : exists
                    ? "text-vf-muted hover:text-vf-text hover:bg-vf-bg border border-transparent"
                    : "text-vf-muted/30 cursor-not-allowed border border-transparent"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-64 bg-vf-border/40 rounded" />
            <div className="h-4 w-96 bg-vf-border/40 rounded" />
            <div className="h-4 w-80 bg-vf-border/40 rounded" />
          </div>
        ) : doc ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-vf-border">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-vf-accent" strokeWidth={1.5} />
                <span className="font-mono text-sm font-semibold text-vf-ink">{doc.file}</span>
              </div>
              <div className="flex items-center gap-4">
                {doc.lastModified && (
                  <span className="flex items-center gap-1.5 text-xs text-vf-muted font-mono">
                    <Clock size={12} />
                    {new Date(doc.lastModified).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                <button
                  onClick={openInEditor}
                  className="flex items-center gap-1 text-xs text-vf-muted hover:text-vf-accent transition-colors font-medium"
                  title={t.common.open}
                >
                  <ExternalLink size={12} />
                  <span>{t.common.open}</span>
                </button>
              </div>
            </div>

            <article className="prose prose-sm max-w-none prose-headings:text-vf-ink prose-headings:font-bold prose-p:text-vf-text prose-a:text-vf-accent prose-a:no-underline hover:prose-a:underline prose-code:text-vf-accent prose-code:bg-vf-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs prose-pre:bg-vf-ink prose-pre:text-vf-bg prose-pre:border prose-pre:border-vf-border prose-pre:rounded-lg prose-table:text-sm prose-th:text-vf-muted prose-td:border-vf-border prose-th:border-vf-border prose-strong:text-vf-ink prose-li:text-vf-text">
              <ReactMarkdown>{doc.content}</ReactMarkdown>
            </article>
          </div>
        ) : (
          <div className="text-center py-16">
            <img
              src="/atomic_prompts.png"
              alt=""
              className="mx-auto w-24 h-24 opacity-20 mb-4"
            />
            <p className="text-vf-muted font-medium">{t.docs.notFound}</p>
            <p className="text-xs text-vf-muted/60 mt-1">{t.docs.notFoundHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
