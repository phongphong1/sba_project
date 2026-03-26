import { CalendarDays, FolderKanban } from 'lucide-react'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { octomSecondaryButtonClass } from '@/constants/uiStyles'

export default function ProfileWorkspacesSection({
  workspaceList,
  isLoadingWorkspaces,
  activeSinceFallback,
  getPreferredBoardId,
  onOpenWorkspace,
  onOpenBoard,
  onRefresh,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-400">My workspaces</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Workspaces and boards you are following
        </h2>
      </div>

      {isLoadingWorkspaces ? (
        <Card className="rounded-[22px] border-0 bg-slate-50 px-5 py-5 text-sm text-slate-500 shadow-none ring-1 ring-slate-200/70">
          Loading workspaces...
        </Card>
      ) : workspaceList.length ? (
        <div className="space-y-3">
          {workspaceList.map((workspace, index) => (
            <Card
              key={workspace.id}
              className="rounded-[22px] border-0 bg-white px-5 py-5 shadow-sm ring-1 ring-slate-200/70"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-indigo-100 text-[#5051F9]">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900">{workspace.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {workspace.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#5051F9]" />
                      Active since {workspace.activeSince ?? activeSinceFallback}
                    </span>
                    <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      {workspace.role ?? (index === 0 ? 'Owner' : 'Member')}
                    </Badge>
                    <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      {workspace.boardCount} boards
                    </Badge>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className={`h-11 ${octomSecondaryButtonClass}`}
                    onClick={() => onOpenWorkspace(workspace.id)}
                  >
                    Open workspace
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className={`h-11 ${octomSecondaryButtonClass}`}
                    onClick={() => onOpenBoard(workspace.id, getPreferredBoardId(workspace.id))}
                  >
                    Open current board
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyStatePanel
          eyebrow="Workspace memberships"
          title="No workspaces available"
          description="This account does not currently belong to any workspace, or the workspace API returned an empty list."
          secondaryActionLabel="Refresh"
          onSecondaryAction={onRefresh}
        />
      )}
    </div>
  )
}
