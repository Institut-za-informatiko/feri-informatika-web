import { defineConfig } from 'astro/config';

function repoFullReloadPlugin() {
  const ignoredPathParts = ['/.git/', '/node_modules/', '/dist/', '/.astro/'];
  let reloadTimer;

  return {
    name: 'repo-full-reload',
    apply: 'serve',
    configureServer(server) {
      server.watcher.add(process.cwd());
      server.watcher.on('all', (_event, file) => {
        const normalizedFile = file.replaceAll('\\', '/');

        if (ignoredPathParts.some((part) => normalizedFile.includes(part))) {
          return;
        }

        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
          server.ws.send({ type: 'full-reload' });
        }, 75);
      });
    },
  };
}

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://ii-preview.bclabum.si',
  base: process.env.BASE_PATH ?? '/',
  i18n: {
    defaultLocale: 'sl',
    locales: ['sl', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [repoFullReloadPlugin()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
