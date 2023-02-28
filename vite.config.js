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
  base: './',
  server: {
    host: "localhost",
    port: 8003,
    proxy: {
      '/admin': {
        // 线上的接口
        target: 'http://ceshi13.dishait.cn',
        // mock接口
        // target: "https://www.fastmock.site/mock/47dfae3baec8ed8fa9486189651d8694",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, '')
      },
    }
  },
  plugins: [
    vue(),
    WindiCSS()
  ]
})
