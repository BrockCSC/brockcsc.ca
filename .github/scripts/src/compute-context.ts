import * as core from "@actions/core";
import { slugify, schemaSlug } from "./lib/slugify.js";

const VPS_HOST = "129-153-49-190.sslip.io";

interface Context {
  imageTag: string;
  envName: "prod" | "dev" | "preview";
  projectName: string;
  subdomain: string;
  dbSchema: string;
  gitBranch: string;
}

function computeContext(): Context {
  // cleanup.yml's branch-delete trigger already has the bare branch name
  // (no full ref, no meaningful sha) - it always means a preview teardown.
  const branchOverride = process.env.BRANCH_OVERRIDE?.trim();
  if (branchOverride) {
    const slug = slugify(branchOverride);
    return {
      imageTag: "",
      envName: "preview",
      projectName: `brockcsc-pr-${slug}`,
      subdomain: `${slug}.${VPS_HOST}`,
      dbSchema: `preview_${schemaSlug(slug)}`,
      gitBranch: branchOverride,
    };
  }

  const ref = process.env.GITHUB_REF ?? "";
  const shaShort = (process.env.GITHUB_SHA ?? "").slice(0, 12);

  if (ref.startsWith("refs/tags/")) {
    const tagName = ref.slice("refs/tags/".length);
    return {
      imageTag: `tag-${tagName}`,
      envName: "prod",
      projectName: "brockcsc-prod",
      subdomain: `brockcsc.${VPS_HOST}`,
      dbSchema: "prod",
      gitBranch: tagName,
    };
  }

  if (ref === "refs/heads/main") {
    return {
      imageTag: `main-${shaShort}`,
      envName: "dev",
      projectName: "brockcsc-dev",
      subdomain: `dev.${VPS_HOST}`,
      dbSchema: "dev",
      gitBranch: "main",
    };
  }

  const branch = ref.replace(/^refs\/heads\//, "");
  const slug = slugify(branch);
  return {
    imageTag: `pr-${slug}-${shaShort}`,
    envName: "preview",
    projectName: `brockcsc-pr-${slug}`,
    subdomain: `${slug}.${VPS_HOST}`,
    dbSchema: `preview_${schemaSlug(slug)}`,
    gitBranch: branch,
  };
}

const ctx = computeContext();
core.setOutput("image_tag", ctx.imageTag);
core.setOutput("env_name", ctx.envName);
core.setOutput("project_name", ctx.projectName);
core.setOutput("subdomain", ctx.subdomain);
core.setOutput("db_schema", ctx.dbSchema);
core.setOutput("git_branch", ctx.gitBranch);
