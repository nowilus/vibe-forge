# Prompt authoring guide

This guide is for two audiences:

1. **Maintainers** of `vibe-forge` who edit `INIT_PROMPT_*.md` or the `/atomic-prompts` skill.
2. **Vibe-coders** who want to write better prompts inside their own project after the interview.

Both audiences share the same underlying schema, so reading this once pays off twice.

---

## 1. Atomic prompt schema

An atomic prompt is a single, self-contained Markdown file that another AI session can execute end-to-end without context. The `/atomic-prompts` skill generates these.

Every atomic prompt has the following sections, in this order:

```markdown
# <ID> — <Short, imperative title>

## 1. Goal
One paragraph in plain language. What outcome the user wants. NOT how to do it.

## 2. Context (read first)
- Source-of-truth files this depends on (e.g. PROJECT_MAP.md, STATE.md, DATABASE.md).
- Background the agent needs (recent decisions, related features, constraints).
- Anything explicitly OUT of scope.

## 3. Scope
- **In scope:** bullet list of what this prompt covers.
- **Out of scope:** bullet list of what this prompt explicitly does NOT cover.

## 4. Files likely to be touched
A short list of files and the kind of change expected in each.
Mark "new" / "edit" / "delete" / "rename".

## 5. Step-by-step plan
Numbered steps the agent should execute. Each step is small and verifiable.

## 6. Acceptance criteria
A checklist (`- [ ]`) of objective conditions that must hold before this
prompt is considered done. No "the code is nice" — only verifiable items.

## 7. Edge cases & failure modes
- What happens if X is null?
- What happens if the user is offline / unauthenticated / on mobile?
- What error states must be visible?

## 8. Security / privacy notes
- Any new secret? Any new PII? Any new permission boundary?
- If yes, what changes are needed in DATABASE.md / PROJECT_RULES.md / .env.example?

## 9. Test plan
- Manual steps to reproduce.
- Automated tests, if applicable.
- Tools needed (browser, DB client, etc.).

## 10. Documentation updates
After the change lands, which of these files must be updated and how:
- [ ] STATE.md           (current truth — overwrite affected lines)
- [ ] CHANGELOG.md       (append one entry, dated, with prompt ID)
- [ ] CLIENT_DOCS.md     (if behaviour visible to client changes)
- [ ] PROJECT_MAP.md     (if new files / modules were added)
- [ ] RELEASE_NOTES.md   (if this should appear in the next release)
- [ ] LESSONS.md         (only if the user corrected the executing agent during this work — append pattern, root cause, preventive rule per `PROJECT_RULES.md` §3.1)

## 11. Rollback plan
How to back this change out if something goes wrong. Migrations, feature flags, etc.

## 12. References
Links to issues, designs, prior atomic prompts, screenshots, etc.
```

Sections 7, 8, 11 may be marked **N/A** with one sentence of justification — never deleted silently.

---

## 2. Quality bar for atomic prompts

A good atomic prompt:

- **Names the source-of-truth files** instead of restating their content.
- **Lists files to touch** even if the list might be slightly wrong — being concrete forces the AI to think.
- **Has acceptance criteria that are observable**, not aesthetic ("button is centred and labelled 'Sign in with Google'" not "the UI looks nice").
- **Mentions security implications.** A prompt that adds Google login but ignores token handling is a security-issue generator.
- **Specifies documentation updates.** If a change does not require any doc update, the prompt must explicitly say "no doc update required" and justify it in one sentence.

A bad atomic prompt:

- Reads like a Slack message ("hey can you add google login").
- Re-explains the whole project in section 2 instead of linking.
- Skips security and tests.
- Forgets to mention `STATE.md` / `CHANGELOG.md` / `LESSONS.md` (when the user corrected during execution) updates.

The `/atomic-prompts` skill (see `skills/`) is configured to refuse to emit a prompt that violates the bar.

---

## 3. The `/atomic-prompts` invocation contract

The skill must accept all of these invocations and produce the same output:

```text
/atomic-prompts <one-line idea>
```
```text
use the atomic-prompts skill for "<one-line idea>"
```
```text
run /atomic-prompts on this: <one-line idea>
```
```text
/atomic-prompts
<multi-line idea body>
```

The skill must:

1. Resolve the next sequential ID by scanning `atomic-prompts/` for the highest existing `NNNN-` prefix and incrementing.
2. Generate the file at `atomic-prompts/NNNN-<kebab-slug>.md`.
3. Print a short confirmation to chat with the relative path and the acceptance criteria count.
4. **Not execute** the prompt. The user runs it manually, in this or another tool.

This last point is important. The skill produces *prompts*, not *changes*.

---

## 4. Editing `INIT_PROMPT_*.md`

If you maintain the framework, the rules are:

- One question per turn. No question walls.
- Every question uses the schema in [`INTERVIEW_PHILOSOPHY.md`](INTERVIEW_PHILOSOPHY.md) §3.
- Always include option E and `/skip-section` instructions.
- Always include the path-check preamble.
- Always end the prompt with the cleanup checklist mirroring the README.
- When adding a question, also add the downstream effect (which template gets which content).
- Keep `INIT_PROMPT_short` and `INIT_PROMPT_deep` in sync with `_standard` whenever a question is added — short = subset, deep = superset.

---

## 5. Style rules for generated documentation

- `STATE.md` and `PROJECT_MAP.md` use compact tables and short bullets. Optimise for LLM parsing.
- `CLIENT_DOCS.md` uses long, friendly paragraphs. Optimise for human reading by a non-technical client.
- `CHANGELOG.md` uses `Keep a Changelog`-style entries grouped by `Added / Changed / Removed / Fixed / Security`.
- `RELEASE_NOTES.md` uses one section per version, written for end-users, in past tense.
- `PROJECT_RULES.md` uses imperative voice ("MUST", "SHOULD", "MAY") and is the single rule file other tools point to.

If a generated file violates these style rules, regenerate it. Do not patch it in place — the inconsistency will leak across files.
