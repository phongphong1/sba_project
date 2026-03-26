import { CalendarDays } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  octomCardClass,
  octomMutedPanelClass,
} from '@/constants/uiStyles'

function ScheduleList({ items }) {
  const hasItems = Array.isArray(items) && items.length > 0

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
        {hasItems ? (
          items.map((item) => (
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
          ))
        ) : (
          <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No schedule events yet for this workspace.
          </div>
        )}
      </div>
    </Card>
  )
}

export default function RightPanel({ schedule }) {
  return (
    <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
      <ScheduleList items={schedule} />
    </aside>
  )
}
