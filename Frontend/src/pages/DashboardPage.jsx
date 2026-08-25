import { useAuth } from '../hooks/useAuth'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gestor Kanban</h1>
        <div>
          <span>{user?.email || 'Usuario'}</span>

            Cerrar Sesión
          </button>
        </div>
      </header>

  )
}

export default DashboardPage
