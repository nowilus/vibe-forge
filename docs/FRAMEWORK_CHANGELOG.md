# `vibe-forge` framework changelog

This is the changelog of the **framework itself**, not of any project built with it. Your project gets its own `CHANGELOG.md` generated during the interview.

Format: based on [Keep a Changelog](https://keepachangelog.com/). The framework does not use semantic versioning — each clone is a snapshot of `main`. Entries are grouped by date and milestone.

---

## [Unreleased]

### Added
- Initial public skeleton of `vibe-forge`.
- Sentinel file `.vibe-forge-root` and minimal baseline `.gitignore` / `.env.example` at the repo root.
- Framework README with the nine-step happy path, layout overview, FAQ, and `/atomic-prompts` highlight.
- Framework docs (`HOW_IT_WORKS.md`, `INTERVIEW_PHILOSOPHY.md`, `PROMPT_AUTHORING_GUIDE.md`, this file).
- Three interview prompts: `INIT_PROMPT_short.md` (~10 questions), `INIT_PROMPT_standard.md` (~30 questions), `INIT_PROMPT_deep.md` (~60+ questions).
- Six project-doc templates (`STATE`, `CHANGELOG`, `CLIENT_DOCS`, `PROJECT_MAP`, `RELEASE_NOTES`, `LESSONS`).
- Six project-rule templates (`PROJECT_RULES`, `CODING_RULES`, `DESIGN`, `PRODUCT`, `DATABASE`, `DEPLOYMENT`).
- Agent-config templates for Cursor, Claude Code, Codex, Windsurf, Copilot, Lovable.
- Stack-specific `env-examples/` (Supabase, Firebase, Postgres, Vercel).
- `/atomic-prompts` skill bundled in three flavours (Cursor slash-command, Claude Code skill, Codex skill), plus `skills/README.md` for global installation.
- **`LESSONS.md` self-improvement loop**: template at `templates/project-docs/LESSONS.md.template`; `PROJECT_RULES.md` §3.1 protocol (append after every user correction, review at session start, graduation into permanent rule files); all agent-config templates and `INIT_PROMPT_*.md` updated; README documentation philosophy extended to six root docs.

### Design decisions captured this milestone
- Framework is **stack-agnostic**: the interview picks the stack, not the framework.
- Language policy: README and templates are English; generated docs default to the user's language confirmed during the interview; default code-comment language is English (overridable).
- **Master-file approach** for agent configs: a single `PROJECT_RULES.md` is the source of truth, all tool-specific files are derived from it.
- **Hybrid interview interaction**: `askUserQuestion` preferred, numbered-Markdown fallback, plus per-question option E and per-section `/skip-section` meta-command with two-step confirmation.
- **Six separate documentation files** at the project root (`STATE` / `CHANGELOG` / `CLIENT_DOCS` / `PROJECT_MAP` / `RELEASE_NOTES` / `LESSONS`) instead of one mega-README.
- **`LESSONS.md`** captures mistake patterns and corrective rules; agents skim it at session start and append after corrections; proven rules can graduate into `CODING_RULES.md`, `DESIGN.md`, etc.
- **In-repo skill files** for `/atomic-prompts`, with optional global install documented in `skills/README.md`.
- **Flat top-level repository structure**, with `templates/` consumed and removed after the interview.
- **No formal framework versioning** — clone `main`, archive a tag yourself if you want a snapshot.
- **Three depth levels** for the interview prompt.
- **Strict path check** using `.vibe-forge-root` sentinel; interview refuses to proceed without it.
- **Embedded brainstorming logic** — the interview prompt does not depend on external "brainstorming" / "grill-me" skills.

---

## Maintenance notes

When making future changes to the framework:

- Add a dated `## [YYYY-MM-DD]` section under `[Unreleased]`.
- Group entries by `Added / Changed / Removed / Fixed / Security`.
- Update the README "Framework changelog" mirror block with the same headlines.
- When you change a template that affects already-cloned projects, write an `### Migration` note explaining what existing users need to do (or simply that they cannot upgrade in place and need to re-clone for new projects).
