import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: 'standalone',
  // Next 16 writes an AGENTS.md on dev start; this repo keeps its own docs.
  agentRules: false,
  // Section landing URLs and the old SL-only /projects pages. Redirects run before src/proxy.ts.
  async redirects() {
    return [
      { source: '/research', destination: '/research/group', permanent: true },
      {
        source: '/en/research',
        destination: '/en/research/projects',
        permanent: true,
      },
      {
        source: '/studies',
        destination: '/studies/programmes',
        permanent: true,
      },
      {
        source: '/en/studies',
        destination: '/en/studies/programmes',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/research/projects',
        permanent: true,
      },
      // Data cleanup 2026-10-08: duplicates merged into former staff, slugs corrected.
      ...['', '/en'].flatMap((l) => [
        ...['ivona-colakovic', 'nadica-uzunova-petric', 'zala-lahovnik'].map(
          (s) => ({
            source: `${l}/staff/${s}`,
            destination: `${l}/staff/former/${s}`,
            permanent: true,
          })
        ),
        {
          source: `${l}/staff/fister1user-commandsfister1`,
          destination: `${l}/staff/iztok-fister`,
          permanent: true,
        },
        {
          source: `${l}/laboratories/lab-ai`,
          destination: `${l}/laboratories/laboratorij-za-informacijske-sisteme`,
          permanent: true,
        },
      ]),
      {
        source: '/projects/:slug*',
        destination: '/research/projects/:slug*',
        permanent: true,
      },
    ];
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname),
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
