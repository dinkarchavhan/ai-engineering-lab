/** @type {import('next').NextConfig} */
// For GitHub Pages: set NEXT_PUBLIC_BASE_PATH to "/<repo-name>" when deploying to
// a project page (https://<user>.github.io/<repo-name>). Leave empty for a user/org
// page or a custom domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
