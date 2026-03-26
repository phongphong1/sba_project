export const profileTabs = [
  { id: 'general', label: 'General' },
  { id: 'workspaces', label: 'Workspaces' },
  { id: 'security', label: 'Security' },
]

export function getRoleLabel(systemRole) {
  return systemRole === 'ROLE_ADMIN' ? 'Admin' : 'User'
}

export function createProfileForm(user) {
  return {
    fullName: user.fullName ?? '',
    email: user.email ?? '',
    bio: user.bio ?? '',
    emailNotifications: Boolean(user.emailNotifications),
  }
}

export function createPasswordForm() {
  return {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

export function createPasswordErrors() {
  return {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

export function validatePasswordForm(passwordForm) {
  const errors = createPasswordErrors()

  if (!passwordForm.currentPassword.trim()) {
    errors.currentPassword = 'Current password is required.'
  }

  if (!passwordForm.newPassword.trim()) {
    errors.newPassword = 'New password is required.'
  } else if (passwordForm.newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters.'
  } else if (passwordForm.newPassword === passwordForm.currentPassword) {
    errors.newPassword = 'New password must be different from the current password.'
  }

  if (!passwordForm.confirmPassword.trim()) {
    errors.confirmPassword = 'Please confirm the new password.'
  } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
    errors.confirmPassword = 'Password confirmation does not match.'
  }

  return errors
}

export function hasPasswordErrors(errors) {
  return Object.values(errors).some(Boolean)
}

export function getRequestErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    fallbackMessage
  )
}

export function createEmptyProfileData() {
  return {
    user: {
      id: null,
      fullName: '',
      email: '',
      avatarUrl: '',
      systemRole: 'ROLE_USER',
      bio: '',
      emailNotifications: false,
    },
    stats: {
      workspacesCount: 0,
      tasksCompleted: 0,
      totalComments: 0,
      activeSince: 'Unavailable',
    },
  }
}

export function normalizeProfileData(payload) {
  const base = createEmptyProfileData()
  // Accept both `{ user, stats }` and a flatter user payload.
  const resolvedUser =
    payload?.user && typeof payload.user === 'object'
      ? payload.user
      : payload && typeof payload === 'object'
        ? payload
        : null

  if (!resolvedUser) {
    return null
  }

  return {
    ...base,
    ...payload,
    user: {
      ...base.user,
      ...resolvedUser,
    },
    stats: {
      ...base.stats,
      ...(payload?.stats ?? {}),
    },
  }
}

export function normalizeWorkspaceList(payload) {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.workspaces)
      ? payload.workspaces
      : []

  // Keep the UI shape stable even when the API omits optional fields.
  return source.map((workspace, index) => ({
    id: workspace.id ?? `workspace-${index + 1}`,
    name: workspace.name ?? 'Untitled workspace',
    description: workspace.description ?? 'No description yet.',
    role: workspace.role ?? (index === 0 ? 'Owner' : 'Member'),
    boardCount: workspace.boardCount ?? workspace.boards?.length ?? 0,
    activeSince: workspace.activeSince ?? null,
  }))
}
