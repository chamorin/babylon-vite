import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@babylonjs/gui-editor/guiEditor.js': '@babylonjs/gui-editor',
    },
  },
});