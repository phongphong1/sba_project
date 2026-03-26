import { useState } from 'react'
import { Check, Filter, FolderKanban, Plus, Search, UserPlus, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomDrawerContentClass,
  octomFilterBadgeClass,
  octomInlineInputClass,
  octomMutedPanelClass,
  octomPrimaryButtonClass,
  octomSecondaryButtonClass,
} from '@/constants/uiStyles'

const priorityOptions = ['ALL', 'HIGH', 'MEDIUM', 'LOW']

export default function BoardHeader({
  workspaceName,
  boardTitle,
  boardDescription,
  activeBoardId,
  boards,
  workspaceMembers,
  searchQuery,
  onSearchChange,
  activePriority,
  onPriorityChange,
  onAddColumn,
  onBoardSelect,
  columnCount,
  taskCount,
}) {
  const [activeDrawer, setActiveDrawer] = useState(null)
  const isBoardDrawerOpen = activeDrawer === 'board'
  const isMembersDrawerOpen = activeDrawer === 'members'

  return (
    <>
      <Card className={`space-y-5 ${octomCardClass}`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">{workspaceName}</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">{boardTitle}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {boardDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className={`h-12 ${octomSecondaryButtonClass}`}
            onClick={() => setActiveDrawer('board')}
          >
            <FolderKanban className="h-4 w-4" />
            Switch board
          </Button>

          <Button
            type="button"
            variant="secondary"
            className={`h-12 ${octomSecondaryButtonClass}`}
            onClick={() => setActiveDrawer('members')}
          >
            <Users className="h-4 w-4" />
            {workspaceMembers.length} members
          </Button>

          <Button
            type="button"
            onClick={onAddColumn}
            className={`h-12 ${octomPrimaryButtonClass}`}
          >
            <Plus className="h-4 w-4" />
            Add Column
          </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="flex w-full items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3 text-slate-400 ring-1 ring-slate-200 transition focus-within:ring-[#5051F9] xl:max-w-md">
            <Search className="h-4 w-4" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search cards by title, assignee, or due date..."
              className={octomInlineInputClass}
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className={octomFilterBadgeClass}
            >
              <Filter className="h-3.5 w-3.5" />
              Priority
            </Badge>

            {priorityOptions.map((priority) => {
              const isActive = activePriority === priority

              return (
                <Button
                  key={priority}
                  type="button"
                  onClick={() => onPriorityChange(priority)}
                  variant={isActive ? 'default' : 'outline'}
                  className={`rounded-full px-4 text-sm font-semibold ${
                    isActive
                      ? 'bg-[#5051F9] text-white shadow-lg shadow-indigo-200'
                      : 'border-slate-200 bg-white text-slate-500 shadow-none hover:bg-slate-50'
                  }`}
                >
                  {priority}
                </Button>
              )
            })}
          </div>
        </div>
      </Card>

      <Drawer open={isBoardDrawerOpen} onOpenChange={(open) => !open && setActiveDrawer(null)} direction="right">
        <DrawerContent className={`${octomDrawerContentClass} data-[vaul-drawer-direction=right]:sm:max-w-xl`}>
          {isBoardDrawerOpen ? (
            <div className="flex h-full flex-col gap-6 overflow-y-auto">
              <DrawerHeader className="px-0">
                <DrawerTitle>Switch board</DrawerTitle>
                <DrawerDescription>Select another board inside this workspace.</DrawerDescription>
              </DrawerHeader>

              <Card className={`border-0 ${octomMutedPanelClass}`}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-slate-400">Columns</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{columnCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Tasks</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{taskCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Workspace members</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {workspaceMembers.length}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-3">
                {boards.map((board) => {
                  const isActive = board.id === activeBoardId

                  return (
                    <button
                      key={board.id}
                      type="button"
                      onClick={() => {
                        onBoardSelect(board.id)
                        setActiveDrawer(null)
                      }}
                      className={`w-full rounded-[20px] border px-5 py-4 text-left transition ${
                        isActive
                          ? 'border-[#5051F9] bg-indigo-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{board.name}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {board.description}
                          </p>
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {board.taskCount} tasks • {board.columnCount} columns
                          </p>
                        </div>
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isActive ? 'bg-[#5051F9] text-white' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>

      <Drawer open={isMembersDrawerOpen} onOpenChange={(open) => !open && setActiveDrawer(null)} direction="right">
        <DrawerContent className="w-full border-none bg-[#F8F9FB] p-4 data-[vaul-drawer-direction=right]:sm:max-w-md md:p-6">
          {isMembersDrawerOpen ? (
            <div className="flex h-full flex-col gap-6 overflow-y-auto">
              <DrawerHeader className="px-0">
                <DrawerTitle>Workspace members</DrawerTitle>
                <DrawerDescription>People available across boards in this workspace.</DrawerDescription>
              </DrawerHeader>

              <div className="flex items-center justify-between gap-3 rounded-[20px] bg-white p-4 ring-1 ring-slate-200/70">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{workspaceMembers.length} members</p>
                  <p className="mt-1 text-sm text-slate-500">Keep ownership visible across all boards.</p>
                </div>
                <Button type="button" className={`h-11 ${octomPrimaryButtonClass}`}>
                  <UserPlus className="h-4 w-4" />
                  Add member
                </Button>
              </div>

              <div className="space-y-3">
                {workspaceMembers.map((member) => (
                  <Card
                    key={member.id}
                    className="rounded-[20px] border-0 bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200/70"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        className={`${octomAvatarBaseClass} h-12 w-12 rounded-[18px]`}
                        style={{ backgroundColor: member.color }}
                      >
                        <AvatarFallback
                          className={octomAvatarFallbackClass}
                          style={{ backgroundColor: member.color }}
                        >
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {member.fullName}
                        </p>
                        <p className="text-sm text-slate-500">{member.role}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        Member
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    </>
  )
}
