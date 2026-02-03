import { defineConfig } from 'orval'

export default defineConfig({
  openapi_server: {
    input: {
      target: 'http://localhost:8080/v3/api-docs',
    },
    output: {
      prettier: true,
      baseUrl: 'http://localhost:8080',
      mode: 'tags',
      target: './src/orval/',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios.ts',
          name: 'axiosApi',
        },
      },
    },
  },
})
