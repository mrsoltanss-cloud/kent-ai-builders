import path from 'path';
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Ensure file tracing stays inside this project (avoid parent lockfiles)
  outputFileTracingRoot: path.join(process.cwd()),
};
export default nextConfig;
