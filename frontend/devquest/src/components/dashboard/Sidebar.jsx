import { NavLink } from 'react-router-dom'
import { sidebarNavItems } from '@/constants/navigation'
import { Card } from '@/components/ui/card'
import { octomCardClass, octomSmallIconButtonClass } from '@/constants/uiStyles'

export default function Sidebar() {
  return (
    <aside className="sticky top-4 z-10 h-[calc(100vh-2rem)] w-[104px] min-w-[104px] self-start md:top-6 md:h-[calc(100vh-3rem)] xl:top-8 xl:h-[calc(100vh-4rem)]">
      <Card className={`flex h-full flex-col items-center rounded-[32px] px-3 py-4 ${octomCardClass}`}>
        <div className="flex w-full flex-col items-center gap-2 px-3 py-2">
          <div className="flex h-14 w-14 items-center justify-center text-lg font-black tracking-[0.28em] text-[#5051F9]">
            O
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-500">DevQuest</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Menu
          </p>
        </div>

        <nav className="mt-3 flex w-full flex-col items-center gap-2">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group flex w-full flex-col items-center justify-center rounded-[22px] px-3 py-3 transition-all duration-200 ${
                    isActive ? 'text-slate-900' : 'text-slate-500 hover:-translate-y-0.5 hover:text-slate-900'
                  }`
                }
                aria-label={item.label}
                title={item.label}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-[18px] ${
                        isActive
                          ? 'bg-[#5051F9] text-white shadow-lg shadow-indigo-200/70'
                          : octomSmallIconButtonClass
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={`mt-2 text-[10px] font-semibold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto flex w-full justify-center pt-4">
          <div className="rounded-[20px] bg-slate-50 px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Live
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-700">S12</p>
          </div>
        </div>
      </Card>
    </aside>
  )
}
