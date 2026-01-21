import type { LucideIcon } from 'lucide-react'

export interface MoreOptionSwitch {
    type: 'switch'
    id: string
    label: string
    defaultChecked?: boolean
}

export interface MoreOptionButton {
    type: 'button'
    id: string
    label: string
    onClick?: () => void
    icon?: LucideIcon
}

export type MoreOption = MoreOptionSwitch | MoreOptionButton

export const moreOptions: MoreOption[] = [
    {
        type: 'switch',
        id: 'dark-mode',
        label: 'Dark Mode',
        defaultChecked: false,
    },
    {
        type: 'switch',
        id: 'notifications',
        label: 'Notifications',
        defaultChecked: true,
    },
    {
        type: 'switch',
        id: 'auto-save',
        label: 'Auto Save',
        defaultChecked: true,
    },
    {
        type: 'button',
        id: 'settings',
        label: 'Settings',
        onClick: () => {
            console.log('Settings clicked')
        },
    },
    {
        type: 'button',
        id: 'logout',
        label: 'Logout',
        onClick: () => {
            console.log('Logout clicked')
        },
    },
]
