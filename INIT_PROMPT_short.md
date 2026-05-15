# vibe-forge — INIT_PROMPT (short, ~10 questions)

> Use this prompt for weekend hacks, throwaway POCs, or experiments where you want a sane skeleton fast and you trust the model to fill the rest.
>
> The rules and lifecycle are identical to `INIT_PROMPT_standard.md`. The **only** difference is the question set: ~10 questions instead of ~30. Everything not asked here is auto-filled with the model's defaults, marked `🤖` in the final summary.

---

## 0. Preflight (identical to standard)

- **0.1 Path check:** verify `.vibe-forge-root` exists in cwd; if not, search up 3 levels; otherwise stop and ask the user to re-anchor.
- **0.2 Language detection:** match the user's first reply.
- **0.3 Mode:** prefer `askUserQuestion`, fall back to numbered Markdown (announce the fallback in one sentence).
- **0.4 Escape hatches:** Option E per question, `/skip-section` per section (with two-step confirmation). Explain ONCE before Q1.

## 1. Interview rules (identical to standard)

One question per turn. No file writes until Section 3 confirmation. Mark auto-filled answers with 🤖.

## 2. The ten questions

### Q1 — Project name?
Free-text. Becomes `<<PROJECT_NAME>>` everywhere.

### Q2 — One-line pitch?
Free-text. If empty, model drafts one from Q3 and asks for confirmation.

### Q3 — Audience + product type, combined.
- A) Internal web app / SaaS dashboard
- B) Public marketing site / landing
- C) Consumer web app
- D) Mobile app
- E) Other — describe
- F) Let the model decide

### Q4 — Which AI tools will you use? (multi-choice)
- A) Cursor, B) Claude Code, C) Codex, D) Lovable, E) Windsurf, F) Copilot, G) Other, H) Let the model decide (default A+B).

### Q5 — Stack preset?
- A) Next.js + Supabase (Postgres + Auth + Storage) on Vercel — recommended default.
- B) Next.js + Firebase on Vercel.
- C) SvelteKit + Postgres on Railway.
- D) Astro + no backend (static).
- E) Other — describe.
- F) Let the model decide (default A).

### Q6 — Design vibe in one line?
Free-text ("minimal, modern, dark with bright accents" / "fun and colourful" / …). If empty, model proposes a vibe and asks for confirmation.

### Q7 — PII / regulatory?
- A) No personal data.
- B) Personal data (GDPR applies).
- C) Sensitive PII / regulated industry — describe.
- D) Let the model decide (default B).

### Q8 — Documentation language?
- A) English.
- B) Polish.
- C) Other — specify.
- D) Let the model decide (default = interview language).

### Q9 — Cleanup after interview?
- A) Delete `templates/`, `INIT_PROMPT_*.md`, `.vibe-forge-root`. Keep `docs/`.
- B) Archive everything under `.vibe-forge/used/`.
- C) Delete everything including `docs/`.
- D) Let the model decide (default A).

### Q10 — Re-init git?
- A) Yes — `rm -rf .git && git init`.
- B) No.
- C) Let the model decide (default A).

## 3. Wrap-up & generation

After Q10:

1. Summarise answers in a compact table (mark 🤖 rows).
2. List files that will be created (same superset as standard, just with more defaults auto-applied).
3. Ask: **"Ready to generate? Reply 'yes, generate'."**
4. On confirmation, materialise templates exactly like `INIT_PROMPT_standard.md` Section 11 instructs. Print the post-interview cleanup checklist.

## 4. Defaults applied when not asked

Because we skipped sections (multi-tenancy, auth specifics, deployment specifics, error tracking, dark mode, atomic-prompts folder, numbering, etc.), apply these defaults and mark them 🤖:

- Multi-tenancy: per-user only.
- Authorisation: DB-level (Supabase RLS) if Q5 = A; app-level otherwise.
- Auth strategy: provider matching Q5 (Supabase Auth / Firebase Auth / Auth.js).
- Storage: provider matching Q5.
- Dark mode: light only for v1.
- Error tracking: hosting provider's built-in.
- Environments: `local` + `production`.
- CI/CD: hosting provider's built-in.
- Atomic-prompts folder: `atomic-prompts/`, zero-padded sequential.
- Code-comment language: English.
- Markdown docs language: from Q8.
- Generate handover walkthrough: yes.

These defaults must be enumerated in the final summary table so the user can spot anything they want to change before generation.

## 5. Failure modes (same list as standard)

See `INIT_PROMPT_standard.md` Section 13. The short variant inherits all of them.

## 6. Now begin

Acknowledge the path check and the escape-hatch explanation, then ask **Q1**. One question per turn.
