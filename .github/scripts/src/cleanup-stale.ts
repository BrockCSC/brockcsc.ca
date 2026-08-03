import * as core from "@actions/core";
import { getOctokit } from "@actions/github";
import { slugify, schemaSlug } from "./lib/slugify.js";
import { listStacks, deleteStack, type KomodoCreds } from "./lib/komodo.js";
import { dropPreviewSchema } from "./lib/ssh.js";

const STALE_MS = 3 * 24 * 60 * 60 * 1000;

async function main(): Promise<void> {
  const [owner, repo] = process.env.GITHUB_REPOSITORY!.split("/");
  const octokit = getOctokit(process.env.GH_TOKEN!);
  const creds: KomodoCreds = {
    host: process.env.KOMODO_HOST!,
    apiKey: process.env.KOMODO_API_KEY!,
    apiSecret: process.env.KOMODO_API_SECRET!,
  };

  const branches = await octokit.paginate(octokit.rest.repos.listBranches, {
    owner,
    repo,
  });
  const slugToBranch = new Map<string, string>();
  for (const branch of branches)
    slugToBranch.set(slugify(branch.name), branch.name);

  const stacks = await listStacks(creds);
  const now = Date.now();

  for (const stack of stacks) {
    if (!stack.name.startsWith("brockcsc-pr-")) continue;

    const slug = stack.name.slice("brockcsc-pr-".length);
    const branch = slugToBranch.get(slug);

    let stale = false;
    if (!branch) {
      core.info(`${stack.name}: source branch no longer exists`);
      stale = true;
    } else {
      const { data: commit } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: branch,
      });
      const commitDate =
        commit.commit.committer?.date ?? commit.commit.author?.date;
      const ageMs = now - new Date(commitDate ?? 0).getTime();
      if (ageMs > STALE_MS) {
        core.info(
          `${stack.name}: branch '${branch}' last active ${Math.floor(ageMs / 86_400_000)} days ago, stale`,
        );
        stale = true;
      }
    }

    if (!stale) continue;

    await deleteStack(creds, stack.name);
    dropPreviewSchema({
      sshKey: process.env.BROCKCSC_DEPLOY_SSH_KEY!,
      deployHost: process.env.BROCKCSC_DEPLOY_HOST!,
      deployUser: process.env.BROCKCSC_DEPLOY_USER!,
      dbSchema: `preview_${schemaSlug(slug)}`,
    });
  }
}

main().catch((err) =>
  core.setFailed(err instanceof Error ? err.message : String(err)),
);
