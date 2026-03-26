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
import { useWorkspaceShell } from '@/contexts/WorkspaceShellContext'
import { useBoardData } from '@/hooks/useBoardData'
import {
  sendTaskMoveCommand,
  subscribeToWorkspaceTasks,
} from '@/lib/realtime/stompClient'

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

function coerceCommandId(value) {
  const normalizedValue = String(value ?? '').trim()

  if (/^\d+$/.test(normalizedValue)) {
    return Number(normalizedValue)
  }

  return value
}

function applyTaskMovedEvent(currentData, event, workspaceId) {
  if (!currentData || event?.type !== 'TASK_MOVED' || !event.payload || typeof event.payload !== 'object') {
    return currentData
  }

  const payloadWorkspaceId = String(event.payload.workspaceId ?? '')

  if (payloadWorkspaceId && payloadWorkspaceId !== String(workspaceId)) {
    return currentData
  }

  const targetTaskId = String(event.payload.taskId ?? '')

  if (!targetTaskId) {
    return currentData
  }

  const hasTaskOnBoard = currentData.tasks.some((task) => String(task.id) === targetTaskId)

  if (!hasTaskOnBoard) {
    return currentData
  }

  const updatedTasks = currentData.tasks.map((task) =>
    String(task.id) === targetTaskId
      ? {
          ...task,
          columnId: String(event.payload.toColumnId ?? task.columnId),
          position: Number(event.payload.position ?? task.position),
        }
      : task,
  )

  return {
    ...currentData,
    tasks: sortTasksForBoard(currentData.columns, updatedTasks),
  }
}

function buildTaskMovePayload(currentData, workspaceId, activeId, overId) {
  if (!currentData) {
    return null
  }

  const activeTask = currentData.tasks.find((task) => String(task.id) === String(activeId))

  if (!activeTask) {
    return null
  }

  const overTask = currentData.tasks.find((task) => String(task.id) === String(overId))
  const toColumnId = String(overTask?.columnId ?? overId)
  const tasksInDestinationColumn = sortByPosition(
    currentData.tasks.filter(
      (task) => task.columnId === toColumnId && String(task.id) !== String(activeTask.id),
    ),
  )

  const overIndex = overTask
    ? tasksInDestinationColumn.findIndex((task) => String(task.id) === String(overTask.id))
    : -1
  const insertionIndex = overIndex >= 0 ? overIndex : tasksInDestinationColumn.length
  const reorderedColumnTasks = [...tasksInDestinationColumn]

  reorderedColumnTasks.splice(insertionIndex, 0, {
    ...activeTask,
    columnId: toColumnId,
  })

  const reindexedColumnTasks = reindexTasks(reorderedColumnTasks, toColumnId)
  const movedTask = reindexedColumnTasks.find((task) => String(task.id) === String(activeTask.id))

  return {
    workspaceId: coerceCommandId(workspaceId),
    taskId: coerceCommandId(activeTask.id),
    fromColumnId: coerceCommandId(activeTask.columnId),
    toColumnId: coerceCommandId(toColumnId),
    position: movedTask?.position ?? activeTask.position,
  }
}

export default function TasksPage() {
  const navigate = useNavigate()
  const { workspaceId, boardId } = useParams()
  const { currentWorkspace } = useOutletContext()
  const { getPreferredBoardId, setPreferredBoard } = useWorkspaceShell()
  const { boardPayload, isLoadingBoard, boardError, refreshBoard } = useBoardData(workspaceId, boardId)
  const [boardDraft, setBoardDraft] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activePriority, setActivePriority] = useState('ALL')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const workspaceBoards = useMemo(() => boardPayload?.boards ?? [], [boardPayload?.boards])
  const workspaceMembers = useMemo(
    () => boardPayload?.workspaceMembers ?? [],
    [boardPayload?.workspaceMembers],
  )
  const resolvedBoard = useMemo(() => boardPayload?.board ?? null, [boardPayload?.board])
  const boardData = useMemo(() => {
    if (boardDraft && resolvedBoard && boardDraft.id === resolvedBoard.id) {
      return boardDraft
    }

    return resolvedBoard
  }, [boardDraft, resolvedBoard])

  useEffect(() => {
    if (!workspaceId) {
      return undefined
    }

    const unsubscribe = subscribeToWorkspaceTasks(workspaceId, (event) => {
      setBoardDraft((currentData) => applyTaskMovedEvent(currentData ?? resolvedBoard, event, workspaceId))
    })

    return () => {
      unsubscribe()
    }
  }, [resolvedBoard, workspaceId])

  const preferredBoardId = workspaceId ? getPreferredBoardId(workspaceId) : null

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
    setBoardDraft((currentData) => {
      const currentBoardData = currentData ?? boardData
      const nextPosition = currentBoardData.columns.length + 1

      return {
        ...currentBoardData,
        columns: [
          ...currentBoardData.columns,
          {
            id: String(Date.now()),
            name: `New Column ${nextPosition}`,
            position: nextPosition * 1000,
          },
        ],
      }
    })
  }

  const handleBoardSelect = (nextBoardId) => {
    if (nextBoardId === boardData?.id) return

    setPreferredBoard(workspaceId, nextBoardId)
    navigate(`/w/${workspaceId}/boards/${nextBoardId}`)
  }

  const handleColumnsChange = (newColumns) => {
    setBoardDraft((currentData) => {
      const currentBoardData = currentData ?? boardData
      const columnMap = new Map(currentBoardData.columns.map((column) => [column.id, column]))

      return {
        ...currentBoardData,
        columns: reindexColumns(
          newColumns
            .map((column) => columnMap.get(column.id))
            .filter(Boolean),
        ),
      }
    })
  }

  const handleKanbanDataChange = (newKanbanData) => {
    setBoardDraft((currentData) => {
      const currentBoardData = currentData ?? boardData
      const visibleTaskIds = new Set(filteredTasks.map((task) => task.id))
      const taskMap = new Map(currentBoardData.tasks.map((task) => [task.id, task]))
      const hiddenTasks = currentBoardData.tasks.filter((task) => !visibleTaskIds.has(task.id))

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
        ...currentBoardData,
        tasks: mergedTasks,
      }
    })
  }

  const handleKanbanDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over || active.id === over.id) return
    if (active.data.current?.type === 'column') return

    const movePayload = buildTaskMovePayload(boardData, workspaceId, active.id, over.id)

    if (!movePayload) {
      return
    }

    void sendTaskMoveCommand(movePayload).catch((error) => {
      console.error('Failed to publish task move command:', error)
    })
  }

  if (!workspaceId) {
    return <Navigate to="/workspace-empty" replace />
  }

  if (isLoadingBoard && !boardPayload) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <Card className={octomLoadingCardClass}>
          Loading tasks board...
        </Card>
      </div>
    )
  }

  if (boardError && !boardPayload) {
    return (
      <main className="flex min-h-[420px] items-center">
        <EmptyStatePanel
          eyebrow="Workspace boards"
          title="Unable to load board data"
          description={boardError}
          primaryActionLabel="Try again"
          onPrimaryAction={() => {
            void refreshBoard()
          }}
          secondaryActionLabel="Back to dashboard"
          onSecondaryAction={() => navigate(`/w/${workspaceId}/dashboard`)}
        />
      </main>
    )
  }

  if (!boardId && preferredBoardId) {
    return <Navigate to={`/w/${workspaceId}/boards/${preferredBoardId}`} replace />
  }

  if (!boardId && workspaceBoards[0]?.id) {
    return <Navigate to={`/w/${workspaceId}/boards/${workspaceBoards[0].id}`} replace />
  }

  if (boardId && !resolvedBoard && workspaceBoards[0]?.id) {
    return (
      <Navigate
        to={`/w/${workspaceId}/boards/${workspaceBoards[0].id}`}
        replace
      />
    )
  }

  if (!workspaceBoards.length) {
    return (
      <main className="flex min-h-[420px] items-center">
        <EmptyStatePanel
          eyebrow="Workspace boards"
          title="No board exists in this workspace yet"
          description="Boards are the layer between workspace members and task columns. As soon as the backend returns a board list, users will be able to switch boards from this screen."
          primaryActionLabel="Back to dashboard"
          onPrimaryAction={() => navigate(`/w/${workspaceId}/dashboard`)}
        />
      </main>
    )
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
          workspaceName={currentWorkspace?.name ?? 'Workspace'}
          boardTitle={boardData.name}
          boardDescription={boardData.description}
          activeBoardId={boardData.id}
          boards={workspaceBoards}
          workspaceMembers={workspaceMembers}
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
            onSecondaryAction={() => navigate(`/w/${workspaceId}/dashboard`)}
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
