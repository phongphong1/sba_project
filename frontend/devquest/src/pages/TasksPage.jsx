import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/kibo-ui/kanban'
import BoardHeader from '@/components/tasks/BoardHeader'
import KiboTaskCardContent from '@/components/tasks/KiboTaskCardContent'
import TaskDetailModal from '@/components/tasks/TaskDetailModal'
import { Card } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { octomLoadingCardClass } from '@/constants/uiStyles'
import { DEFAULT_WORKSPACE_ID } from '@/data/mockWorkspaceGraph'
import { useWorkspaceShell } from '@/contexts/WorkspaceShellContext'

function sortByPosition(items) {
  return [...items].sort((a, b) => a.position - b.position)
}

function reindexTasks(tasks, columnId) {
  return tasks.map((task, index) => ({
    ...task,
    columnId,
    position: (index + 1) * 1000,
  }))
}

function sortTasksForBoard(columns, tasks) {
  return [...columns]
    .sort((a, b) => a.position - b.position)
    .flatMap((column) =>
      tasks
        .filter((task) => task.columnId === column.id)
        .sort((a, b) => a.position - b.position),
    )
}

function reindexColumns(columns) {
  return columns.map((column, index) => ({
    ...column,
    position: (index + 1) * 1000,
  }))
}

export default function TasksPage() {
  const navigate = useNavigate()
  const { workspaceId, boardId } = useParams()
  const { currentWorkspace } = useOutletContext()
  const { getHydratedBoard, getWorkspaceOverview, getPreferredBoardId } = useWorkspaceShell()
  const [boardData, setBoardData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activePriority, setActivePriority] = useState('ALL')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const workspaceOverview = currentWorkspace ? getWorkspaceOverview(currentWorkspace.id) : null
  const resolvedBoard = useMemo(() => {
    if (!workspaceId || !boardId) return null

    return getHydratedBoard(workspaceId, boardId)
  }, [boardId, getHydratedBoard, workspaceId])

  useEffect(() => {
    setBoardData(resolvedBoard)
    setSearchQuery('')
    setSelectedTaskId(null)
  }, [resolvedBoard])

  if (!currentWorkspace || workspaceId !== currentWorkspace.id) {
    return <Navigate to={DEFAULT_WORKSPACE_ID ? `/w/${DEFAULT_WORKSPACE_ID}/dashboard` : '/workspace-empty'} replace />
  }

  if (!workspaceOverview) {
    return <Navigate to={DEFAULT_WORKSPACE_ID ? `/w/${DEFAULT_WORKSPACE_ID}/dashboard` : '/workspace-empty'} replace />
  }

  const preferredBoardId = getPreferredBoardId(currentWorkspace.id)

  if (!boardId && preferredBoardId) {
    return <Navigate to={`/w/${currentWorkspace.id}/boards/${preferredBoardId}`} replace />
  }

  if (boardId && !resolvedBoard && preferredBoardId) {
    return (
      <Navigate
        to={`/w/${currentWorkspace.id}/boards/${preferredBoardId}`}
        replace
      />
    )
  }

  if (!workspaceOverview.boardSummaries.length) {
    return (
      <main className="flex min-h-[420px] items-center">
        <EmptyStatePanel
          eyebrow="Workspace boards"
          title="No board exists in this workspace yet"
          description="Boards are the layer between workspace members and task columns. As soon as the backend returns a board list, users will be able to switch boards from this screen."
          primaryActionLabel="Back to dashboard"
          onPrimaryAction={() => navigate(`/w/${currentWorkspace.id}/dashboard`)}
        />
      </main>
    )
  }

  const filteredTasks = useMemo(() => {
    if (!boardData) return []

    const normalizedQuery = searchQuery.trim().toLowerCase()

    return boardData.tasks.filter((task) => {
      const matchesPriority = activePriority === 'ALL' || task.priority === activePriority

      if (!matchesPriority) return false

      if (!normalizedQuery) return true

      const haystack =
        `${task.title} ${task.assignee?.name ?? ''} ${task.priority} ${task.dueDate}`.toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [activePriority, boardData, searchQuery])

  const tasksByColumn = useMemo(() => {
    if (!boardData) return {}

    return boardData.columns.reduce((accumulator, column) => {
      accumulator[column.id] = sortByPosition(
        filteredTasks.filter((task) => task.columnId === column.id),
      )
      return accumulator
    }, {})
  }, [boardData, filteredTasks])

  const selectedTask = useMemo(() => {
    if (!boardData || !selectedTaskId) return null
    return boardData.tasks.find((task) => task.id === selectedTaskId) ?? null
  }, [boardData, selectedTaskId])

  const orderedColumns = useMemo(() => {
    if (!boardData) return []
    return [...boardData.columns].sort((a, b) => a.position - b.position)
  }, [boardData])

  const kanbanColumns = useMemo(
    () =>
      orderedColumns.map((column) => ({
        id: column.id,
        name: column.name,
      })),
    [orderedColumns],
  )

  const kanbanData = useMemo(
    () =>
      sortTasksForBoard(orderedColumns, filteredTasks).map((task) => ({
        id: task.id,
        name: task.title,
        column: task.columnId,
        task,
      })),
    [filteredTasks, orderedColumns],
  )

  const handleAddColumn = () => {
    setBoardData((currentData) => {
      const nextPosition = currentData.columns.length + 1

      return {
        ...currentData,
        columns: [
          ...currentData.columns,
          {
            id: `col-${Date.now()}`,
            name: `New Column ${nextPosition}`,
            position: nextPosition * 1000,
          },
        ],
      }
    })
  }

  const handleBoardSelect = (nextBoardId) => {
    if (nextBoardId === boardData?.id) return

    navigate(`/w/${currentWorkspace.id}/boards/${nextBoardId}`)
  }

  const handleColumnsChange = (newColumns) => {
    setBoardData((currentData) => {
      const columnMap = new Map(currentData.columns.map((column) => [column.id, column]))

      return {
        ...currentData,
        columns: reindexColumns(
          newColumns
            .map((column) => columnMap.get(column.id))
            .filter(Boolean),
        ),
      }
    })
  }

  const handleKanbanDataChange = (newKanbanData) => {
    setBoardData((currentData) => {
      const visibleTaskIds = new Set(filteredTasks.map((task) => task.id))
      const taskMap = new Map(currentData.tasks.map((task) => [task.id, task]))
      const hiddenTasks = currentData.tasks.filter((task) => !visibleTaskIds.has(task.id))

      const updatedVisibleTasks = newKanbanData
        .map((item) => {
          const task = taskMap.get(item.id)
          if (!task) return null
          return {
            ...task,
            columnId: item.column,
          }
        })
        .filter(Boolean)

      const mergedTasks = orderedColumns.flatMap((column) => {
        const visibleInColumn = updatedVisibleTasks.filter((task) => task.columnId === column.id)
        const hiddenInColumn = hiddenTasks
          .filter((task) => task.columnId === column.id)
          .sort((a, b) => a.position - b.position)

        return reindexTasks([...visibleInColumn, ...hiddenInColumn], column.id)
      })

      return {
        ...currentData,
        tasks: mergedTasks,
      }
    })
  }

  const handleKanbanDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over || active.id === over.id) return
    if (active.data.current?.type === 'column') return

    const activeTask = boardData?.tasks.find((task) => task.id === active.id)
    const overTask = boardData?.tasks.find((task) => task.id === over.id)
    const overColumnId = overTask?.columnId ?? String(over.id)

    const movePayload = {
      taskId: String(active.id),
      fromColumnId: activeTask?.columnId ?? null,
      toColumnId: overColumnId,
      overTaskId: String(over.id),
    }

    void movePayload
    // Reserve this payload for PATCH /api/tasks/move.
  }

  if (!boardData) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <Card className={octomLoadingCardClass}>
          Loading tasks board...
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <BoardHeader
          workspaceName={currentWorkspace.name}
          boardTitle={boardData.name}
          boardDescription={boardData.description}
          activeBoardId={boardData.id}
          boards={workspaceOverview.boardSummaries}
          workspaceMembers={workspaceOverview.members}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activePriority={activePriority}
          onPriorityChange={setActivePriority}
          onAddColumn={handleAddColumn}
          onBoardSelect={handleBoardSelect}
          columnCount={boardData.columns.length}
          taskCount={boardData.tasks.length}
        />

        {!boardData.columns.length ? (
          <EmptyStatePanel
            eyebrow="Board setup"
            title="This board has no columns yet"
            description="Columns define the workflow for the board. Add the first column to start organizing tasks across this workspace."
            primaryActionLabel="Add first column"
            onPrimaryAction={handleAddColumn}
            secondaryActionLabel="Back to dashboard"
            onSecondaryAction={() => navigate(`/w/${currentWorkspace.id}/dashboard`)}
          />
        ) : (
          <>
            {!boardData.tasks.length ? (
              <EmptyStatePanel
                eyebrow="Board tasks"
                title="This board is ready, but there are no tasks yet"
                description="Your columns are in place. As soon as tasks arrive from the backend or task creation is connected, they will appear inside these columns."
              />
            ) : null}

            <ScrollArea className="w-full pb-3">
              <KanbanProvider
                columns={kanbanColumns}
                data={kanbanData}
                onDataChange={handleKanbanDataChange}
                onColumnsChange={handleColumnsChange}
                onDragEnd={handleKanbanDragEnd}
                className="auto-cols-[360px] pb-1"
              >
                {(column) => (
                  <KanbanBoard
                    id={column.id}
                    key={column.id}
                    sortable
                    className="w-[360px] min-w-[360px] rounded-[24px] border-0 bg-slate-100/70 shadow-none ring-0"
                  >
                    <KanbanHeader dragHandle className="px-4 py-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {column.name}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {(tasksByColumn[column.id] ?? []).length} tasks
                        </p>
                      </div>
                    </KanbanHeader>

                    <KanbanCards id={column.id} className="gap-4 p-4">
                      {(item) => (
                        <KanbanCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          className="rounded-[24px] border-0 bg-white p-5 shadow-sm ring-1 ring-slate-200/80 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedTaskId(item.id)}
                            className="w-full cursor-grab whitespace-normal text-left active:cursor-grabbing"
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
          </>
        )}
      </div>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTaskId(null)} />
    </>
  )
}
