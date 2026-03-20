import { Settings, LogOut } from 'lucide-react'
import { useLogout } from '../../../hooks/useLogout'

interface MoreMenuButtonsProps {
    onButtonClick?: () => void
}

export default function MoreMenuButtons({ onButtonClick }: MoreMenuButtonsProps) {
    const { logout, isLoading } = useLogout()

    const handleSettingsClick = () => {
        console.log('Settings clicked')
        onButtonClick?.()
    }

    const handleLogoutClick = async () => {
        await logout()
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
                disabled={isLoading}
                className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <LogOut className="w-4 h-4" />
                <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
            </button>
        </>
    )
}
