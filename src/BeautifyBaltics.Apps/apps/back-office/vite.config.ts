/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const coreApiBaseUrl = env.VITE_CORE_API_URL
    || env.VITE_CORE_API_BASE_URL
    || env['services__core-api__https__0']
    || env['services__core-api__http__0']
    || (mode === 'production' ? '' : 'https://localhost:5225');

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/back-office',

    define: {
      __CORE_API_BASE_URL__: JSON.stringify(''),
    },

    server: {
      port: 4200,
      host: 'localhost',
      proxy: {
        '/api': {
          target: coreApiBaseUrl,
          secure: false,
        },
      },
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }), react(), nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@beautify-baltics-apps/api-client': path.resolve(__dirname, '../../packages/api-client/src/index.ts'),
        '@beautify-baltics-apps/theme': path.resolve(__dirname, '../../packages/theme/src/index.ts'),
        '@beautify-baltics-apps/devtools': path.resolve(__dirname, '../../packages/devtools/src/index.ts'),
        '@beautify-baltics-apps/components': path.resolve(__dirname, '../../packages/components/src/index.ts'),

        // Fix: https://github.com/tabler/tabler-icons/issues/1233
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
      dedupe: ['react', 'react-dom'],
    },

    build: {
      outDir: '../../dist/apps/back-office',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            const src = path.resolve(__dirname, 'src') + path.sep;

            if (id.startsWith(path.join(src, 'features'))) {
              const [, featureName] = id.slice(src.length).split(path.sep);
              return `app.feature.${featureName}`;
            }

            const appGroups: Array<[string, string]> = [
              ['components', 'app.components'],
              ['hooks', 'app.utils'],
              ['contexts', 'app.utils'],
              ['layouts', 'app.layouts'],
              ['state', 'app.state'],
              ['utils', 'app.utils'],
            ];

            const appMatch = appGroups.find(([folder]) => id.startsWith(path.join(src, folder)));
            if (appMatch) return appMatch[1];

            if (!id.includes('node_modules')) return null;

            // todo: add actual logic for splitting vendor chunks

            return 'vendor';
          },
        },
      },
    },
  };
});
