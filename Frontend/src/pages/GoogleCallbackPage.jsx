import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function getCallbackData(search, hashValue) {
  const query = new URLSearchParams(search)
  const hash = new URLSearchParams(hashValue.replace(/^#/, ''))
  const token = query.get('token') || hash.get('token')
  const userValue = query.get('user') || hash.get('user')

  let user = null
  if (userValue) {
    try {
      user = JSON.parse(userValue)
    } catch {
      user = null
    }
  }

  return { token, user }
}

export function GoogleCallbackPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { search, hash } = location
  const callbackData = getCallbackData(search, hash)
  const error = callbackData.token ? '' : 'No se recibió un token válido de Google.'

  useEffect(() => {
    const { token, user } = getCallbackData(search, hash)
    if (!token) {
      return
    }

    login(token, user)
    navigate('/', { replace: true })
  }, [search, hash, login, navigate])

  return <p>{error || 'Completando inicio de sesión...'}</p>
}

export default GoogleCallbackPage