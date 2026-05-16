# project-health

Run health checks and produce a status dashboard for this project.

## Checks to run

1. Hardcoded secrets scan (grep src/ for API key patterns)
2. TypeScript errors (`tsc --noEmit`)
3. Dependency vulnerabilities (`npm audit`)
4. Unused dependencies (`depcheck`)
5. Docs freshness (last modified date of STATE.md, CHANGELOG.md)
6. Test coverage (`npm test -- --coverage`)
7. Build health (`npm run build`)
8. Dead exports (`ts-prune` if installed)
9. Bundle size (parse build output)
10. LESSONS.md last activity

## Status icons

✅ Pass | ⚠️ Warning | ❌ Fail | ⬜ Skipped

## Output format

Markdown table with Check / Status / Detail columns, followed by sorted action items (❌ first, then ⚠️, then ⬜).

## Rules

- Report only, do not auto-fix
- Skip unavailable tools (mark ⬜)
- Run all 10 checks even if some fail
