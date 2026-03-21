import { defineConfig } from 'orval'
import dotenv from 'dotenv'

dotenv.config()

const baseUrl = process.env.VITE_SERVER_URL
const specUrl = `${baseUrl}/v3/api-docs`

const axiosPath = './src/api/axios.ts'
const axiosName = 'axiosApi'

const orvalTarget = './src/orval/'

export default defineConfig({
  openapi_server: {
    input: {
      target: specUrl,
    },
    output: {
      prettier: true,
      mode: 'tags',
      target: orvalTarget,
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: axiosPath,
          name: axiosName,
        },
      },
    },
  },
})
