import * as core from "@actions/core";
import { upsertAndDeployStack, type KomodoCreds } from "./lib/komodo.js";

async function main(): Promise<void> {
  const creds: KomodoCreds = {
    host: process.env.KOMODO_HOST!,
    apiKey: process.env.KOMODO_API_KEY!,
    apiSecret: process.env.KOMODO_API_SECRET!,
  };

  const projectName = process.env.PROJECT_NAME!;
  const subdomain = process.env.SUBDOMAIN!;
  // One shared `brockcsc` database for every environment - only the schema
  // varies. See apps/api/DEPLOYMENT.md.
  const databaseUrl = `postgresql://brockcsc:${process.env.DB_PASSWORD}@postgres:5432/brockcsc`;

  const environment = [
    `IMAGE_TAG=${process.env.IMAGE_TAG}`,
    `PROJECT_NAME=${projectName}`,
    `SUBDOMAIN=${subdomain}`,
    `DATABASE_URL=${databaseUrl}`,
    `DB_SCHEMA=${process.env.DB_SCHEMA}`,
    `KEYCLOAK_ISSUER=${process.env.KEYCLOAK_ISSUER}`,
    `KEYCLOAK_CLIENT_ID=${process.env.KEYCLOAK_CLIENT_ID}`,
    `KEYCLOAK_CLIENT_SECRET=${process.env.KEYCLOAK_CLIENT_SECRET}`,
    `ADMIN_ROLE=brockcsc-admin`,
    `SESSION_JWT_SECRET=${process.env.SESSION_JWT_SECRET}`,
  ];

  core.info(`Checking whether stack '${projectName}' already exists...`);
  await upsertAndDeployStack(creds, {
    projectName,
    gitBranch: process.env.GIT_BRANCH!,
    environment,
  });

  core.info(`Deploy triggered for ${projectName} -> https://${subdomain}`);
}

main().catch((err) =>
  core.setFailed(err instanceof Error ? err.message : String(err)),
);
