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

function resolveCreatedBoardId(payload) {
    return payload?.id ?? payload?.boardId ?? payload?.data?.id ?? payload?.data?.boardId ?? null
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

function arrayMove(array, from, to) {
    const newArray = array.slice()
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0])
    return newArray
}

function buildTaskMovePayload(kanbanData, workspaceId, activeIdRaw, overIdRaw, isOverColumnExplicit = false) {
    if (!kanbanData || !kanbanData.length) return null

    const activeItemIndex = kanbanData.findIndex((item) => String(item.id).replace('tsk_', '') === String(activeIdRaw))
    if (activeItemIndex === -1) return null

    const activeItem = kanbanData[activeItemIndex]
    const activeTask = activeItem.task

    let toColumnIdRaw
    let overItemIndex = -1

    if (isOverColumnExplicit) {
        toColumnIdRaw = String(overIdRaw)
    } else {
        overItemIndex = kanbanData.findIndex((item) => String(item.id).replace('tsk_', '') === String(overIdRaw))
        if (overItemIndex !== -1) {
            toColumnIdRaw = String(kanbanData[overItemIndex]?.column).replace('col_', '')
        } else {
            toColumnIdRaw = String(overIdRaw)
        }
    }

    const targetColumn = `col_${toColumnIdRaw}`

    // 1. Simulate the exact global arrayMove that dnd-kit performs
    let newKanbanData = [...kanbanData]

    if (String(activeItem.column) !== targetColumn) {
        newKanbanData[activeItemIndex] = { ...newKanbanData[activeItemIndex], column: targetColumn }
    }

    const targetIndex = overItemIndex !== -1 ? overItemIndex : newKanbanData.length - 1
    newKanbanData = arrayMove(newKanbanData, activeItemIndex, targetIndex)

    // 2. Extract the newly sorted destination column
    const destinationItems = newKanbanData.filter((item) => String(item.column) === targetColumn)

    // 3. Find our active item inside the destination layout
    const finalIndex = destinationItems.findIndex((item) => String(item.id) === String(activeItem.id))

    // 4. Calculate fractional position based entirely on database task positions of visually adjoining neighbors
    let newPosition = 1000.0

    if (destinationItems.length <= 1) {
        newPosition = 1000.0
    } else if (finalIndex === 0) {
        const nextPos = Number(destinationItems[1]?.task?.position) || 1000.0
        newPosition = nextPos / 2.0
    } else if (finalIndex === destinationItems.length - 1) {
        const prevPos = Number(destinationItems[destinationItems.length - 2]?.task?.position) || 1000.0
        newPosition = prevPos + 1000.0
    } else {
        const prevPos = Number(destinationItems[finalIndex - 1]?.task?.position) || 1000.0
        const nextPos = Number(destinationItems[finalIndex + 1]?.task?.position) || 2000.0
        newPosition = (prevPos + nextPos) / 2.0
    }

    if (isNaN(newPosition) || newPosition <= 0) {
        newPosition = 1000.0
    }

    return {
        workspaceId: coerceCommandId(workspaceId),
        taskId: coerceCommandId(activeIdRaw),
        fromColumnId: coerceCommandId(activeTask.columnId),
        toColumnId: coerceCommandId(toColumnIdRaw),
        position: newPosition,
    }
}

export {
    applyTaskMovedEvent,
    buildTaskMovePayload,
    reindexColumns,
    reindexTasks,
    resolveCreatedBoardId,
    sortByPosition,
    sortTasksForBoard,
}
