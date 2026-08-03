import * as core from "@actions/core";

async function main(): Promise<void> {
  const subdomain = process.env.SUBDOMAIN!;
  const envName = process.env.ENV_NAME!;
  const url = `https://${subdomain}`;

  core.notice(url, { title: `Deployed (${envName})` });

  await core.summary
    .addHeading("Deployed :rocket:", 3)
    .addRaw(`- **Environment:** ${envName}\n- **URL:** ${url}`)
    .write();
}

main().catch((err) =>
  core.setFailed(err instanceof Error ? err.message : String(err)),
);
