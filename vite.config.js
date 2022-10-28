import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: "localhost",
    port: 8003,
    proxy: {
      "/admin": {
        target: "http://ceshi13.dishait.cn",
        changeOrigin: true
      }
    }
  },
  plugins: [
    vue(),
    WindiCSS()
  ]
})
