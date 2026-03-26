import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { octomCardClass, octomPrimaryButtonClass, octomSecondaryButtonClass } from '@/constants/uiStyles'

export default function EmptyStatePanel({
  eyebrow = 'Empty state',
  title,
  description,
  primaryActionLabel = '',
  onPrimaryAction,
  secondaryActionLabel = '',
  onSecondaryAction,
}) {
  return (
    <Card className={`w-full items-center px-8 py-10 text-center ${octomCardClass}`}>
      <p className="text-sm font-medium text-slate-400">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">{description}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {primaryActionLabel ? (
          <Button
            type="button"
            onClick={onPrimaryAction}
            className={`h-12 ${octomPrimaryButtonClass}`}
          >
            {primaryActionLabel}
          </Button>
        ) : null}

        {secondaryActionLabel ? (
          <Button
            type="button"
            variant="secondary"
            onClick={onSecondaryAction}
            className={`h-12 ${octomSecondaryButtonClass}`}
          >
            {secondaryActionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
