# vibe-forge — INIT_PROMPT (deep, ~60+ questions)

> Audit-grade interview. Use this for SaaS products, multi-tenant systems, regulated industries, or any project where "I forgot to think about X" would be expensive to fix later.
>
> Rules, lifecycle, escape hatches, and generation flow are identical to `INIT_PROMPT_standard.md`. The **only** difference is that every section asks **2–5 follow-up questions** inside it. The full superset is below. Treat the standard prompt as the spine; the questions here are its extensions.

---

## 0. Preflight (identical to standard)

- 0.1 Path check (`.vibe-forge-root`).
- 0.2 Language detection.
- 0.3 `askUserQuestion` preferred, numbered Markdown fallback.
- 0.4 Explain option E and `/skip-section` ONCE before Q1.

## 1. Interview rules (identical to standard)

One question per turn. No file writes until the wrap-up confirmation. Mark auto-filled answers 🤖.

---

## 2. The interview — extended set

For brevity, the standard set is referenced by ID and only the **extra** deep questions are listed in full. Ask the standard question first, then its follow-ups, in this order.

### Section 1 — Tooling

- **Q1.1** (standard) — which AI tools? (multi-choice).
- **Q1.1a** — primary daily driver tool? Single choice from Q1.1 selections.
- **Q1.1b** — do you intend to switch tools mid-project? If yes, prioritise generating *all* selected agent configs so switching is friction-free.
- **Q1.2** (standard) — `/atomic-prompts` skill placement.
- **Q1.2a** — should the skill also enforce a per-prompt size budget? (A: yes, hard cap at N lines; B: no; C: model decides — default A with N=400.)

### Section 2 — Product

- **Q2.1**–**Q2.4** standard.
- **Q2.5** — long-form description (paragraph). If empty, model drafts from Q2.2.
- **Q2.6** — commercial model: free / freemium / one-off / subscription / internal / open-source.
- **Q2.7** — geographic scope (countries / continents) — affects locale and regulatory defaults.
- **Q2.8** — top 3 use cases, in order. Free-text, three bullets.
- **Q2.9** — what is explicitly **out of scope** (3 bullets)? This is the "do not fix this" list.
- **Q2.10** — top 3 success metrics (number of users? revenue? specific user action?).

### Section 3 — Stack

- **Q3.1**–**Q3.6** standard.
- **Q3.7** — package manager (npm / pnpm / yarn / bun / pip / poetry / uv / go modules / cargo / …).
- **Q3.8** — language style (TypeScript strict? Python type-hinted? Go vet-clean?). Choose strictness level.
- **Q3.9** — routing library / approach (file-based, code-based, TanStack Router, React Router, …).
- **Q3.10** — UI component library (shadcn/ui, MUI, Chakra, Mantine, Ant, Tailwind only, custom). Picks downstream `DESIGN.md` defaults.
- **Q3.11** — form library (react-hook-form + zod, formik, native, Conform, custom).
- **Q3.12** — state management (server-only / TanStack Query / Zustand / Redux / Jotai / signals / none).
- **Q3.13** — feature-flag system (none / config flags / LaunchDarkly / Flagsmith / Unleash / custom).

### Section 4 — Design

- **Q4.1**–**Q4.3** standard.
- **Q4.4** — typography (font family choice + scale family: major-third / minor-third / golden ratio / custom).
- **Q4.5** — density (compact / cozy / comfortable). Influences spacing scale.
- **Q4.6** — radius style (sharp / soft / pill / mixed).
- **Q4.7** — motion intensity (none / subtle / playful) — set duration & easing tokens.
- **Q4.8** — icon library (Lucide / Heroicons / Phosphor / Material / custom). No mixing rule.
- **Q4.9** — accessibility target (WCAG AA / AAA / informal).
- **Q4.10** — illustration style (none / abstract / mascot / photographic) — affects `DESIGN.md` "voice".

### Section 5 — Data model

- **Q5.1**–**Q5.3** standard.
- **Q5.4** — soft-delete vs hard-delete default policy.
- **Q5.5** — audit columns set (`created_at`, `updated_at`, `created_by`, `updated_by`, version?).
- **Q5.6** — search strategy (DB ILIKE / full-text / Postgres tsvector / external — Algolia / Meilisearch / Typesense / none).
- **Q5.7** — file metadata pattern (store in DB + storage URL / store metadata only / store everything in DB).
- **Q5.8** — historical data / time-travel (none / event sourcing / temporal tables / soft snapshots).
- **Q5.9** — primary key style (uuid / cuid / nanoid / serial / ULID).

### Section 6 — Security & compliance

- **Q6.1**–**Q6.3** standard.
- **Q6.4** — MFA / 2FA policy (none / optional / required for admins / required for all).
- **Q6.5** — session lifetime + idle timeout.
- **Q6.6** — password policy (length, rotation, breach check).
- **Q6.7** — rate limiting (none / per-IP / per-user / both).
- **Q6.8** — CSRF / CORS posture (default-strict, allow-list, none).
- **Q6.9** — Content Security Policy (off / report-only / enforced).
- **Q6.10** — audit log requirement (none / app-level / DB triggers / external SIEM).
- **Q6.11** — data retention policy per entity (days/years/forever).
- **Q6.12** — data export / right-to-be-forgotten flow.

### Section 7 — Deployment & ops

- **Q7.1**–**Q7.3** standard.
- **Q7.4** — runtime (Node version / Bun / Deno / Python version / Go version).
- **Q7.5** — container vs native deploy.
- **Q7.6** — CDN (provider's default / Cloudflare / Fastly / none).
- **Q7.7** — backups (provider default / daily snapshot / PITR / off-site mirror).
- **Q7.8** — metrics backend (provider default / Grafana Cloud / Datadog / none).
- **Q7.9** — uptime monitoring (none / UptimeRobot / Better Stack / Statuspage).
- **Q7.10** — incident channel (none / email / Slack / PagerDuty).
- **Q7.11** — on-call schedule (none / informal / rota).

### Section 8 — Documentation policy

- **Q8.1**–**Q8.3** standard.
- **Q8.4** — code-doc tool (JSDoc only / TypeDoc / Sphinx / mkdocs / none).
- **Q8.5** — automated doc generation in CI? (yes/no).
- **Q8.6** — diagram tool (none / Mermaid in markdown / external / draw.io).
- **Q8.7** — Release Notes audience (devs / end-users / both).

### Section 9 — Atomic prompts skill

- **Q9.1**–**Q9.2** standard.
- **Q9.3** — per-prompt template overrides (none / domain-specific sub-templates — describe).
- **Q9.4** — auto-link to prompts in `CHANGELOG.md` entries? (recommended yes).

### Section 10 — Testing & quality

A whole section that does **not** exist in standard or short:

- **Q10.1** — testing layers (unit / integration / e2e / visual / load — multi-choice).
- **Q10.2** — coverage target (none / aspirational / hard threshold % — specify).
- **Q10.3** — e2e tool (Playwright / Cypress / WebdriverIO / Detox / none).
- **Q10.4** — preview environment for QA? (yes / no).
- **Q10.5** — accessibility tests in CI? (axe-core / pa11y / none).
- **Q10.6** — performance budget (LCP / TBT / bundle size) — specify thresholds or "let the model decide".

### Section 11 — Team & process

- **Q11.1** — team size (solo / 2-5 / 6-15 / 16+).
- **Q11.2** — Code review policy (none / informal / required + 1 reviewer / required + 2 reviewers).
- **Q11.3** — Branch naming (free-form / `<type>/<slug>` / `<initials>/<slug>` / Jira-style `<ABC-123>-…`).
- **Q11.4** — Commit message style (free-form / Conventional Commits / Gitmoji / custom).
- **Q11.5** — PR template needed (yes/no).

### Section 12 — Cleanup & repository hygiene

- **Q12.1** (standard Q10.1) — what to do with `templates/`, etc.
- **Q12.2** (standard Q10.2) — re-init git.
- **Q12.3** — initial commit message style (Conventional / free).
- **Q12.4** — install pre-commit hooks (none / lint-staged / husky / lefthook / pre-commit framework)?

---

## 3. Wrap-up & confirmation

Same as `INIT_PROMPT_standard.md` Section 11, with **extra rigour**:

1. Summarise every section in its own sub-table.
2. Highlight any contradictions detected (e.g. `Q5.3 = DB-level` but `Q3.3 = SQLite` — flag because SQLite has no RLS).
3. Ask: **"Ready to generate? Reply 'yes, generate'. Or 'change Q2.6 to subscription'. Or 'explain Q6.10 again'."**
4. On `yes, generate`:
   - Materialise every template (same superset as standard, including `LESSONS.md`).
   - Additionally write **section stubs** for any extra topic raised here (testing, performance budgets, on-call) into the relevant rules files (`CODING_RULES.md`, `DEPLOYMENT.md`, `PROJECT_RULES.md`).
   - Add a `### Security` block to `PROJECT_RULES.md` summarising MFA / session / rate-limit / audit-log answers.
   - Add testing config stubs to the project root only if Q10.3 ≠ none (e.g. `playwright.config.ts.template`-style stub written from your knowledge — not from a template file in this framework, because we deliberately do not ship code).
   - Run cleanup per Q12.1.
   - Run git init per Q12.2 + initial commit using Q12.3 style.
5. Print the same post-interview cleanup checklist as the standard prompt (which includes `LESSONS.md`), **plus** a "deep-mode extras" sub-checklist with items for tests / perf / on-call configured during the interview.

## 4. Failure modes

Same list as `INIT_PROMPT_standard.md` Section 13, plus:

- ❌ Failing to flag contradictions between sections (e.g. "no auth" + "MFA required").
- ❌ Forgetting to enumerate every deep-mode topic in the final summary.
- ❌ Generating test config files in the framework (we do not ship code, only templates).

## 5. Now begin

Acknowledge the path check and escape-hatch policy, then ask **Q1.1**. One question per turn. This will take a while — pace yourself.
