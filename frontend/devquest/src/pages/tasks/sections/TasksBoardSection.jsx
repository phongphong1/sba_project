import { GripVertical, MoreHorizontal, PencilLine, Plus } from 'lucide-react'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import {
    KanbanBoard,
    KanbanCard,
    KanbanCardDragHandle,
    KanbanCards,
    KanbanDragHandle,
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
                onColumnsChange={onColumnsChange}
                onDragEnd={onKanbanDragEnd}
                className="auto-cols-[360px] pb-1"
            >
                {(column) => (
                    <KanbanBoard
                        id={column.id}
                        key={column.id}
                        sortable
                        className="w-[360px] min-w-[360px] rounded-[24px] border-0 bg-slate-100/70 shadow-none ring-0"
                    >
                        <KanbanHeader className="px-4 py-4">
                            <div className="flex items-start justify-between gap-3">
                                <KanbanDragHandle className="min-w-0 flex-1">
                                    <h3 className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        {column.name}
                                    </h3>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {(tasksByColumn[column.id] ?? []).length} tasks
                                    </p>
                                </KanbanDragHandle>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            className="rounded-xl text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                window.setTimeout(() => {
                                                    onCreateTask(column.id)
                                                }, 0)
                                            }}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Create task
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                window.setTimeout(() => {
                                                    onEditColumn(column.id)
                                                }, 0)
                                            }}
                                        >
                                            <PencilLine className="h-4 w-4" />
                                            Edit column
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </KanbanHeader>

                        <KanbanCards id={column.id} className="gap-4 p-4">
                            {(item) => (
                                <KanbanCard
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    dragHandle
                                    className="rounded-[24px] border-0 bg-white p-5 shadow-sm ring-1 ring-slate-200/80 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
                                >
                                    <div className="mb-3 flex justify-end">
                                        <KanbanCardDragHandle className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                            <GripVertical className="h-4 w-4" />
                                        </KanbanCardDragHandle>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onTaskSelect(String(item.id))}
                                        className="w-full whitespace-normal text-left"
                                    >
                                        <KiboTaskCardContent task={item.task} />
                                    </button>
                                </KanbanCard>
                            )}
                        </KanbanCards>
                    </KanbanBoard>
                )}
            </KanbanProvider>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}
