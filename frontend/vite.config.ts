import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// When running under Aspire, the API URL is injected via service discovery env vars.
// AddViteApp + WithReference(api) injects: services__api__https__0, services__api__http__0
const apiTarget = process.env['services__api__https__0'] ||
                  process.env['services__api__http__0'];

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: parseInt(process.env.PORT ?? '5173'),
    proxy: apiTarget ? {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    } : undefined,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
