import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const classicScriptOutput = (): Plugin => ({
  name: 'classic-script-output',
  apply: 'build',
  enforce: 'post',
  generateBundle(_options, bundle) {
    delete bundle._redirects
    const entry = bundle['index.html']
    if (entry?.type === 'asset' && typeof entry.source === 'string') {
      entry.source = entry.source.replace(/<script type="module" crossorigin/g, '<script defer')
    }
  },
})

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react(), classicScriptOutput()],
  build: {
    modulePreload: { polyfill: false },
    sourcemap: false,
  },
})
