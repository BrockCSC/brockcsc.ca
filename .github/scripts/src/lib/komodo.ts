export interface KomodoCreds {
  host: string;
  apiKey: string;
  apiSecret: string;
}

type KomodoEndpoint = "read" | "write" | "execute";

async function call<T>(
  creds: KomodoCreds,
  endpoint: KomodoEndpoint,
  type: string,
  params: unknown,
): Promise<T> {
  const res = await fetch(`${creds.host}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": creds.apiKey,
      "x-api-secret": creds.apiSecret,
    },
    body: JSON.stringify({ type, params }),
  });

  if (!res.ok) {
    throw new Error(`Komodo ${type} failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as T;
}

export async function getStack(
  creds: KomodoCreds,
  stack: string,
): Promise<unknown | null> {
  try {
    return await call(creds, "read", "GetStack", { stack });
  } catch {
    return null;
  }
}

export interface UpsertStackOptions {
  projectName: string;
  gitBranch: string;
  environment: string[];
}

export async function upsertAndDeployStack(
  creds: KomodoCreds,
  opts: UpsertStackOptions,
): Promise<void> {
  const config = {
    server: "wayfarerbx-vps",
    repo: "BrockCSC/website",
    branch: opts.gitBranch,
    git_provider: "github.com",
    file_paths: ["deploy/docker-compose.yml"],
    auto_pull: true,
    destroy_before_deploy: false,
    webhook_enabled: false,
    environment: opts.environment.join("\n"),
  };

  const existing = await getStack(creds, opts.projectName);
  if (existing) {
    await call(creds, "write", "UpdateStack", { id: opts.projectName, config });
  } else {
    await call(creds, "write", "CreateStack", {
      name: opts.projectName,
      config,
    });
  }

  await call(creds, "execute", "DeployStack", { stack: opts.projectName });
}

// Only ever called against brockcsc-pr-* preview stacks - prod/dev are never
// torn down by automation.
export async function deleteStack(
  creds: KomodoCreds,
  projectName: string,
): Promise<boolean> {
  if (!projectName.startsWith("brockcsc-pr-")) {
    throw new Error("refusing: this only deletes brockcsc-pr-* preview stacks");
  }

  const existing = await getStack(creds, projectName);
  if (!existing) return false;

  await call(creds, "write", "DeleteStack", { id: projectName });
  return true;
}

export async function listStacks(
  creds: KomodoCreds,
): Promise<{ name: string }[]> {
  return call(creds, "read", "ListStacks", {});
}
