import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProjectForm } from '../components/ProjectForm'
import { useIsProjectLeader } from '../hooks/useIsProjectLeader'
import { getApiError } from '../services/api'
import { deleteProject, getProject, getProjectMembers, inviteProjectMember, removeProjectMember, updateProject, updateProjectWip } from '../services/projects'

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)
  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole] = useState('MEMBER')
  const [wip, setWip] = useState({})
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const isLeader = useIsProjectLeader(project)

  async function load() {
    setLoading(true)
    try {
      const loadedProject = await getProject(projectId)
      setProject(loadedProject)
      const projectWip = loadedProject?.wip || loadedProject?.wipLimits || {}
      const columns = Array.isArray(loadedProject?.columns) ? loadedProject.columns : []
      setWip(Object.keys(projectWip).length ? projectWip : Object.fromEntries(columns.map((column) => [column.id || column.name || column, ''])))
      const loadedMembers = loadedProject?.members?.length ? loadedProject.members : await getProjectMembers(projectId)
      setMembers(loadedMembers)
      setProject({ ...loadedProject, members: loadedMembers })
      setError('')
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudo cargar el proyecto.'))
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [projectId])

  async function handleProjectSave(payload) {
    setSaving(true)
    try { setProject(await updateProject(projectId, payload)); setForm(null); setMessage('Proyecto guardado.') } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!window.confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return
    try { await deleteProject(projectId); navigate('/') } catch (requestError) { setError(getApiError(requestError, 'No se pudo eliminar el proyecto.')) }
  }

  async function handleInvite(event) {
    event.preventDefault()
    if (!memberEmail.trim()) return
    setSaving(true)
    try { const member = await inviteProjectMember(projectId, { email: memberEmail.trim(), role: memberRole }); setMembers((current) => [...current, member]); setMemberEmail(''); setMessage('Miembro invitado.') } catch (requestError) { setError(getApiError(requestError, 'No se pudo invitar al miembro.')) } finally { setSaving(false) }
  }

  async function handleRemove(member) {
    if (!window.confirm(`¿Eliminar a ${member.user?.name || member.name || member.email}?`)) return
    try { await removeProjectMember(projectId, member.id || member.userId); setMembers((current) => current.filter((item) => item.id !== member.id)) } catch (requestError) { setError(getApiError(requestError, 'No se pudo eliminar al miembro.')) }
  }

  async function handleWip(event) {
    event.preventDefault()
    const values = Object.fromEntries(Object.entries(wip).map(([column, value]) => [column, Number(value)]))
    if (Object.values(values).some((value) => !Number.isInteger(value) || value < 0)) { setError('Los límites WIP deben ser números enteros no negativos.'); return }
    try { await updateProjectWip(projectId, values); setMessage('Límites WIP guardados.'); setError('') } catch (requestError) { setError(getApiError(requestError, 'No se pudieron guardar los límites WIP.')) }
  }

  if (loading) return <p className="status">Cargando proyecto...</p>
  if (error && !project) return <main className="empty-state"><p className="form-error">{error}</p><Link to="/">Volver a proyectos</Link></main>

  return <main className="app-shell"><Link to="/" className="back-link">← Mis proyectos</Link><header className="detail-header"><div><p className="eyebrow">Proyecto</p><h1>{project.name}</h1><p>{project.description || 'Sin descripción'}</p></div>{isLeader && <div className="form-actions"><button onClick={() => setForm(project)}>Editar</button><button className="button-danger" onClick={handleDelete}>Eliminar</button></div>}</header>{message && <p className="success" role="status">{message}</p>}{error && <p className="form-error" role="alert">{error}</p>}
    {isLeader && <section className="management-grid"><div className="panel"><h2>Miembros</h2><form className="inline-form" onSubmit={handleInvite}><input type="email" placeholder="email@ejemplo.com" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} required /><select value={memberRole} onChange={(event) => setMemberRole(event.target.value)}><option value="MEMBER">Miembro</option><option value="LEADER">Líder</option></select><button disabled={saving}>Invitar</button></form><ul className="member-list">{members.map((member) => <li key={member.id || member.userId}><span><strong>{member.user?.name || member.name || member.email}</strong><small>{member.user?.email || member.email} · {member.role || 'MEMBER'}</small></span><button className="button-danger button-small" onClick={() => handleRemove(member)}>Eliminar</button></li>)}</ul></div><div className="panel"><h2>Límites WIP</h2><form className="stack-form" onSubmit={handleWip}>{Object.entries(wip).length === 0 && <p className="muted">La API no devolvió columnas configurables.</p>}{Object.entries(wip).map(([column, value]) => <label key={column}>{column}<input type="number" min="0" step="1" value={value} onChange={(event) => setWip((current) => ({ ...current, [column]: event.target.value }))} /></label>)}{Object.entries(wip).length > 0 && <button type="submit">Guardar WIP</button>}</form></div></section>}
    {!isLeader && <p className="muted">Tienes acceso de consulta a este proyecto.</p>}
    {form && <div className="modal-backdrop"><div className="modal"><ProjectForm project={form} saving={saving} onSubmit={handleProjectSave} onCancel={() => setForm(null)} /></div></div>}
  </main>
}

export default ProjectDetailPage