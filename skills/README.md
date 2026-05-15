# `/atomic-prompts` skill — installation guide

This folder contains the **bundled `/atomic-prompts` skill** in three flavours, ready to drop into a project initialised with `vibe-forge`.

The skill turns a one-line idea into a fully-contextualised prompt file in `atomic-prompts/NNNN-<slug>.md`. The skill produces *prompts*, not *changes* — you run the generated prompt afterwards (in the same tool or a different one).

```
skills/
├── README.md            ← you are here
├── cursor/
│   └── .cursor/commands/atomic-prompts.md
├── claude-code/
│   └── .claude/skills/atomic-prompts/SKILL.md
└── codex/
    └── .codex/skills/atomic-prompts/SKILL.md
```

---

## 1. Per-project install (recommended default)

The `INIT_PROMPT` does this automatically for the tools you selected in Q1.1. If you want to install manually:

### Cursor

```bash
mkdir -p .cursor/commands
cp skills/cursor/.cursor/commands/atomic-prompts.md .cursor/commands/atomic-prompts.md
```

Then in Cursor, type `/atomic-prompts <idea>` in any chat session.

### Claude Code

```bash
mkdir -p .claude/skills/atomic-prompts
cp skills/claude-code/.claude/skills/atomic-prompts/SKILL.md .claude/skills/atomic-prompts/SKILL.md
```

Claude Code discovers the skill automatically. Trigger with `/atomic-prompts <idea>` or "use the atomic-prompts skill for: <idea>".

### Codex CLI

```bash
mkdir -p .codex/skills/atomic-prompts
cp skills/codex/.codex/skills/atomic-prompts/SKILL.md .codex/skills/atomic-prompts/SKILL.md
```

Trigger via the Codex CLI skills mechanism (`/atomic-prompts` or by name).

---

## 2. Global install (one machine, many projects)

If you want the skill available everywhere on your machine instead of per-project:

### Cursor (global)

```bash
# Windows
mkdir -p "$env:USERPROFILE\.cursor\commands"
copy skills\cursor\.cursor\commands\atomic-prompts.md `
     "$env:USERPROFILE\.cursor\commands\atomic-prompts.md"

# macOS / Linux
mkdir -p ~/.cursor/commands
cp skills/cursor/.cursor/commands/atomic-prompts.md \
   ~/.cursor/commands/atomic-prompts.md
```

### Claude Code (global)

```bash
mkdir -p ~/.claude/skills/atomic-prompts
cp skills/claude-code/.claude/skills/atomic-prompts/SKILL.md \
   ~/.claude/skills/atomic-prompts/SKILL.md
```

### Codex CLI (global)

```bash
mkdir -p ~/.codex/skills/atomic-prompts
cp skills/codex/.codex/skills/atomic-prompts/SKILL.md \
   ~/.codex/skills/atomic-prompts/SKILL.md
```

---

## 3. Invocation patterns (all three flavours support the same)

The skill responds to all of these and produces the same output file:

```text
/atomic-prompts Add Google login to the auth screen
```
```text
use the atomic-prompts skill for "Add Google login to the auth screen"
```
```text
run /atomic-prompts on this idea: dark-mode toggle in the settings page
```
```text
/atomic-prompts
<multi-line idea here, free-form>
```

Output:

```text
Created: atomic-prompts/0007-add-google-login-to-the-auth-screen.md
Acceptance criteria: 6
References: PROJECT_MAP.md §3, STATE.md §3, PROJECT_RULES.md §4
```

The skill **never** implements the idea — it always produces a Markdown ticket and stops. To execute, the user runs the generated file as the next prompt (same chat or new one).

---

## 4. What the generated file contains

12 sections, mirroring `docs/PROMPT_AUTHORING_GUIDE.md`:

1. Goal
2. Context (read first) — pointers, not duplication
3. Scope (in / out)
4. Files likely to be touched
5. Step-by-step plan
6. Acceptance criteria (verifiable, observable)
7. Edge cases & failure modes
8. Security / privacy notes
9. Test plan
10. Documentation updates checklist
11. Rollback plan
12. References

Sections 7, 8, 11 may be marked **N/A** with a one-sentence rationale — never silently omitted.

---

## 5. Customising the skill

The skill file is plain Markdown. If you want to add a project-specific section, add it under `## Output schema` in the skill file. Re-derive from `docs/PROMPT_AUTHORING_GUIDE.md` if you need a refresher on the canonical schema.

---

## 6. Troubleshooting

- **"Skill not recognised"** — make sure the skill file is at the exact path the tool expects (`.cursor/commands/`, `.claude/skills/<name>/`, `.codex/skills/<name>/`).
- **"Generated file overwrites an existing one"** — the skill scans `atomic-prompts/` for the highest sequential ID. If you renamed files or removed leading zeros, the scan can miscount; rename them back to `NNNN-…` first.
- **"Skill tries to implement the idea"** — that means the rule "do not implement, only generate" was overridden by your custom rules. Re-add the rule to the skill file.
