import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  octomInputClass,
  octomMutedPanelClass,
  octomPrimaryButtonClass,
  octomSecondaryButtonClass,
} from '@/constants/uiStyles'

export default function ProfileGeneralSection({
  profileForm,
  isLoadingProfile,
  isSavingProfile,
  onFieldChange,
  onReset,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-400">General information</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Update your profile details
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-500">Full name</label>
          <Input
            value={profileForm.fullName}
            onChange={(event) => onFieldChange('fullName', event.target.value)}
            className={octomInputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-500">Email</label>
          <Input
            type="email"
            value={profileForm.email}
            disabled
            readOnly
            className={`${octomInputClass} cursor-not-allowed opacity-70`}
          />
          <p className="text-xs text-slate-400">
            Email can not be changed from this screen.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-500">Bio</label>
        <Textarea
          value={profileForm.bio}
          onChange={(event) => onFieldChange('bio', event.target.value)}
          className="rounded-[18px] border-slate-200 bg-slate-50 shadow-none focus-visible:border-[#5051F9] focus-visible:ring-[#5051F9]/20"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={`border-0 md:col-span-2 ${octomMutedPanelClass}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Mail className="h-4 w-4 text-[#5051F9]" />
                Email notifications
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Receive updates about tasks, mentions, and workspace activity.
              </p>
            </div>
            <Switch
              checked={profileForm.emailNotifications}
              onCheckedChange={(checked) => onFieldChange('emailNotifications', checked)}
            />
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onReset}
          disabled={isLoadingProfile || isSavingProfile}
          className={`h-12 ${octomSecondaryButtonClass}`}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoadingProfile || isSavingProfile}
          className={`h-12 ${octomPrimaryButtonClass}`}
        >
          {isSavingProfile ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}
