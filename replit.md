# Student Management System

A responsive college administration dashboard for managing student records, courses, departments, and academic settings.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/student-management run dev` — run the student management website
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/student-management/index.html`, `style.css`, and `app.js` — student management interface and browser-side behavior
- Student, course, department, theme, and preference data are stored in browser Local Storage.
- `lib/api-spec/openapi.yaml` — shared API contract for the API server (not used by this app)

## Architecture decisions

- The student management app is intentionally frontend-only and uses Local Storage, as specified by the project brief.
- Records are browser-local; they are not shared between devices or users.

## Product

- Dashboard with student totals, recent additions, and activity.
- Student record creation, viewing, editing, deletion, search, filtering, sorting, pagination, and CSV export.
- Course and department overview with course management and enrollment counts.
- Settings for themes and restoring demo data.

## User preferences

- Use HTML, CSS, and vanilla JavaScript with separate source files.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
