import { Outlet, Link, useLocation } from 'react-router-dom'
import { headerNavigation, siteName } from '../../const/navigation'
import MoreMenu from './MoreMenu'

export default function BaseLayout() {
    const location = useLocation()

    return (
        <div className="min-h-screen flex">
            {/* Sidebar Navigation */}
            <aside className="w-16 flex flex-col bg-background">
                {/* Logo - Top */}
                <div className="p-4 flex items-center justify-center">
                    <Link to="/" className="text-xl font-bold" title={siteName}>
                        G
                    </Link>
                </div>

                {/* Navigation Items - Middle */}
                <nav className="flex-1 px-2 flex flex-col gap-2 items-center justify-center">
                    {headerNavigation.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={item.label}
                                className={`w-full aspect-square rounded-lg transition-colors flex items-center justify-center
                                    ${item.background ? 'bg-accent' : ''}
                                    ${isActive
                                        ? ''
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                <Icon size={24} strokeWidth={isActive ? 3 : 1} />
                            </Link>
                        )
                    })}
                </nav>

                {/* More Menu - Bottom */}
                <MoreMenu />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="container mx-auto px-6 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
