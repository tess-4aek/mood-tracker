import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, logout as logoutRequest } from '@/api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadUser() {
    try {
      const data = await getMe()
      setUser(data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    await logoutRequest()
    setUser(null)
  }

  useEffect(() => {
    loadUser()
  }, [])

  const value = useMemo(() => ({ user, setUser, isLoading, logout }), [user, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }

  return context
}
