import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import BoardHeader from '@/components/tasks/BoardHeader'
import KanbanColumn from '@/components/tasks/KanbanColumn'
import TaskDetailModal from '@/components/tasks/TaskDetailModal'
import { Card } from '@/components/ui/card'
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

function reindexColumns(columns) {
  return columns.map((column, index) => ({
    ...column,
    position: index + 1,
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
            position: nextPosition,
          },
        ],
      }
    })
  }

  const handleDragEnd = (result) => {
    const { source, destination, draggableId, type } = result

    if (!destination || !boardData) return

    const sameLocation =
      source.droppableId === destination.droppableId && source.index === destination.index

    if (sameLocation) return

    setBoardData((currentData) => {
      if (type === 'COLUMN') {
        const orderedColumns = sortByPosition(currentData.columns)
        const [movedColumn] = orderedColumns.splice(source.index, 1)

        if (!movedColumn) return currentData

        orderedColumns.splice(destination.index, 0, movedColumn)

        return {
          ...currentData,
          columns: reindexColumns(orderedColumns),
        }
      }

      const sourceTasks = sortByPosition(
        currentData.tasks.filter((task) => task.columnId === source.droppableId),
      )
      const destinationTasks =
        source.droppableId === destination.droppableId
          ? sourceTasks
          : sortByPosition(currentData.tasks.filter((task) => task.columnId === destination.droppableId))

      const movingTaskIndex = sourceTasks.findIndex((task) => task.id === draggableId)
      const [movingTask] = sourceTasks.splice(movingTaskIndex, 1)

      if (!movingTask) return currentData

      const updatedTask = {
        ...movingTask,
        columnId: destination.droppableId,
      }

      destinationTasks.splice(destination.index, 0, updatedTask)

      const normalizedSourceTasks = reindexTasks(sourceTasks, source.droppableId)
      const normalizedDestinationTasks =
        source.droppableId === destination.droppableId
          ? reindexTasks(destinationTasks, destination.droppableId)
          : reindexTasks(destinationTasks, destination.droppableId)

      const unaffectedTasks = currentData.tasks.filter(
        (task) =>
          task.columnId !== source.droppableId && task.columnId !== destination.droppableId,
      )

      const mergedTasks =
        source.droppableId === destination.droppableId
          ? [...unaffectedTasks, ...normalizedDestinationTasks]
          : [...unaffectedTasks, ...normalizedSourceTasks, ...normalizedDestinationTasks]

      const movePayload = {
        taskId: draggableId,
        fromColumnId: source.droppableId,
        toColumnId: destination.droppableId,
        newPosition: (destination.index + 1) * 1000,
      }

      void movePayload
      // Reserve this payload for PATCH /api/tasks/move.

      return {
        ...currentData,
        tasks: mergedTasks,
      }
    })
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
          onlineMembers={boardData.onlineMembers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activePriority={activePriority}
          onPriorityChange={setActivePriority}
          onAddColumn={handleAddColumn}
        />

        <DragDropContext onDragEnd={handleDragEnd}>
          <section className="overflow-x-auto pb-3">
            <Droppable droppableId="board-columns" direction="horizontal" type="COLUMN">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex min-w-max gap-5"
                >
                  {sortByPosition(boardData.columns).map((column, index) => (
                    <KanbanColumn
                      key={column.id}
                      column={column}
                      columnIndex={index}
                      tasks={tasksByColumn[column.id] ?? []}
                      onTaskClick={setSelectedTaskId}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>
        </DragDropContext>
      </div>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTaskId(null)} />
    </>
  )
}
