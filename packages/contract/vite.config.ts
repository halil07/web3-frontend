import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    target: 'esnext',
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'contract',
      formats: ['es']
    }
  },
  plugins: [dts()]
})
