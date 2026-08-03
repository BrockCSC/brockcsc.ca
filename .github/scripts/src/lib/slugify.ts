// Shared slug rule so every script derives the same project/subdomain/schema
// name from a branch name.
export function slugify(branch: string): string {
  return branch
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function schemaSlug(slug: string): string {
  return slug.replace(/-/g, "_");
}
