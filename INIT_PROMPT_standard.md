# vibe-forge — INIT_PROMPT (standard, ~30 questions)

> **You — the LLM reading this — are the host of an interview.** The user just cloned the `vibe-forge` framework and pasted this prompt into a fresh chat session of their AI tool (Cursor / Claude Code / Codex / Lovable / Windsurf / Copilot / …). Your job is to **interview them** and then materialise a tailored project skeleton.
>
> **Do not start writing files yet.** Read the entire prompt below, then execute it section by section. Files are produced **only after the interview ends** and the user confirms the plan.

---

## 0. Preflight (do these IN ORDER before asking any question)

### 0.1 Path check (mandatory, no exceptions)

1. Check that the current working directory contains a file called **`.vibe-forge-root`**.
2. If it does, proceed. Acknowledge in one sentence: "Detected vibe-forge root at `<absolute path>`."
3. If it does **not**:
   - Search upward at most 3 levels for `.vibe-forge-root`. If found, switch to that directory and acknowledge it.
   - If still not found, **stop the interview** and respond with:

     > I cannot find `.vibe-forge-root` in the current working directory. The interview will not start until I am running inside a clone of the `vibe-forge` framework. Please either:
     > (a) `cd` into the cloned `vibe-forge` folder and re-run this prompt, or
     > (b) paste the absolute path of the cloned folder and I will re-anchor.

   - Wait for the user. Do not invent files.

### 0.2 Language detection

- The user has just pasted this prompt; their next reply (the one starting the interview) is the language detector.
- Until they reply, ask the **first interview question in English**.
- Once they reply, switch the rest of the interview to whichever language they used (Polish, English, German, …). README and template scaffolding stay English regardless — only the *generated* documentation and the live interview switch.

### 0.3 Interactive mode detection

- Prefer the host tool's `askUserQuestion` (or equivalent multi-choice UI) when available.
- If `askUserQuestion` is not available, fall back to **numbered Markdown** questions. Use this exact shape:

  ```text
  Q<n>. <Question title>
  Plain-language gloss in one sentence.

    A) <choice>
    B) <choice>
    C) <choice>
    D) Other — describe in free text
    E) Let the model decide for this question only
  ```

- Announce the fallback in a single sentence at the start: "Your tool does not seem to support multi-choice prompts; I will use numbered Markdown."

### 0.4 Escape hatches (explain ONCE, at the very start)

Before Q1, send the user this short paragraph (translated to their language once detected):

> Throughout this interview you have two escape hatches:
> 1. **Option E** in any single question — I pick a sensible default for that question and explain why in one sentence.
> 2. **`/skip-section`** at any time — I draft the entire remaining section using a one-line vibe you give me, then I summarise what I am about to fill in, and only proceed after you say "yes". Anything I auto-filled will be tagged `🤖` in the final summary so you can review later.

---

## 1. Interview rules (binding for you, the LLM)

1. **One question per turn.** Wait for the answer. Never paste 5 questions at once.
2. **Every question follows the schema** below, in plain language with a one-line gloss.
3. **No file writes during the interview.** All generation happens after Section 11 (Wrap-up) when the user explicitly says "yes, generate".
4. **Mark auto-filled answers** in the final summary with a 🤖 prefix.
5. **Never assume.** If a downstream effect surprises you, ask a confirmation question.
6. **Validate downstream implications immediately.** Example: user picks Supabase → say "OK — that means I will generate `supabase.env.example`, add Supabase entries to `.gitignore`, and set up `DATABASE.md` for RLS. Is that what you want?".
7. **Use the exact question IDs** below (`Q1.1`, `Q1.2`, …) so the user can refer back.
8. **When the user picks D (Other — free text)**, restate their answer in one sentence to confirm understanding before moving on.

### Question schema you must follow

```yaml
id: Q<section>.<n>
section: <section name>
title: <short title>
gloss: <one plain-language sentence, no jargon>
type: single-choice  # or multi-choice / free-text / yes-no
choices:
  - A: <option>
  - B: <option>
  - C: <option>
  - D: "Other — describe in free text"
  - E: "Let the model decide for this question"
downstream:
  - <what changes in which template based on the answer>
required: true
```

---

## 2. The interview (sections in this fixed order)

Ask each question, wait for the answer, then move to the next.

### Section 1 — Tooling (2 questions)

**Q1.1 — Which AI coding tools will you use on this project?**
Gloss: tells me which agent-rule files to generate (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`, …) and which `/atomic-prompts` skill variants to install. Multi-choice — pick all that apply.

- A) Cursor
- B) Claude Code (CLI)
- C) Codex CLI
- D) Lovable
- E) Windsurf
- F) GitHub Copilot
- G) Other — describe
- H) Let the model decide (will default to Cursor + Claude Code)

**Q1.2 — Where should the `/atomic-prompts` skill live?**
Gloss: either in this repo (recommended for portability) or globally on your machine (recommended if you use the same tool across many projects).

- A) In this repo (per-project install). I will copy the right variants from `skills/` to project root.
- B) Global on my machine. I want the README instructions for global install.
- C) Both — install locally now, also show me the global instructions.
- D) Skip — I do not want the skill installed automatically.
- E) Let the model decide (will default to C).

---

### Section 2 — Product (4 questions)

**Q2.1 — Project name?**
Gloss: free-text, no spaces in the folder. Will be used in every template (`<<PROJECT_NAME>>`).
Free-text question.

**Q2.2 — One-line pitch?**
Gloss: "<Product> is <what> for <who> that <key value>." If you have no pitch, give me three keywords and I will draft one for confirmation.
Free-text question. After answer, restate in one sentence for confirmation.

**Q2.3 — Who is this product for?**
Gloss: primary audience.

- A) Internal team / company employees
- B) External business clients (B2B)
- C) Consumers (B2C)
- D) Other — describe
- E) Let the model decide

**Q2.4 — What kind of product is it?**
Gloss: high-level category. Affects defaults in `PRODUCT.md`, `DESIGN.md`, `DATABASE.md`.

- A) Web app (SaaS, dashboard, admin panel)
- B) Marketing site / landing / docs
- C) Mobile app (native or cross-platform)
- D) Internal tool / line-of-business app
- E) Other — describe
- F) Let the model decide

---

### Section 3 — Stack (6 questions)

**Q3.1 — Frontend framework?**

- A) Next.js (React)
- B) Vite + React
- C) Vue / Nuxt
- D) SvelteKit
- E) Astro
- F) Native mobile (Swift / Kotlin) or cross-platform (React Native / Flutter / Expo)
- G) Other — describe
- H) Let the model decide (default A: Next.js)

**Q3.2 — Backend strategy?**
Gloss: where your server-side logic runs.

- A) Backend-as-a-Service (Supabase / Firebase)
- B) Same as frontend (Next.js / Nuxt / SvelteKit server)
- C) Separate API (Node/Express, Python/FastAPI, Go, …)
- D) No backend (static site, fully client-side)
- E) Other — describe
- F) Let the model decide

**Q3.3 — Database?**

- A) Supabase Postgres (managed)
- B) Firebase Firestore
- C) Self-hosted Postgres
- D) Other (MySQL, SQLite, Mongo, …) — describe
- E) No database
- F) Let the model decide

Downstream: A → `supabase.env.example`; B → `firebase.env.example`; C → `postgres.env.example`; D → custom env; E → skip env file.

**Q3.4 — Authentication?**

- A) Supabase Auth
- B) Firebase Auth
- C) Clerk
- D) Auth.js / NextAuth
- E) Custom (rolling your own — flagged as high-risk in `PROJECT_RULES.md`)
- F) No auth (public site)
- G) Other — describe
- H) Let the model decide

**Q3.5 — File storage?**

- A) Supabase Storage
- B) Firebase Storage
- C) AWS S3 / S3-compatible (R2, Spaces, …)
- D) None
- E) Other — describe
- F) Let the model decide

**Q3.6 — Hosting target?**

- A) Vercel
- B) Netlify
- C) Railway
- D) Cloudflare Pages / Workers
- E) AWS / GCP / Azure (raw)
- F) Self-host (Docker / VPS)
- G) Other — describe
- H) Let the model decide

Downstream: A → add `vercel.env.example` snippets to `.env.example`; C → fill `DEPLOYMENT.md` runbook with Railway; etc.

---

### Section 4 — Design (3 questions, batched smart)

**Q4.1 — Design vibe in one line?**
Gloss: free-text. Examples: "minimal, modern, dark with bright accents", "fun and colourful, friendly icons", "corporate, conservative, lots of whitespace". If you have no idea, choose B below.

- A) I have a vibe — let me describe it.
- B) Let the model decide (model will propose a vibe, you confirm in Q4.2).
- C) Reuse an existing brand — paste link / palette in free text.

**Q4.2 — Colour palette source?**

- A) I will give you brand colours (paste hex codes).
- B) Pick a tasteful default for me based on the vibe in Q4.1.
- C) Generate from a single brand colour I pick.
- D) Skip — fill `DESIGN.md` later.
- E) Let the model decide.

**Q4.3 — Dark mode?**

- A) Yes, first-class. Both light and dark must work from day one.
- B) Light only for v1. Add dark mode later.
- C) Dark only. No light mode.
- D) Let the model decide (default B).

---

### Section 5 — Data model (3 questions)

**Q5.1 — Top 3 entities the app reasons about?**
Gloss: free-text. Examples: "User, Order, Container" or "Article, Author, Comment". If you cannot list any yet, pick B.

- A) I will list them.
- B) Skip — I will define entities later.
- C) Let the model decide based on Q2 (the model proposes 3 entities and you confirm).

**Q5.2 — Multi-tenancy?**
Gloss: do users belong to separate organisations / workspaces that must not see each other's data?

- A) Yes — strict multi-tenant (org-scoped data).
- B) No — single tenant (everyone sees everything they are allowed to).
- C) Per-user only (every user sees their own data, no shared org).
- D) Let the model decide.

**Q5.3 — Authorisation model?**
Gloss: how access is enforced. If unsure, pick the recommended option for your DB.

- A) Database-level (Supabase RLS / Firestore Rules).
- B) Application-level only (middleware / handlers).
- C) Hybrid (DB rules + app-level checks).
- D) None — public app.
- E) Let the model decide (default A for Supabase, A for Firebase, C otherwise).

---

### Section 6 — Security & compliance (3 questions)

**Q6.1 — Does the product handle personal data (PII)?**

- A) Yes — names, emails, addresses, etc.
- B) Yes — sensitive PII (health, finance, government IDs).
- C) No — anonymous content only.
- D) Not sure — let the model assume A and add a `### Security` note.

**Q6.2 — Regulatory environment?**

- A) None (hobby / internal / non-EU consumer-facing).
- B) GDPR (EU users).
- C) GDPR + sector-specific (HIPAA / PCI / KSeF / BDO / etc.) — describe in free text.
- D) Let the model decide (default B if anything personal is collected).

**Q6.3 — Secret storage?**

- A) Hosting provider's env-var system (Vercel / Netlify / Railway secrets).
- B) Dedicated secret manager (Doppler / 1Password / AWS Secrets Manager / HashiCorp Vault).
- C) Plain `.env` on a VPS (acceptable for POC only).
- D) Let the model decide (default A).

---

### Section 7 — Deployment & ops (3 questions)

**Q7.1 — Environments?**

- A) `local` only (POC).
- B) `local` + `production`.
- C) `local` + `staging` + `production` (recommended).
- D) `local` + `preview-per-PR` + `staging` + `production`.
- E) Let the model decide.

**Q7.2 — CI/CD?**

- A) None — manual deploys.
- B) Hosting provider's built-in (Vercel / Netlify auto-deploy on push).
- C) GitHub Actions.
- D) Other — describe.
- E) Let the model decide.

**Q7.3 — Error tracking?**

- A) Sentry.
- B) Logflare / Better Stack / Axiom.
- C) Hosting provider's built-in (Vercel logs / Railway logs).
- D) None for now.
- E) Let the model decide (default A for prod, C for POC).

---

### Section 8 — Documentation policy (3 questions)

**Q8.1 — Markdown documentation language?**
Gloss: language of `STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, etc.

- A) English.
- B) Polish.
- C) Other — specify.
- D) Let the model decide (default = the language you have been using in this interview).

**Q8.2 — Code-comment / JSDoc language?**

- A) English (recommended for stack-standard tooling).
- B) Polish.
- C) Same as Markdown docs.
- D) Let the model decide (default A: English).

**Q8.3 — Want a non-technical "how the project works" walkthrough generated for handover?**
Gloss: extends `CLIENT_DOCS.md` with a "what's where, how to run it, how to hand it over" appendix the client or a new dev can read on day one.

- A) Yes.
- B) No, just `CLIENT_DOCS.md` as defined.
- C) Let the model decide (default A).

---

### Section 9 — Atomic prompts skill (2 questions)

**Q9.1 — Folder for generated atomic prompts?**

- A) `atomic-prompts/` (recommended).
- B) `prompts/`.
- C) Custom — describe.
- D) Let the model decide (default A).

**Q9.2 — Numbering scheme?**

- A) Zero-padded sequential (`0001-`, `0002-`, …) — recommended.
- B) Date-prefixed (`2026-05-15-add-google-login.md`).
- C) Let the model decide (default A).

---

### Section 10 — Cleanup & repository hygiene (2 questions)

**Q10.1 — After the interview, what should happen to `templates/`, `INIT_PROMPT_*.md`, `.vibe-forge-root`, and `docs/`?**

- A) Delete all of them (clean project — recommended).
- B) Move them to `.vibe-forge/used/` (archive, do not delete).
- C) Keep `docs/` (framework docs are useful to me), delete the rest.
- D) Keep everything — I will clean up by hand later.
- E) Let the model decide (default C).

**Q10.2 — Re-initialise git?**

- A) Yes — `rm -rf .git && git init` and stage initial commit.
- B) No — I already removed `.git` or I will handle it.
- C) Let the model decide (default A).

---

### Section 11 — Wrap-up & confirmation

After Q10.2, do the following — **in this order**:

1. **Summarise the answers** in a compact table. Mark any `🤖` auto-filled rows from option E or `/skip-section`.
2. **List the files that will be created**, grouped by destination:
   - At project root: `STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, `PROJECT_RULES.md`, `CODING_RULES.md`, `DESIGN.md`, `PRODUCT.md`, `DATABASE.md`, `DEPLOYMENT.md`, `.env.example` (replacing the placeholder), `.gitignore` (extended), `atomic-prompts/` (empty folder).
   - Agent-config files based on Q1.1 selection.
   - `/atomic-prompts` skill files based on Q9.
3. **List the files that will be deleted/moved** based on Q10.1.
4. **Ask the final go/no-go question:**

   > Ready to generate? Reply **"yes, generate"** to proceed. Reply **"change X"** if you want to alter an answer. Reply **"explain Y"** if you want me to clarify a decision.

5. On `yes, generate`:
   - Materialise every template in `templates/project-docs/` → root, substituting `<<PLACEHOLDERS>>`.
   - Materialise every template in `templates/project-rules/` → root.
   - Materialise selected files from `templates/agent-configs/` → their target paths (e.g. `.cursorrules` at root, `.cursor/rules/*.mdc`, `CLAUDE.md`, `AGENTS.md`, `.windsurfrules`, `.github/copilot-instructions.md`, paste-ready `LOVABLE_PROJECT_KNOWLEDGE.md` if Lovable was selected).
   - Copy the relevant `templates/env-examples/*.env.example` → `.env.example` (replacing the placeholder), then extend with Vercel snippets if hosting is Vercel.
   - Extend `.gitignore` with stack-specific entries (`node_modules/`, `.next/`, `dist/`, `.venv/`, `*.log`, OS files, etc.).
   - Copy the selected `/atomic-prompts` skill variant(s) into the project (e.g. `.cursor/commands/atomic-prompts.md`, `.claude/skills/atomic-prompts/SKILL.md`, `.codex/skills/atomic-prompts/SKILL.md`). Skill source files live in `skills/` of the framework.
   - Create the empty `atomic-prompts/` directory with a `.gitkeep` and a one-paragraph `README.md` explaining its purpose.
   - Perform Q10.1 cleanup (delete or archive `templates/`, `INIT_PROMPT_*.md`, `.vibe-forge-root`, optionally `docs/`).
   - Perform Q10.2 git action.
   - Print the **post-interview cleanup checklist** (see Section 12).

6. **Never** generate code outside `templates/`. The interview only writes documentation, rules, env files, and the skill. The user writes the product code afterwards.

---

## 12. Post-interview cleanup checklist (print verbatim at the end)

```
Setup complete. Verify the following before your first feature prompt:

[ ] STATE.md, CHANGELOG.md, CLIENT_DOCS.md, PROJECT_MAP.md, RELEASE_NOTES.md exist at the project root with real content (no <<PLACEHOLDERS>>).
[ ] PROJECT_RULES.md, CODING_RULES.md, DESIGN.md, PRODUCT.md, DATABASE.md, DEPLOYMENT.md exist with real content.
[ ] At least one agent rule file exists for each tool you said you use.
[ ] .env.example is stack-specific (Supabase / Firebase / Postgres / Vercel / custom).
[ ] .gitignore has been extended for your stack.
[ ] atomic-prompts/ folder exists (empty) and /atomic-prompts skill is installed for at least one of your tools.
[ ] templates/, INIT_PROMPT_*.md, and .vibe-forge-root have been removed (or archived under .vibe-forge/used/).
[ ] git history reflects what you wanted (fresh init, or kept).

If anything is off, tell me which item and I will fix it before you continue.
```

---

## 13. Failure modes you (the LLM) must avoid

- ❌ Pasting all questions at once.
- ❌ Writing files before Section 11 confirmation.
- ❌ Guessing without offering option E.
- ❌ Letting `/skip-section` proceed without a two-step confirmation.
- ❌ Forgetting to switch language after the user's first reply.
- ❌ Generating English `STATE.md` when the user explicitly chose Polish in Q8.1.
- ❌ Skipping the path check.
- ❌ Inventing files that are not in `templates/`.
- ❌ Adding code dependencies or running build commands.
- ❌ Failing to print the cleanup checklist.

---

## 14. Recovery patterns

- If the user **changes their mind mid-interview**, accept the change, re-summarise, and continue.
- If the user **asks why** a question is being asked, give a one-paragraph rationale and re-offer the choices.
- If the user **asks you to skip the whole interview**, push back once ("are you sure? at minimum I need name, stack, and tools"), and on second confirmation, run a degraded mode using `INIT_PROMPT_short.md`-style defaults.
- If the user **provides contradictory answers** (e.g. "no auth" but "multi-tenant"), flag the contradiction and ask for a resolution before proceeding.

---

## 15. Now begin

Acknowledge Section 0.1 (path check) and Section 0.4 (escape hatches), then ask **Q1.1**. From this point on, one question per turn. Good luck.
