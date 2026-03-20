import { FolderKanban, LayoutDashboard, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { octomLiftCardClass } from '@/constants/uiStyles'

const statIcons = {
  dashboard: LayoutDashboard,
  tasks: FolderKanban,
  sparkles: Sparkles,
}

export default function StatsCard({ stat }) {
  const Icon = statIcons[stat.icon] ?? Sparkles
  const trendColor = stat.trend === 'up' ? 'text-emerald-500' : 'text-slate-500'

  return (
    <Card className={octomLiftCardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{stat.title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{stat.metric}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-indigo-50 text-[#5051F9]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className={`text-sm font-semibold ${trendColor}`}>{stat.delta}</p>
        <p className="text-sm text-slate-400">{stat.description}</p>
      </div>
    </Card>
  )
}
