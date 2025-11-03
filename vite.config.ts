import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 使用正确的开发环境配置
      jsxRuntime: 'automatic'
    })
  ],
  server: {
    // 热模块替换配置
    hmr: {
      // 为HMR客户端配置超时
      timeout: 30000
    },
    // 监听所有网络接口，便于其他设备访问
    host: true,
    // 自动打开浏览器
    open: true
  },
  // 优化构建性能
  optimizeDeps: {
    // 预构建的依赖
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    // 禁用某些依赖的优化
    exclude: []
  },
  // 确保TypeScript支持良好
  esbuild: {
    // 配置ESBuild选项
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  }
})
