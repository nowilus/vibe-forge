# Plan: Import Mode for vibe-forge (`INIT_PROMPT_import.md`)

## Context

Vibe-coders often prepare knowledge docs (PRODUCT.md, DESIGN.md, architecture plans, PNG mockups, Claude Design exports, action plans) in free-tier LLMs before reaching vibe-forge. Current wizard forces them to re-answer everything from scratch. Import Mode lets them drop existing docs into vibe-forge and get the same output as the wizard — with the AI extracting data from their files, filling templates automatically, and only asking about gaps.

User has this exact use case NOW and wants to self-test it.

---

## Design Principles

1. **Non-destructive** — new option alongside existing wizards, zero changes to `INIT_PROMPT_short/standard/deep.md`
2. **Same output** — identical template materialization as wizard (same 39 files, same cleanup)
3. **No runtime** — runs inside user's AI tool (Cursor, Claude Code, etc.), no Node.js CLI
4. **Low barrier** — no technical knowledge required; vibe-coder drops files, AI does the rest
5. **Consumed, not installed** — import prompt is deleted after use, like the other INIT_PROMPTs

---

## Architecture Overview

```
User drops files into import/ folder
        ↓
Pastes INIT_PROMPT_import.md into AI tool
        ↓
Phase 1: INVENTORY — AI reads all files in import/, catalogs what's there
        ↓
Phase 2: EXTRACT — AI maps content → <<PLACEHOLDER>> values, builds extraction table
        ↓
Phase 3: CONFIRM EXTRACTION — shows user what was found, asks for corrections
        ↓
Phase 4: GAP-FILL — asks targeted questions ONLY for missing/ambiguous placeholders
        ↓
Phase 5: REVIEW — full summary table (extracted ✓ vs gap-filled ● vs defaulted 🤖)
        ↓
Phase 6: GENERATE — same template materialization as wizard Section 11
        ↓
Phase 7: CLEANUP — same cleanup options as wizard
```

---

## Files to Create

### 1. `INIT_PROMPT_import.md` (NEW — ~250-350 lines)

The core deliverable. Structure:

#### Section 0: Preflight
- Same `.vibe-forge-root` sentinel check as other prompts
- Language detection from user's first message
- Mode detection: `askUserQuestion` preferred, numbered Markdown fallback
- **New:** Verify `import/` folder exists and contains at least 1 file

#### Section 1: Supported Input Formats

| Format | How AI processes it |
|--------|-------------------|
| `.md` files (PRODUCT.md, DESIGN.md, architecture docs, action plans) | Read content, extract structured data |
| `.png` / `.jpg` / `.webp` (mockups, wireframes, screenshots) | Vision analysis — extract colors, layout patterns, component inventory, typography cues |
| `.txt` / `.pdf` | Read as unstructured text, extract what's recognizable |
| Exported project folders (Claude Design, v0, etc.) | Read code files for stack detection, component patterns, design tokens |

#### Section 2: Inventory Phase

AI reads every file in `import/`, produces inventory table:

```
| # | File | Type | Size | Content summary (1 line) |
```

Then categorizes each file into extraction targets:
- **Product knowledge** → feeds PRODUCT.md, PROJECT_RULES.md placeholders
- **Design knowledge** → feeds DESIGN.md placeholders
- **Technical/stack** → feeds CODING_RULES.md, DATABASE.md, DEPLOYMENT.md placeholders
- **Visual/mockups** → feeds DESIGN.md (colors, typography, layout), component inventory
- **Action plan** → feeds STATE.md (planned features), PROJECT_MAP.md (structure)
- **Unknown** → shown to user, asked what it is

#### Section 3: Extraction Engine

The prompt contains a **Placeholder Extraction Map** — a comprehensive table mapping every `<<PLACEHOLDER>>` across all templates to:
- Which source doc type it's most likely found in
- What to look for (keywords, patterns, section headers)
- Confidence level rules (HIGH = exact match found, MEDIUM = inferred, LOW = guessed)

Example rows from the map:

| Placeholder | Look in | Search patterns | Confidence rule |
|-------------|---------|-----------------|-----------------|
| `<<PROJECT_NAME>>` | Any .md title/header, folder name | `# ProjectName`, first H1, repo name | HIGH if H1 found |
| `<<PROJECT_ONE_LINER>>` | Product doc intro, pitch section | "elevator pitch", first paragraph, subtitle | HIGH if labeled section |
| `<<FRONTEND_STACK>>` | Tech doc, architecture doc, package.json mentions | "React", "Next.js", "Svelte", framework names | HIGH if explicitly stated |
| `<<BRAND_PRIMARY>>` | Design doc, CSS/tokens, mockup analysis | hex/rgb/hsl values, "primary", "brand color" | HIGH if token found, MEDIUM if extracted from PNG |
| `<<FONT_PRIMARY>>` | Design doc, CSS, mockup OCR | font-family declarations, typography section | MEDIUM from mockups |
| `<<DATABASE_STACK>>` | Architecture doc, tech doc | "Postgres", "Supabase", "Firebase", "MongoDB" | HIGH if named |
| `<<AUTH_STRATEGY>>` | Architecture doc, security section | "authentication", "auth", "login", "SSO" | MEDIUM if mentioned but not detailed |

Full map covers all ~120 unique placeholders across 6 project-rules templates + 7 project-docs templates.

After extraction, AI builds an **Extraction Report**:

```markdown
## Extraction Report

### ✓ Extracted (high confidence) — 47 placeholders
| Placeholder | Value | Source file | Line/section |
...

### ~ Inferred (medium confidence) — 12 placeholders  
| Placeholder | Value | Source | Reasoning |
...

### ? Missing — 8 placeholders
| Placeholder | Needed for | Why it matters |
...

### 🤖 Will use defaults — 15 placeholders
| Placeholder | Default value | Same as short-mode default |
...
```

#### Section 4: User Confirmation of Extraction

Show extraction report. User can:
- Accept all → proceed to gap-fill
- Correct specific values → AI updates
- Flag "inferred" items as wrong → moves to gap-fill list

#### Section 5: Gap-Fill Questions

Only ask about **missing** and **user-rejected-inferred** placeholders. Questions grouped by topic (not scattered). Each question:
- States what's missing and why it matters
- Offers 3-4 options + "E) Let model decide"
- Shows what the default would be if skipped

Key: gap-fill questions reuse the EXACT same option sets from `INIT_PROMPT_standard.md` where applicable. No reinventing.

Escape hatches same as wizard: Option E per question, `/skip-remaining` fills rest with defaults.

#### Section 6: Pre-Generation Review

Same as wizard Section 11 confirmation:
- Full summary table with source column (✓ extracted / ● gap-filled / 🤖 defaulted)
- List of files that will be created
- "Ready to generate? Reply 'yes, generate'."

#### Section 7: Template Materialization

Identical to wizard — same template processing, same file generation order, same conditional blocks (`<<#IF_TDD_*>>`).

#### Section 8: Cleanup

Same options as wizard:
- A) Delete `templates/`, `INIT_PROMPT_*.md`, `.vibe-forge-root`, **`import/`**
- B) Archive under `.vibe-forge/used/` (including `import/`)
- C) Delete everything including `docs/`

#### Section 9: Failure Modes

Inherits wizard failure modes plus:
- **Empty import folder** → abort, tell user to add files
- **All placeholders missing** → suggest using wizard instead ("your docs don't contain enough structured info")
- **Conflicting info across files** → flag conflicts, ask user to resolve
- **Image-only import** → warn that visual extraction has limits, more gap-fill questions expected
- **Non-English docs** → detect language, confirm with user, proceed (vibe-forge is multilingual)

---

### 2. `import/README.md` (NEW — ~30 lines)

Short guide inside the import folder:

```markdown
# Import folder

Drop your existing project documents here before running the import wizard.

## Supported files
- .md files (PRODUCT.md, DESIGN.md, architecture plans, action plans)
- .png / .jpg (mockups, wireframes, screenshots)  
- .txt / .pdf (any text documents)
- Exported project folders (paste the folder contents here)

## Then
Paste `INIT_PROMPT_import.md` into your AI tool and follow the instructions.

## After import
This folder will be cleaned up automatically.
```

---

### 3. Updates to existing files

| File | Change | Why |
|------|--------|-----|
| `README.md` | Add Import Mode section under "Getting started" | User-facing docs |
| `.gitignore` | Add `import/` line | User files shouldn't be committed to vibe-forge |
| `docs/HOW_IT_WORKS.md` | Add "Import Mode" subsection explaining the philosophy | Maintainer docs |
| `docs/FRAMEWORK_CHANGELOG.md` | Add v1.4 entry | Release tracking |

---

## Placeholder Extraction Map — Source

The full extraction map (Section 3 of INIT_PROMPT_import.md) is derived from these template files. Here's the mapping by template:

### From `PRODUCT.md.template` (11 sections, ~25 placeholders)
- Product identity: `<<PROJECT_NAME>>`, `<<PROJECT_ONE_LINER>>`, `<<PROJECT_LONG_DESCRIPTION>>`
- Business context: `<<INDUSTRY>>`, `<<REGULATIONS>>`, `<<COMMERCIAL_MODEL>>`, `<<GEO_SCOPE>>`
- Audience: `<<PERSONA_*>>` (repeating), `<<ROLE_*>>` (repeating)
- Processes: `<<PROCESS_*>>`, `<<US_*>>` (user stories), `<<ENTITY_*>>` (data entities)
- Scope: `<<OUT_OF_SCOPE_*>>`, `<<TERM_*>>` (glossary), `<<OPEN_Q_*>>`

### From `DESIGN.md.template` (13 sections, ~30 placeholders)
- Colors: `<<BRAND_PRIMARY>>`, `<<BRAND_SECONDARY>>`, `<<NEUTRAL_BG>>`, `<<NEUTRAL_*>>`, `<<SEMANTIC_*>>`
- Typography: `<<FONT_PRIMARY>>`, `<<FONT_SECONDARY>>`, `<<FONT_MONO>>`, `<<SCALE_*>>`
- Layout: `<<SPACING_SCALE>>`, `<<CONTAINER_*>>`, `<<GRID_*>>`
- Motion: `<<MOTION_*>>`, `<<SHADOW_*>>`, `<<RADIUS_*>>`
- Standards: `<<ICON_LIBRARY>>`, `<<WCAG_LEVEL>>`, `<<BRAND_TONE>>`

### From `PROJECT_RULES.md.template` (12 sections, ~20 placeholders)
- Stack: `<<FRONTEND_STACK>>`, `<<BACKEND_STACK>>`, `<<DATABASE_STACK>>`, `<<AUTH_STACK>>`, `<<STORAGE_STACK>>`, `<<HOSTING_STACK>>`, `<<CICD_STACK>>`, `<<OBSERVABILITY_STACK>>`
- Language: `<<DOCS_LANGUAGE>>`, `<<CODE_COMMENT_LANGUAGE>>`, `<<UI_LANGUAGE>>`, `<<COMMIT_LANGUAGE>>`
- Security: `<<AUTH_STRATEGY>>`, `<<AUTHZ_STRATEGY>>`, `<<SECRETS_PROVIDER>>`, `<<PII_POLICY>>`

### From `CODING_RULES.md.template` (~15 placeholders)
- Naming: `<<FILE_NAMING>>`, `<<FOLDER_NAMING>>`, `<<COMPONENT_NAMING>>`, `<<HOOK_NAMING>>`
- Workflow: `<<COMMIT_MESSAGE_STYLE>>`, `<<BRANCH_NAMING>>`, `<<POC_OR_PROD>>`
- Tech: `<<DATA_LAYER>>`, `<<LOGGER_NAME>>`, `<<MIN_VIEWPORT_WIDTH>>`

### From `DATABASE.md.template` (~15 placeholders)
- Schema: `<<ENTITY_*>>` (repeating), `<<MIGRATION_NAMING>>`, `<<MIGRATION_TOOL>>`
- Policy: `<<DEFAULT_ROW_POLICY>>`, `<<TIMESTAMP_TRIGGER>>`, `<<DB_TYPES_FILE>>`
- Ops: `<<BACKUP_*>>`, `<<LOCAL_DB_INSTRUCTIONS>>`, `<<SEED_CMD>>`, `<<RESET_CMD>>`

### From `DEPLOYMENT.md.template` (~20 placeholders)
- Infra: `<<PORT>>`, `<<HOSTING_REGIONS>>`, `<<DEPLOY_METHOD>>`
- URLs: `<<STAGING_URL>>`, `<<PROD_URL>>`, `<<APEX_DOMAIN>>`
- Ops: `<<ERROR_TRACKING>>`, `<<UPTIME_URL>>`, `<<LOG_DRAIN>>`

---

## Implementation Order

### Phase A: Core prompt (INIT_PROMPT_import.md)
1. Write complete `INIT_PROMPT_import.md` with all 9 sections
2. Include full Placeholder Extraction Map inline (this IS the engine — no external code)
3. Include gap-fill question bank (reused from standard prompt's option sets)
4. Include same wrap-up / generation / cleanup flow as wizard

### Phase B: Supporting files
5. Create `import/README.md` guide
6. Update `.gitignore` — add `import/`

### Phase C: Documentation updates
7. Update `README.md` — add Import Mode section
8. Update `docs/HOW_IT_WORKS.md` — add Import Mode philosophy
9. Update `docs/FRAMEWORK_CHANGELOG.md` — v1.4 entry

### Phase D: Cross-reference
10. Add import mode mention in `INIT_PROMPT_standard.md` Section 0 (one line: "Already have docs? See `INIT_PROMPT_import.md`")
11. Add same mention in `INIT_PROMPT_short.md` Section 0
12. Add same mention in `INIT_PROMPT_deep.md` Section 0

---

## Key Design Decisions

### Why a separate INIT_PROMPT file (not a flag/mode in existing prompts)?
- Keeps existing prompts untouched (non-destructive)
- Import flow is fundamentally different (read-then-ask vs ask-from-scratch)
- Consistent with vibe-forge pattern: one prompt file = one flow
- Easy to delete after use

### Why an `import/` folder (not inline paste)?
- Multiple files need processing (PRODUCT.md + DESIGN.md + PNGs + more)
- PNGs can't be pasted inline in most tools
- Folder gives clear staging area
- Cleaned up after import (same as templates/)

### Why include the full extraction map in the prompt?
- No runtime/CLI available — the AI tool IS the runtime
- Map gives AI structured instructions for extraction (not vague "figure it out")
- Reproducible: any AI tool reading the prompt extracts the same way
- Maintainable: map lives next to the templates it references

### How does PNG/mockup extraction work?
- Vision-capable models (Claude, GPT-4V) analyze images directly
- Extract: dominant colors (→ `<<BRAND_PRIMARY>>`), typography style, layout patterns, component types
- Confidence always MEDIUM or LOW for visual extraction
- More gap-fill questions expected when import is image-heavy
- Non-vision models: skip images, flag as unprocessable, ask more questions

### Conflict resolution strategy
- If two files disagree (e.g., PRODUCT.md says "React" but architecture doc says "Vue"):
  - Flag conflict in extraction report
  - Ask user once: "Your PRODUCT.md says React, your architecture doc says Vue. Which is correct?"
  - Never silently pick one

---

## Verification Plan

### Self-test (user's stated goal)
1. User creates `import/` folder with their existing PRODUCT.md, DESIGN.md, architecture plan, PNGs
2. User pastes `INIT_PROMPT_import.md` into Claude Code
3. Verify: inventory phase lists all files correctly
4. Verify: extraction report shows reasonable placeholder values
5. Verify: gap-fill only asks about truly missing items
6. Verify: generated output files are complete and correct
7. Verify: cleanup removes import/ folder

### Regression check
8. Run standard wizard (`INIT_PROMPT_standard.md`) — verify unchanged behavior
9. Run short wizard (`INIT_PROMPT_short.md`) — verify unchanged behavior
10. Verify `.gitignore` correctly ignores `import/`

### Edge cases to test
11. Empty import/ folder → should abort gracefully
12. Single file import (just PRODUCT.md) → should work, more gap-fill questions
13. Image-only import → should warn, extract what it can from vision
14. Non-English docs → should detect and proceed
15. Docs that contradict each other → should flag conflicts

---

## Estimated Size

| File | Lines | Notes |
|------|-------|-------|
| `INIT_PROMPT_import.md` | ~300-350 | Core prompt with extraction map |
| `import/README.md` | ~25 | Short guide |
| README.md changes | ~20 lines added | New section |
| HOW_IT_WORKS.md changes | ~15 lines added | New subsection |
| FRAMEWORK_CHANGELOG.md | ~10 lines added | v1.4 entry |
| .gitignore | 1 line added | `import/` |
| INIT_PROMPT_*.md (3 files) | 1 line each | Cross-reference |

Total new content: ~400 lines. Total modifications: ~50 lines across 6 files.

---

## Reference: Template Files to Read During Implementation

These files must be open/referenced when writing the extraction map:

```
templates/project-rules/PRODUCT.md.template
templates/project-rules/DESIGN.md.template
templates/project-rules/PROJECT_RULES.md.template
templates/project-rules/CODING_RULES.md.template
templates/project-rules/DATABASE.md.template
templates/project-rules/DEPLOYMENT.md.template
templates/project-docs/STATE.md.template
templates/project-docs/CHANGELOG.md.template
templates/project-docs/CLIENT_DOCS.md.template
templates/project-docs/PROJECT_MAP.md.template
templates/project-docs/RELEASE_NOTES.md.template
templates/project-docs/LESSONS.md.template
templates/agent-configs/claude-code/CLAUDE.md.template
templates/agent-configs/cursor/.cursorrules.template
templates/agent-configs/codex/AGENTS.md.template
templates/agent-configs/windsurf/.windsurfrules.template
templates/agent-configs/copilot/.github/copilot-instructions.md.template
templates/agent-configs/lovable/LOVABLE_PROJECT_KNOWLEDGE.md.template
INIT_PROMPT_standard.md  (for gap-fill question reuse + Section 11 generation flow)
INIT_PROMPT_short.md     (for default values reference)
```

## Reference: INIT_PROMPT_standard.md Question → Placeholder Mapping

This mapping is essential for building the gap-fill question bank. Each standard wizard question feeds specific placeholders:

| Question | Placeholders fed |
|----------|-----------------|
| Q1.1 AI tools | Agent config file selection |
| Q1.2 Hooks scope | Hook installation path |
| Q2.1 Project name | `<<PROJECT_NAME>>` everywhere |
| Q2.2 One-liner | `<<PROJECT_ONE_LINER>>` |
| Q2.3 Audience + type | `<<PERSONA_*>>`, `<<INDUSTRY>>` |
| Q2.4 Existing codebase | Generation strategy (merge vs clean) |
| Q3.1 Stack preset | `<<FRONTEND_STACK>>`, `<<BACKEND_STACK>>`, `<<DATABASE_STACK>>`, `<<AUTH_STACK>>`, `<<STORAGE_STACK>>`, `<<HOSTING_STACK>>` |
| Q3.2 Auth strategy | `<<AUTH_STRATEGY>>`, `<<AUTHZ_STRATEGY>>` |
| Q3.3 Multi-tenancy | `<<AUTHZ_STRATEGY>>` detail |
| Q3.4 Storage | `<<STORAGE_STACK>>` |
| Q3.5 Environments | `<<STAGING_URL>>`, `<<PROD_URL>>`, env config |
| Q3.6 CI/CD | `<<CICD_STACK>>`, `<<DEPLOY_METHOD>>` |
| Q4.1 Design vibe | `<<DESIGN_PHILOSOPHY_PARAGRAPH>>`, `<<BRAND_TONE>>` |
| Q4.2 Dark mode | Dark palette in DESIGN.md |
| Q4.3 Design uniqueness | Design quality hook toggle |
| Q5.1 Data model | `<<ENTITY_*>>` in DATABASE.md and PRODUCT.md |
| Q5.2 PII / regulatory | `<<PII_POLICY>>`, `<<REGULATIONS>>` |
| Q5.3 Realtime | DATABASE.md realtime section |
| Q6.1 Error tracking | `<<ERROR_TRACKING>>`, `<<OBSERVABILITY_STACK>>` |
| Q6.2 Secrets management | `<<SECRETS_PROVIDER>>` |
| Q6.3 Deployment platform | `<<HOSTING_STACK>>`, `<<HOSTING_REGIONS>>`, DEPLOYMENT.md |
| Q7.1 Testing tier | TDD conditional blocks in CLAUDE.md, CODING_RULES.md |
| Q7.2 Pre-commit checks | Hook configuration |
| Q7.3 POC or production | `<<POC_OR_PROD>>` |
| Q7.4 Code comment language | `<<CODE_COMMENT_LANGUAGE>>` |
| Q8.1 Doc language | `<<DOCS_LANGUAGE>>` |
| Q8.2 UI language | `<<UI_LANGUAGE>>`, `<<COMMIT_LANGUAGE>>` |
| Q8.3 Generate walkthrough | CLIENT_DOCS.md generation toggle |
| Q9.1 Atomic prompts folder | Folder path + numbering style |
| Q9.2 Seed prompts | Initial atomic prompt generation |
| Q10.1 Cleanup | Post-generation file deletion |
| Q10.2 Re-init git | Git repository reset |
