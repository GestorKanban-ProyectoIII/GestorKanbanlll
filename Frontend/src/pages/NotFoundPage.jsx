import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="empty-state">
      <h1>Página no encontrada</h1>
      <Link to="/">Volver a proyectos</Link>
    </main>
  )
}

export default NotFoundPage
