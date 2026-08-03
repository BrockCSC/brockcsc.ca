# Brock Computer Science Club

The public site and admin panel for the Brock University Computer Science Club — a single Next.js app (App Router) with API routes, Postgres via Drizzle ORM, and Keycloak-backed admin auth.

- Next.js: 16.1.4
- React: 19.2.3
- Tailwind CSS: 4.0
- Drizzle ORM + Postgres
- Node.js >= 22

---

## Development

### Prerequisites

- [Node][node] >= 22
- [npm][npm] >= 10
- A reachable Postgres instance (see `.env.example`)

[node]: https://nodejs.org/en/download/
[npm]: https://www.npmjs.com/get-npm

### Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, KEYCLOAK_*, SESSION_JWT_SECRET
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000). Migrations run automatically before the dev server starts (`predev` → `scripts/migrate.mjs`); run `npm run db:migrate` manually any other time.

### Project layout

- `app/` — pages and API routes (App Router). `app/api/**/route.ts` are the HTTP endpoints the admin panel calls.
- `lib/db/` — Drizzle schema, connection pool, and the generic jsonb CRUD repository shared by `events` and `execs`.
- `lib/auth/` — Keycloak token exchange and the app's own signed session cookie.
- `lib/api/` — client-side fetch helpers used by `"use client"` components.
- `drizzle/` — generated SQL migrations (`npm run db:generate` after changing `lib/db/schema.ts`).
- `scripts/migrate.mjs` — applies pending migrations. Deliberately a plain Node script outside the Next.js bundle (not `instrumentation.ts`) — `pg`'s optional native bindings don't play well with webpack's dev/edge bundling otherwise. Run before the server starts, both locally (`predev`) and in the Docker image (`CMD`).

### Commands

| Command                                                       | Description                                           |
| ------------------------------------------------------------- | ----------------------------------------------------- |
| `npm run dev`                                                 | Start the dev server                                  |
| `npm run build`                                               | Production build (`output: "standalone"`)             |
| `npm run start`                                               | Run the production build                              |
| `npm run lint` / `npm run typecheck` / `npm run format:check` | CI checks                                             |
| `npm run db:generate`                                         | Regenerate Drizzle migrations from `lib/db/schema.ts` |

## Deployment

Every push runs `.github/workflows/ci.yml`'s checks, then waits for the matching [GitHub Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)'s required reviewers to approve (`dev` for any branch, `uat` for `main`, `production` for version tags). Approval triggers a Komodo Action (`komodo/actions/deploy.ts`) that builds the image **on the VPS itself** and deploys it — GitHub Actions never builds or pushes a Docker image or touches app secrets; it only holds `KOMODO_API_KEY`/`KOMODO_API_SECRET`.

Komodo resources (`Build`, `Stack`s, `Action`s) are declared in `komodo/resources.toml` and kept in sync from this repo by a `ResourceSync`. `komodo/actions/*.ts` are the human-readable source for the two Actions — their actual (identical) contents are embedded in `resources.toml`'s `file_contents` fields, since Komodo can't include external files; keep both in sync by hand when editing.

### One-time Komodo setup

Before the first sync, in the Komodo UI:

1. Create Variables (Settings → Variables), marking secrets as such: `BROCKCSC_DB_PASSWORD`, `BROCKCSC_KEYCLOAK_ISSUER`, `BROCKCSC_KEYCLOAK_CLIENT_ID`, `BROCKCSC_KEYCLOAK_CLIENT_SECRET`, `BROCKCSC_SESSION_JWT_SECRET`, `GITHUB_TOKEN` (a PAT with read access to list branches/commits, used only by the preview-sweep schedule).
2. Confirm a `ghcr.io` registry account named `brockcsc` exists in Komodo Core's docker registry config (a GitHub PAT with `write:packages`) — `komodo/resources.toml`'s `[[build]]` pushes there.
3. Create a `ResourceSync` pointed at this repo (`komodo/resources.toml`), or let the one declared in the TOML itself pick it up once applied manually the first time.

Deploys always go through `komodo/actions/deploy.ts` (dispatched by CI after review approval) — the Stack webhooks in `resources.toml` are deliberately `webhook_enabled = false`, since a raw git-push webhook would deploy before the GitHub review gate approves.

### Database contract

- `DATABASE_URL` points at **one shared** Postgres database, the same for every environment.
- `DB_SCHEMA` selects the Postgres **schema** used by this environment inside that database (`prod`, `uat`, `dev`, or a `preview_<slug>` per branch). Must match `^[a-z0-9_]+$`; defaults to `public`.
- On boot, the app runs `CREATE SCHEMA IF NOT EXISTS "<DB_SCHEMA>"` and applies every migration in `drizzle/` against that schema, with the migration-tracking table living in the same schema — so each environment tracks its own applied-migrations state independently.
- All pooled connections pin `search_path` to `<DB_SCHEMA>`, so unqualified table names in queries resolve correctly.
- One-time, outside the app: the shared `brockcsc` database and `brockcsc` role must exist, and `brockcsc` must own the database (or hold `CREATE` on it) so it can create its own schemas.

### Auth

Admin login exchanges a username/password against Keycloak (`KEYCLOAK_ISSUER`, resource-owner password grant), checks for the `ADMIN_ROLE` realm role, and issues the app's own signed session cookie (`SESSION_JWT_SECRET`) — Keycloak is never queried again for the life of that cookie.
