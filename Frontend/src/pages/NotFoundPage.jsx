import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Página no encontrada</h1>
      <Link to="/">Volver al inicio</Link>
    </main>
  )
}

export default NotFoundPage
