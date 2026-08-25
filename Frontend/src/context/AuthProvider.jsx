import { useState } from 'react'
import { AuthContext } from './AuthContext'

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(readStoredUser)

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

export default AuthProvider
