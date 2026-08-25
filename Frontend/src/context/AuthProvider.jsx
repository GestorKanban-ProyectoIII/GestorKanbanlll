import { useState } from 'react'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = (newToken, userData = null) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
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
  }

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
