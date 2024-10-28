import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const raw = loadEnv("dev", process.cwd(), "VITE_");
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    "VITE_POOL_CONTRACT_ADDRESS": `'${raw.VITE_POOL_CONTRACT_ADDRESS}'`,
    "VITE_RPC_URL": `'${raw.VITE_RPC_URL}'`,
  },
})
