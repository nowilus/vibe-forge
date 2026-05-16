# /project-health

Run 10 health checks and produce a status dashboard for this project.

## Checks

| # | Check | Tool |
|---|-------|------|
| 1 | Hardcoded secrets scan | grep patterns in src/ |
| 2 | TypeScript errors | `tsc --noEmit` |
| 3 | Dependency vulnerabilities | `npm audit` |
| 4 | Unused dependencies | `depcheck` |
| 5 | Docs freshness | git log STATE.md CHANGELOG.md (last modified) |
| 6 | Test coverage | parse coverage report or run `npm test -- --coverage` |
| 7 | Build health | `npm run build` |
| 8 | Dead exports | `ts-prune` if available |
| 9 | Bundle size | parse build output for size warnings |
| 10 | LESSONS.md activity | git log LESSONS.md (last entry date) |

## Status icons

- ✅ Pass
- ⚠️ Warning (fixable, not blocking)
- ❌ Fail (blocking)
- ⬜ Skipped (tool not available)

## Output format

```markdown
# Project Health Dashboard
_Run: <timestamp>_

| Check | Status | Detail |
|-------|--------|--------|
| Secrets | ✅ | No patterns found |
| TypeScript | ⚠️ | 3 errors |
| npm audit | ❌ | 2 critical vulnerabilities |
| ...    | ...    | ...    |

## Action items
1. ❌ Fix 2 critical npm vulnerabilities: `npm audit fix`
2. ⚠️ Resolve 3 TypeScript errors
3. ⬜ Install ts-prune for dead export detection
```

## Rules

- Report only — do not auto-fix
- Skip checks where tool is unavailable (mark ⬜)
- Sort action items: ❌ → ⚠️ → ⬜
- Always run all 10 checks, even if earlier ones fail
