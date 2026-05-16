# project-health

Run 10 health checks and produce a dashboard.

## Checks

1. Secrets scan — grep src/ for hardcoded credentials
2. TypeScript — `tsc --noEmit`
3. Vulnerabilities — `npm audit`
4. Unused deps — `depcheck`
5. Docs freshness — git log STATE.md CHANGELOG.md
6. Test coverage — `npm test -- --coverage`
7. Build — `npm run build`
8. Dead exports — `ts-prune`
9. Bundle size — parse build output
10. LESSONS.md — last git activity

## Output

Markdown table: Check | Status (✅⚠️❌⬜) | Detail
Followed by action items sorted ❌ → ⚠️ → ⬜.

## Rules

- Report only, do not fix
- Skip unavailable tools (⬜)
- Run all 10 even if some fail
