# deploy-guide

Generate or refresh a step-by-step DEPLOYMENT.md for this project.

## Process

1. Identify deployment platform from STATE.md or ask user
2. Research current official docs for the platform (search web for latest docs)
3. Write DEPLOYMENT.md to project root (overwrite if exists)
4. Include 5 post-deploy verification checks
5. Confirm file path on completion

## Output structure (DEPLOYMENT.md)

```markdown
# Deployment Guide — <Platform>
_Generated: <date>. Refresh by running deploy-guide command._

## Prerequisites
- [ ] <requirement>

## Environment variables
| Variable | Description | Required |
|----------|-------------|----------|

## Step 1 — Staging deploy
<commands>

## Step 2 — Production deploy
<commands>

## Post-deploy verification
1–5. <checks>

## Rollback
<rollback steps>
```

## Rules

- Fetch current platform docs — CLI flags and UI change frequently
- Runbook only — commands and checklists, no prose explanations
- Overwrite existing DEPLOYMENT.md
