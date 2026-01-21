import { Settings, LogOut } from 'lucide-react'

interface MoreMenuButtonsProps {
    onButtonClick?: () => void
}

export default function MoreMenuButtons({ onButtonClick }: MoreMenuButtonsProps) {
    const handleSettingsClick = () => {
        console.log('Settings clicked')
        onButtonClick?.()
    }

    const handleLogoutClick = () => {
        console.log('Logout clicked')
        onButtonClick?.()
    }

    return (
        <>
            <button
                onClick={handleSettingsClick}
                className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2"
            >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
            </button>
            <button
                onClick={handleLogoutClick}
                className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2"
            >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
            </button>
        </>
    )
}
