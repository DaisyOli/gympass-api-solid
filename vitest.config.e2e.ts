/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.e2e.{test,spec}.ts'],
    environment: './prisma/vitest-environment-prisma/prisma-test-evironment.ts',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
