import {
  FolderKanban,
  LayoutDashboard,
  MessageCircleMore,
  SquareChartGantt,
  UserRound,
} from 'lucide-react'

export const sidebarNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', matchPrefix: 'dashboard' },
  { id: 'tasks', label: 'Boards', icon: FolderKanban, to: '/tasks', matchPrefix: 'boards' },
  { id: 'timeline', label: 'Timeline', icon: SquareChartGantt, to: '/timeline', matchPrefix: 'timeline' },
  { id: 'messages', label: 'Messages', icon: MessageCircleMore, to: '/messages', matchPrefix: 'messages' },
  { id: 'profile', label: 'Profile', icon: UserRound, to: '/profile' },
]
