# Deployment contract

## Environment variables

- `DATABASE_URL` — points at **one shared** Postgres database (`postgresql://brockcsc:<password>@postgres:5432/brockcsc`), the same for every environment (prod, dev, every preview). It no longer encodes a per-environment database name.
- `DB_SCHEMA` — selects the Postgres **schema** used by this environment inside that shared database, e.g. `prod`, `dev`, `preview_pr42`. Must match `^[a-z0-9_]+$`. Defaults to `public` if unset.

## What happens automatically on container boot

Before the HTTP server starts listening (`src/index.ts` → `bootstrapDatabase()` in `src/db.ts`):

1. `CREATE SCHEMA IF NOT EXISTS "<DB_SCHEMA>"` is run using the app's own `brockcsc` role.
2. Drizzle's migrator (`drizzle-orm/node-postgres/migrator`) applies every migration in `./drizzle` against that schema. The migration-tracking table itself lives in that same schema (`migrationsSchema: <DB_SCHEMA>`), so each environment tracks its own applied-migrations state independently — a preview environment migrating first does not mark migrations "done" for prod or vice versa.
3. All pooled connections have `search_path` pinned to `<DB_SCHEMA>` via the `pg.Pool` `options` connection parameter, so unqualified table names in application queries resolve to the right schema.

This fully replaces the old SSH + `psql < 001_init.sql` step — there is no schema-application work left to do outside the container.

## What still has to happen outside the container

- **One-time, for the shared database itself:** the `brockcsc` Postgres database and the `brockcsc` role must exist, and `brockcsc` must **own** the database (or hold `CREATE` on it) so it's allowed to `CREATE SCHEMA`. No table-level `GRANT`s are needed anymore — the app creates its own schema and owns everything in it.
- **Per-environment teardown (previews):** the app only ever creates schemas, it never drops them. Deleting a stale preview environment still requires an external step: `DROP SCHEMA "<DB_SCHEMA>" CASCADE`, run as the `brockcsc` role (no superuser / SSH access required, unlike the old `drop-db.sh`, since `brockcsc` owns the schema it created).

## Not carried over

`GRANT`/`ALTER DEFAULT PRIVILEGES` statements from the old hand-written migration are gone: they existed because `ensure-db.sh` applied migrations as the Postgres superuser, so tables ended up owned by `postgres` and had to be granted to `brockcsc`. Under this contract `brockcsc` creates its own schema and tables, so it already owns them.
