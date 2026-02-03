//  @ts-check

import { globalIgnores } from 'eslint/config'
import { tanstackConfig } from '@tanstack/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'

export default [
  ...tanstackConfig,
  reactPlugin.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  reactPlugin.configs.flat['jsx-runtime'], // Add this if you are using React 17+
  reactHooks.configs.flat.recommended,

  globalIgnores(['eslint.config.js', 'prettier.config.js', 'src/orval']),
]
