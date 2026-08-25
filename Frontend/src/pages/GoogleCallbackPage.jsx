import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const token = searchParams.get('token') || searchParams.get('accessToken') || searchParams.get('access_token') || hashParams.get('token') || hashParams.get('accessToken') || hashParams.get('access_token')

    if (token) {
      login(token)
      navigate('/', { replace: true })
    } else {
      navigate('/login?error=google', { replace: true })
    }
  }, [login, navigate, searchParams])

  return <p aria-live="polite">Completando inicio de sesión...</p>
}

export default GoogleCallbackPage