# /deploy-guide

Generate or refresh a step-by-step DEPLOYMENT.md for this project.

## Process

1. **Identify platform** — read STATE.md or ask user if unknown
2. **Research live docs** — fetch official deployment docs for the platform (always use WebSearch/WebFetch for current docs, never rely on training data)
3. **Write DEPLOYMENT.md** in project root — overwrite if exists
4. **List 5 post-deploy checks** at end of the runbook
5. Print path to created file

## Output structure (DEPLOYMENT.md)

```markdown
# Deployment Guide — <Platform>
_Generated: <date>. Refresh with `/deploy-guide`._

## Prerequisites
- [ ] <requirement>

## Environment variables
| Variable | Description | Required |
|----------|-------------|----------|
| ...      | ...         | Yes/No   |

## Step 1 — Staging deploy
<commands>

## Step 2 — Production deploy
<commands>

## Post-deploy verification
1. <check>
2. <check>
3. <check>
4. <check>
5. <check>

## Rollback
<rollback steps>

## Estimated cost
<monthly cost estimate if applicable>
```

## Research priority

1. Official platform docs (Vercel, Railway, Netlify, etc.)
2. Framework-specific deployment guide (Next.js on Vercel, etc.)
3. Database connection guide if project uses DB

## Rules

- Always fetch live docs — platform UIs and CLI flags change
- Note if docs seem stale (>6 months old)
- Runbook only — no explanations, only commands and checklists
- Overwrite existing DEPLOYMENT.md without asking
