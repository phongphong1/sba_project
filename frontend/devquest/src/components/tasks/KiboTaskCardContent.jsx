import { Calendar, MessageSquare, Paperclip } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomPillBadgeClass,
} from '@/constants/uiStyles'

const priorityBadgeMap = {
  HIGH: 'bg-rose-100 text-rose-600',
  MEDIUM: 'bg-amber-100 text-amber-600',
  LOW: 'bg-emerald-100 text-emerald-600',
}

export default function KiboTaskCardContent({ task }) {
  return (
    <div className="min-w-0 whitespace-normal">
      <div className="flex items-start justify-between gap-3">
        <Badge className={`${octomPillBadgeClass} ${priorityBadgeMap[task.priority]}`}>
          {task.priority}
        </Badge>
        <Avatar
          className={`${octomAvatarBaseClass} h-10 w-10 rounded-[18px]`}
          style={{ backgroundColor: task.assignee.color }}
          title={task.assignee.name}
        >
          <AvatarFallback
            className={octomAvatarFallbackClass}
            style={{ backgroundColor: task.assignee.color }}
          >
            {task.assignee.avatar}
          </AvatarFallback>
        </Avatar>
      </div>

      <h3 className="mt-4 break-words text-base font-semibold leading-6 text-slate-900">
        {task.title}
      </h3>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
          <span>Sub-task progress</span>
          <span>{task.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6C6DFB] to-[#5051F9]"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {task.dueDate}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Paperclip className="h-3.5 w-3.5" />
          {task.attachments.length}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" />
          {task.comments.length}
        </span>
      </div>
    </div>
  )
}
