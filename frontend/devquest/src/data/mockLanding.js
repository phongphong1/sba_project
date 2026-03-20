import {
  Activity,
  BellRing,
  ChartSpline,
  Grip,
  MessageSquareText,
  Users,
} from 'lucide-react'

export const FEATURES = [
  {
    id: 'smart-kanban',
    icon: Grip,
    title: 'Smart Kanban',
    description: 'Organize work with fluid drag-and-drop boards built for fast prioritization.',
  },
  {
    id: 'real-time-analytics',
    icon: ChartSpline,
    title: 'Real-time Analytics',
    description: 'Track delivery health with live insights, performance curves, and team velocity.',
  },
  {
    id: 'team-collaboration',
    icon: Users,
    title: 'Team Collaboration',
    description: 'Keep conversations, mentions, and notifications in one shared workspace.',
  },
]

export const LANDING_STATS = [
  { id: 'teams', label: 'Teams onboarded', value: 10000, suffix: '+' },
  { id: 'tasks', label: 'Tasks completed', value: 1000000, suffix: '+' },
  { id: 'uptime', label: 'Workflow uptime', value: 99, suffix: '%' },
]

export const FOOTER_LINKS = [
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'solutions', label: 'Solutions', href: '#solutions' },
  { id: 'pricing', label: 'Pricing', href: '#pricing' },
]

export const HERO_PREVIEW_CARDS = [
  {
    id: 'kanban',
    title: 'Launch campaign assets',
    progress: 78,
    icon: BellRing,
    accent: '#5051F9',
  },
  {
    id: 'analytics',
    title: 'Weekly team velocity',
    progress: 92,
    icon: Activity,
    accent: '#22C55E',
  },
  {
    id: 'collab',
    title: 'Stakeholder sync notes',
    progress: 64,
    icon: MessageSquareText,
    accent: '#F97316',
  },
]
