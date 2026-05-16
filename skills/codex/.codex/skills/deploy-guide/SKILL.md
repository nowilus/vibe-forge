# deploy-guide

Generate or refresh DEPLOYMENT.md for this project.

## Process

1. Read STATE.md to identify deployment platform; ask if unclear
2. Search web for current official deployment docs for the platform
3. Write DEPLOYMENT.md to project root (overwrite if exists)
4. Include prerequisites, env vars table, staging steps, production steps, 5 post-deploy checks, rollback
5. Confirm completion

## Rules

- Always fetch live documentation — do not use training data for deployment steps
- Runbook format only: commands and checklists, no prose
- Overwrite existing DEPLOYMENT.md without asking
- Note if docs seem outdated (>6 months)
