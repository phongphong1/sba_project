import { Camera, CheckCircle2, MessageSquare, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomMutedPanelClass,
  octomSmallIconButtonClass,
} from '@/constants/uiStyles'
import useAvatarUpload from '../hooks/useAvatarUpload'
import AvatarUploadDialog from './AvatarUploadDialog'

export default function ProfileOverviewCard({
  profileData,
  profileForm,
  roleLabel,
  onAvatarUpdated,
}) {
  const avatarUpload = useAvatarUpload({
    onSuccess: onAvatarUpdated,
  })
  const avatarLabel = profileData.user.fullName.slice(0, 2).toUpperCase()

  return (
    <>
      <Card className={`space-y-6 ${octomCardClass}`}>
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar
              className={`${octomAvatarBaseClass} h-28 w-28 rounded-[32px]`}
              style={{ backgroundColor: '#E0E7FF' }}
            >
              {profileData.user.avatarUrl ? (
                <AvatarImage src={profileData.user.avatarUrl} alt={profileData.user.fullName} />
              ) : null}
              <AvatarFallback
                className={`${octomAvatarFallbackClass} text-xl`}
                style={{ backgroundColor: '#E0E7FF' }}
              >
                {avatarLabel}
              </AvatarFallback>
            </Avatar>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={avatarUpload.openDialog}
              className={`absolute -bottom-1 -right-1 h-10 w-10 ${octomSmallIconButtonClass}`}
              aria-label="Edit avatar"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
            {profileForm.fullName}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{profileForm.email}</p>
          <Badge className="mt-3 rounded-full bg-indigo-100 px-3 py-1 text-indigo-600">
            {roleLabel}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4 text-[#5051F9]" />
              Workspaces Joined
            </div>
            <span className="text-lg font-semibold text-slate-900">
              {profileData.stats.workspacesCount}
            </span>
          </div>

          <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-[#5051F9]" />
              Tasks Completed
            </div>
            <span className="text-lg font-semibold text-slate-900">
              {profileData.stats.tasksCompleted}
            </span>
          </div>

          <div className={`flex items-center justify-between ${octomMutedPanelClass}`}>
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <MessageSquare className="h-4 w-4 text-[#5051F9]" />
              Total Comments
            </div>
            <span className="text-lg font-semibold text-slate-900">
              {profileData.stats.totalComments}
            </span>
          </div>
        </div>

        <Card className="rounded-[20px] border-0 bg-slate-50 px-4 py-4 shadow-none">
          <p className="text-sm font-medium text-slate-400">Active since</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {profileData.stats.activeSince}
          </p>
        </Card>
      </Card>

      <AvatarUploadDialog fullName={profileData.user.fullName} upload={avatarUpload} />
    </>
  )
}
