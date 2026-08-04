<div align="center">

<img src="public/logo.svg" alt="Brock CSC" width="88" height="88" />

# BROCK COMPUTER SCIENCE CLUB

<img src="https://readme-typing-svg.demolab.com/?font=JetBrains+Mono&weight=800&size=22&pause=1200&color=9A4440&center=true&vCenter=true&width=600&lines=Code.+Connect.+Create.;Events+%2B+Team+%2B+CS+Guide+%2B+Admin+CMS;Next.js+16+%C2%B7+Drizzle+%C2%B7+Postgres+%C2%B7+Keycloak" alt="typing animation" />

<p>
  <img src="https://img.shields.io/badge/Next.js-16.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white&labelColor=000000" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-9A4440?style=for-the-badge&logo=react&logoColor=white&labelColor=000000" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-9A4440?style=for-the-badge&logo=typescript&logoColor=white&labelColor=000000" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-9A4440?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=000000" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-Drizzle-9A4440?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=000000" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Keycloak-Auth-9A4440?style=for-the-badge&logo=keycloak&logoColor=white&labelColor=000000" alt="Keycloak" />
</p>

**The public site and admin panel for the Brock University Computer Science Club.**
One Next.js app — marketing pages, an events/team CMS, and a student CS guide.

[Discord](https://discord.com/invite/qsctEK2) · [Instagram](https://www.instagram.com/brockcsc/) · [LinkedIn](https://www.linkedin.com/company/brockcsc)

</div>

<br />

<table width="100%">
<tr>
<td width="20%" align="center">🏠</td>
<td><strong>Home &amp; About</strong><br />Club intro, exec avatar wall, and a live preview of the next two events.</td>
</tr>
<tr>
<td align="center">📅</td>
<td><strong>Events</strong><br />One-off and recurring events (weekly/biweekly/monthly, with weekday rules), computed live against a Toronto-timezone schedule.</td>
</tr>
<tr>
<td align="center">🧑‍🤝‍🧑</td>
<td><strong>Team</strong><br />Current execs ranked by role, plus an alumni wall for past executives.</td>
</tr>
<tr>
<td align="center">📚</td>
<td><strong>CS Guide</strong><br />An open-source, student-written guide to course codes, program requirements, and campus resources.</td>
</tr>
<tr>
<td align="center">🛠️</td>
<td><strong>Admin CMS</strong><br />Keycloak-gated dashboard for managing events and executives — no database access required.</td>
</tr>
</table>

<br />

## Getting Started

**Prerequisites** — [Node.js](https://nodejs.org/en/download/) ≥ 22, [npm](https://www.npmjs.com/get-npm) ≥ 10, and a reachable Postgres instance.

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, KEYCLOAK_*, SESSION_JWT_SECRET
npm run dev
```

Open [localhost:3000](http://localhost:3000). Migrations run automatically before the dev server starts (`predev` → `scripts/migrate.mjs`); run `npm run db:migrate` manually any other time.

<table width="100%">
<tr><th align="left" width="45%">Command</th><th align="left">What it does</th></tr>
<tr><td><code>npm run dev</code></td><td>Start the dev server</td></tr>
<tr><td><code>npm run build</code></td><td>Production build (<code>output: "standalone"</code>)</td></tr>
<tr><td><code>npm run start</code></td><td>Run the production build</td></tr>
<tr><td><code>npm run lint</code> / <code>typecheck</code> / <code>format:check</code></td><td>CI checks</td></tr>
<tr><td><code>npm run db:generate</code></td><td>Regenerate Drizzle migrations from <code>lib/db/schema.ts</code></td></tr>
</table>

<br />

## Project Layout

```
app/            Pages and API routes (App Router).
                app/api/**/route.ts are the HTTP endpoints the admin panel calls.
lib/db/         Drizzle schema, connection pool, and the generic jsonb
                CRUD repository shared by events and execs.
lib/auth/       Keycloak token exchange and the app's own signed session cookie.
lib/api/        Client-side fetch helpers used by "use client" components.
lib/events/     Recurrence math and event-timing classification.
drizzle/        Generated SQL migrations (npm run db:generate after
                changing lib/db/schema.ts).
scripts/        migrate.mjs — a plain Node script (outside the Next.js
                bundle) that applies pending migrations before the app boots.
komodo/         Deploy + preview-cleanup automation, see below.
```

<br />

## Deployment

<details>
<summary><strong>Push → review gate → self-hosted build → deploy</strong> (click to expand)</summary>

<br />

Every push runs `.github/workflows/ci.yml`'s checks, then waits for the matching [GitHub Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)'s required reviewers to approve (`dev` for any branch, `uat` for `main`, `production` for version tags). On approval, the `deploy` job applies `komodo/resources.toml` (creating the `ResourceSync` itself on first run), upserts the app secrets into Komodo as Variables, and triggers a Komodo Action (`komodo/actions/deploy.ts`) that builds the image **on the VPS itself** and deploys it. All three steps are idempotent — safe to run on every deploy. GitHub Actions never builds or pushes a Docker image; the only long-lived GitHub secrets are `KOMODO_API_KEY` / `KOMODO_API_SECRET` plus the app secrets it forwards to Komodo.

Komodo resources (`Build`, `Stack`s, `Action`s) are declared in `komodo/resources.toml`. `komodo/actions/*.ts` are the human-readable source for the two Actions — their actual (identical) contents are embedded in `resources.toml`'s `file_contents` fields, since Komodo can't include external files, so keep both in sync by hand when editing.

There's no manual setup at all — no Komodo UI clicking, no registry credential (Build and every Stack run on the same server, so the image never leaves that Docker daemon), no GitHub PAT (`preview-sweep`'s branch/commit lookups hit GitHub's public, unauthenticated API — this repo is public, and a once-daily job is nowhere near the 60 req/hour unauthenticated rate limit). The whole pipeline bootstraps itself from a push once `KOMODO_API_KEY` / `KOMODO_API_SECRET` are in GitHub secrets.

Deploys always go through `komodo/actions/deploy.ts` (dispatched by CI after review approval) — the Stack webhooks in `resources.toml` are deliberately `webhook_enabled = false`, since a raw git-push webhook would deploy before the GitHub review gate approves.

</details>

<details>
<summary><strong>Database contract</strong> — one shared Postgres instance, one schema per environment</summary>

<br />

- `DATABASE_URL` points at **one shared** Postgres database, the same for every environment.
- `DB_SCHEMA` selects the Postgres **schema** used by this environment inside that database (`prod`, `uat`, `dev`, or a `preview_<slug>` per branch). Must match `^[a-z0-9_]+$`; defaults to `public`.
- On boot, the app runs `CREATE SCHEMA IF NOT EXISTS "<DB_SCHEMA>"` and applies every migration in `drizzle/` against that schema, with the migration-tracking table living in the same schema — so each environment tracks its own applied-migrations state independently.
- All pooled connections pin `search_path` to `<DB_SCHEMA>`, so unqualified table names in queries resolve correctly.
- One-time, outside the app: the shared `brockcsc` database and `brockcsc` role must exist, and `brockcsc` must own the database (or hold `CREATE` on it) so it can create its own schemas.

</details>

<details>
<summary><strong>Auth</strong> — Keycloak once, signed cookie after that</summary>

<br />

Admin login exchanges a username/password against Keycloak (`KEYCLOAK_ISSUER`, resource-owner password grant), checks for the `ADMIN_ROLE` realm role, and issues the app's own signed session cookie (`SESSION_JWT_SECRET`) — Keycloak is never queried again for the life of that cookie.

</details>

<br />

<div align="center">

Built by students, for students. <img src="https://img.shields.io/badge/Join_our-Discord-9A4440?style=flat-square&logo=discord&logoColor=white&labelColor=000000" alt="Join our Discord" />

</div>
