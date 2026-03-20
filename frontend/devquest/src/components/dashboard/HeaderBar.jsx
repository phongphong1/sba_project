import { Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  onSearchChange = () => {},
}) {
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

        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className={`relative h-12 w-12 ${octomIconButtonClass}`}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#5051F9]" />
        </Button>

        <Avatar
          className={`${octomAvatarBaseClass} h-12 w-12 rounded-[20px]`}
          style={{ backgroundColor: '#E0E7FF' }}
          title="DevQuest Admin"
        >
          <AvatarFallback className={octomAvatarFallbackClass} style={{ backgroundColor: '#E0E7FF' }}>
            DQ
          </AvatarFallback>
        </Avatar>
      </div>
    </Card>
  )
}
