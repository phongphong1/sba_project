const pageMetaMap = {
  dashboard: {
    eyebrow: 'Workspace overview',
    title: 'Workspace dashboard',
    description: 'Track board health, delivery momentum, and team capacity from one place.',
    showSearch: true,
  },
  boards: {
    eyebrow: 'Board',
    title: 'Board workspace',
    description: 'Move work across columns and keep each board focused and easy to scan.',
    showSearch: false,
  },
  timeline: {
    eyebrow: 'Planning',
    title: 'Timeline and milestones',
    description: 'Keep upcoming milestones, dependencies, and sprint pacing visible.',
    showSearch: false,
  },
  messages: {
    eyebrow: 'Communication',
    title: 'Team conversations',
    description: 'Stay aligned on updates, feedback loops, and important delivery notes.',
    showSearch: false,
  },
  settings: {
    eyebrow: 'Preferences',
    title: 'Workspace settings',
    description: 'Adjust account, notification, and workspace level preferences here.',
    showSearch: false,
  },
  profile: {
    eyebrow: 'Personal workspace',
    title: 'Profile and account',
    description: 'Manage your personal details, activity stats, and account security settings.',
    showSearch: false,
  },
  fallback: {
    eyebrow: 'Workspace overview',
    title: 'Workspace dashboard',
    description: 'Track board health, delivery momentum, and team capacity from one place.',
    showSearch: false,
  },
}

export function getPageMeta(pathname) {
  if (pathname.includes('/boards/')) return pageMetaMap.boards
  if (pathname.endsWith('/dashboard')) return pageMetaMap.dashboard
  if (pathname.endsWith('/timeline')) return pageMetaMap.timeline
  if (pathname.endsWith('/messages')) return pageMetaMap.messages
  if (pathname.endsWith('/settings')) return pageMetaMap.settings
  if (pathname === '/profile') return pageMetaMap.profile

  return pageMetaMap.fallback
}
