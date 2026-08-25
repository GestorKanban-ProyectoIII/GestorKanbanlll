import { useAuth } from './useAuth'

function sameId(left, right) {
  return left != null && right != null && String(left) === String(right)
}

export function isProjectLeader(project, user) {
  const explicitRole = project?.currentUserRole || project?.userRole || project?.myRole
  if (explicitRole) return String(explicitRole).toUpperCase() === 'LEADER'
  const members = project?.members || project?.projectMembers || []
  return members.some((member) => {
    const memberUser = member.user || member
    const matchesUser = sameId(memberUser.id, user?.id)
      || sameId(memberUser.userId, user?.id)
      || (memberUser.email && memberUser.email.toLowerCase() === user?.email?.toLowerCase())
    const role = member.role || memberUser.role
    return matchesUser && String(role).toUpperCase() === 'LEADER'
  })
}

export function useIsProjectLeader(project) {
  const { user } = useAuth()
  return isProjectLeader(project, user)
}

export default useIsProjectLeader