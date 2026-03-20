import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
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
import { MOCK_TASKS_DATA } from '@/data/mockTasksBoard'

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
  const { searchQuery, setSearchQuery } = useOutletContext()
  const [boardData, setBoardData] = useState(null)
  const [activePriority, setActivePriority] = useState('ALL')
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBoardData(MOCK_TASKS_DATA)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const filteredTasks = useMemo(() => {
    if (!boardData) return []

    const normalizedQuery = searchQuery.trim().toLowerCase()

    return boardData.tasks.filter((task) => {
      const matchesPriority = activePriority === 'ALL' || task.priority === activePriority

      if (!matchesPriority) return false

      if (!normalizedQuery) return true

      const haystack =
        `${task.title} ${task.assignee.name} ${task.priority} ${task.dueDate}`.toLowerCase()

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
        name: column.title,
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
            title: `New Column ${nextPosition}`,
            position: nextPosition * 1000,
          },
        ],
      }
    })
  }

  const handleProjectSelect = (projectId) => {
    setBoardData((currentData) => {
      const nextProject = currentData.projects.find((project) => project.id === projectId)

      if (!nextProject || nextProject.id === currentData.board.id) {
        return currentData
      }

      return {
        ...currentData,
        board: {
          id: nextProject.id,
          title: nextProject.title,
          description: nextProject.description,
        },
      }
    })
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
          boardTitle={boardData.board.title}
          activeProjectId={boardData.board.id}
          projects={boardData.projects}
          onlineMembers={boardData.onlineMembers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activePriority={activePriority}
          onPriorityChange={setActivePriority}
          onAddColumn={handleAddColumn}
          onProjectSelect={handleProjectSelect}
          columnCount={boardData.columns.length}
          taskCount={boardData.tasks.length}
        />

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
      </div>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTaskId(null)} />
    </>
  )
}
