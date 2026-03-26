import { ChevronRight, Clock3 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { priorityClassMap, statusClassMap } from '@/constants/theme'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomGhostBadgeClass,
  octomLiftCardClass,
  octomMutedPanelClass,
  octomSecondaryButtonClass,
} from '@/constants/uiStyles'

function TaskItem({ task, onToggleReminder }) {
  const statusLabel = task.status.replace(/([A-Z])/g, ' $1').toLowerCase()

  return (
    <Card className={octomLiftCardClass}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassMap[task.status]}`}
            >
              {statusLabel}
            </Badge>
            <Badge variant="outline" className={`${octomGhostBadgeClass} ${priorityClassMap[task.priority]}`}>
              {task.priority} priority
            </Badge>
            <span className="text-xs font-medium text-slate-400">{task.sprint}</span>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-2 text-sm text-slate-500">
            Assignee: <span className="font-medium text-slate-700">{task.assignee.name}</span> · Est.
            {` ${task.estimateHours} hrs`}
          </p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="font-semibold text-slate-700">{task.progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6C6DFB] to-[#5051F9]"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className={`flex min-w-[220px] flex-col gap-4 rounded-[22px] ${octomMutedPanelClass}`}>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="h-4 w-4 text-[#5051F9]" />
            <span>{task.dueDate}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <AvatarGroup className="-space-x-3">
              {task.members.map((member) => (
                <Avatar
                  key={member.id}
                  className={`${octomAvatarBaseClass} h-10 w-10 rounded-[18px] ring-white`}
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
              onClick={() => onToggleReminder(task.id)}
              variant={task.reminderEnabled ? 'default' : 'outline'}
              className={`px-4 text-sm font-semibold ${task.reminderEnabled
                  ? 'bg-[#5051F9] text-white hover:bg-[#4344dd]'
                  : `${octomSecondaryButtonClass} border-slate-200 bg-white text-slate-600 hover:bg-slate-100`
                }`}
            >
              Reminder
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function EmptyTaskState({ hasActiveSearch }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
      {hasActiveSearch
        ? 'No tasks match the current search.'
        : 'No tasks available yet. Add one from Quick Add to get started.'}
    </div>
  )
}

export default function TaskList({ tasks, onToggleReminder, hasActiveSearch = false }) {
  return (
    <Card className={octomCardClass}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Detailed task list</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Current delivery pipeline
          </h2>
        </div>

        <Button
          type="button"
          variant="secondary"
          className={`self-start ${octomSecondaryButtonClass}`}
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleReminder={onToggleReminder} />
          ))
        ) : (
          <EmptyTaskState hasActiveSearch={hasActiveSearch} />
        )}
      </div>
    </Card>
  )
}
