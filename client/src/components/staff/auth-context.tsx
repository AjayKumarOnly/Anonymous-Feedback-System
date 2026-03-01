import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface User {
  id: string
  name: string
  role: 'teacher' | 'student'
  groups?: string[] // For students
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (role: 'teacher' | 'student', payload: any) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'cipherfeedback_user'

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = async (role: 'teacher' | 'student', payload: any) => {
    try {
      const endpoint = role === 'teacher' ? '/api/auth/login/teacher' : '/api/auth/login/student'
      const res = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Login failed')

      const newUser = await res.json()
      setUser(newUser)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      return newUser
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const joinGroup = async (groupId: string) => {
    if (!user || user.role !== 'student') return
    try {
      const res = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, groupId }),
      })
      if (!res.ok) throw new Error('Failed to join group')

      setUser((prev) => {
        if (!prev || prev.role !== 'student') return prev
        const newGroups = prev.groups ? [...new Set([...prev.groups, groupId])] : [groupId]
        const newUser = { ...prev, groups: newGroups }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
        return newUser
      })
    } catch (err) {
      console.error(err)
      throw err // Rethrow to handle in UI
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      joinGroup,
    }),
    [user], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
