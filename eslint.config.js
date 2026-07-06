import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    '.next',
    'node_modules',
    '.agents',
    'scratch',
    'test-results',
    'testreel-output',
    'playwright.config.ts',
    'tests',
    'boxingwiki-ad',
    'boxingwiki-demo',
    'boxingwiki-demo-vertical',
    'coachjosh-demo',
    'coachjosh-demo-vertical',
    'narration'
  ]),
  ...tseslint.config(
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        reactHooks.configs.flat.recommended,
      ],
      languageOptions: {
        globals: { ...globals.browser, ...globals.node },
        parserOptions: {
          ecmaFeatures: { jsx: true }
        },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-require-imports': 'off',
        'react-hooks/set-state-in-effect': 'off',
        'react-hooks/purity': 'off',
        'react-hooks/immutability': 'off',
        'react-hooks/preserve-manual-memoization': 'off',
        'react-hooks/rules-of-hooks': 'off',
        'react-hooks/refs': 'off',
        'no-useless-escape': 'off',
        'no-empty': 'off',
        'no-useless-assignment': 'off',
        '@next/next/no-img-element': 'off',
      }
    }
  )
])
