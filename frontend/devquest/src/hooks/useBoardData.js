import { useCallback, useEffect, useMemo, useState } from 'react'
import workspaceApi from '@/api/workspaceApi'

function resolveEntityId(source, ...keys) {
  const matchedKey = keys.find((key) => source?.[key] !== undefined && source?.[key] !== null)
  return matchedKey ? source[matchedKey] : null
}

function normalizeBoardSummary(board, workspaceId, index) {
  return {
    id: String(resolveEntityId(board, 'id', 'boardId') ?? index + 1),
    workspaceId: String(resolveEntityId(board, 'workspaceId') ?? workspaceId ?? ''),
    name: board?.name ?? 'Untitled board',
    description: board?.description ?? 'No description yet.',
    columnCount: Number(board?.columnCount ?? board?.columns?.length ?? 0),
    taskCount: Number(board?.taskCount ?? board?.tasks?.length ?? 0),
    completedTaskCount: Number(board?.completedTaskCount ?? 0),
  }
}

function normalizeMember(member, index) {
  return {
    id: String(resolveEntityId(member, 'id', 'memberId', 'userId') ?? index + 1),
    fullName: member?.fullName ?? member?.name ?? 'Unknown member',
    role: member?.role ?? 'Member',
    avatar: member?.avatar ?? member?.initials ?? 'NA',
    color: member?.color ?? '#E2E8F0',
  }
}

function normalizeTaskMember(member, index) {
  return {
    id: String(resolveEntityId(member, 'id', 'memberId', 'userId') ?? index + 1),
    name: member?.name ?? member?.fullName ?? 'Unknown member',
    avatar: member?.avatar ?? member?.initials ?? 'NA',
    color: member?.color ?? '#E2E8F0',
  }
}

function normalizeTask(task, index) {
  const members = Array.isArray(task?.members) ? task.members : []

  return {
    id: String(resolveEntityId(task, 'id', 'taskId') ?? index + 1),
    columnId: String(resolveEntityId(task, 'columnId', 'toColumnId') ?? ''),
    title: task?.title ?? 'Untitled task',
    priority: task?.priority ?? 'MEDIUM',
    position: Number(task?.position ?? (index + 1) * 1000),
    dueDate: task?.dueDate ?? 'TBD',
    progress: Number(task?.progress ?? 0),
    assignee: {
      id: String(resolveEntityId(task?.assignee, 'id', 'memberId', 'userId') ?? task?.assigneeId ?? 'unassigned'),
      name: task?.assignee?.name ?? task?.assignee?.fullName ?? 'Unassigned',
      avatar: task?.assignee?.avatar ?? 'NA',
      color: task?.assignee?.color ?? '#E2E8F0',
    },
    members: members.map(normalizeTaskMember),
    estimateHours: Number(task?.estimateHours ?? 0),
    checklist: Array.isArray(task?.checklist) ? task.checklist : [],
    comments: Array.isArray(task?.comments) ? task.comments : [],
    attachments: Array.isArray(task?.attachments) ? task.attachments : [],
  }
}

function normalizeBoardPayload(payload, workspaceId) {
  const resolved = payload && typeof payload === 'object' ? payload : {}
  const boardsSource = Array.isArray(resolved.boards) ? resolved.boards : []
  const board = resolved.board && typeof resolved.board === 'object' ? resolved.board : resolved
  const boardColumns = Array.isArray(resolved.columns)
    ? resolved.columns
    : Array.isArray(board?.columns)
      ? board.columns
      : []
  const boardTasks = Array.isArray(resolved.tasks)
    ? resolved.tasks
    : Array.isArray(board?.tasks)
      ? board.tasks
      : []

  return {
    boards: boardsSource.map((item, index) => normalizeBoardSummary(item, workspaceId, index)),
    workspaceMembers: (
      Array.isArray(resolved.workspaceMembers)
        ? resolved.workspaceMembers
        : Array.isArray(resolved.members)
          ? resolved.members
          : []
    ).map(normalizeMember),
    board: {
      id: String(resolveEntityId(board, 'id', 'boardId') ?? ''),
      workspaceId: String(resolveEntityId(board, 'workspaceId') ?? workspaceId ?? ''),
      name: board?.name ?? 'Untitled board',
      description: board?.description ?? 'No description yet.',
      columns: boardColumns.map((column, index) => ({
        id: String(resolveEntityId(column, 'id', 'columnId') ?? index + 1),
        name: column?.name ?? 'Untitled column',
        position: Number(column?.position ?? (index + 1) * 1000),
      })),
      tasks: boardTasks.map(normalizeTask),
    },
  }
}

function resolveBoardError(error) {
  return error?.response?.data?.message ?? error?.message ?? 'Unable to load board data.'
}

export function useBoardData(workspaceId, boardId) {
  const [boardPayload, setBoardPayload] = useState(null)
  const [isLoadingBoard, setIsLoadingBoard] = useState(Boolean(workspaceId))
  const [boardError, setBoardError] = useState('')

  const loadBoard = useCallback(async () => {
    if (!workspaceId) {
      setBoardPayload(null)
      setBoardError('')
      return
    }

    setIsLoadingBoard(true)
    setBoardError('')

    try {
      const boardsResponse = await workspaceApi.getBoards(workspaceId)
      const normalizedBoards = normalizeBoardPayload({ boards: boardsResponse }, workspaceId)

      if (!boardId) {
        setBoardPayload({
          boards: normalizedBoards.boards,
          workspaceMembers: [],
          board: null,
        })
        return
      }

      const boardResponse = await workspaceApi.getBoard(workspaceId, boardId)
      const normalizedBoard = normalizeBoardPayload(boardResponse, workspaceId)

      setBoardPayload({
        boards: normalizedBoard.boards.length ? normalizedBoard.boards : normalizedBoards.boards,
        workspaceMembers: normalizedBoard.workspaceMembers,
        board: normalizedBoard.board,
      })
    } catch (error) {
      setBoardPayload(null)
      setBoardError(resolveBoardError(error))
    } finally {
      setIsLoadingBoard(false)
    }
  }, [boardId, workspaceId])

  useEffect(() => {
    void loadBoard()
  }, [loadBoard])

  return useMemo(
    () => ({
      boardPayload,
      isLoadingBoard,
      boardError,
      refreshBoard: loadBoard,
    }),
    [boardError, boardPayload, isLoadingBoard, loadBoard],
  )
}

export default useBoardData
