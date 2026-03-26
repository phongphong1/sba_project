import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PRIMARY_COLOR } from '@/constants/theme'
import { octomFilterBadgeClass, octomInteractiveCardClass } from '@/constants/uiStyles'

export default function AnalyticsChart({ data }) {
  return (
    <Card className={octomInteractiveCardClass}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Task Done</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Team output this week
          </h2>
        </div>

        <div className="inline-flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-500">
          <Badge variant="secondary" className={`${octomFilterBadgeClass} bg-slate-50 px-0 py-0 text-sm font-normal normal-case tracking-normal`}>
            <span className="h-2.5 w-2.5 rounded-full bg-[#5051F9]" />
            Completed
          </Badge>
          <Badge variant="secondary" className={`${octomFilterBadgeClass} bg-slate-50 px-0 py-0 text-sm font-normal normal-case tracking-normal`}>
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            Goal
          </Badge>
        </div>
      </div>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="taskDoneGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.4} />
                <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#E5E7EB" strokeDasharray="6 6" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip
              cursor={{ stroke: '#C7D2FE', strokeWidth: 1 }}
              contentStyle={{
                border: '1px solid #E2E8F0',
                borderRadius: '18px',
                boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
              }}
            />
            <Area
              type="monotone"
              dataKey="completedTasks"
              stroke={PRIMARY_COLOR}
              strokeWidth={4}
              fill="url(#taskDoneGradient)"
            />
            <Area
              type="monotone"
              dataKey="goalTasks"
              stroke="#CBD5E1"
              strokeWidth={2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
