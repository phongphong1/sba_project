import { CalendarDays, Plus } from 'lucide-react'
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
              {item.startTime} - {item.endTime}
            </p>
            <p className="mt-1 text-sm text-slate-400">{item.location}</p>
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
              onValueChange={(value) => onDraftChange('assigneeId', value)}
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
  team,
  draftTask,
  onDraftChange,
  onSubmit,
}) {
  return (
    <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
      <ScheduleList items={schedule} />
      <QuickAddTask
        team={team}
        draftTask={draftTask}
        onDraftChange={onDraftChange}
        onSubmit={onSubmit}
      />
    </aside>
  )
}
