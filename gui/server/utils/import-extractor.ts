import fs from "node:fs/promises";
import path from "node:path";
import type { WizardAnswers } from "./setup-templates.js";

export type Confidence = "high" | "medium" | "low" | "default";

export interface ImportStatus {
  exists: boolean;
  files: string[];
}

export interface ExtractionResult {
  answers: WizardAnswers;
  confidence: Record<keyof WizardAnswers, Confidence>;
  filesRead: string[];
}

const STACK_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /next\.js|nextjs/i, value: "Next.js" },
  { pattern: /react\s*\+\s*node/i, value: "React + Node.js" },
  { pattern: /vue\s*\+\s*node/i, value: "Vue + Node.js" },
  { pattern: /fastapi|python.*api/i, value: "Python / FastAPI" },
  { pattern: /sveltekit/i, value: "SvelteKit" },
  { pattern: /laravel/i, value: "Laravel" },
  { pattern: /\bgo\b.*(?:gin|echo|fiber)|golang/i, value: "Go" },
  { pattern: /\breact\b/i, value: "React + Node.js" },
  { pattern: /\bvue\b/i, value: "Vue + Node.js" },
  { pattern: /\bsvelte\b/i, value: "SvelteKit" },
];

const DEPLOYMENT_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /vercel/i, value: "Vercel" },
  { pattern: /fly\.io|flyio/i, value: "Fly.io" },
  { pattern: /railway/i, value: "Railway" },
  { pattern: /\baws\b|amazon web services/i, value: "AWS" },
  { pattern: /supabase/i, value: "Supabase" },
  { pattern: /self.?host/i, value: "Self-hosted" },
];

const TOOL_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /claude.?code/i, value: "claude-code" },
  { pattern: /\bcursor\b/i, value: "cursor" },
  { pattern: /\bcodex\b/i, value: "codex" },
  { pattern: /windsurf/i, value: "windsurf" },
  { pattern: /github copilot|copilot/i, value: "copilot" },
  { pattern: /lovable/i, value: "lovable" },
];

const POLISH_MARKERS = [
  /\bprojekt\b/i,
  /\baplikacja\b/i,
  /\bużytkownik/i,
  /\bwdrożenie\b/i,
  /\btechnologia\b/i,
  /\barchitektura\b/i,
  /\bfunkcja\b/i,
  /\bsystem\b/i,
];

function detectLanguage(text: string): "English" | "Polish" {
  const matches = POLISH_MARKERS.filter((p) => p.test(text)).length;
  return matches >= 3 ? "Polish" : "English";
}

function extractProjectName(text: string): { value: string; confidence: Confidence } {
  const h1 = text.match(/^#\s+(.+)$/m);
  if (h1) return { value: h1[1].trim(), confidence: "high" };

  const nameLabel = text.match(/(?:project name|project:|name:)\s*(.+)/i);
  if (nameLabel) return { value: nameLabel[1].trim(), confidence: "medium" };

  return { value: "", confidence: "default" };
}

function extractDescription(text: string): { value: string; confidence: Confidence } {
  const afterH1 = text.match(/^#\s+.+\n+([^#\n].{20,})/m);
  if (afterH1) return { value: afterH1[1].trim().split("\n")[0], confidence: "high" };

  const descSection = text.match(
    /(?:description|overview|about|what is)[\s:*]+([^\n#]{20,})/i
  );
  if (descSection) return { value: descSection[1].trim(), confidence: "medium" };

  return { value: "", confidence: "default" };
}

function extractAudience(text: string): { value: string; confidence: Confidence } {
  const audienceSection = text.match(
    /(?:target audience|audience|użytkownicy|for whom|who is this for|docelowi)[\s:*]+([^\n#]{10,})/i
  );
  if (audienceSection) return { value: audienceSection[1].trim(), confidence: "high" };

  const persona = text.match(/(?:persona|users?|klienci)[\s:]+([^\n#]{10,})/i);
  if (persona) return { value: persona[1].trim(), confidence: "medium" };

  return { value: "", confidence: "default" };
}

function extractStack(text: string): { value: string; confidence: Confidence } {
  const stackSection = text.match(
    /(?:tech stack|stack|technologie|technology|built with)[\s:*#]+([^\n]{5,})/i
  );
  if (stackSection) {
    const chunk = stackSection[1];
    for (const { pattern, value } of STACK_PATTERNS) {
      if (pattern.test(chunk)) return { value, confidence: "high" };
    }
  }

  for (const { pattern, value } of STACK_PATTERNS) {
    if (pattern.test(text)) return { value, confidence: "medium" };
  }

  return { value: "", confidence: "default" };
}

function extractDeployment(text: string): { value: string; confidence: Confidence } {
  const deploySection = text.match(
    /(?:deployment|deploy|hosting|wdrożenie|hosted on)[\s:*#]+([^\n]{3,})/i
  );
  if (deploySection) {
    const chunk = deploySection[1];
    for (const { pattern, value } of DEPLOYMENT_PATTERNS) {
      if (pattern.test(chunk)) return { value, confidence: "high" };
    }
  }

  for (const { pattern, value } of DEPLOYMENT_PATTERNS) {
    if (pattern.test(text)) return { value, confidence: "medium" };
  }

  return { value: "Vercel", confidence: "default" };
}

function extractTddTier(text: string): {
  value: "none" | "basic" | "full";
  confidence: Confidence;
} {
  if (/no tests|without tests|skip tests|bez testów/i.test(text))
    return { value: "none", confidence: "medium" };
  if (/full tdd|red.*green.*refactor|failing test first|coverage.*80|80.*coverage/i.test(text))
    return { value: "full", confidence: "high" };
  if (/\btdd\b|unit test|test coverage|testing/i.test(text))
    return { value: "basic", confidence: "medium" };
  return { value: "basic", confidence: "default" };
}

function extractTools(text: string): { value: string[]; confidence: Confidence } {
  const found: string[] = [];
  for (const { pattern, value } of TOOL_PATTERNS) {
    if (pattern.test(text)) found.push(value);
  }
  if (found.length > 0) return { value: found, confidence: "medium" };
  return { value: ["claude-code"], confidence: "default" };
}

export async function getImportStatus(importDir: string): Promise<ImportStatus> {
  try {
    const entries = await fs.readdir(importDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name !== "README.md" && !e.name.startsWith("."))
      .map((e) => e.name);
    return { exists: true, files };
  } catch {
    return { exists: false, files: [] };
  }
}

export async function extractFromImportDir(importDir: string): Promise<ExtractionResult> {
  const status = await getImportStatus(importDir);
  const filesRead: string[] = [];
  let combinedText = "";

  for (const filename of status.files) {
    const ext = path.extname(filename).toLowerCase();
    if ([".md", ".txt"].includes(ext)) {
      try {
        const content = await fs.readFile(path.join(importDir, filename), "utf-8");
        combinedText += `\n\n=== ${filename} ===\n\n${content}`;
        filesRead.push(filename);
      } catch {
        // skip unreadable
      }
    }
  }

  const nameResult = extractProjectName(combinedText);
  const descResult = extractDescription(combinedText);
  const audienceResult = extractAudience(combinedText);
  const stackResult = extractStack(combinedText);
  const deployResult = extractDeployment(combinedText);
  const tddResult = extractTddTier(combinedText);
  const toolsResult = extractTools(combinedText);

  const answers: WizardAnswers = {
    projectName: nameResult.value,
    description: descResult.value,
    language: detectLanguage(combinedText),
    audience: audienceResult.value,
    stack: stackResult.value,
    tddTier: tddResult.value,
    deployment: deployResult.value,
    tools: toolsResult.value,
    hooksScope: "project",
  };

  const confidence: Record<keyof WizardAnswers, Confidence> = {
    projectName: nameResult.confidence,
    description: descResult.confidence,
    language: combinedText.length > 100 ? "medium" : "default",
    audience: audienceResult.confidence,
    stack: stackResult.confidence,
    tddTier: tddResult.confidence,
    deployment: deployResult.confidence,
    tools: toolsResult.confidence,
    hooksScope: "default",
  };

  return { answers, confidence, filesRead };
}
