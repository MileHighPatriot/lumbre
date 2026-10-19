import type { NextConfig } from "next";

const repo = "lumbre";
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? `/${repo}` : "";

/**
 * Full static export for GitHub Pages. cacheComponents stays off: it turns on
 * Partial Prerendering, which needs a server, and Pages can only serve files.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isPages ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
