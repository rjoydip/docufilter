import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: 'inline',
  clean: true,
  dts: true,
  format: ['esm', 'cjs', 'iife']
})
