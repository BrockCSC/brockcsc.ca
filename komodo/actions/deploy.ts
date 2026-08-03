// Komodo Action "brockcsc-deploy". Source of truth is the copy embedded in
// resources.toml's [[action]] file_contents - Komodo doesn't support
// including external files, so this .ts file is kept here purely for
// human review/diffing and must be kept in sync by hand.
//
// Triggered by .github/workflows/ci.yml's `deploy` job, which only runs
// after the matching GitHub Environment's required reviewers approve.
// Arguments (key_value format, see resources.toml):
//   REF - full git ref, eg refs/heads/main, refs/tags/v1.2.3, refs/heads/some-branch
//   SHA - full commit sha being deployed

const VPS_HOST = "129-153-49-190.sslip.io";
const REPO = "BrockCSC/website";
const SERVER = "wayfarerbx-vps";

const slugify = (branch: string): string =>
  branch
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const schemaSlug = (slug: string): string => slug.replace(/-/g, "_");

const ref = ARGS.REF;
const sha = ARGS.SHA ?? "";

let envName: "prod" | "uat" | "dev";
let projectName: string;
let subdomain: string;
let dbSchema: string;
let branch: string;

if (ref.startsWith("refs/tags/")) {
  branch = ref.slice("refs/tags/".length);
  envName = "prod";
  projectName = "brockcsc-prod";
  subdomain = `brockcsc.${VPS_HOST}`;
  dbSchema = "prod";
} else if (ref === "refs/heads/main") {
  branch = "main";
  envName = "uat";
  projectName = "brockcsc-uat";
  subdomain = `uat.${VPS_HOST}`;
  dbSchema = "uat";
} else {
  branch = ref.replace(/^refs\/heads\//, "");
  const slug = slugify(branch);
  envName = "dev";
  projectName = `brockcsc-pr-${slug}`;
  subdomain = `${slug}.${VPS_HOST}`;
  dbSchema = `preview_${schemaSlug(slug)}`;
}

console.log(
  `Deploying ${projectName} (${envName}) from ${branch} -> https://${subdomain}`,
);

// 1. Point the shared Build at this branch/commit and build it. `execute`
// blocks until the build finishes (same semantics as a Procedure stage).
await komodo.write("UpdateBuild", {
  id: "brockcsc",
  config: { branch },
});

const buildUpdate = await komodo.execute("RunBuild", { build: "brockcsc" });
if (!buildUpdate.success) {
  throw new Error(`Build failed for ${branch} - see Build logs in Komodo.`);
}

const imageTag = buildUpdate.commit_hash || sha || "latest";

// 2. Upsert the Stack. uat/prod already exist (declared in resources.toml);
// preview stacks are created here on first deploy of a branch.
const databaseUrl = `postgresql://brockcsc:[[BROCKCSC_DB_PASSWORD]]@postgres:5432/brockcsc`;
const environment = [
  `IMAGE_TAG=${imageTag}`,
  `PROJECT_NAME=${projectName}`,
  `SUBDOMAIN=${subdomain}`,
  `DATABASE_URL=${databaseUrl}`,
  `DB_SCHEMA=${dbSchema}`,
  `KEYCLOAK_ISSUER=[[BROCKCSC_KEYCLOAK_ISSUER]]`,
  `KEYCLOAK_CLIENT_ID=[[BROCKCSC_KEYCLOAK_CLIENT_ID]]`,
  `KEYCLOAK_CLIENT_SECRET=[[BROCKCSC_KEYCLOAK_CLIENT_SECRET]]`,
  `ADMIN_ROLE=brockcsc-admin`,
  `SESSION_JWT_SECRET=[[BROCKCSC_SESSION_JWT_SECRET]]`,
].join("\n");

const config = {
  server: SERVER,
  repo: REPO,
  branch,
  git_provider: "github.com",
  file_paths: ["deploy/docker-compose.yml"],
  auto_pull: false,
  destroy_before_deploy: false,
  webhook_enabled: false,
  environment,
};

let exists = true;
try {
  await komodo.read("GetStack", { stack: projectName });
} catch {
  exists = false;
}

if (exists) {
  await komodo.write("UpdateStack", { id: projectName, config });
} else {
  await komodo.write("CreateStack", { name: projectName, config });
}

// 3. Deploy. The app creates its own DB schema on boot (scripts/migrate.mjs
// in the Docker image's CMD) - nothing to provision here.
const deployUpdate = await komodo.execute("DeployStack", {
  stack: projectName,
});
if (!deployUpdate.success) {
  throw new Error(
    `Deploy failed for ${projectName} - see Stack logs in Komodo.`,
  );
}

console.log(`Deployed ${projectName} -> https://${subdomain}`);
