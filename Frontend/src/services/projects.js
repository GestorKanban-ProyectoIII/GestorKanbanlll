import api from './api'

function unwrap(data, key) {
  return data?.[key] ?? data?.data ?? data
}

export async function getProjects() {
  const response = await api.get('/projects')
  const projects = unwrap(response.data, 'projects')
  return Array.isArray(projects) ? projects : []
}

export async function getProject(projectId) {
  const response = await api.get(`/projects/${projectId}`)
  return unwrap(response.data, 'project')
}

export async function createProject(payload) {
  const response = await api.post('/projects', payload)
  return unwrap(response.data, 'project')
}

export async function updateProject(projectId, payload) {
  const response = await api.patch(`/projects/${projectId}`, payload)
  return unwrap(response.data, 'project')
}

export async function deleteProject(projectId) {
  return api.delete(`/projects/${projectId}`)
}

export async function getProjectMembers(projectId) {
  const response = await api.get(`/projects/${projectId}/members`)
  const members = unwrap(response.data, 'members')
  return Array.isArray(members) ? members : []
}

export async function inviteProjectMember(projectId, payload) {
  const response = await api.post(`/projects/${projectId}/members`, payload)
  return unwrap(response.data, 'member')
}

export async function removeProjectMember(projectId, memberId) {
  return api.delete(`/projects/${projectId}/members/${memberId}`)
}

export async function updateProjectWip(projectId, wip) {
  const response = await api.patch(`/projects/${projectId}/wip`, { wip })
  return unwrap(response.data, 'project')
}