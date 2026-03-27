import { pointerWithin } from '@dnd-kit/core'
import { MoreHorizontal, PencilLine, Plus, Trash2 } from 'lucide-react'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import {
    KanbanBoard,
    KanbanCard,
    KanbanCards,
    KanbanHeader,
    KanbanProvider,
} from '@/components/kibo-ui/kanban'
import KiboTaskCardContent from '@/components/tasks/KiboTaskCardContent'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function TasksBoardSection({
    workspaceId,
    navigate,
    hasBoards,
    boardView,
    kanbanColumns,
    kanbanData,
    tasksByColumn,
    onCreateBoard,
    onAddColumn,
    onKanbanDataChange,
    onColumnsChange,
    onKanbanDragEnd,
    onCreateTask,
    onEditColumn,
    onTaskSelect,
    onDeleteColumn,
}) {
    if (!hasBoards) {
        return (
            <EmptyStatePanel
                eyebrow="Workspace boards"
                title="No board exists in this workspace yet"
                description="Boards are the layer between workspace members and task columns. When a board is created, this area will show the full kanban with drag and drop."
                primaryActionLabel="Create board"
                onPrimaryAction={onCreateBoard}
                secondaryActionLabel="Back to dashboard"
                onSecondaryAction={() => navigate(`/w/${workspaceId}/dashboard`)}
            />
        )
    }

    if (!boardView.columns.length) {
        return (
            <EmptyStatePanel
                eyebrow="Board setup"
                title="This board has no columns yet"
                description="Columns define the workflow for the board. Add the first column to start organizing tasks across this workspace."
                primaryActionLabel="Add first column"
                onPrimaryAction={onAddColumn}
                secondaryActionLabel="Back to dashboard"
                onSecondaryAction={() => navigate(`/w/${workspaceId}/dashboard`)}
            />
        )
    }

    return (
        <ScrollArea className="w-full pb-3">
            <KanbanProvider
                columns={kanbanColumns}
                data={kanbanData}
                onDataChange={onKanbanDataChange}
                onDragEnd={onKanbanDragEnd}
                collisionDetection={pointerWithin}
                className="auto-cols-[360px] pb-1"
            >
                {(column) => (
                    <KanbanBoard
                        id={column.id}
                        key={column.id}
                        className="w-[360px] min-w-[360px] rounded-[24px] border border-slate-200/60 bg-slate-50 shadow-sm"
                    >
                        <KanbanHeader className="p-5 flex items-start justify-between gap-3 border-b border-slate-200/50">
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-xs font-bold uppercase tracking-widest text-slate-500">
                                    {column.name}
                                </h3>
                                <p className="mt-1 text-sm font-medium text-slate-700">
                                    {(tasksByColumn[column.rawId] ?? []).length} tasks
                                </p>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        className="rounded-xl text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg">
                                    <DropdownMenuItem
                                        onSelect={() => {
                                            window.setTimeout(() => onCreateTask(column.rawId), 0)
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <Plus className="mr-2 h-4 w-4 text-emerald-500" />
                                        Create task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => {
                                            window.setTimeout(() => onEditColumn(column.rawId), 0)
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <PencilLine className="mr-2 h-4 w-4 text-amber-500" />
                                        Edit column
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => {
                                            window.setTimeout(() => onDeleteColumn(column.rawId), 0)
                                        }}
                                        className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete column
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </KanbanHeader>

                        <KanbanCards id={column.id} className="gap-3 p-3">
                            {(item) => (
                                <KanbanCard
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] active:shadow-none"
                                >
                                    <div
                                        onClick={() => onTaskSelect(String(item.id).replace('tsk_', ''))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                onTaskSelect(String(item.id).replace('tsk_', ''))
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        className="w-full text-left focus:outline-none"
                                    >
                                        <KiboTaskCardContent task={item.task} />
                                    </div>
                                </KanbanCard>
                            )}
                        </KanbanCards>
                    </KanbanBoard>
                )}
            </KanbanProvider>
            <ScrollBar orientation="horizontal" className="h-2.5" />
        </ScrollArea>
    )
}
