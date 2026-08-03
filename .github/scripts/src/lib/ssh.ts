import { writeFileSync, chmodSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface DropPreviewSchemaOptions {
  sshKey: string;
  deployHost: string;
  deployUser: string;
  dbSchema: string;
}

// Postgres itself isn't reachable from the runner - this dispatches the drop
// through the VPS's forced-command SSH key (deploy/ssh-dispatch.sh), same as
// the old drop-db.sh path.
export function dropPreviewSchema(opts: DropPreviewSchemaOptions): void {
  if (!opts.dbSchema.startsWith("preview_")) {
    throw new Error("refusing: can only drop preview_* schemas");
  }

  const keyPath = join(tmpdir(), `deploy_key_${process.pid}`);
  const key = opts.sshKey.endsWith("\n") ? opts.sshKey : `${opts.sshKey}\n`;
  writeFileSync(keyPath, key, { mode: 0o600 });
  chmodSync(keyPath, 0o600);

  execFileSync(
    "ssh",
    [
      "-i",
      keyPath,
      "-o",
      "StrictHostKeyChecking=accept-new",
      `${opts.deployUser}@${opts.deployHost}`,
      `drop-db ${opts.dbSchema}`,
    ],
    { stdio: "inherit" },
  );
}
