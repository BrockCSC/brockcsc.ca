import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    // npm workspaces hoists node_modules to the monorepo root, so Turbopack
    // needs to be told that's the real root, not apps/web itself.
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
