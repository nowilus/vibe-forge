# How `vibe-forge` works

This is the long-form explanation behind the design choices in `vibe-forge`. The README answers *what* and *how to start*; this document answers *why*.

---

## 1. The core loop

```
clone repo  →  copy-paste INIT_PROMPT_*.md  →  interview  →  templates filled in  →  cleanup  →  normal vibe-coding
```

The crucial idea is that **the framework is consumed**, not installed. After the interview is over, none of the framework scaffolding remains — only your project files, your project rules, your project documentation, and the bundled `/atomic-prompts` skill. There is no runtime, no CLI, no package to update.

This is intentional. It means:

- The framework has zero blast radius once the interview ends.
- You can mix it freely with any stack, any folder layout, any deployment.
- "Upgrading" means starting a new project from a newer clone — never breaking your existing one.

---

## 2. Why an interview-driven setup?

The single biggest cause of bad vibe-coded projects is that the user *never wrote down what they wanted*. The AI then guesses, drifts, and 50 prompts later the project is incoherent.

`vibe-forge` short-circuits this by forcing a structured interview at minute zero. By the time you write your first feature prompt:

- The stack is decided.
- The design language is decided.
- The security baseline is decided.
- The deployment target is decided.
- The documentation files exist and are accurate.
- The agent rule files all point to one canonical map (`PROJECT_MAP.md`).

In short — every future prompt has a context anchor. The AI does not have to guess what the project is, because there is a literal file that says.

---

## 3. Why three INIT_PROMPT variants?

Different projects deserve different amounts of upfront thought.

| Variant       | Questions | When to use                                                                 |
| ------------- | --------- | --------------------------------------------------------------------------- |
| **short**     | ~10       | Weekend hacks, throwaway POCs, experiments. Sensible defaults, fast start.  |
| **standard**  | ~30       | The default. Anything you might show to a real user or client.              |
| **deep**      | ~60+      | Audit-grade. Multi-tenant SaaS, regulated industries, multi-agent products. |

All three share the same backbone (path check, language detection, tool detection, output schema). They differ only in **depth per section**. The short variant skips many sections by auto-applying `/skip-section`-with-defaults; the deep variant asks follow-up questions inside every section.

---

## 4. The six-files-for-six-jobs documentation rule

A single `README.md` cannot serve a non-technical client, an LLM rebuilding context, and a developer reviewing history at the same time. So `vibe-forge` splits them:

- **`STATE.md`** — *what is true right now*. Overwritten when truth changes. No history. If a feature is deleted, it disappears from `STATE.md`.
- **`CHANGELOG.md`** — *what happened, in order*. Append-only. Linear. Never edited. This is your archaeology.
- **`CLIENT_DOCS.md`** — *what the product is, in plain language*. Non-technical. Updated only when product behaviour changes. Always safe to send to the client.
- **`PROJECT_MAP.md`** — *where things live*. Compact, mechanical, LLM-optimised. Pointers to source-of-truth files. Updated when the map changes (new folder, moved module, etc.).
- **`RELEASE_NOTES.md`** — *what shipped, by version*. Derived from `CHANGELOG.md` at release boundaries.
- **`LESSONS.md`** — *what went wrong and how never to repeat it*. Append-only lessons after user corrections or discovered mistakes; skim relevant categories at session start; rules can **graduate** into `CODING_RULES.md`, `DESIGN.md`, etc. when they prove stable.

Each file knows its job. None of them tries to do somebody else's. The agent rule files all reference these by name, which is why renaming them is a bad idea unless you also regenerate the rule files.

---

## 5. Master rule file + derived agent configs

The single source of truth is `PROJECT_RULES.md`. Every agent-specific rule file is a *projection* of it into the format that tool expects:

- `.cursorrules` → Cursor's flat rule file plus `.cursor/rules/*.mdc` per-glob.
- `CLAUDE.md` → Anthropic Claude Code's project-level memory file.
- `AGENTS.md` → Codex CLI's agent instructions.
- `.windsurfrules` → Windsurf's equivalent.
- `.github/copilot-instructions.md` → Copilot Chat repository instructions.
- Lovable Project Knowledge → paste-ready text block.

If you change something fundamental about the project (new stack, new security baseline, new audience), you change it in **`PROJECT_RULES.md`** and re-derive the rest. Otherwise the agent configs diverge from each other and you re-introduce the chaos you cloned the framework to escape.

---

## 6. Hybrid interview interaction

The interview prefers the `askUserQuestion`-style tool when your AI supports it (rich multi-choice UI). When it does not, it falls back to a numbered Markdown format:

```text
Q12. Which authentication strategy do you want?
  A) Email + password
  B) OAuth (Google / GitHub / …)
  C) Magic link
  D) Custom — describe in free text
  E) Let the model decide for this question only
```

Two escape hatches exist:

- **Option E** — applies only to *that single question*. The model picks a sensible default and explains why in one sentence.
- **`/skip-section`** — applies to the *rest of the current section*. The model asks for a one-line description ("simple modern look, bright colors, animated icons") and then a two-step confirmation: first it summarises what it is about to fill in, then it waits for "yes". Without that confirmation, nothing is filled.

This means an exhausted vibe-coder can always escape, but cannot accidentally generate ten files of guesses.

---

## 7. The `/atomic-prompts` skill, briefly

The skill takes a one-line idea and emits a structured atomic prompt file: context, scope, files to touch, acceptance criteria, edge cases, security notes, test plan, rollback plan, references to `PROJECT_MAP.md` / `STATE.md` / `PRODUCT.md`. The file is saved to `atomic-prompts/NNNN-slug.md` and is *re-runnable in any tool* — which is the entire point. See [`PROMPT_AUTHORING_GUIDE.md`](PROMPT_AUTHORING_GUIDE.md) for the schema.

---

## 8. What `vibe-forge` deliberately does **not** do

- It does not write your product spec for you. It interviews you for one.
- It does not pick the stack for you unless you explicitly ask it to.
- It does not run code or invoke deploys.
- It does not enforce a particular folder layout for the *application code*. It only enforces the **documentation and rule files**. The rest is yours.
- It does not version itself. Every clone is a snapshot.

The smaller the framework, the less it can rot.
