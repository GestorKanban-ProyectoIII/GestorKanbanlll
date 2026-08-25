import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { getApiError } from '../services/api'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const response = await api.post('/auth/register', { name, email, password })
      login(response.data.token, response.data.user)
      navigate('/')
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudo crear la cuenta.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="auth-page">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="stack-form">
        {error && <p className="form-error" role="alert">{error}</p>}
        <div>
          <label htmlFor="name">Nombre: </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña: </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={saving}>{saving ? 'Creando...' : 'Crear cuenta'}</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  )
}

export default RegisterPage
