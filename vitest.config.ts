import { defineConfig } from 'vitest/config'
import path from 'path'

// Set global test environment variables before tests load
process.env.JWT_SECRET = 'test-secret-key-at-least-thirty-two-chars-long'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
