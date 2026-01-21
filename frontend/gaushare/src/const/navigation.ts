import type { LucideIcon } from 'lucide-react'
import { Home, Plus, AppWindowMac, File, Bell, User } from 'lucide-react'

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
        path: '/posts',
        label: 'Posts',
        icon: AppWindowMac,
        background: false,
    },
    {
        path: '/documents',
        label: 'Documents',
        icon: File,
        background: false,
    },
    {
        path: '/notifications',
        label: 'Notifications',
        icon: Bell,
        background: false,
    },
    {
        path: '/profile',
        label: 'Profile',
        icon: User,
        background: false,
    },
    {
        path: '/add',
        label: 'Add',
        icon: Plus,
        background: true,
    },
]

export const siteName = 'Gaushare'
