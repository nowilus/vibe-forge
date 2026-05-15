# Interview philosophy

This document explains *how* the `INIT_PROMPT_*.md` interview is designed — the rules every prompt author must respect so the experience stays consistent across the short / standard / deep variants and across AI tools.

It is also the rulebook for anyone editing or adding new questions.

---

## 1. Principles

1. **Ask, don't assume.** If the framework does not know the answer, it asks. Defaults exist only as a fallback when the user opts out (option E or `/skip-section`).
2. **Lead the user by the hand.** The vibe-coder may not know what "RLS" or "ER diagram" mean. Every question has a one-line plain-language gloss before the choices.
3. **Never blast 30 questions at once.** Ask one question per turn. Wait for the answer. This is non-negotiable — Markdown walls of questions cause partial answers and contradictions.
4. **Multi-choice with an escape hatch.** Every question has 3 plausible canned answers plus a free-form option plus a "let the model decide" option.
5. **The model can fill blanks, but only after confirmation.** The model is allowed to make decisions for the user, but only after two-step confirmation (`/skip-section`) or on the explicit per-question opt-in (option E).
6. **Language follows the user.** First reply in Polish? Continue in Polish. First reply in English? Continue in English. README and templates stay English; *generated* docs follow the user's chosen documentation language.
7. **Validate as you go.** When the user picks a stack or tool, the prompt immediately confirms downstream implications ("you chose Supabase — that means we will generate `supabase.env.example` and add Supabase-specific entries to `.gitignore`. OK?").
8. **No silent fallbacks.** If `askUserQuestion` is not available, switch to numbered Markdown, but *announce the switch* in one sentence.
9. **No file writes during the interview.** All file generation happens at the very end, after the last question is answered. This means the user can review the plan and cancel.
10. **Path check is the first thing.** Before any question, the prompt verifies the working directory contains `.vibe-forge-root`. If it does not, the interview refuses to proceed.

---

## 2. Question taxonomy

Every question in every `INIT_PROMPT_*.md` belongs to exactly one of these sections, in this fixed order:

| #   | Section                | Examples of questions                                                        |
| --- | ---------------------- | ---------------------------------------------------------------------------- |
| 0   | Preflight              | Path check, language detection, interview depth confirmation.                |
| 1   | Tooling                | Which AI tools you use (Cursor / Claude Code / Codex / …).                   |
| 2   | Product                | Name, one-line pitch, target audience, business domain, top 3 use-cases.    |
| 3   | Stack                  | Frontend, backend, database, auth, file storage, payments, hosting.         |
| 4   | Design                 | Brand tone, palette, typography, density, motion, accessibility level.     |
| 5   | Data model             | Core entities, relationships, multi-tenancy, RLS, soft-delete policy.       |
| 6   | Security & compliance  | Auth strategy, PII handling, secrets policy, regulatory needs (GDPR, …).    |
| 7   | Deployment & ops       | Environments, CI/CD, observability, error reporting.                        |
| 8   | Documentation policy   | Language for `.md`, language for code comments, client-facing docs depth.   |
| 9   | Atomic prompts skill   | Which tools to install it into, default folder, numbering policy.           |
| 10  | Wrap-up & confirmation | Show plan; ask "shall I generate now?"; perform cleanup choices.            |

Short variant collapses 4 / 5 / 6 / 7 into single high-level questions. Deep variant adds 2-5 follow-ups inside each section.

---

## 3. Question schema

Every question — short, standard, or deep — uses this internal schema in the prompt's instructions to the LLM:

```yaml
id: Q3.2
section: Stack
title: "Which database do you want?"
gloss: "Where your structured data will live. SQL = tables and relations. NoSQL = flexible documents."
type: single-choice                # or: multi-choice / free-text / yes-no
choices:
  - A: "Supabase Postgres (managed)"
  - B: "Firebase Firestore"
  - C: "Self-hosted Postgres"
  - D: "Other — describe"
  - E: "Let the model decide for this question"
downstream:
  - if A: "generate supabase.env.example, add Supabase to .gitignore, write Supabase section in DATABASE.md"
  - if B: "generate firebase.env.example, write Firestore rules section in DATABASE.md"
  - if C: "generate postgres.env.example, write self-host runbook in DEPLOYMENT.md"
required: true
```

This schema is documented so future maintainers can add questions without breaking the interview flow.

---

## 4. The `/skip-section` meta-command

When the user types `/skip-section`, the LLM must:

1. **Acknowledge** which section is being skipped.
2. **Ask** for a one-line description of the user's intent for that section (optional — empty is fine).
3. **Generate a draft summary** of what it will fill in for every remaining question in that section.
4. **Wait for explicit "yes" confirmation.** No file writes until this confirmation lands.
5. **Mark each filled answer** in the final summary with a `🤖` (auto-filled) tag so the user can review later.

This is the *two-step confirmation* the user requested. It cannot be bypassed.

---

## 5. The "no input" fallback for design / coding rules

A vibe-coder will frequently say "I have no idea about design" or "just make the coding rules sensible". The prompt's instructions tell the LLM:

- Ask once: "Want to give me a one-line vibe instead? Something like 'minimal, modern, dark, bright accents'?"
- If yes, generate the section from that vibe, summarise, confirm.
- If no, fall through to `/skip-section` defaults.

This is the path that the user explicitly requested in the spec.

---

## 6. Detecting tools

The prompt asks the user which tools they use **before** generating anything. The answer affects:

- Which agent-config files get materialised at the project root.
- Which `/atomic-prompts` skill variants are installed.
- Which deployment hints appear in `DEPLOYMENT.md`.

Detection is **explicit, not implicit**. The prompt does not try to scan the filesystem for `.cursor/` etc.; it asks the user, with a checklist.

---

## 7. Anti-patterns to avoid when authoring prompts

- ❌ Pasting all 30 questions at once.
- ❌ Asking for a free-form spec without offering choices.
- ❌ Using jargon ("RBAC", "RLS", "OAuth flow") without a one-line gloss.
- ❌ Writing files before the interview ends.
- ❌ Saying "I'll use sensible defaults" without telling the user which defaults.
- ❌ Letting the user say "decide everything for me" without two-step confirmation.
- ❌ Forgetting to mark auto-filled answers in the final summary.

If you maintain this framework, *enforce these rules in code review*.
