import { useMemo } from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import BrandLogo from '@/components/common/BrandLogo'
import { sidebarNavItems } from '@/constants/navigation'
import { useWorkspaceShell } from '@/contexts/WorkspaceShellContext'
import { Card } from '@/components/ui/card'
import { octomCardClass, octomSmallIconButtonClass } from '@/constants/uiStyles'

export default function Sidebar() {
  const location = useLocation()
  const { workspaceId: routeWorkspaceId } = useParams()
  const { preferredWorkspaceId, getPreferredBoardId, getWorkspace } = useWorkspaceShell()

  const activeWorkspaceId =
    (routeWorkspaceId && getWorkspace(routeWorkspaceId)?.id) ?? preferredWorkspaceId
  const workspaceFallbackPath = '/workspace-empty'

  const navItems = useMemo(
    () =>
      sidebarNavItems.map((item) => {
        if (item.id === 'profile') {
          return {
            ...item,
            isActive: location.pathname === '/profile',
          }
        }

        const workspacePathMap = {
          dashboard: activeWorkspaceId ? `/w/${activeWorkspaceId}/dashboard` : workspaceFallbackPath,
          tasks: activeWorkspaceId
            ? `/w/${activeWorkspaceId}/boards/${getPreferredBoardId(activeWorkspaceId) ?? ''}`.replace(/\/$/, '')
            : workspaceFallbackPath,
          timeline: activeWorkspaceId ? `/w/${activeWorkspaceId}/timeline` : workspaceFallbackPath,
          messages: activeWorkspaceId ? `/w/${activeWorkspaceId}/messages` : workspaceFallbackPath,
        }

        return {
          ...item,
          to: workspacePathMap[item.id] ?? item.to,
          isActive:
            item.id !== 'profile'
              ? location.pathname.startsWith(`/w/${activeWorkspaceId}/${item.matchPrefix}`)
              : location.pathname === '/profile',
        }
      }),
    [activeWorkspaceId, getPreferredBoardId, location.pathname],
  )

  return (
    <aside className="sticky top-4 z-10 h-[calc(100vh-2rem)] w-[104px] min-w-[104px] self-start md:top-6 md:h-[calc(100vh-3rem)] xl:top-8 xl:h-[calc(100vh-4rem)]">
      <Card className={`flex h-full flex-col items-center rounded-[32px] px-3 py-4 ${octomCardClass}`}>
        <div className="flex w-full flex-col items-center gap-2 px-3 py-2">
          <BrandLogo
            stacked
            iconClassName="h-14 w-12"
            textClassName="text-[10px] tracking-[0.08em] text-slate-500"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Menu
          </p>
        </div>

        <nav className="mt-3 flex w-full flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.id === 'profile'}
                className={() =>
                  `group flex w-full flex-col items-center justify-center rounded-[22px] px-3 py-3 transition-all duration-200 ${item.isActive ? 'text-slate-900' : 'text-slate-500 hover:-translate-y-0.5 hover:text-slate-900'
                  }`
                }
                aria-label={item.label}
                title={item.label}
              >
                {() => (
                  <>
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-[18px] ${item.isActive
                          ? 'bg-[#5051F9] text-white shadow-lg shadow-indigo-200/70'
                          : octomSmallIconButtonClass
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={`mt-2 text-[10px] font-semibold ${item.isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

      </Card>
    </aside>
  )
}
