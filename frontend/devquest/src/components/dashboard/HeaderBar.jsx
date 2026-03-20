import { useMemo, useState } from 'react'
import { Bell, ChevronDown, LogOut, Search, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomIconButtonClass,
  octomInlineInputClass,
} from '@/constants/uiStyles'

export default function HeaderBar({
  eyebrow = 'Welcome back',
  title = 'Dashboard',
  description = 'Build faster with clarity',
  searchQuery = '',
  onSearchChange = () => { },
}) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Mia left feedback on Timeline view', time: '5m ago', unread: true },
    { id: 2, title: '3 tasks moved to Review', time: '18m ago', unread: true },
    { id: 3, title: 'Profile settings updated successfully', time: '1h ago', unread: false },
  ])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  )

  const handleReadAll = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      })),
    )
  }

  return (
    <Card className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${octomCardClass}`}>
      <div>
        <p className="text-sm font-medium text-slate-400">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex min-w-[260px] items-center gap-3 rounded-[22px] bg-slate-50 px-4 py-3 text-slate-400 ring-1 ring-slate-200 transition focus-within:ring-[#5051F9]">
          <Search className="h-4 w-4" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks, people, keywords..."
            className={octomInlineInputClass}
          />
        </label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className={`relative h-12 w-12 ${octomIconButtonClass}`}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount ? (
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#5051F9]" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-80 rounded-[20px] border-0 bg-white p-2 shadow-xl ring-1 ring-slate-200/70"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="text-xs text-slate-500">{unreadCount} unread</p>
              </div>
              <button
                type="button"
                onClick={handleReadAll}
                className="text-xs font-semibold text-[#5051F9] transition hover:text-[#4344dd]"
              >
                Read all
              </button>
            </div>

            <DropdownMenuSeparator className="bg-slate-200/70" />

            <div className="space-y-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="items-start rounded-[14px] px-3 py-3 text-slate-700"
                >
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full bg-[#5051F9] ${notification.unread ? 'opacity-100' : 'opacity-0'
                      }`}
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium text-slate-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-[22px] bg-transparent p-0 text-left outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#5051F9]/30"
              aria-label="Open profile menu"
            >
              <Avatar
                className={`${octomAvatarBaseClass} h-12 w-12 rounded-[20px]`}
                style={{ backgroundColor: '#E0E7FF' }}
                title="DevQuest Admin"
              >
                <AvatarFallback className={octomAvatarFallbackClass} style={{ backgroundColor: '#E0E7FF' }}>
                  DQ
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-[20px] border-0 bg-white p-2 shadow-xl ring-1 ring-slate-200/70">
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-sm font-semibold text-slate-900">DevQuest Admin</p>
              <p className="text-xs font-normal text-slate-500">admin@devquest.app</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200/70" />
            <DropdownMenuItem asChild className="rounded-[14px] px-3 py-2 text-slate-700">
              <Link to="/profile">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200/70" />
            <DropdownMenuItem
              variant="destructive"
              className="rounded-[14px] px-3 py-2 text-rose-500 focus:bg-rose-50 focus:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
