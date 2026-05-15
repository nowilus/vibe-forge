# vibe-forge

> A starter framework for **vibe-coders** — people who build real software with AI assistants (Cursor, Claude Code, Codex, Lovable, Windsurf, Copilot, …) without necessarily being career engineers.
>
> `vibe-forge` does **not** ship a stack. It ships **structure, rules, and a guided interview** that bootstraps a project of any stack into a state where AI agents can work on it safely, documentation stays honest, and the code does not silently rot into the typical vibe-coded mess.

---

## Table of contents

1. [What this is (and what it is not)](#what-this-is-and-what-it-is-not)
2. [Who it is for](#who-it-is-for)
3. [The 9-step happy path](#the-9-step-happy-path)
4. [Quick start](#quick-start)
5. [The `/atomic-prompts` skill](#the-atomic-prompts-skill--read-this)
6. [Repository layout](#repository-layout)
7. [Supported AI agents](#supported-ai-agents)
8. [Documentation philosophy](#documentation-philosophy)
9. [Post-interview cleanup checklist](#post-interview-cleanup-checklist)
10. [FAQ](#faq)
11. [Framework changelog](#framework-changelog)
12. [License](#license)

---

## What this is (and what it is not)

**`vibe-forge` is:**

- A **template GitHub repository** you clone once per project.
- A set of **document templates** (`STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, plus a master `PROJECT_RULES.md`) that survive any stack change.
- A set of **agent-specific rule files** (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`, `.windsurfrules`, `copilot-instructions.md`, Lovable Project Knowledge) generated from a single source of truth.
- A **deeply structured initial prompt** (`INIT_PROMPT_*.md`) that runs a guided interview with you in your own language and produces a tailored project skeleton at the end.
- A **bundled `/atomic-prompts` skill** that turns a one-line idea into a high-quality, fully-contextualised prompt file you can run in any tool.

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

If you are an engineer who already has strong opinions and a tight stack, you can still use it — just delete what you do not need after the interview.

---

## The 9-step happy path

This is the intended user journey end-to-end:

1. You open this repository on GitHub and read this README.
2. You skim the [docs/](docs/) folder if you want to understand the *why* behind the design.
3. You **clone** this repository to your machine and rename the folder to your project name.
4. You **open the cloned folder** in your AI tool of choice (Cursor, Claude Code, Codex, …) and copy-paste one of the `INIT_PROMPT_*.md` files into the chat. The prompt verifies it is running inside a `vibe-forge` clone (using the `.vibe-forge-root` sentinel file). If the working directory is wrong, it stops and asks you to re-point it.
5. The LLM **interviews you** — in your own language — about your stack, design, business domain, security needs, target audience, deployment, tooling, etc. At any time you can answer:
   - one of the multiple-choice options the LLM offers,
   - your own free-form answer,
   - **option E ("let the model decide")** for that single question, or
   - **`/skip-section`** to let the model fill the whole remaining section with its best guesses (the prompt asks for a two-step confirmation before doing this, so you cannot trigger it by accident).
6. When the interview ends, the LLM **fills every template** in `templates/` with your answers and moves them to the project root, deletes leftover scaffolding, and writes the first entries of `CHANGELOG.md`, `STATE.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`. If you asked for it, it also writes a guided "how this project works" walkthrough you can hand to a non-technical teammate.
7. You **start prompting normally** in your tool. The generated `.cursorrules` / `CLAUDE.md` / `AGENTS.md` / … all point every future agent session to `PROJECT_MAP.md` first, so context reload becomes one file, not the whole repo.
8. Whenever you want a new feature or change, you can invoke the **`/atomic-prompts`** skill (see below). It turns a loose idea into a fully-contextualised prompt file in `atomic-prompts/`, which you can then execute in the same or a different tool.
9. You sleep well. Documentation is in sync, history is linear, the client has something to read, the AI has something to anchor to.

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

## Repository layout

```text
vibe-forge/
├── README.md                        ← you are here
├── .vibe-forge-root                 ← sentinel; INIT_PROMPT refuses to run if missing
├── .gitignore                       ← minimal baseline; extended after interview
├── .env.example                     ← placeholder; replaced after interview
│
├── INIT_PROMPT_short.md             ← guided interview, ~10 questions
├── INIT_PROMPT_standard.md          ← guided interview, ~30 questions (recommended)
├── INIT_PROMPT_deep.md              ← guided interview, ~60+ questions
│
├── docs/                            ← framework's own documentation
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
│   │   └── RELEASE_NOTES.md.template
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
│   └── env-examples/                ← stack-specific .env.example variants
│       ├── supabase.env.example
│       ├── firebase.env.example
│       ├── postgres.env.example
│       └── vercel.env.example
│
└── skills/                          ← /atomic-prompts skill, multiple flavours
    ├── README.md                    ← installation instructions
    ├── cursor/.cursor/commands/atomic-prompts.md
    ├── claude-code/.claude/skills/atomic-prompts/SKILL.md
    └── codex/.codex/skills/atomic-prompts/SKILL.md
```

After the interview ends:

- `templates/` is **deleted** (or archived under `.vibe-forge/used/` if you opt in).
- `INIT_PROMPT_*.md` files are **deleted** (you can recover them from this repo any time).
- `.vibe-forge-root` is **deleted**.
- `docs/` is **kept** if you want the framework documentation around; **deleted** otherwise — your choice during the interview.
- All five `templates/project-docs/*.template` files become real files at the project root.

---

## Supported AI agents

`vibe-forge` is **agent-agnostic by design**. The interview detects which tools you use and writes the appropriate rule files. Currently the framework ships first-class templates for:

| Tool          | File generated                                   | Notes                                              |
| ------------- | ------------------------------------------------ | -------------------------------------------------- |
| Cursor        | `.cursorrules`, `.cursor/rules/*.mdc`            | Includes a `/atomic-prompts` slash-command.        |
| Claude Code   | `CLAUDE.md`, `.claude/skills/atomic-prompts/`    | Skill format matches official Anthropic spec.      |
| Codex CLI     | `AGENTS.md`, `.codex/skills/atomic-prompts/`     | Skill registered for the Codex CLI.                |
| Windsurf      | `.windsurfrules`                                 | Mirrors `PROJECT_RULES.md`.                        |
| GitHub Copilot| `.github/copilot-instructions.md`                | For the Copilot Chat repository instructions API.  |
| Lovable       | Lovable Project Knowledge block (paste-ready)    | Generated from `PROJECT_RULES.md`.                 |

If your tool is not on this list, the master `PROJECT_RULES.md` is still 95% of what you need — you can paste it into the tool's "system prompt" / "custom instructions" slot.

---

## Documentation philosophy

`vibe-forge` enforces **five separate documentation files** at the project root, each with one job and one job only:

| File              | Audience          | Update policy                                    |
| ----------------- | ----------------- | ------------------------------------------------ |
| `STATE.md`        | LLM + dev         | **Overwritten** to reflect current truth only. No history. If a feature is removed, it disappears here. |
| `CHANGELOG.md`    | Dev + future you  | **Append-only** linear history. Every meaningful change adds one entry. Never edited retroactively. |
| `CLIENT_DOCS.md`  | End client        | Plain-language, non-technical. Updated when product behaviour changes. Safe to hand over at any moment. |
| `PROJECT_MAP.md`  | LLM (primary)     | Compact, mechanical map of files / modules / sources of truth. The first file every agent rule points to. |
| `RELEASE_NOTES.md`| Mixed / public    | Per-version user-facing notes. Generated from `CHANGELOG.md` at release time. |

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

- [ ] `STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md` exist at the project root with content.
- [ ] `PROJECT_RULES.md` exists and contains your chosen stack, language policy, and security baseline.
- [ ] At least one agent rule file matches each tool you said you use (`.cursorrules`, `CLAUDE.md`, `AGENTS.md`, etc.).
- [ ] `.env.example` reflects the stack you chose (Supabase / Firebase / Postgres / Vercel / custom).
- [ ] `.gitignore` has been extended with stack-specific entries.
- [ ] The `atomic-prompts/` folder exists (empty is fine) and the `/atomic-prompts` skill is installed for at least one of your tools.
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

---

## Framework changelog

> This is the changelog of `vibe-forge` itself — not of your project. Your project gets its own `CHANGELOG.md` generated during the interview.
>
> Detailed entries live in [`docs/FRAMEWORK_CHANGELOG.md`](docs/FRAMEWORK_CHANGELOG.md). The most recent entries are mirrored here for convenience.

### Unreleased

- Initial public skeleton:
  - Three `INIT_PROMPT_*.md` variants (short / standard / deep).
  - Five project-doc templates and six project-rule templates.
  - Agent-config templates for Cursor, Claude Code, Codex, Windsurf, Copilot, Lovable.
  - `/atomic-prompts` skill in Cursor, Claude Code, and Codex flavours.
  - Sentinel-file path check, hybrid interview interaction (askUserQuestion + numbered fallback, option E + `/skip-section`).

---

## License

MIT, unless you fork it and decide otherwise. See `LICENSE` if present, or assume MIT.
