import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '../services/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!token) {
      return
    }

    authApi.profile()
      .then(({ data }) => {
        const profile = data.user || data
        setUser(profile)
        localStorage.setItem('user', JSON.stringify(profile))
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const login = (newToken, userData = null) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setIsLoading(true)
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setIsLoading(false)
  }

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
