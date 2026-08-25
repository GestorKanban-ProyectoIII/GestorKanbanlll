import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>404 - Página no encontrada</h2>
      <p>La página que buscas no existe.</p>
      <Link to="/">Volver al Inicio</Link>
    </div>
  )
}

export default NotFoundPage
