import * as core from "@actions/core";
import { dropPreviewSchema } from "./lib/ssh.js";

async function main(): Promise<void> {
  dropPreviewSchema({
    sshKey: process.env.SSH_KEY!,
    deployHost: process.env.DEPLOY_HOST!,
    deployUser: process.env.DEPLOY_USER!,
    dbSchema: process.env.DB_SCHEMA!,
  });
}

main().catch((err) =>
  core.setFailed(err instanceof Error ? err.message : String(err)),
);
