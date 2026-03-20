import { Filter, Plus, Search, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomFilterBadgeClass,
  octomInlineInputClass,
  octomPrimaryButtonClass,
  octomSecondaryButtonClass,
} from '@/constants/uiStyles'

const priorityOptions = ['ALL', 'HIGH', 'MEDIUM', 'LOW']

export default function BoardHeader({
  boardTitle,
  onlineMembers,
  searchQuery,
  onSearchChange,
  activePriority,
  onPriorityChange,
  onAddColumn,
}) {
  return (
    <Card className={`space-y-5 ${octomCardClass}`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Kanban board</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{boardTitle}</h2>
          <p className="mt-2 text-sm text-slate-500">
            Drag tasks across columns and keep discovery work moving clearly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AvatarGroup className="-space-x-3">
            {onlineMembers.map((member) => (
              <Avatar
                key={member.id}
                className={`${octomAvatarBaseClass} h-11 w-11 rounded-[18px] ring-white`}
                style={{ backgroundColor: member.color }}
                title={member.name}
              >
                <AvatarFallback
                  className={octomAvatarFallbackClass}
                  style={{ backgroundColor: member.color }}
                >
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>

          <Button
            type="button"
            variant="secondary"
            className={`h-12 ${octomSecondaryButtonClass}`}
          >
            <UserPlus className="h-4 w-4" />
            Invite
          </Button>

          <Button
            type="button"
            onClick={onAddColumn}
            className={`h-12 ${octomPrimaryButtonClass}`}
          >
            <Plus className="h-4 w-4" />
            Add Column
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <label className="flex w-full items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3 text-slate-400 ring-1 ring-slate-200 transition focus-within:ring-[#5051F9] xl:max-w-md">
          <Search className="h-4 w-4" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search cards by title, assignee, or due date..."
            className={octomInlineInputClass}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className={octomFilterBadgeClass}
          >
            <Filter className="h-3.5 w-3.5" />
            Priority
          </Badge>

          {priorityOptions.map((priority) => {
            const isActive = activePriority === priority

            return (
              <Button
                key={priority}
                type="button"
                onClick={() => onPriorityChange(priority)}
                variant={isActive ? 'default' : 'outline'}
                className={`rounded-full px-4 text-sm font-semibold ${
                  isActive
                    ? 'bg-[#5051F9] text-white shadow-lg shadow-indigo-200'
                    : 'border-slate-200 bg-white text-slate-500 shadow-none hover:bg-slate-50'
                }`}
              >
                {priority}
              </Button>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
