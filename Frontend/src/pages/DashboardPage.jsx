import { useAuth } from '../hooks/useAuth'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gestor Kanban</h1>
        <div>
          <span>{user?.email || 'Usuario'}</span>
          <button onClick={logout} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main style={{ marginTop: '2rem' }}>
        <p>Bienvenido al tablero Kanban.</p>
      </main>
    </div>
  )
}

export default DashboardPage
