import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import BoardHeader from '@/components/tasks/BoardHeader'
import TaskDetailModal from '@/components/tasks/TaskDetailModal'
import { Card } from '@/components/ui/card'
import { octomLoadingCardClass } from '@/constants/uiStyles'
import { useWorkspaceShell } from '@/contexts/WorkspaceShellContext'
import { useBoardData } from '@/hooks/useBoardData'
import workspaceApi from '@/api/workspaceApi'
import {
    sendTaskMoveCommand,
    subscribeToWorkspaceTasks,
} from '@/lib/realtime/stompClient'
import TasksBoardSection from './sections/TasksBoardSection'
import TasksDialogsSection from './sections/TasksDialogsSection'
import {
    applyTaskMovedEvent,
    buildTaskMovePayload,
    reindexColumns,
    reindexTasks,
    resolveCreatedBoardId,
    sortByPosition,
    sortTasksForBoard,
} from './tasks.helpers'

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
    const [isCreatingBoard, setIsCreatingBoard] = useState(false)
    const [isCreatingColumn, setIsCreatingColumn] = useState(false)
    const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] = useState(false)
    const [createBoardName, setCreateBoardName] = useState('')
    const [createBoardError, setCreateBoardError] = useState('')
    const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false)
    const [addColumnName, setAddColumnName] = useState('')
    const [addColumnError, setAddColumnError] = useState('')
    const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false)
    const isCreateTaskDrawerOpeningRef = useRef(false)
    const [createTaskForm, setCreateTaskForm] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        estimateHours: '',
        color: '#5051F9',
        startDate: '',
        dueDate: '',
        assigneeId: 'UNASSIGNED',
    })
    const [createTaskError, setCreateTaskError] = useState('')
    const [targetCreateTaskColumnId, setTargetCreateTaskColumnId] = useState('')
    const [isCreatingTask, setIsCreatingTask] = useState(false)
    const [isEditColumnDialogOpen, setIsEditColumnDialogOpen] = useState(false)
    const [editColumnName, setEditColumnName] = useState('')
    const [editColumnError, setEditColumnError] = useState('')
    const [targetEditColumnId, setTargetEditColumnId] = useState('')
    const [isUpdatingColumn, setIsUpdatingColumn] = useState(false)
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
    const hasBoards = workspaceBoards.length > 0
    const hasResolvedBoard = Boolean(boardData)
    const boardView = boardData ?? {
        id: '',
        name: 'No board selected',
        description: 'This workspace has no board yet. Create one to organize columns and tasks.',
        columns: [],
        tasks: [],
    }

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
        return boardData.tasks.find((task) => String(task.id) === String(selectedTaskId)) ?? null
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

    const handleOpenAddColumnDialog = () => {
        if (!boardData || isCreatingColumn) {
            return
        }

        setAddColumnName('')
        setAddColumnError('')
        setIsAddColumnDialogOpen(true)
    }

    const handleConfirmAddColumn = async () => {
        const normalizedName = addColumnName.trim()

        if (!normalizedName) {
            setAddColumnError('Column name is required.')
            return
        }

        if (!workspaceId || !boardData?.id) {
            setAddColumnError('Board context is missing. Please reload this page.')
            return
        }

        setIsCreatingColumn(true)

        try {
            await workspaceApi.createColumn(workspaceId, boardData.id, {
                name: normalizedName,
            })

            await refreshBoard()
            setIsAddColumnDialogOpen(false)
            setAddColumnName('')
            setAddColumnError('')
            toast.success('Column created successfully.')
        } catch (error) {
            setAddColumnError(
                error?.response?.data?.message ?? error?.message ?? 'Unable to create column.',
            )
        } finally {
            setIsCreatingColumn(false)
        }
    }

    const resetCreateTaskForm = () => {
        setCreateTaskForm({
            title: '',
            description: '',
            priority: 'MEDIUM',
            estimateHours: '',
            color: '#5051F9',
            startDate: '',
            dueDate: '',
            assigneeId: 'UNASSIGNED',
        })
    }

    const handleOpenCreateTaskDialog = (columnId) => {
        if (!boardData || isCreatingTask) {
            return
        }

        isCreateTaskDrawerOpeningRef.current = true
        setTargetCreateTaskColumnId(String(columnId))
        resetCreateTaskForm()
        setCreateTaskError('')
        setIsCreateTaskDialogOpen(true)

        window.setTimeout(() => {
            isCreateTaskDrawerOpeningRef.current = false
        }, 200)
    }

    const handleConfirmCreateTask = async () => {
        const normalizedTitle = createTaskForm.title.trim()
        const normalizedBoardId = /^\d+$/.test(String(boardData?.id ?? ''))
            ? Number(boardData.id)
            : boardData?.id
        const normalizedColumnId = /^\d+$/.test(String(targetCreateTaskColumnId ?? ''))
            ? Number(targetCreateTaskColumnId)
            : targetCreateTaskColumnId
        const normalizedAssigneeId = /^\d+$/.test(String(createTaskForm.assigneeId ?? ''))
            ? Number(createTaskForm.assigneeId)
            : createTaskForm.assigneeId

        if (!normalizedTitle) {
            setCreateTaskError('Task title is required.')
            return
        }

        if (createTaskForm.estimateHours && Number(createTaskForm.estimateHours) < 0) {
            setCreateTaskError('Estimate hours must be greater than or equal to 0.')
            return
        }

        if (
            createTaskForm.startDate &&
            createTaskForm.dueDate &&
            createTaskForm.startDate > createTaskForm.dueDate
        ) {
            setCreateTaskError('Due date must be later than or equal to start date.')
            return
        }

        if (!normalizedBoardId || !normalizedColumnId) {
            setCreateTaskError('Column context is missing. Please reload this page.')
            return
        }

        setIsCreatingTask(true)

        try {
            const payload = {
                boardId: normalizedBoardId,
                columnId: normalizedColumnId,
                title: normalizedTitle,
                description: createTaskForm.description.trim() || undefined,
                priority: createTaskForm.priority,
                estimateHours: createTaskForm.estimateHours
                    ? Number(createTaskForm.estimateHours)
                    : undefined,
                color: createTaskForm.color || undefined,
                startDate: createTaskForm.startDate || undefined,
                dueDate: createTaskForm.dueDate || undefined,
                assigneeId: createTaskForm.assigneeId !== 'UNASSIGNED'
                    ? normalizedAssigneeId
                    : undefined,
            }

            await workspaceApi.createTask(payload)

            await refreshBoard()
            setIsCreateTaskDialogOpen(false)
            resetCreateTaskForm()
            setCreateTaskError('')
            setTargetCreateTaskColumnId('')
            toast.success('Task created successfully.')
        } catch (error) {
            setCreateTaskError(error?.response?.data?.message ?? error?.message ?? 'Unable to create task.')
        } finally {
            setIsCreatingTask(false)
        }
    }

    const handleOpenEditColumnDialog = (columnId) => {
        if (!boardData || isUpdatingColumn) {
            return
        }

        const targetColumn = boardData.columns.find((column) => String(column.id) === String(columnId))

        if (!targetColumn) {
            toast.error('Column not found.')
            return
        }

        setTargetEditColumnId(String(targetColumn.id))
        setEditColumnName(targetColumn.name)
        setEditColumnError('')
        setIsEditColumnDialogOpen(true)
    }

    const handleConfirmEditColumn = async () => {
        const normalizedName = editColumnName.trim()

        if (!normalizedName) {
            setEditColumnError('Column name is required.')
            return
        }

        if (!targetEditColumnId) {
            setEditColumnError('Column context is missing. Please reload this page.')
            return
        }

        setIsUpdatingColumn(true)

        try {
            await workspaceApi.updateColumn(targetEditColumnId, {
                name: normalizedName,
            })

            await refreshBoard()
            setIsEditColumnDialogOpen(false)
            setEditColumnName('')
            setEditColumnError('')
            setTargetEditColumnId('')
            toast.success('Column updated successfully.')
        } catch (error) {
            setEditColumnError(error?.response?.data?.message ?? error?.message ?? 'Unable to update column.')
        } finally {
            setIsUpdatingColumn(false)
        }
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

    const handleCreateBoard = async (boardName) => {
        if (!workspaceId || isCreatingBoard) {
            return
        }

        setIsCreatingBoard(true)

        try {
            const createdBoard = await workspaceApi.createBoard(workspaceId, {
                name: boardName,
            })

            await refreshBoard()

            const createdBoardId = resolveCreatedBoardId(createdBoard)

            if (createdBoardId) {
                setPreferredBoard(workspaceId, String(createdBoardId))
                navigate(`/w/${workspaceId}/boards/${createdBoardId}`)
            }

            toast.success('Board created successfully.')
        } catch (error) {
            toast.error(error?.response?.data?.message ?? error?.message ?? 'Unable to create board.')
        } finally {
            setIsCreatingBoard(false)
        }
    }

    const handleOpenCreateBoardDialog = () => {
        if (isCreatingBoard) {
            return
        }

        setCreateBoardName('')
        setCreateBoardError('')
        setIsCreateBoardDialogOpen(true)
    }

    const handleConfirmCreateBoard = async () => {
        const normalizedName = createBoardName.trim()

        if (!normalizedName) {
            setCreateBoardError('Board name is required.')
            return
        }

        await handleCreateBoard(normalizedName)
        setIsCreateBoardDialogOpen(false)
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

    if (!boardData && hasBoards) {
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
                    boardTitle={boardView.name}
                    boardDescription={boardView.description}
                    activeBoardId={boardView.id}
                    boards={workspaceBoards}
                    workspaceMembers={workspaceMembers}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activePriority={activePriority}
                    onPriorityChange={setActivePriority}
                    onAddColumn={handleOpenAddColumnDialog}
                    onBoardSelect={handleBoardSelect}
                    columnCount={boardView.columns.length}
                    taskCount={boardView.tasks.length}
                    canAddColumn={hasResolvedBoard}
                />

                <TasksBoardSection
                    workspaceId={workspaceId}
                    navigate={navigate}
                    hasBoards={hasBoards}
                    boardView={boardView}
                    kanbanColumns={kanbanColumns}
                    kanbanData={kanbanData}
                    tasksByColumn={tasksByColumn}
                    onCreateBoard={handleOpenCreateBoardDialog}
                    onAddColumn={handleOpenAddColumnDialog}
                    onKanbanDataChange={handleKanbanDataChange}
                    onColumnsChange={handleColumnsChange}
                    onKanbanDragEnd={handleKanbanDragEnd}
                    onCreateTask={handleOpenCreateTaskDialog}
                    onEditColumn={handleOpenEditColumnDialog}
                    onTaskSelect={setSelectedTaskId}
                />
            </div>

            <TasksDialogsSection
                createBoard={{
                    open: isCreateBoardDialogOpen,
                    setOpen: setIsCreateBoardDialogOpen,
                    value: createBoardName,
                    onChange: (value) => {
                        setCreateBoardName(value)
                        if (createBoardError) {
                            setCreateBoardError('')
                        }
                    },
                    error: createBoardError,
                    loading: isCreatingBoard,
                    onSubmit: () => {
                        void handleConfirmCreateBoard()
                    },
                }}
                addColumn={{
                    open: isAddColumnDialogOpen,
                    setOpen: setIsAddColumnDialogOpen,
                    value: addColumnName,
                    onChange: (value) => {
                        setAddColumnName(value)
                        if (addColumnError) {
                            setAddColumnError('')
                        }
                    },
                    error: addColumnError,
                    loading: isCreatingColumn,
                    onSubmit: () => {
                        void handleConfirmAddColumn()
                    },
                }}
                createTask={{
                    open: isCreateTaskDialogOpen,
                    setOpen: (open) => {
                        if (!open && isCreateTaskDrawerOpeningRef.current) {
                            return
                        }

                        setIsCreateTaskDialogOpen(open)
                        if (!open) {
                            setCreateTaskError('')
                            setTargetCreateTaskColumnId('')
                            resetCreateTaskForm()
                        }
                    },
                    form: createTaskForm,
                    onFieldChange: (field, value) => {
                        setCreateTaskForm((current) => ({
                            ...current,
                            [field]: value,
                        }))
                        if (createTaskError) {
                            setCreateTaskError('')
                        }
                    },
                    members: workspaceMembers,
                    error: createTaskError,
                    loading: isCreatingTask,
                    onSubmit: () => {
                        void handleConfirmCreateTask()
                    },
                }}
                editColumn={{
                    open: isEditColumnDialogOpen,
                    setOpen: (open) => {
                        setIsEditColumnDialogOpen(open)
                        if (!open) {
                            setEditColumnError('')
                            setTargetEditColumnId('')
                        }
                    },
                    value: editColumnName,
                    onChange: (value) => {
                        setEditColumnName(value)
                        if (editColumnError) {
                            setEditColumnError('')
                        }
                    },
                    error: editColumnError,
                    loading: isUpdatingColumn,
                    onSubmit: () => {
                        void handleConfirmEditColumn()
                    },
                }}
            />

            <TaskDetailModal task={selectedTask} onClose={() => setSelectedTaskId(null)} />
        </>
    )
}
