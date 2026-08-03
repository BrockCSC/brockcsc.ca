import * as core from "@actions/core";
import { deleteStack, type KomodoCreds } from "./lib/komodo.js";

async function main(): Promise<void> {
  const creds: KomodoCreds = {
    host: process.env.KOMODO_HOST!,
    apiKey: process.env.KOMODO_API_KEY!,
    apiSecret: process.env.KOMODO_API_SECRET!,
  };
  const projectName = process.env.PROJECT_NAME!;

  core.info(`Checking whether stack '${projectName}' exists...`);
  const deleted = await deleteStack(creds, projectName);
  core.info(
    deleted
      ? `Deleted stack '${projectName}'.`
      : `Stack '${projectName}' does not exist, nothing to do.`,
  );
}

main().catch((err) =>
  core.setFailed(err instanceof Error ? err.message : String(err)),
);
