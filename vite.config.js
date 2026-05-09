import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Vite proxy ini meneruskan request /api/anthropic/* ke Claude API
// dengan API key di-inject di server side. Key tidak ter-expose ke browser.
// Untuk production deployment, ganti dengan serverless function (Vercel/Netlify).

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.ANTHROPIC_API_KEY) {
                proxyReq.setHeader('x-api-key', env.ANTHROPIC_API_KEY)
                proxyReq.setHeader('anthropic-version', '2023-06-01')
                proxyReq.setHeader('content-type', 'application/json')
              }
            })
            proxy.on('error', (err) => {
              console.error('[proxy error]', err.message)
            })
          },
        },
      },
    },
  }
})
