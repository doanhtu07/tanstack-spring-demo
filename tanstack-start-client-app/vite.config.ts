import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import dotenv from 'dotenv'

dotenv.config()

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    nitro({
      routeRules: {
        '/server-proxy/**': {
          proxy: {
            to: `${process.env.VITE_SERVER_URL}/**`,
          },
        },
      },
    }),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
})

export default config
