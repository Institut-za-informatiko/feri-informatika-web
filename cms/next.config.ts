import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: 'standalone',
  // Next 16 writes an AGENTS.md on dev start; this repo keeps its own docs.
  agentRules: false,
  // The workspace root holds the lockfile; trace from there so standalone output is complete.
  outputFileTracingRoot: path.resolve(dirname, '..'),
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname, '..'),
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
