import { Card } from '@/components/ui/card'
import { octomCardClass } from '@/constants/uiStyles'

export default function PlaceholderPage({ title, description }) {
  return (
    <main className="flex min-h-[320px] items-center">
      <Card className={`w-full ${octomCardClass}`}>
        <p className="text-sm font-medium text-slate-400">Route ready</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">{description}</p>
      </Card>
    </main>
  )
}
