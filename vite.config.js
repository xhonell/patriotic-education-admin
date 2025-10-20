import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3001,
    open: true,
    host: true, // 监听所有地址
    hmr: true, // 启用热模块替换
    watch: {
      usePolling: true, // 使用轮询模式，确保文件变化被检测到
      interval: 100 // 轮询间隔
    },
    // 代理配置 - 解决跨域问题
    proxy: {
      '/api': {
        target: 'http://localhost:8801', // 后端服务器地址
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  }
})

