import { CalendarDays, MessageCircleMore, Plus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomInputClass,
  octomMutedPanelClass,
  octomPrimaryButtonClass,
  octomSelectTriggerClass,
} from '@/constants/uiStyles'

function ScheduleList({ items }) {
  return (
    <Card className={octomCardClass}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Today's Schedule</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Keep the cadence</h2>
        </div>
        <CalendarDays className="h-5 w-5 text-[#5051F9]" />
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className={octomMutedPanelClass}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {item.type}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                {item.position}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {item.start_time} - {item.end_time}
            </p>
            <p className="mt-1 text-sm text-slate-400">{item.location}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function MessagesList({ messages }) {
  return (
    <Card className={octomCardClass}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Messages</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Recent updates</h2>
        </div>
        <MessageCircleMore className="h-5 w-5 text-[#5051F9]" />
      </div>

      <div className="mt-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${octomMutedPanelClass}`}>
            <Avatar
              className={`${octomAvatarBaseClass} h-11 w-11 shrink-0 rounded-[18px]`}
              style={{ backgroundColor: message.color }}
              title={message.sender}
            >
              <AvatarFallback
                className={octomAvatarFallbackClass}
                style={{ backgroundColor: message.color }}
              >
                {message.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{message.sender}</p>
                  <p className="text-xs text-slate-400">{message.position}</p>
                </div>
                {message.unread ? <span className="h-2.5 w-2.5 rounded-full bg-[#5051F9]" /> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{message.content}</p>
              <p className="mt-3 text-xs font-medium text-slate-400">{message.created_at}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function QuickAddTask({ team, draftTask, onDraftChange, onSubmit }) {
  return (
    <Card className={octomCardClass}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Quick Add Task</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Capture new work</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-indigo-50 text-[#5051F9]">
          <Plus className="h-5 w-5" />
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="taskTitle">
            Task title
          </label>
          <Input
            id="taskTitle"
            type="text"
            value={draftTask.title}
            onChange={(event) => onDraftChange('title', event.target.value)}
            placeholder="Add a concise deliverable"
            className={octomInputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="taskAssignee">
              Assignee
            </label>
            <Select
              value={String(draftTask.assigneeId)}
              onValueChange={(value) => onDraftChange('assigneeId', Number(value))}
            >
              <SelectTrigger
                id="taskAssignee"
                className={octomSelectTriggerClass}
              >
                <SelectValue placeholder="Choose assignee" />
              </SelectTrigger>
              <SelectContent>
                {team.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-500" htmlFor="taskDueDate">
              Due
            </label>
            <Input
              id="taskDueDate"
              type="text"
              value={draftTask.dueDate}
              onChange={(event) => onDraftChange('dueDate', event.target.value)}
              placeholder="Tomorrow, 02:00 PM"
              className={octomInputClass}
            />
          </div>
        </div>

        <Button
          type="submit"
          className={`h-14 w-full rounded-[20px] ${octomPrimaryButtonClass}`}
        >
          <Plus className="h-4 w-4" />
          Add to board
        </Button>
      </form>
    </Card>
  )
}

export default function RightPanel({
  schedule,
  messages,
  team,
  draftTask,
  onDraftChange,
  onSubmit,
}) {
  return (
    <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
      <ScheduleList items={schedule} />
      <MessagesList messages={messages} />
      <QuickAddTask
        team={team}
        draftTask={draftTask}
        onDraftChange={onDraftChange}
        onSubmit={onSubmit}
      />
    </aside>
  )
}
