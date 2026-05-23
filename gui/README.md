# vibe-forge-ui

Local dashboard for [vibe-forge](../README.md) projects. Fastify API + React 18/Vite SPA.

## Quick start

```bash
cd gui
npm install
npm run dev
```

| URL | What |
|-----|------|
| `http://localhost:5173` | React client (Vite dev server) |
| `http://localhost:7432` | Fastify API + static file server |
| `http://localhost:7432/api/*` | REST endpoints |

> The dashboard reads the **parent of `gui/`** as the project root. Run `npm run dev` from inside `gui/`, not from the repo root.

## Screens

| Screen | Route | API endpoint |
|--------|-------|-------------|
| Home | `/` | `GET /api/project` |
| Docs | `/docs` | `GET /api/docs` |
| Health | `/health` | `GET /api/health` |
| Prompts | `/prompts` | `GET /api/prompts`, `POST /api/prompts`, `GET /api/prompts/:file` |
| Hooks Monitor | `/hooks` | `GET /api/hooks` |
| Setup | `/setup` | `GET /api/setup/status`, `POST /api/setup/preview`, `POST /api/setup/generate`, `GET /api/import/status`, `POST /api/import/extract` |

## API reference

### `GET /api/project`
Returns `{ name, root, stateExists }`.

### `GET /api/health`
Runs all 10 health checks in parallel. Returns:
```json
{
  "score": 85,
  "runAt": "2025-05-17T10:00:00.000Z",
  "checks": [{ "name": "secrets", "status": "pass", "label": "Clean", "detail": "" }],
  "history": [{ "runAt": "...", "score": 85 }]
}
```
History is saved to `.vibe-forge/health-history.json` in the project root (last 90 entries).

### `GET /api/prompts`
Lists all `.md` files in `atomic-prompts/`. Returns `{ prompts: PromptFile[] }`.

### `GET /api/prompts/:file`
Returns a single prompt file with parsed frontmatter. `:file` must be a plain filename (no path separators).

### `POST /api/prompts`
Creates a new prompt file. Body: `{ filename, title, status, content }`.

### `GET /api/hooks`
Reads `.claude/settings.json` and `.vibe-forge/hook-events.json` from the project root.
Returns `{ hooks, totalDefined, totalKnown, settingsFound, recentEvents }`.

### `GET /api/setup/status`
Returns whether vibe-forge scaffolding is still present: `{ initialized, hasTemplates, hasInitPrompt, hasVibeForgRoot }`.

### `POST /api/setup/preview`
Accepts `WizardAnswers` body, returns a preview list of files that would be generated.

### `POST /api/setup/generate`
Accepts `WizardAnswers` body, materializes all project-rules and project-docs templates with the provided values. Returns `{ filesWritten: string[] }`.

### `GET /api/import/status`
Checks whether an `import/` folder exists at the project root and lists its files.
Returns `{ exists: boolean, files: string[] }`.

### `POST /api/import/extract`
Reads all files in `import/`, runs the regex-based extraction engine, and returns pre-filled `WizardAnswers` with a confidence map.
Returns `{ answers: WizardAnswers, confidence: Record<keyof WizardAnswers, "high"|"medium"|"low"|"default">, filesRead: string[] }`.

## Health checks

| # | Check | Tool used |
|---|-------|-----------|
| 1 | Secret scan | Regex patterns |
| 2 | TypeScript errors | `tsc --noEmit` |
| 3 | npm audit | `npm audit --json` |
| 4 | Unused deps | `depcheck` |
| 5 | Docs freshness | `STATE.md` mtime |
| 6 | Test coverage | `nyc`/`c8`/`vitest` coverage summary |
| 7 | Build health | `npm run build` |
| 8 | Dead exports | `ts-prune` |
| 9 | Bundle size | `dist/` directory size |
| 10 | LESSONS.md activity | Entry count in the last 7 days |

## Production build

```bash
npm run build   # outputs React build to dist/
npm run start   # serves dist/ from Fastify on port 7432
```

## Tech stack

| Layer | Technology |
|-------|-----------|
| API server | Fastify v5 + TypeScript (`tsx watch`) |
| Client | React 18, React Router v6, Tailwind CSS v4, Vite 6 |
| Icons | Lucide React |
| Dev runner | `concurrently` (server + client in one terminal) |
