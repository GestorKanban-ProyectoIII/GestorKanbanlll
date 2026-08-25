import { useState } from 'react'
import { getApiError } from '../services/api'

export function ProjectForm({ project, saving, onSubmit, onCancel }) {
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError('El nombre del proyecto es obligatorio.')
      return
    }
    setError('')
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
    } catch (requestError) {
      setError(getApiError(requestError, 'No se pudo guardar el proyecto.'))
    }
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <h2>{project ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      <label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} required /></label>
      <label>Descripción<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows="4" /></label>
      <div className="form-actions">
        <button type="button" className="button-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  )
}