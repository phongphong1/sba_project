import {
  FolderKanban,
  LayoutDashboard,
  MessageCircleMore,
  Settings,
  SquareChartGantt,
} from 'lucide-react'

export const sidebarNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { id: 'tasks', label: 'Tasks', icon: FolderKanban, to: '/tasks' },
  { id: 'timeline', label: 'Timeline', icon: SquareChartGantt, to: '/timeline' },
  { id: 'messages', label: 'Messages', icon: MessageCircleMore, to: '/messages' },
  { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]
