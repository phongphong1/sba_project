import {
  FolderKanban,
  LayoutDashboard,
  MessageCircleMore,
  SquareChartGantt,
  UserRound,
} from 'lucide-react'

export const sidebarNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { id: 'tasks', label: 'Tasks', icon: FolderKanban, to: '/tasks' },
  { id: 'timeline', label: 'Timeline', icon: SquareChartGantt, to: '/timeline' },
  { id: 'messages', label: 'Messages', icon: MessageCircleMore, to: '/messages' },
  { id: 'profile', label: 'Profile', icon: UserRound, to: '/profile' },
]
