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

export {
    applyTaskMovedEvent,
    buildTaskMovePayload,
    reindexColumns,
    reindexTasks,
    resolveCreatedBoardId,
    sortByPosition,
    sortTasksForBoard,
}
