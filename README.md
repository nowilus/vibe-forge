# vibe-forge

**Language / język:** [English](README.md) · [Polski](README.pl.md)

**Note:** GitHub renders `README.md` on the repository home page by default. Use the link above to open the full Polish README (`README.pl.md`).

<p align="center">
  <img src="docs/assets/readme/main.png" alt="vibe-forge main icon" width="180">
</p>

> A starter framework for **vibe-coders** — people who build real software with AI assistants (Cursor, Claude Code, Codex, Lovable, Windsurf, Copilot, …) without necessarily being career engineers.
>
> `vibe-forge` does **not** ship a stack. It ships **structure, rules, a guided interview, and a silent safety net** that bootstraps a project of any stack into a state where AI agents can work on it safely, documentation stays honest, and the code does not silently rot into the typical vibe-coded mess.

<p align="center">
  <img src="docs/assets/readme/banner-hero.png" alt="vibe-forge hero banner" width="960">
</p>

---

## Table of contents

1. [What this is (and what it is not)](#what-this-is-and-what-it-is-not)
2. [Who it is for](#who-it-is-for)
3. [The 9-step happy path](#the-9-step-happy-path)
4. [Quick start](#quick-start)
5. [The `/atomic-prompts` skill](#the-atomic-prompts-skill--read-this)
6. [Built-in safety net](#built-in-safety-net--engineering-guardrails-invisible-to-you)
7. [Repository layout](#repository-layout)
8. [Supported AI agents](#supported-ai-agents)
9. [Documentation philosophy](#documentation-philosophy)
10. [Post-interview cleanup checklist](#post-interview-cleanup-checklist)
11. [FAQ](#faq)
12. [Framework changelog](#framework-changelog)
13. [License](#license)

---

## What this is (and what it is not)

**`vibe-forge` is:**

- A **template GitHub repository** you clone once per project.
- A set of **document templates** (`STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, `LESSONS.md`, plus a master `PROJECT_RULES.md`) that survive any stack change.
- A **self-improvement loop** (`LESSONS.md`) that records every mistake and correction as a preventive rule, reviewed at the start of every agent session — so the same mistake never happens twice.
- A set of **agent-specific rule files** (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`, `.windsurfrules`, `copilot-instructions.md`, Lovable Project Knowledge) generated from a single source of truth.
- A **deeply structured initial prompt** (`INIT_PROMPT_*.md`) that runs a guided interview with you in your own language and produces a tailored project skeleton at the end.
- A **bundled `/atomic-prompts` skill** that turns a one-line idea into a high-quality, fully-contextualised prompt file you can run in any tool.
- **Seven invisible quality hooks** that run silently on every file save — catching leaked secrets, TypeScript errors, stray `console.log` calls, missing doc updates, and cookie-cutter design patterns before they ever ship.
- Two **on-demand power skills** beyond atomic-prompts: `/deploy-guide` (live-researched, always-current deployment documentation) and `/project-health` (instant 10-check project dashboard).
- A **3-tier testing policy** you choose during the interview — from zero-friction prototyping to full TDD with ≥ 80% coverage — enforced uniformly in all six agent configs.

**`vibe-forge` is NOT:**

- Not a stack. It does not prescribe React, Vue, Supabase, Firebase, Next.js, anything. The interview picks for you, or with you.
- Not a generator that runs without you. The LLM is in charge; you answer questions; the files appear.
- Not versioned in semver terms (yet). Clone `main`, that is the framework. See [Framework changelog](#framework-changelog) for the history.
- Not a replacement for thinking. It enforces structure, but it does not write your product spec for you — though it will *grill you* for one.

---

## Who it is for

You should use `vibe-forge` if **at least one** of these is true:

- You are starting a new project with AI assistance and you want it to **survive past the proof-of-concept**.
- You are not a senior engineer and you are afraid of ending up with code nobody — not even your AI — can navigate.
- You want a **client-deliverable document** (`CLIENT_DOCS.md`) ready at any point in the project.
- You are tool-agnostic or you suspect you will **switch between Cursor / Claude Code / Codex / Lovable / Windsurf / Copilot** during the project.
- You hate the moment when an AI assistant "forgets" what the project is about because there is no canonical place to look.
- You want **real engineering guardrails** — secret scanning, type checking, test coverage — without having to set them up yourself or even know they exist.

If you are an engineer who already has strong opinions and a tight stack, you can still use it — just delete what you do not need after the interview.

---

## The 9-step happy path

<p align="center">
  <img src="docs/assets/readme/guided-interview.png" alt="guided interview illustration" width="420">
</p>

This is the intended user journey end-to-end:

1. You open this repository on GitHub and read this README.
2. You skim the [docs/](docs/) folder if you want to understand the *why* behind the design.
3. You **clone** this repository to your machine and rename the folder to your project name.
4. You **open the cloned folder** in your AI tool of choice (Cursor, Claude Code, Codex, …) and copy-paste one of the `INIT_PROMPT_*.md` files into the chat. The prompt verifies it is running inside a `vibe-forge` clone (using the `.vibe-forge-root` sentinel file). If the working directory is wrong, it stops and asks you to re-point it.
5. The LLM **interviews you** — in your own language — about your stack, design, business domain, security needs, target audience, deployment, tooling, testing philosophy, etc. At any time you can answer:
   - one of the multiple-choice options the LLM offers,
   - your own free-form answer,
   - **option E ("let the model decide")** for that single question, or
   - **`/skip-section`** to let the model fill the whole remaining section with its best guesses (the prompt asks for a two-step confirmation before doing this, so you cannot trigger it by accident).
6. When the interview ends, the LLM **fills every template** in `templates/` with your answers and moves them to the project root, deletes leftover scaffolding, and writes the first entries of `CHANGELOG.md`, `STATE.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, `LESSONS.md`. It also **installs the quality hooks** into `.claude/hooks/` (project-local, global, or both — you choose during the interview) and copies the right skill files for your tools. If you asked for it, it also writes a guided "how this project works" walkthrough you can hand to a non-technical teammate.
7. You **start prompting normally** in your tool. The generated `.cursorrules` / `CLAUDE.md` / `AGENTS.md` / … all point every future agent session to `PROJECT_MAP.md` first, so context reload becomes one file, not the whole repo. The hooks run silently in the background.
8. Whenever you want a new feature or change, you can invoke the **`/atomic-prompts`** skill (see below). It turns a loose idea into a fully-contextualised prompt file in `atomic-prompts/`, which you can then execute in the same or a different tool.
9. You sleep well. Documentation is in sync, history is linear, secrets can't leak to git, the client has something to read, and the AI has something to anchor to.

---

## Quick start

```bash
# 1. Clone the framework (rename the folder to your project)
git clone https://github.com/<your-fork-or-org>/vibe-forge.git my-project
cd my-project

# 2. (Optional) Drop the vibe-forge git history so this becomes a fresh repo
rm -rf .git
git init

# 3. Open the folder in your preferred AI tool, then copy-paste ONE of:
#    - INIT_PROMPT_short.md      (~10 questions, fastest, mostly LLM defaults)
#    - INIT_PROMPT_standard.md   (~30 questions, recommended for most projects)
#    - INIT_PROMPT_deep.md       (~60+ questions, full audit-grade interview)

# 4. Answer the questions. Use option E or /skip-section whenever you
#    do not know or do not care.

# 5. When the interview ends, follow the post-interview cleanup checklist
#    printed at the bottom of the prompt's final message.
```

> **Tip:** Run the interview in a *fresh* chat session of your AI tool, with the cloned folder as the workspace root. Do not paste the prompt into a long, unrelated conversation — it relies on a clean context.

---

## The `/atomic-prompts` skill — read this

<p align="center">
  <img src="docs/assets/readme/atomic-prompts.png" alt="atomic prompts illustration" width="420">
</p>

This is one of the two reasons `vibe-forge` exists (the other being the interview).

**What it does.** You give the AI a sentence like:

> "Add Google login to the auth screen."

…and it produces a fully-formed, self-contained prompt file in `atomic-prompts/NNNN-add-google-login-to-auth-screen.md`, structured exactly like a senior engineer would write a ticket: context, acceptance criteria, files to touch, edge cases, tests, rollback notes, references to `PROJECT_MAP.md` and `STATE.md`. That file is yours forever — re-runnable, diffable, shareable, executable in a different tool tomorrow.

The skill is bundled in three flavours inside `skills/`:

- `skills/cursor/.cursor/commands/atomic-prompts.md` — Cursor slash-command.
- `skills/claude-code/.claude/skills/atomic-prompts/SKILL.md` — Claude Code skill.
- `skills/codex/.codex/skills/atomic-prompts/SKILL.md` — Codex skill.

During the interview, the prompt will ask which tools you use and **install the right variants into your project root** (and tell you how to install them globally if you prefer). After installation, any of these works:

```text
/atomic-prompts Add Google login to the auth screen
```
```text
Use the atomic-prompts skill for: "Add Google login to the auth screen"
```
```text
Run /atomic-prompts on this idea: dark-mode toggle in the settings page
```

The output structure follows the proven format used in real-world atomic prompts (see `docs/PROMPT_AUTHORING_GUIDE.md` for the full schema and examples).

---

## Built-in safety net — engineering guardrails, invisible to you

This is what separates `vibe-forge` from a simple rule-file collection. When you install it, you get a **passive quality and security layer** that works silently on every file save. No configuration needed. No engineering knowledge required. It just works.

### Seven automatic hooks (Claude Code)

Seven background scripts activate on every file operation. When everything is fine you never hear from them. When something needs attention they speak up — and they are always non-blocking by default (they warn, not crash).

| Hook | Trigger | What it protects you from |
|------|---------|---------------------------|
| **Secret scanner** | Before any file write | API keys, tokens, passwords, database URLs accidentally pasted into source code. Blocks the write if a secret pattern is detected. |
| **Config protection** | Before touching config files | Accidental edits to `.eslintrc`, `tsconfig.json`, `biome.json`, `.prettierrc`, `.editorconfig`, and other project-critical configs — warns before you break the build. |
| **TypeScript quality gate** | After any `.ts`/`.tsx` edit | Runs `tsc --noEmit` and reports the current error count, so you always know whether the project compiles. |
| **Console.log guard** | After any source file edit | Stray `console.log/warn/error/debug` calls that would flood the browser console or leak internal state to production. |
| **Doc-sync reminder** | After any source file edit | Nudges you to update `STATE.md` when code changes — so the project map never drifts. |
| **Auto-formatter** | At session end (Stop event) | Runs `biome format --write .` (or `prettier` as fallback) automatically, then does a final `tsc --noEmit` and reports. |
| **Design uniqueness guard** | After any UI file edit (`.tsx/.jsx/.html`) | Warns when Bootstrap-style class patterns (`col-md-4`, `btn btn-primary`, `jumbotron`, …) suggest a generic, cookie-cutter look rather than a unique design. |

**Windows support:** Every hook ships in both `.sh` (macOS/Linux) and `.ps1` (PowerShell/Windows) variants. The interview detects your OS and installs the right one.

**Scope you control:** During the interview you choose where hooks are installed:
- **Project-local** — only active for this project (`.claude/hooks/`)
- **Global** — apply to all your Claude Code projects (`~/.claude/hooks/`)
- **Both** — maximum protection everywhere
- **Skip** — if you prefer to manage hooks yourself

### 3-tier testing policy — your choice, enforced everywhere

You pick the testing philosophy that matches your project's stage. Your choice is recorded in all six agent configs, so every AI tool knows the rule from session one.

| Tier | What it means | Best for |
|------|--------------|----------|
| **No tests** | Move fast, no testing requirement. | Throwaway prototypes, early explorations. |
| **Basic TDD** | Every new function ships with at least one happy-path test before the feature is marked done. | Most real projects — quality without ceremony. |
| **Full TDD** | Failing test first (RED) → minimal implementation (GREEN) → refactor. Coverage ≥ 80%. Never skip RED. | Production apps, client work, anything that needs to last. |

### `/deploy-guide` — live deployment documentation, always up-to-date

Type `/deploy-guide` in Claude Code, Cursor, or Codex CLI. The agent:

1. Identifies your deployment platform (Vercel, Fly.io, Railway, AWS, Supabase, Render, …)
2. **Fetches the current official documentation live** — not training data that may be months out of date, but the actual docs right now
3. Writes a complete `DEPLOYMENT.md` covering:
   - Prerequisites and required accounts
   - Environment variables table (with descriptions and where to get each value)
   - Step-by-step staging deployment
   - Step-by-step production deployment
   - 5 platform-specific post-deploy verification checks
   - Rollback procedure
   - Cost estimate for your expected usage tier

The result is a `DEPLOYMENT.md` you can hand to a non-technical client or a new team member — always accurate, always tailored to your exact stack.

### `/project-health` — 10-check instant dashboard

Type `/project-health` any time you want a snapshot of your project's real state. You get a dashboard like this:

```
## Project health — 2025-05-16

| #  | Check                    | Status                          |
|----|--------------------------|----------------------------------|
|  1 | Secret scan              | ✅ Clean                         |
|  2 | TypeScript errors        | ✅ 0 errors                      |
|  3 | npm audit                | ⚠️  2 moderate vulnerabilities   |
|  4 | Unused deps (depcheck)   | ✅ Clean                         |
|  5 | Docs freshness           | ✅ STATE.md updated today        |
|  6 | Test coverage            | ⚠️  74% (target: 80%)            |
|  7 | Build health             | ✅ Build passes                  |
|  8 | Dead exports (ts-prune)  | ✅ 0 found                       |
|  9 | Bundle size              | ✅ 142 KB (gzip)                 |
| 10 | LESSONS.md activity      | ✅ 3 new lessons this week       |

### Action items (sorted by severity)
- ⚠️  Bring test coverage to 80% — focus on `src/auth/` (currently 42%)
- ⚠️  Update 2 npm packages with moderate vulnerabilities: `follow-redirects`, `axios`
```

Available for Claude Code, Cursor, and Codex. Zero setup — runs against your local project files.

---

## Repository layout

```text
vibe-forge/
├── README.md                        ← you are here
├── README.pl.md                     ← Polish README (full translation)
├── .vibe-forge-root                 ← sentinel; INIT_PROMPT refuses to run if missing
├── .gitignore                       ← minimal baseline; extended after interview
├── .env.example                     ← placeholder; replaced after interview
│
├── INIT_PROMPT_short.md             ← guided interview, ~10 questions
├── INIT_PROMPT_standard.md          ← guided interview, ~30 questions (recommended)
├── INIT_PROMPT_deep.md              ← guided interview, ~60+ questions
│
├── docs/                            ← framework's own documentation
│   ├── assets/
│   │   └── readme/                  ← README artwork and brand illustrations
│   ├── HOW_IT_WORKS.md
│   ├── INTERVIEW_PHILOSOPHY.md
│   ├── PROMPT_AUTHORING_GUIDE.md
│   └── FRAMEWORK_CHANGELOG.md
│
├── templates/                       ← consumed by INIT_PROMPT, deleted after
│   ├── project-docs/                ← per-project documentation templates
│   │   ├── STATE.md.template
│   │   ├── CHANGELOG.md.template
│   │   ├── CLIENT_DOCS.md.template
│   │   ├── PROJECT_MAP.md.template
│   │   ├── RELEASE_NOTES.md.template
│   │   └── LESSONS.md.template
│   ├── project-rules/               ← per-project rule templates
│   │   ├── PROJECT_RULES.md.template       ← MASTER source of truth
│   │   ├── CODING_RULES.md.template
│   │   ├── DESIGN.md.template
│   │   ├── PRODUCT.md.template
│   │   ├── DATABASE.md.template
│   │   └── DEPLOYMENT.md.template
│   ├── agent-configs/               ← tool-specific rule files (generated from PROJECT_RULES)
│   │   ├── cursor/        (.cursorrules.template, .cursor/rules/*)
│   │   ├── claude-code/   (CLAUDE.md.template)
│   │   ├── codex/         (AGENTS.md.template)
│   │   ├── windsurf/      (.windsurfrules.template)
│   │   ├── copilot/       (.github/copilot-instructions.md.template)
│   │   └── lovable/       (LOVABLE_PROJECT_KNOWLEDGE.md.template)
│   ├── hooks/                       ← quality hooks, installed during interview
│   │   ├── claude-code/
│   │   │   ├── hooks.json.template          ← hook registry (macOS/Linux)
│   │   │   └── hooks.windows.json.template  ← hook registry (Windows/PowerShell)
│   │   └── scripts/
│   │       ├── secret-scanner.sh / .ps1
│   │       ├── config-protection.sh / .ps1
│   │       ├── quality-gate.sh / .ps1
│   │       ├── console-log-warn.sh / .ps1
│   │       ├── doc-sync-reminder.sh / .ps1
│   │       ├── auto-format.sh / .ps1
│   │       └── design-quality-check.sh / .ps1
│   └── env-examples/                ← stack-specific .env.example variants
│       ├── supabase.env.example
│       ├── firebase.env.example
│       ├── postgres.env.example
│       └── vercel.env.example
│
└── skills/                          ← on-demand skills, multiple flavours
    ├── README.md                    ← installation instructions
    ├── cursor/.cursor/commands/
    │   ├── atomic-prompts.md        ← /atomic-prompts slash-command
    │   ├── deploy-guide.md          ← /deploy-guide slash-command
    │   └── project-health.md        ← /project-health slash-command
    ├── claude-code/.claude/skills/
    │   ├── atomic-prompts/SKILL.md
    │   ├── deploy-guide/SKILL.md
    │   └── project-health/SKILL.md
    └── codex/.codex/skills/
        ├── atomic-prompts/SKILL.md
        ├── deploy-guide/SKILL.md
        └── project-health/SKILL.md
```

After the interview ends:

- `templates/` is **deleted** (or archived under `.vibe-forge/used/` if you opt in).
- `INIT_PROMPT_*.md` files are **deleted** (you can recover them from this repo any time).
- `.vibe-forge-root` is **deleted**.
- `docs/` is **kept** if you want the framework documentation around; **deleted** otherwise — your choice during the interview.
- All six `templates/project-docs/*.template` files become real files at the project root.
- Hook scripts move to `.claude/hooks/` (and/or your global Claude Code config, depending on your choice).

---

## Supported AI agents

`vibe-forge` is **agent-agnostic by design**. The interview detects which tools you use and writes the appropriate rule files. Currently the framework ships first-class templates for:

| Tool           | File generated                                   | Skills installed                                                  |
| -------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| Cursor         | `.cursorrules`, `.cursor/rules/*.mdc`            | `/atomic-prompts`, `/deploy-guide`, `/project-health`             |
| Claude Code    | `CLAUDE.md`, `.claude/hooks/`, `.claude/skills/` | `/atomic-prompts`, `/deploy-guide`, `/project-health` + 7 hooks   |
| Codex CLI      | `AGENTS.md`, `.codex/skills/`                    | `/atomic-prompts`, `/deploy-guide`, `/project-health`             |
| Windsurf       | `.windsurfrules`                                 | Rules only (Windsurf has no native hook/skill system).            |
| GitHub Copilot | `.github/copilot-instructions.md`               | Rules only (for the Copilot Chat repository instructions API).    |
| Lovable        | Lovable Project Knowledge block (paste-ready)    | Rules only — generated from `PROJECT_RULES.md`.                   |

**Why are hooks Claude Code-only?** Claude Code is the only tool in this list with a first-class hook system (`PreToolUse`, `PostToolUse`, `Stop` events). All other tools receive the equivalent rules embedded in their config files — they just rely on agent compliance rather than OS-level enforcement.

If your tool is not on this list, the master `PROJECT_RULES.md` is still 95% of what you need — you can paste it into the tool's "system prompt" / "custom instructions" slot.

---

## Documentation philosophy

<p align="center">
  <img src="docs/assets/readme/documentation-discipline.png" alt="documentation discipline illustration" width="420">
</p>

`vibe-forge` enforces **six separate documentation files** at the project root, each with one job and one job only:

| File              | Audience          | Update policy                                    |
| ----------------- | ----------------- | ------------------------------------------------ |
| `STATE.md`        | LLM + dev         | **Overwritten** to reflect current truth only. No history. If a feature is removed, it disappears here. |
| `CHANGELOG.md`    | Dev + future you  | **Append-only** linear history. Every meaningful change adds one entry. Never edited retroactively. |
| `CLIENT_DOCS.md`  | End client        | Plain-language, non-technical. Updated when product behaviour changes. Safe to hand over at any moment. |
| `PROJECT_MAP.md`  | LLM (primary)     | Compact, mechanical map of files / modules / sources of truth. The first file every agent rule points to. |
| `RELEASE_NOTES.md`| Mixed / public    | Per-version user-facing notes. Generated from `CHANGELOG.md` at release time. |
| `LESSONS.md`      | LLM + dev         | **Append after every correction.** Each entry captures the pattern, root cause, and a preventive rule. Reviewed at session start. Entries graduate into permanent rule files when proven. |

Plus the rule files:

| File                  | Purpose                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| `PROJECT_RULES.md`    | Master source of truth, agent-agnostic. Every other rule file is derived. |
| `CODING_RULES.md`     | Code-level rules (JSDoc, error handling, security, naming, etc.).         |
| `DESIGN.md`           | Design system, colors, typography, components, motion, accessibility.     |
| `PRODUCT.md`          | What the product is, who it serves, what it must do.                      |
| `DATABASE.md`         | Schema, migration policy, RLS / security rules, enums.                    |
| `DEPLOYMENT.md`       | Hosting target, environments, secrets policy, runbook.                    |

See [`docs/HOW_IT_WORKS.md`](docs/HOW_IT_WORKS.md) for the long-form explanation of why this split exists.

---

## Post-interview cleanup checklist

The final message of every `INIT_PROMPT_*.md` ends with this checklist. Reproduced here so you can sanity-check the result:

- [ ] `STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, `LESSONS.md` exist at the project root with content.
- [ ] `PROJECT_RULES.md` exists and contains your chosen stack, language policy, and security baseline.
- [ ] At least one agent rule file matches each tool you said you use (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`, etc.).
- [ ] `.env.example` reflects the stack you chose (Supabase / Firebase / Postgres / Vercel / custom).
- [ ] `.gitignore` has been extended with stack-specific entries.
- [ ] The `atomic-prompts/` folder exists (empty is fine) and the `/atomic-prompts` skill is installed for at least one of your tools.
- [ ] If you use Claude Code: `.claude/hooks/` exists and contains the hook scripts matching your OS (`.sh` or `.ps1`).
- [ ] `/deploy-guide` and `/project-health` skills are installed for at least one of your tools.
- [ ] `templates/`, `INIT_PROMPT_*.md`, and `.vibe-forge-root` have been deleted (or moved to `.vibe-forge/used/`).
- [ ] `git status` shows only the files you expect.

---

## FAQ

**Q. Can I run the interview twice?**
A. Yes, but it is destructive — clone the framework into a fresh folder if you want to start over. There is no formal upgrade path between framework versions.

**Q. Why isn't the framework versioned with semver?**
A. Because there is no "upgrading" — every project is created from a snapshot of `main` at clone time. The framework's own history lives in [`docs/FRAMEWORK_CHANGELOG.md`](docs/FRAMEWORK_CHANGELOG.md). If you want a frozen version, fork or tag the commit you cloned from.

**Q. What language does the interview use?**
A. It detects the language of your first reply and continues in that language. README and template scaffolding are in English; the *generated* documentation (`.md` files) defaults to the language you confirm during the interview. Code comments default to English; you can override this.

**Q. What if `askUserQuestion` is not available in my tool?**
A. The prompt automatically falls back to numbered Markdown questions with 4 options (A / B / C / D), where D is always "my own answer (free-form)".

**Q. What if I don't know the answer to a design / coding question?**
A. Pick **option E ("let the model decide")** for that single question, or invoke **`/skip-section`** to let the model fill the rest of the section. Both paths require a confirmation step so you cannot trigger them accidentally.

**Q. Can I add more agent tools later?**
A. Yes. `PROJECT_RULES.md` is the single source of truth; you (or your AI) can derive new tool-specific files from it at any time.

**Q. Do the hooks slow down Claude Code?**
A. No. They are lightweight shell scripts (< 50 ms each). The secret scanner, config protection, and console-log guard run in milliseconds. The TypeScript quality gate runs `tsc --noEmit` — that takes a few seconds for larger projects but is non-blocking (it only reports, it does not stop the agent).

**Q. What if I don't use Claude Code?**
A. The hooks are Claude Code-specific. All other tools (Cursor, Codex, Windsurf, Copilot, Lovable) receive equivalent rules embedded in their config files. The `/deploy-guide` and `/project-health` skills work natively in Cursor and Codex too.

**Q. Can I change the testing tier later?**
A. Yes — edit `PROJECT_RULES.md` and regenerate the agent configs (any AI can do this for you). The TDD tier is a single placeholder `<<TDD_TIER>>` that controls conditional blocks in all generated files.

---

## Framework changelog

### v1.1

- **ECC safety net integration:**
  - Seven Claude Code hooks (secret scanner, config protection, TypeScript quality gate, console.log guard, doc-sync reminder, auto-formatter, design uniqueness guard) with `.sh` (macOS/Linux) and `.ps1` (Windows/PowerShell) variants.
  - Hook scope choice (project-local / global / both / skip) added to all three `INIT_PROMPT_*.md` interview flows.
  - `templates/hooks/` directory with `hooks.json.template` and `hooks.windows.json.template`.
- **3-tier testing policy:** No tests / Basic TDD / Full TDD — chosen during the interview, enforced via conditional blocks (`<<#IF_TDD_NONE>>`, `<<#IF_TDD_BASIC>>`, `<<#IF_TDD_FULL>>`) in all six agent config templates.
- **New skills:**
  - `/deploy-guide` — live-researched deployment documentation (Cursor, Claude Code, Codex).
  - `/project-health` — 10-check project dashboard (Cursor, Claude Code, Codex).
- **Security non-negotiables** embedded in all six agent config templates (secrets, parameterised queries, `.env` commit prevention).

### v1.0

- Three `INIT_PROMPT_*.md` variants (short / standard / deep).
- Six project-doc templates (including `LESSONS.md` self-improvement loop) and six project-rule templates.
- Agent-config templates for Cursor, Claude Code, Codex, Windsurf, Copilot, Lovable.
- `/atomic-prompts` skill in Cursor, Claude Code, and Codex flavours.
- Sentinel-file path check, hybrid interview interaction (`askUserQuestion` + numbered fallback, option E + `/skip-section`).
- Docs: [`docs/FRAMEWORK_CHANGELOG.md`](docs/FRAMEWORK_CHANGELOG.md), [`docs/HOW_IT_WORKS.md`](docs/HOW_IT_WORKS.md), [`docs/PROMPT_AUTHORING_GUIDE.md`](docs/PROMPT_AUTHORING_GUIDE.md).

---

## License

MIT, unless you fork it and decide otherwise. See `LICENSE` if present, or assume MIT.
