import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getApiError } from '../services/api'
import { createProject, getProjects } from '../services/projects'
import { ProjectForm } from '../components/ProjectForm'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  async function loadProjects() {
    setLoading(true)
    try {
      setProjects(await getProjects())
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudieron cargar los proyectos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProjects() }, [])

  async function handleCreate(payload) {
    setSaving(true)
    try {
      const project = await createProject(payload)
      setShowForm(false)
      if (project?.id) navigate(`/projects/${project.id}`)
      else await loadProjects()
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div><p className="eyebrow">Espacio de trabajo</p><h1>Mis proyectos</h1></div><div className="topbar-actions"><span>{user?.email || 'Usuario'}</span><button className="button-secondary" onClick={logout}>Cerrar sesión</button></div></header>
      <section className="page-heading"><p>Organiza el trabajo de tus equipos en un solo lugar.</p><button onClick={() => setShowForm(true)}>+ Crear proyecto</button></section>
      {loading && <p className="status">Cargando proyectos...</p>}
      {error && <div className="status error"><p>{error}</p><button onClick={loadProjects}>Reintentar</button></div>}
      {!loading && !error && projects.length === 0 && <section className="empty-state"><h2>Aún no tienes proyectos</h2><p>Crea el primero para empezar a organizar tareas.</p><button onClick={() => setShowForm(true)}>Crear mi primer proyecto</button></section>}
      <section className="project-grid" aria-label="Proyectos">
        {projects.map((project) => <Link className="project-card" to={`/projects/${project.id}`} key={project.id}><span className="card-kicker">Proyecto</span><h2>{project.name}</h2><p>{project.description || 'Sin descripción'}</p><footer>{project.memberCount ?? project.members?.length ?? 0} miembros <span>{project.taskCount ?? project.tasks?.length ?? 0} tareas</span></footer></Link>)}
      </section>
      {showForm && <div className="modal-backdrop"><div className="modal"><ProjectForm saving={saving} onSubmit={handleCreate} onCancel={() => setShowForm(false)} /></div></div>}
    </main>
  )
}

export default DashboardPage
