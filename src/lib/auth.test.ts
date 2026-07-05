import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth'

describe('Auth Helpers', () => {
  describe('Password Hashing', () => {
    it('should hash a password and verify it successfully', async () => {
      const password = 'mySecurePassword123!'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(10)
      
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should fail verification for incorrect password', async () => {
      const password = 'mySecurePassword123!'
      const wrongPassword = 'wrongPassword!'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword(wrongPassword, hash)
      expect(isValid).toBe(false)
    })
  })

  describe('JWT Tokens', () => {
    it('should generate and verify tokens successfully', async () => {
      const payload = {
        userId: 'user-123',
        email: 'test@learnwave.com',
        role: 'STUDENT',
        name: 'Test Student'
      }

      const token = await generateToken(payload)
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')

      const decoded = await verifyToken(token)
      expect(decoded).not.toBeNull()
      if (decoded) {
        expect(decoded.userId).toBe(payload.userId)
        expect(decoded.email).toBe(payload.email)
        expect(decoded.role).toBe(payload.role)
        expect(decoded.name).toBe(payload.name)
      }
    })

    it('should return null or fail verification for invalid tokens', async () => {
      const decoded = await verifyToken('invalid-token-string')
      expect(decoded).toBeNull()
    })
  })
})
