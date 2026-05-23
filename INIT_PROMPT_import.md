# vibe-forge — INIT_PROMPT (import mode)

> **Who reads this:** an LLM tool (Cursor / Claude Code / Codex / Lovable / Windsurf) whose user already has project knowledge docs and wants to import them into vibe-forge instead of re-answering the full wizard.
>
> **How it works:** you read the user's files, extract every `<<PLACEHOLDER>>` value you can, show them what you found, ask targeted questions only for what's missing, then materialise the same output as the standard wizard.
>
> **One rule before you begin:** do NOT write any files until the user says **"yes, generate"** in Section 6.

---

## 0. Preflight (do IN ORDER before touching any import files)

### 0.1 Path check

1. Check that cwd contains **`.vibe-forge-root`**. If not, search up 3 levels.
2. If found → acknowledge: "Detected vibe-forge root at `<absolute path>`."
3. If not found → stop and tell the user to `cd` into the vibe-forge folder.

### 0.2 Import folder check

1. Check that an **`import/`** folder exists and contains at least one file.
2. If folder is missing or empty → stop and respond:

   > No files found in `import/`. Please create the folder and drop your project docs there (`.md`, `.txt`, `.png`, `.jpg`, `.pdf`, or any exported project files), then re-run this prompt.

3. If folder exists and has files → list them in one sentence and continue.

### 0.3 Language detection

Match the language of the user's first reply. Until then, use English.

### 0.4 Escape hatches (explain once)

> Throughout this process you have two escape hatches:
> 1. **Option E** on any gap-fill question — I pick a sensible default and mark it 🤖.
> 2. **`/skip-remaining`** at any time — I fill all remaining missing placeholders with defaults, tag them 🤖, and move to the Review section.

---

## 1. Supported input formats

| Format | How it is processed |
|--------|-------------------|
| `.md` (PRODUCT.md, DESIGN.md, architecture, action plan, …) | Read as text; extract structured data by section headers and keywords |
| `.png` / `.jpg` / `.webp` (mockups, wireframes, screenshots) | Vision analysis — extract dominant colours, typography cues, layout patterns, component inventory |
| `.txt` / `.pdf` | Read as unstructured text; extract what is recognisable |
| Code files / exported project folders (Claude Design, v0, …) | Stack detection from imports/deps, design tokens from CSS/config |

If the tool is not vision-capable, skip images, mark those placeholders as LOW-confidence, and flag them for gap-fill.

---

## 2. Inventory (Phase 1)

Read every file in `import/`. Produce this table:

```
| # | File | Type | Content summary (1 line) |
```

Then classify each file into extraction targets:

| Category | Feeds templates |
|----------|----------------|
| Product knowledge | PRODUCT.md, PROJECT_RULES.md |
| Design knowledge | DESIGN.md |
| Technical / stack | PROJECT_RULES.md, CODING_RULES.md, DATABASE.md, DEPLOYMENT.md |
| Visual / mockups | DESIGN.md (colours, typography, layout) |
| Action plan / roadmap | STATE.md, PROJECT_MAP.md |
| Unknown | Ask user what it is before continuing |

Flag any file in the Unknown category and ask the user once: "I found `<file>` but could not determine what it contains. What is it?" before proceeding.

---

## 3. Extraction engine (Phase 2)

For each file in `import/`, scan for the placeholders listed in the map below. Apply confidence rules:

- **HIGH** — exact match found (token, section label, explicit statement).
- **MEDIUM** — inferred from context (e.g. "we use React" → `<<FRONTEND_STACK>>=Next.js` if package.json mentions next).
- **LOW** — guessed from overall context. Ask before using.

**Conflict rule:** if two files disagree on the same placeholder (e.g. one says "React", another says "Vue"), flag the conflict in the extraction report and ask the user to resolve it. Never silently pick one.

### Placeholder extraction map

#### Identity

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<PROJECT_NAME>>` | Any .md H1, folder name, title | First `# Heading`, repo/folder name | HIGH if H1 found |
| `<<PROJECT_ONE_LINER>>` | Product doc intro | Elevator pitch, subtitle, first paragraph after H1 | HIGH if labelled section |
| `<<PROJECT_LONG_DESCRIPTION>>` | Product doc body | Sections 2–3 of PRODUCT.md equivalent | MEDIUM |
| `<<INDUSTRY>>` | Product doc business context | "industry", "domain", "sector" | HIGH if explicit |
| `<<REGULATIONS>>` | Security / compliance section | "GDPR", "HIPAA", "PCI", "regulation" | HIGH if named |
| `<<COMMERCIAL_MODEL>>` | Product doc | "subscription", "freemium", "B2B", "SaaS", "internal" | MEDIUM |
| `<<GEO_SCOPE>>` | Product doc | "EU", "global", "Poland", geography | MEDIUM |

#### Audience & roles

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<PERSONA_1_WHO>>` | Audience / personas section | "target user", "user persona", "who is this for" | HIGH if dedicated section |
| `<<PERSONA_1_PAIN>>` | Same section | "problem", "pain point", "challenge" | MEDIUM |
| `<<PERSONA_1_WIN>>` | Same section | "goal", "win", "success", "outcome" | MEDIUM |
| `<<PERSONA_1_TECH>>` | Same section | "tech-savvy", "non-technical", "developer" | MEDIUM |
| `<<ROLE_1>>` + details | Roles / permissions section | "admin", "user", "editor", "viewer" | HIGH if table present |

#### Stack

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<FRONTEND_STACK>>` | Tech doc, architecture, package.json mentions | "React", "Next.js", "Vue", "Nuxt", "Svelte", "Astro", framework names | HIGH if explicit |
| `<<BACKEND_STACK>>` | Architecture doc | "Node", "FastAPI", "Express", "Supabase", "Firebase", "BaaS" | HIGH if named |
| `<<DATABASE_STACK>>` | Architecture doc, tech doc | "Postgres", "Supabase", "Firebase", "MySQL", "MongoDB" | HIGH if named |
| `<<AUTH_STACK>>` | Auth section, architecture | "Supabase Auth", "Firebase Auth", "Clerk", "NextAuth", "Auth.js" | HIGH if named |
| `<<STORAGE_STACK>>` | Architecture doc | "S3", "Supabase Storage", "Firebase Storage", "R2", "Spaces" | HIGH if named |
| `<<HOSTING_STACK>>` | Deployment section | "Vercel", "Netlify", "Railway", "Cloudflare", "AWS", "GCP" | HIGH if named |
| `<<CICD_STACK>>` | Deployment / ops section | "GitHub Actions", "Vercel CI", "Netlify CI", "CircleCI" | HIGH if named |
| `<<OBSERVABILITY_STACK>>` | Monitoring / ops section | "Sentry", "Datadog", "Logflare", "Axiom", "Better Stack" | HIGH if named |
| `<<DATA_LAYER>>` | Architecture doc | ORM name, "Prisma", "Drizzle", "Supabase client", query builder | MEDIUM |

#### Auth & security

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<AUTH_STRATEGY>>` | Security / architecture section | "JWT", "session", "OAuth", "magic link", "SSO" | MEDIUM if named |
| `<<AUTHZ_STRATEGY>>` | Auth / DB section | "RLS", "RBAC", "middleware", "row-level security" | HIGH if named |
| `<<SECRETS_PROVIDER>>` | Deployment / security section | "Doppler", "1Password", "AWS Secrets Manager", "Vercel env" | HIGH if named |
| `<<PII_POLICY>>` | Privacy / compliance section | "GDPR", "personal data", "PII", "data retention" | MEDIUM |

#### Design

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<BRAND_PRIMARY>>` | DESIGN.md, CSS tokens, Figma exports | Hex/rgb/hsl values, "primary colour", "brand colour" | HIGH if hex found |
| `<<BRAND_SECONDARY>>` | Same | "secondary colour", "accent" | HIGH if hex found |
| `<<NEUTRAL_BG>>` | Design doc, CSS | Background colour token | HIGH if token found |
| `<<NEUTRAL_SURFACE>>` | Design doc, CSS | Card/panel colour token | HIGH if token found |
| `<<NEUTRAL_BORDER>>` | Design doc, CSS | Border colour token | MEDIUM |
| `<<TEXT_PRIMARY>>` | Design doc, CSS | "text-primary", main text colour | MEDIUM |
| `<<TEXT_SECONDARY>>` | Design doc, CSS | "text-secondary", meta text | MEDIUM |
| `<<TEXT_MUTED>>` | Design doc, CSS | "muted", "disabled", "placeholder" | MEDIUM |
| `<<SUCCESS_COLOR>>` | Design doc, CSS | "success", "green" | MEDIUM |
| `<<WARNING_COLOR>>` | Design doc, CSS | "warning", "orange", "amber" | MEDIUM |
| `<<ERROR_COLOR>>` | Design doc, CSS | "error", "danger", "red" | MEDIUM |
| `<<INFO_COLOR>>` | Design doc, CSS | "info", "blue" | MEDIUM |
| `<<DARK_MODE_POLICY>>` | Design doc | "dark mode", "light only", "dark only", "both" | HIGH if stated |
| `<<FONT_PRIMARY>>` | Design doc, CSS font declarations | `font-family`, "primary font", Google Fonts name | HIGH if named |
| `<<FONT_MONO>>` | Design doc, CSS | "mono", "monospace", code font | MEDIUM |
| `<<TYPE_SCALE>>` | Design doc | "type scale", rem values, typography section | MEDIUM |
| `<<SPACING_SCALE>>` | Design doc, Tailwind config | "spacing", "4 8 16 24 32", rem scale | MEDIUM |
| `<<BRAND_TONE>>` | Brand / copy section | "tone", "voice", "formal", "casual", "friendly" | MEDIUM |
| `<<WCAG_LEVEL>>` | Accessibility section | "WCAG AA", "WCAG AAA", "accessibility" | HIGH if stated |
| `<<ICON_LIBRARY>>` | Design doc, package.json | "Lucide", "Heroicons", "Phosphor", "Tabler" | HIGH if named |
| `<<PAGE_MAX_WIDTH>>` | Design doc, CSS | "max-width", "container", "1200px" | MEDIUM |
| `<<DESIGN_PHILOSOPHY_PARAGRAPH>>` | Design doc intro, brand guide | Design principles, brand narrative | MEDIUM (paraphrase) |

**PNG/mockup extraction:** when analysing image files, extract dominant colours → `<<BRAND_PRIMARY>>`, `<<NEUTRAL_BG>>`; identify font style → `<<FONT_PRIMARY>>` guess; identify layout type (sidebar, centered, grid). Confidence always MEDIUM or LOW for visual extraction.

#### Language & docs

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<DOCS_LANGUAGE>>` | Any doc | Document language detected | HIGH (auto-detect) |
| `<<CODE_COMMENT_LANGUAGE>>` | Code files / tech doc | Stated preference, or default English | MEDIUM |
| `<<UI_LANGUAGE>>` | Product doc, design doc | "Polish", "English", "i18n", locale codes | HIGH if stated |
| `<<COMMIT_LANGUAGE>>` | Process / workflow doc | Commit style section | MEDIUM |

#### Coding conventions

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<FILE_NAMING>>` | Tech doc, coding guide | "kebab-case", "camelCase", "PascalCase" naming | HIGH if stated |
| `<<COMPONENT_NAMING>>` | Same | "PascalCase components" | HIGH if stated |
| `<<COMMIT_MESSAGE_STYLE>>` | Process doc | "Conventional Commits", "feat:", "fix:" | HIGH if named |
| `<<POC_OR_PROD>>` | Action plan, product doc | "MVP", "POC", "prototype" vs "production", "scalable" | MEDIUM |
| `<<MIN_VIEWPORT_WIDTH>>` | Design doc | "minimum width", "320px", "375px", "mobile" | MEDIUM |
| `<<LOGGER_NAME>>` | Architecture / tech doc | Logger library name | LOW |

#### Database & deployment

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<MIGRATION_TOOL>>` | Tech doc, architecture | "Prisma migrate", "Supabase migrations", "Flyway", "Alembic" | HIGH if named |
| `<<MIGRATION_NAMING>>` | Process doc | "YYYYMMDD", "sequential", naming pattern | MEDIUM |
| `<<PORT>>` | Architecture doc, README | "port 3000", "localhost:8080" | MEDIUM |
| `<<STAGING_URL>>` | Deployment doc | "staging.example.com", preview URL | HIGH if explicit |
| `<<PROD_URL>>` | Deployment doc | Production domain name | HIGH if explicit |
| `<<APEX_DOMAIN>>` | Deployment doc | Top-level domain | HIGH if explicit |
| `<<ERROR_TRACKING>>` | Ops / monitoring section | "Sentry", "Bugsnag", "Rollbar" | HIGH if named |
| `<<BACKUP_CADENCE>>` | Ops section | "daily backup", "hourly" | MEDIUM |
| `<<LOCAL_DB_INSTRUCTIONS>>` | README, dev guide | "docker-compose up", "supabase start", setup commands | HIGH if present |
| `<<SEED_CMD>>` | README, dev guide | "npm run seed", "supabase db seed" | HIGH if present |
| `<<RESET_CMD>>` | README, dev guide | "npm run reset", "supabase db reset" | HIGH if present |

#### Entities (repeating — extract as many as found)

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<ENTITY_1>>` … `<<ENTITY_N>>` | Data model section, ERD, schema | Table names, entity names, noun list | HIGH if labelled |
| `<<ENTITY_N_DESC>>` | Same | Entity description | MEDIUM |
| `<<ENTITY_N_OWNER>>` | Same | "belongs to", "owned by", "user-scoped" | MEDIUM |
| `<<ENTITY_N_RELATIONS>>` | Same | "related to", FK references | MEDIUM |

---

## 4. Extraction report (Phase 3)

After scanning all files, build this report:

```markdown
## Extraction Report

### ✓ Extracted — HIGH confidence (N placeholders)
| Placeholder | Value | Source file | Evidence |
|-------------|-------|-------------|----------|
| ... | ... | ... | ... |

### ~ Inferred — MEDIUM confidence (N placeholders)
| Placeholder | Value | Source | Reasoning |
|-------------|-------|--------|-----------|
| ... | ... | ... | ... |

### ⚠ Conflicts found (N)
| Placeholder | File A says | File B says | Need user input |
|-------------|-------------|-------------|----------------|
| ... | ... | ... | ... |

### ? Missing — needs gap-fill (N placeholders)
| Placeholder | Needed for | Default if skipped |
|-------------|------------|--------------------|
| ... | ... | ... |

### 🤖 Will use defaults — not critical (N placeholders)
| Placeholder | Default value |
|-------------|--------------|
| ... | ... |
```

Show the report. Ask:

> Does this look right? You can:
> - Reply **"ok"** to accept all HIGH/MEDIUM items and proceed to gap-fill for missing ones.
> - Reply **"fix: `<<PLACEHOLDER>>`=`value`"** to correct any extracted value.
> - Reply **"reject: `<<PLACEHOLDER>>`"** to move an inferred item to gap-fill.
> - Reply **"resolve: `<<PLACEHOLDER>>`=`value`"** to fix a conflict.

Wait for user confirmation before continuing.

---

## 5. Gap-fill questions (Phase 4)

Ask only about **missing** and **user-rejected-inferred** placeholders. Group by topic. One question per turn.

> **AI tools (Q1.1) is ALWAYS asked first — never skipped, never defaulted, even if extracted.**
> Reason: agent-config files (CLAUDE.md, .cursorrules, AGENTS.md, etc.) are only generated for explicitly confirmed tools.
> Even if you extracted "cursor" from the user's docs with HIGH confidence, confirm it before generation.
> Ask Q1.1 as the very first gap-fill question regardless of extraction results.

For each gap-fill question, use the **exact option sets from `INIT_PROMPT_standard.md`** — map question IDs to standard wizard equivalents below:

| Gap area | Standard question to reuse |
|----------|---------------------------|
| AI tools | Q1.1 — **MANDATORY FIRST, always asked** |
| Hooks scope | Q7A.2 |
| Product type | Q2.4 |
| Stack (full preset) | Q3.1–Q3.6 (only for missing stack items) |
| Auth strategy | Q5.3 |
| Multi-tenancy | Q5.2 |
| PII / regulatory | Q6.1 + Q6.2 |
| Secrets storage | Q6.3 |
| Environments | Q7.1 |
| CI/CD | Q7.2 |
| Error tracking | Q7.3 |
| Testing tier | Q7A.1 |
| Design uniqueness guard | Q7A.3 |
| Deployment platform | Q7A.4 |
| Docs language | Q8.1 (only if not auto-detected) |
| Code-comment language | Q8.2 |
| Handover walkthrough | Q8.3 |
| Atomic prompts folder | Q9.1 |
| Numbering scheme | Q9.2 |
| Cleanup | Q10.1 (add `import/` to the cleanup list — Option A deletes it) |
| Re-init git | Q10.2 |

When asking a gap-fill question, prefix it: "One question — **[topic]**: …" to orient the user.

**Option E** on any question → apply the short-wizard default for that question and mark 🤖.  
**`/skip-remaining`** → apply all remaining short-wizard defaults and mark 🤖.

---

## 6. Pre-generation review (Phase 5)

After all gap-fill questions, produce a final summary table:

```markdown
## Summary — ready to generate

| Setting | Value | Source |
|---------|-------|--------|
| PROJECT_NAME | ... | ✓ extracted / ● gap-filled / 🤖 defaulted |
| ... | ... | ... |
```

Then list **all files that will be created** (same list as `INIT_PROMPT_standard.md` Section 11):

- At project root: `STATE.md`, `CHANGELOG.md`, `CLIENT_DOCS.md`, `PROJECT_MAP.md`, `RELEASE_NOTES.md`, `LESSONS.md`, `PROJECT_RULES.md`, `CODING_RULES.md`, `DESIGN.md`, `PRODUCT.md`, `DATABASE.md`, `DEPLOYMENT.md`, `.env.example`, `.gitignore` (extended), `atomic-prompts/`.
- Agent-config files based on Q1.1 selection.
- `/atomic-prompts`, `/deploy-guide`, `/project-health` skill files.

Then list **files that will be deleted** based on cleanup answer.

Ask:

> Ready to generate? Reply **"yes, generate"** to proceed. Reply **"change X"** to alter an answer. Reply **"explain Y"** to clarify a decision.

---

## 7. Template materialisation (Phase 6)

On **"yes, generate"** — follow `INIT_PROMPT_standard.md` Section 11 step 5 exactly:

1. Materialise every template in `templates/project-docs/` → root, substituting `<<PLACEHOLDERS>>` with extracted/gap-filled/default values.
2. Materialise every template in `templates/project-rules/` → root.
3. Materialise selected files from `templates/agent-configs/` → their target paths (for Cursor: all `.cursor/rules/*.mdc`, including `karpathy-guidelines.mdc` with `alwaysApply: true`; for Claude/Codex/Windsurf/Copilot/Lovable: embedded **Implementation guidelines (immutable)** from [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)).
4. Copy `templates/env-examples/*.env.example` → `.env.example`; extend with hosting-specific snippets.
5. Extend `.gitignore` with stack-specific entries.
6. Copy selected `/atomic-prompts` skill variants (source: `skills/`).
7. Create `atomic-prompts/` with `.gitkeep` and one-paragraph `README.md`.
8. Hooks (per Q7A.2): copy `templates/hooks/` to `.claude/hooks/`; print global instructions if requested.
9. Skills: copy `deploy-guide` and `project-health` skill files for each selected AI tool.
10. Perform cleanup (Section 8 below).
11. Perform git action (per Q10.2).
12. Print the post-generation checklist (Section 9 below).

---

## 8. Cleanup (Phase 7)

Ask the user which cleanup option to apply — or reuse the gap-fill answer from Section 5:

- **A)** Delete `templates/`, `INIT_PROMPT_*.md`, `.vibe-forge-root`, **`import/`** — clean project (recommended).
- **B)** Archive everything under `.vibe-forge/used/` (including `import/`).
- **C)** Delete everything including `docs/` and `import/`.
- **D)** Keep everything — user cleans up manually.
- **E)** Let the model decide (default A).

---

## 9. Post-generation checklist (print verbatim)

```
Import complete. Verify before your first feature prompt:

[ ] STATE.md, CHANGELOG.md, CLIENT_DOCS.md, PROJECT_MAP.md, RELEASE_NOTES.md, LESSONS.md exist at project root with real content (no <<PLACEHOLDERS>>).
[ ] PROJECT_RULES.md, CODING_RULES.md, DESIGN.md, PRODUCT.md, DATABASE.md, DEPLOYMENT.md exist with real content.
[ ] At least one agent rule file exists for each AI tool you use.
[ ] .env.example is stack-specific (no generic placeholder).
[ ] .gitignore has been extended for your stack.
[ ] atomic-prompts/ folder exists and /atomic-prompts skill is installed.
[ ] templates/, INIT_PROMPT_*.md, .vibe-forge-root, and import/ have been removed (or archived).
[ ] git history reflects what you wanted.
[ ] .claude/hooks/ scripts exist and are executable.
[ ] /deploy-guide and /project-health skills installed.

If anything is off, tell me which item and I will fix it.
```

---

## 10. Failure modes you must avoid

- ❌ Writing files before Section 6 confirmation ("yes, generate").
- ❌ Silently picking between conflicting values in two files — always flag and ask.
- ❌ Using LOW-confidence values without asking the user first.
- ❌ Asking gap-fill questions for placeholders you already extracted with HIGH confidence.
- ❌ Skipping the path check or the import-folder check.
- ❌ Forgetting to add `import/` to the cleanup list.
- ❌ Producing English documentation when the user's docs are in Polish (or vice versa).
- ❌ Pasting multiple gap-fill questions in one turn.
- ❌ Inventing placeholder values when extraction yields nothing — mark as missing, not guessed.
- ❌ Failing to print the post-generation checklist.

### Additional failure modes specific to import

- **Empty import folder** → abort with clear instructions (already handled in Section 0.2).
- **All placeholders missing** → tell the user: "Your files do not contain enough structured information for extraction. Consider running `INIT_PROMPT_standard.md` instead, or add a PRODUCT.md and DESIGN.md to `import/` before retrying."
- **Image-only import** → warn: "Only image files found. Visual extraction has limits — expect more gap-fill questions than usual. Continue? (yes / add text docs first)"
- **Non-English docs** → detect language, confirm: "Your docs appear to be in [language]. I will use that for generated docs — is that correct?"

---

## 11. Now begin

Execute Section 0 (path check → import-folder check → language detection → escape-hatch explanation), then proceed to Section 2 (inventory). One step at a time.
