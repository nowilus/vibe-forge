export interface DocFreshness {
  file: string;
  exists: boolean;
  lastModified: string | null;
  badge: { label: string; status: "fresh" | "stale" | "old" | "missing" };
}

export interface ChangelogEntry {
  date: string;
  text: string;
}

export interface LessonEntry {
  title: string;
  body: string;
}

export interface ProjectData {
  name: string;
  stack: string;
  tddTier: string;
  freshness: DocFreshness[];
  recentChanges: ChangelogEntry[];
  recentLessons: LessonEntry[];
  hasProjectMap: boolean;
  hasState: boolean;
}

export interface DocFile {
  file: string;
  content: string;
  lastModified: string;
}

export interface DocListItem {
  file: string;
  exists: boolean;
  lastModified: string | null;
}

// Health

export type CheckStatus = "pass" | "warn" | "fail" | "skip";
export type Severity = "high" | "medium" | "low";

export interface HealthCheck {
  id: string;
  name: string;
  status: CheckStatus;
  message: string;
  msgKey?: string;
  msgParams?: Record<string, string | number>;
  details: string[];
  severity: Severity;
  durationMs: number;
}

export interface HealthHistoryEntry {
  runAt: string;
  score: number;
}

export interface HealthData {
  score: number;
  checks: HealthCheck[];
  runAt: string;
  history: HealthHistoryEntry[];
}

// Prompts

export interface PromptFile {
  filename: string;
  title: string;
  status: "draft" | "executed" | "in-progress" | string;
  excerpt: string;
  content: string;
  lastModified: string | null;
}

export interface PromptsData {
  prompts: PromptFile[];
}

// Setup Wizard

export type TddTier = "none" | "basic" | "full";
export type HooksScope = "project" | "global" | "both" | "skip";
export type WizardLanguage = "English" | "Polish";

export interface WizardAnswers {
  projectName: string;
  description: string;
  language: WizardLanguage;
  audience: string;
  stack: string;
  tddTier: TddTier;
  deployment: string;
  tools: string[];
  hooksScope: HooksScope;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface SetupStatus {
  setupNeeded: boolean;
  stateExists: boolean;
  projectMapExists: boolean;
}

export interface SetupPreviewResult {
  files: GeneratedFile[];
}

export interface SetupGenerateResult {
  created: string[];
  skipped: string[];
  errors: string[];
}

// Hooks

export interface HookEvent {
  hook: string;
  timestamp: string;
  tool?: string;
  outcome?: string;
}

export interface HookStatus {
  name: string;
  defined: boolean;
  command: string | null;
  recentEvents: HookEvent[];
}

export interface HooksData {
  hooks: HookStatus[];
  totalDefined: number;
  totalKnown: number;
  recentEvents: HookEvent[];
  settingsFound: boolean;
}
