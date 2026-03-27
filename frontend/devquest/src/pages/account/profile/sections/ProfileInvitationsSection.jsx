import { Mail, Check } from 'lucide-react'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  octomPrimaryButtonClass,
} from '@/constants/uiStyles'

export default function ProfileInvitationsSection({
  invitations,
  isLoading,
  isAccepting,
  onAccept,
  onRefresh,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-400">Workspace invitations</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Pending invitations to join teams
        </h2>
      </div>

      {isLoading ? (
        <Card className="rounded-[22px] border-0 bg-slate-50 px-5 py-5 text-sm text-slate-500 shadow-none ring-1 ring-slate-200/70">
          Loading invitations...
        </Card>
      ) : invitations.length ? (
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <Card
              key={invitation.id}
              className="rounded-[22px] border-0 bg-white px-5 py-5 shadow-sm ring-1 ring-slate-200/70"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-indigo-100 text-[#5051F9]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {invitation.workspaceName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Invited by <span className="font-medium text-slate-700">{invitation.inviterName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => onAccept(invitation.token)}
                    disabled={isAccepting}
                    className={`h-11 ${octomPrimaryButtonClass}`}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyStatePanel
          eyebrow="Invitations"
          title="No pending invitations"
          description="You don't have any workspace invitations at the moment."
          secondaryActionLabel="Refresh"
          onSecondaryAction={onRefresh}
        />
      )}
    </div>
  )
}
