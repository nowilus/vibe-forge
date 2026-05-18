import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wand2,
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  Loader2,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import type {
  WizardAnswers,
  TddTier,
  HooksScope,
  WizardLanguage,
  GeneratedFile,
  SetupStatus,
  SetupGenerateResult,
} from "@/types";
import { useLang } from "@/i18n/context";

// ─── defaults ────────────────────────────────────────────────────────────────

const DEFAULT_ANSWERS: WizardAnswers = {
  projectName: "",
  description: "",
  language: "English",
  audience: "",
  stack: "",
  tddTier: "basic",
  deployment: "Vercel",
  tools: ["claude-code"],
  hooksScope: "project",
};

// ─── static data (labels not translated — proper nouns / identifiers) ─────────

const STACKS = [
  "React + Node.js",
  "Next.js",
  "Vue + Node.js",
  "Python / FastAPI",
  "Go",
  "Laravel",
  "SvelteKit",
  "Custom",
];

const DEPLOYMENTS = [
  "Vercel",
  "Fly.io",
  "Railway",
  "AWS",
  "Supabase",
  "Self-hosted",
  "Not decided",
];

const AI_TOOLS = [
  { id: "claude-code", label: "Claude Code" },
  { id: "cursor", label: "Cursor" },
  { id: "codex", label: "Codex" },
  { id: "windsurf", label: "Windsurf" },
  { id: "copilot", label: "GitHub Copilot" },
  { id: "lovable", label: "Lovable" },
];

const TDD_TIERS: TddTier[] = ["none", "basic", "full"];
const HOOKS_SCOPES: HooksScope[] = ["project", "global", "both", "skip"];

// ─── small helpers ────────────────────────────────────────────────────────────

function StepDot({ step, current }: { step: number; current: number }) {
  const done = current > step;
  const active = current === step;
  return (
    <div
      aria-current={active ? "step" : undefined}
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
        done
          ? "bg-vf-accent text-white"
          : active
          ? "border-2 border-vf-accent text-vf-accent"
          : "border border-vf-border text-vf-muted"
      }`}
    >
      {done ? <Check size={12} strokeWidth={3} /> : step}
    </div>
  );
}

function StepBar({ current }: { current: number }) {
  const { t } = useLang();
  const steps = t.setup.steps.map((label, i) => ({ id: i + 1, label }));
  return (
    <nav aria-label={t.setup.stepsNav}>
    <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <StepDot step={s.id} current={current} />
            <span
              className={`text-[10px] font-medium whitespace-nowrap ${
                current === s.id ? "text-vf-accent" : "text-vf-muted"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-8 mb-4 shrink-0 ${
                current > s.id ? "bg-vf-accent" : "bg-vf-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
    </nav>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-vf-text">
        {label}
        {required && <span className="text-vf-danger ml-1">*</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 rounded-lg border border-vf-border bg-vf-bg text-vf-text text-sm placeholder:text-vf-muted focus:outline-none focus:ring-2 focus:ring-vf-accent/30 focus:border-vf-accent transition-colors"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-vf-text">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="px-3 py-2 rounded-lg border border-vf-border bg-vf-bg text-vf-text text-sm placeholder:text-vf-muted focus:outline-none focus:ring-2 focus:ring-vf-accent/30 focus:border-vf-accent transition-colors resize-none"
      />
    </label>
  );
}

// ─── step components ──────────────────────────────────────────────────────────

function StepBasics({
  answers,
  setAnswers,
}: {
  answers: WizardAnswers;
  setAnswers: (a: WizardAnswers) => void;
}) {
  const { t } = useLang();
  const set = <K extends keyof WizardAnswers>(k: K, v: WizardAnswers[K]) =>
    setAnswers({ ...answers, [k]: v });

  return (
    <div className="flex flex-col gap-5">
      <Input
        label={t.setup.fields.projectName}
        value={answers.projectName}
        onChange={(v) => set("projectName", v)}
        placeholder={t.setup.fields.projectNamePlaceholder}
        required
      />
      <Textarea
        label={t.setup.fields.description}
        value={answers.description}
        onChange={(v) => set("description", v)}
        placeholder={t.setup.fields.descriptionPlaceholder}
      />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-vf-text">{t.setup.fields.language}</span>
        <div className="flex gap-3">
          {(["English", "Polish"] as WizardLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => set("language", lang)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                answers.language === lang
                  ? "border-vf-accent bg-vf-accent/10 text-vf-accent"
                  : "border-vf-border text-vf-muted hover:border-vf-accent/50 hover:text-vf-text"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
      <Textarea
        label={t.setup.fields.audience}
        value={answers.audience}
        onChange={(v) => set("audience", v)}
        placeholder={t.setup.fields.audiencePlaceholder}
      />
    </div>
  );
}

function StepStack({
  answers,
  setAnswers,
}: {
  answers: WizardAnswers;
  setAnswers: (a: WizardAnswers) => void;
}) {
  const { t } = useLang();
  const isCustom = !STACKS.slice(0, -1).includes(answers.stack);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STACKS.map((s) => {
          const active = s === "Custom" ? isCustom : answers.stack === s;
          return (
            <button
              key={s}
              onClick={() => setAnswers({ ...answers, stack: s === "Custom" ? "" : s })}
              className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left ${
                active
                  ? "border-vf-accent bg-vf-accent/10 text-vf-accent"
                  : "border-vf-border text-vf-muted hover:border-vf-accent/50 hover:text-vf-text"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
      {isCustom && (
        <Input
          label={t.setup.fields.customStack}
          value={answers.stack}
          onChange={(v) => setAnswers({ ...answers, stack: v })}
          placeholder={t.setup.fields.customStackPlaceholder}
          required
        />
      )}
    </div>
  );
}

function StepTesting({
  answers,
  setAnswers,
}: {
  answers: WizardAnswers;
  setAnswers: (a: WizardAnswers) => void;
}) {
  const { t } = useLang();
  return (
    <div className="flex flex-col gap-3">
      {TDD_TIERS.map((tier, i) => {
        const opt = t.setup.tddOptions[i];
        return (
          <button
            key={tier}
            onClick={() => setAnswers({ ...answers, tddTier: tier })}
            className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-colors ${
              answers.tddTier === tier
                ? "border-vf-accent bg-vf-accent/5"
                : "border-vf-border hover:border-vf-accent/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  answers.tddTier === tier ? "border-vf-accent" : "border-vf-muted/50"
                }`}
              >
                {answers.tddTier === tier && (
                  <div className="w-2 h-2 rounded-full bg-vf-accent" />
                )}
              </div>
              <span
                className={`font-semibold text-sm ${
                  answers.tddTier === tier ? "text-vf-accent" : "text-vf-text"
                }`}
              >
                {opt.label}
              </span>
            </div>
            <p className="text-xs text-vf-muted mt-2 ml-7">{opt.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

function StepDeployment({
  answers,
  setAnswers,
}: {
  answers: WizardAnswers;
  setAnswers: (a: WizardAnswers) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {DEPLOYMENTS.map((d) => (
        <button
          key={d}
          onClick={() => setAnswers({ ...answers, deployment: d })}
          className={`px-3 py-3 rounded-lg border text-sm font-medium transition-colors text-left ${
            answers.deployment === d
              ? "border-vf-accent bg-vf-accent/10 text-vf-accent"
              : "border-vf-border text-vf-muted hover:border-vf-accent/50 hover:text-vf-text"
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

function StepTools({
  answers,
  setAnswers,
}: {
  answers: WizardAnswers;
  setAnswers: (a: WizardAnswers) => void;
}) {
  const { t } = useLang();

  const toggleTool = (id: string) => {
    const tools = answers.tools.includes(id)
      ? answers.tools.filter((tool) => tool !== id)
      : [...answers.tools, id];
    setAnswers({ ...answers, tools });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold text-vf-ink mb-3">{t.setup.toolsTitle}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AI_TOOLS.map(({ id, label }) => {
            const active = answers.tools.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleTool(id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  active
                    ? "border-vf-accent bg-vf-accent/10 text-vf-accent"
                    : "border-vf-border text-vf-muted hover:border-vf-accent/50 hover:text-vf-text"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    active ? "bg-vf-accent border-vf-accent" : "border-vf-muted/50"
                  }`}
                >
                  {active && <Check size={10} strokeWidth={3} className="text-white" />}
                </div>
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-vf-muted mt-2">{t.setup.toolsHint}</p>
      </div>

      <hr className="border-vf-border" />
      <div>
        <p className="text-sm font-semibold text-vf-ink mb-3">{t.setup.hooksTitle}</p>
        <div className="flex flex-col gap-2">
          {HOOKS_SCOPES.map((scope, i) => {
            const opt = t.setup.hooksOptions[i];
            return (
              <button
                key={scope}
                onClick={() => setAnswers({ ...answers, hooksScope: scope })}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  answers.hooksScope === scope
                    ? "border-vf-accent bg-vf-accent/5"
                    : "border-vf-border hover:border-vf-accent/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      answers.hooksScope === scope ? "border-vf-accent" : "border-vf-muted/50"
                    }`}
                  >
                    {answers.hooksScope === scope && (
                      <div className="w-1.5 h-1.5 rounded-full bg-vf-accent" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      answers.hooksScope === scope ? "text-vf-accent" : "text-vf-text"
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs text-vf-muted mt-0.5 ml-6">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilePreviewItem({ file }: { file: GeneratedFile }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-vf-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-vf-surface hover:bg-vf-bg transition-colors text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <FileText size={14} className="text-vf-muted shrink-0" />
        <span className="flex-1 text-sm font-mono text-vf-text">{file.path}</span>
        <ChevronRight
          size={14}
          className={`text-vf-muted transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <pre className="px-4 py-3 text-xs text-vf-muted bg-vf-bg overflow-x-auto max-h-64 font-mono leading-relaxed border-t border-vf-border">
          {file.content}
        </pre>
      )}
    </div>
  );
}

function StepPreview({
  answers,
  onGenerate,
  generating,
  result,
}: {
  answers: WizardAnswers;
  onGenerate: (overwrite: boolean) => void;
  generating: boolean;
  result: SetupGenerateResult | null;
}) {
  const { t } = useLang();
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [overwrite, setOverwrite] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/setup/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    })
      .then((r) => r.json())
      .then((d) => setFiles(d.files ?? []))
      .finally(() => setLoading(false));
  }, [answers]);

  if (result) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-vf-success/30 bg-vf-success/5 px-5 py-4">
          <p className="text-sm font-semibold text-vf-success mb-2">{t.setup.preview.successTitle}</p>
          <p className="text-xs text-vf-muted">
            {t.setup.preview.successDesc(result.created.length, result.skipped.length, result.errors.length)}
          </p>
        </div>
        {result.created.length > 0 && (
          <div>
            <p className="text-xs font-medium text-vf-muted mb-2 uppercase tracking-wide">{t.setup.preview.createdLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {result.created.map((f) => (
                <span key={f} className="text-xs font-mono px-2 py-0.5 rounded bg-vf-success/10 text-vf-success border border-vf-success/20">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
        {result.skipped.length > 0 && (
          <div>
            <p className="text-xs font-medium text-vf-muted mb-2 uppercase tracking-wide">{t.setup.preview.skippedLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {result.skipped.map((f) => (
                <span key={f} className="text-xs font-mono px-2 py-0.5 rounded bg-vf-warn/10 text-vf-warn border border-vf-warn/20">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
        {result.errors.length > 0 && (
          <div>
            <p className="text-xs font-medium text-vf-danger mb-2 uppercase tracking-wide">{t.setup.preview.errorsLabel}</p>
            {result.errors.map((e) => (
              <p key={e} className="text-xs font-mono text-vf-danger">{e}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex items-center gap-2 text-vf-muted py-8 justify-center">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">{t.setup.preview.building}</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-vf-muted">
            {t.setup.preview.filesCount(files.length)}
          </p>
          <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
            {files.map((f) => (
              <FilePreviewItem key={f.path} file={f} />
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-vf-muted cursor-pointer">
            <input
              type="checkbox"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
              className="rounded border-vf-border"
            />
            {t.setup.preview.overwrite}
          </label>
          <button
            disabled={generating}
            onClick={() => {
              if (overwrite && !window.confirm(t.setup.preview.overwriteConfirm)) return;
              onGenerate(overwrite);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-vf-accent text-white font-semibold text-sm hover:bg-vf-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t.setup.preview.generating}
              </>
            ) : (
              <>
                <Wand2 size={16} />
                {t.setup.preview.generate}
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function Setup() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<WizardAnswers>(DEFAULT_ANSWERS);
  const [validationErr, setValidationErr] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<SetupGenerateResult | null>(null);
  const [status, setStatus] = useState<SetupStatus | null>(null);

  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => null);
  }, []);

  function validate(s: number): string | null {
    if (s === 1 && !answers.projectName.trim()) return t.setup.validationProjectName;
    if (s === 2 && !answers.stack.trim()) return t.setup.validationCustomStack;
    return null;
  }

  const goNext = () => {
    const err = validate(step);
    if (err) { setValidationErr(err); return; }
    setValidationErr(null);
    setStep((s) => Math.min(s + 1, 6));
  };

  const goBack = () => {
    setValidationErr(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const generate = async (overwrite: boolean) => {
    setGenerating(true);
    try {
      const res = await fetch("/api/setup/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, overwrite }),
      });
      const data: SetupGenerateResult = await res.json();
      setResult(data);
    } finally {
      setGenerating(false);
    }
  };

  const { title, desc } = t.setup.stepTitles[step - 1];

  return (
    <div className="min-h-full p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Wand2 size={20} className="text-vf-accent" strokeWidth={1.5} />
        <h1 className="text-xl font-bold text-vf-ink">{t.setup.title}</h1>
      </div>

      {status && !status.setupNeeded && !result && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-vf-warn/10 border border-vf-warn/20 mb-6">
          <AlertTriangle size={16} className="text-vf-warn shrink-0 mt-0.5" />
          <p className="text-xs text-vf-muted">{t.setup.existingWarning}</p>
        </div>
      )}

      <StepBar current={step} />

      <div className="mb-6">
        <h2 className="text-base font-semibold text-vf-ink mb-1">{title}</h2>
        <p className="text-sm text-vf-muted">{desc}</p>
      </div>

      <div className="mb-6">
        {step === 1 && <StepBasics answers={answers} setAnswers={setAnswers} />}
        {step === 2 && <StepStack answers={answers} setAnswers={setAnswers} />}
        {step === 3 && <StepTesting answers={answers} setAnswers={setAnswers} />}
        {step === 4 && <StepDeployment answers={answers} setAnswers={setAnswers} />}
        {step === 5 && <StepTools answers={answers} setAnswers={setAnswers} />}
        {step === 6 && (
          <StepPreview
            answers={answers}
            onGenerate={generate}
            generating={generating}
            result={result}
          />
        )}
      </div>

      {validationErr && (
        <p className="text-xs text-vf-danger mb-4 flex items-center gap-1.5">
          <AlertTriangle size={12} />
          {validationErr}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={step === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-vf-border text-sm font-medium text-vf-muted hover:text-vf-text hover:border-vf-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
          {t.common.back}
        </button>

        {result ? (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-vf-accent text-white text-sm font-semibold hover:bg-vf-accent/90 transition-colors"
          >
            <FolderOpen size={14} />
            {t.setup.openProject}
          </button>
        ) : step < 6 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-vf-accent text-white text-sm font-semibold hover:bg-vf-accent/90 transition-colors"
          >
            {t.common.next}
            <ChevronRight size={14} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
