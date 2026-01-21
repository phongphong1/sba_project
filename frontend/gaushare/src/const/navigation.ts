import type { LucideIcon } from 'lucide-react'
import { Home, Info, Plus } from 'lucide-react'

export interface NavigationItem {
    path: string
    label: string
    icon: LucideIcon
    background: boolean
}

export const headerNavigation: NavigationItem[] = [
    {
        path: '/',
        label: 'Home',
        icon: Home,
        background: false,
    },
    {
        path: '/add',
        label: 'Add',
        icon: Plus,
        background: true,
    },
    {
        path: '/about',
        label: 'About',
        icon: Info,
        background: false,
    },
]

export const siteName = 'Gaushare'
