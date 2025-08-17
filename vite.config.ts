import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const port = parseInt(env.VITE_PORT) || 4000
  const productManagerHost = env.VITE_REMOTE_PRODUCT_MANAGER_HOST || 'http://localhost:4001'

  return {
    plugins: [
      react(),
      federation({
        name: 'dashboard',
        remotes: {
          productManager: `${productManagerHost}/assets/remoteEntry.js`,
        },
        shared: ['react', 'react-dom']
      })
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    },
    server: {
      port: port
    },
    preview: {
      port: port
    }
  }
})
