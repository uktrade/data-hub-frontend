import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  root: 'src',
  server: {
    port: 4000,
  },
  build: {
    mode: 'development',
    minify: false,
    manifest: true,
    outDir: '../.dist',
    rollupOptions: {
      input: [
        'src/client/index.jsx',
        'src/assets/stylesheets/application.scss',
        'src/assets/javascripts/app.js',
      ],
    },
    commonjsOptions: {
      include: [
        /node_modules/,
        'src/client/utils/date.js',
        'src/lib/urls.js',
        'src/client/utils/addresses.js',
        'src/lib/text-formatting.js',
        'src/common/formatAdviser.js',
        'src/common/constants.js',
        'src/apps/transformers.js',
        'src/apps/companies/apps/activity-feed/constants.js',
        'src/apps/interactions/constants.js',
        'src/apps/constants.js',
        'src/apps/companies/apps/edit-history/constants.js',
        'src/apps/investments/constants.js',
        'src/apps/companies/labels.js',
        'src/apps/companies/constants.js',
        'src/apps/companies/apps/edit-one-list/constants.js',
        'src/apps/investments/client/opportunities/Details/constants.js',
        'src/apps/contacts/constants.js',
        'src/lib/group-export-countries.js',
        'src/lib/get-export-countries.js',
        'src/client/utils/pagination.js',
        'src/apps/investments/client/projects/transformers.js',
        'src/lib/cast-compact-array.js',
      ],
    },
  },
  plugins: [
    viteCommonjs(),
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
})
