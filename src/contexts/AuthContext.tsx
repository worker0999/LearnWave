'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  phone?: string
  usn?: string
  branch?: string
  semester?: number
  avatarUrl?: string
  mentorProfile?: {
    approved: boolean
    rating?: number
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  updateUser: (updatedFields: Partial<User>) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Clear legacy localStorage token synchronously to prevent child components from using it
  if (typeof window !== 'undefined' && localStorage.getItem('token')) {
    localStorage.removeItem('token')
  }

  useEffect(() => {
    // Fetch current user from /api/auth/me on mount
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setToken(data.token)
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user on mount:', error)
      }
    }
    loadUser()
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
  }

  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null
      return { ...prevUser, ...updatedFields }
    })
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    setToken(null)
    setUser(null)

    // Redirect to landing page
    window.location.href = '/'
  }

  const isAuthenticated = !!user && !!token

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
