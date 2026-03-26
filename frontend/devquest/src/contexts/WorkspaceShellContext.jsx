import { createContext, useContext, useMemo, useState } from 'react'
import {
  DEFAULT_BOARD_IDS,
  DEFAULT_WORKSPACE_ID,
  MOCK_WORKSPACES,
  getBoardById,
  getWorkspaceById,
} from '@/data/mockWorkspaceGraph'

const WorkspaceShellContext = createContext(null)

function hydrateTask(task, membersById) {
  const assignee = membersById.get(task.assigneeId) ?? null
  const members = task.memberIds
    .map((memberId) => membersById.get(memberId))
    .filter(Boolean)

  return {
    ...task,
    assignee: assignee
      ? {
          id: assignee.id,
          name: assignee.fullName,
          avatar: assignee.avatar,
          color: assignee.color,
        }
      : null,
    members: members.map((member) => ({
      id: member.id,
      name: member.fullName,
      avatar: member.avatar,
      color: member.color,
    })),
  }
}

function hydrateBoard(workspace, board) {
  const membersById = new Map(workspace.members.map((member) => [member.id, member]))

  return {
    ...board,
    workspaceId: workspace.id,
    columns: [...board.columns].sort((a, b) => a.position - b.position),
    tasks: [...board.tasks]
      .map((task) => hydrateTask(task, membersById))
      .sort((a, b) => a.position - b.position),
  }
}

function getColumnStatus(columnName) {
  switch (columnName.toLowerCase()) {
    case 'to do':
      return 'todo'
    case 'in progress':
      return 'inProgress'
    case 'review':
      return 'review'
    case 'done':
      return 'done'
    default:
      return 'todo'
  }
}

export function WorkspaceShellProvider({ children }) {
  const [preferredWorkspaceId, setPreferredWorkspaceId] = useState(DEFAULT_WORKSPACE_ID)
  const [preferredBoardIds, setPreferredBoardIds] = useState(DEFAULT_BOARD_IDS)

  const value = useMemo(() => {
    const workspaces = MOCK_WORKSPACES.map((workspace) => ({
      ...workspace,
      boardCount: workspace.boards.length,
      taskCount: workspace.boards.reduce((total, board) => total + board.tasks.length, 0),
    }))

    const getWorkspace = (workspaceId) => getWorkspaceById(workspaceId)

    const getHydratedBoard = (workspaceId, boardId) => {
      const workspace = getWorkspace(workspaceId)
      const board = getBoardById(workspaceId, boardId)

      if (!workspace || !board) return null

      return hydrateBoard(workspace, board)
    }

    const getPreferredBoardId = (workspaceId) =>
      preferredBoardIds[workspaceId] ?? getWorkspace(workspaceId)?.boards[0]?.id ?? null

    const getWorkspaceOverview = (workspaceId) => {
      const workspace = getWorkspace(workspaceId)

      if (!workspace) return null

      const boardSummaries = workspace.boards.map((board) => ({
        id: board.id,
        workspaceId: workspace.id,
        name: board.name,
        description: board.description,
        columnCount: board.columns.length,
        taskCount: board.tasks.length,
        completedTaskCount: board.tasks.filter((task) => task.columnId === 'col-done').length,
      }))

      const allHydratedTasks = workspace.boards.flatMap((board) =>
        hydrateBoard(workspace, board).tasks.map((task) => ({
          ...task,
          boardId: board.id,
          boardName: board.name,
          status:
            getColumnStatus(
              board.columns.find((column) => column.id === task.columnId)?.name ?? 'To Do',
            ),
          sprint: board.name,
        })),
      )

      return {
        workspace,
        members: workspace.members,
        boardSummaries,
        tasks: allHydratedTasks,
        schedule: workspace.schedule,
        updates: workspace.updates,
        weeklyOutput: workspace.weeklyOutput,
      }
    }

    return {
      workspaces,
      preferredWorkspaceId,
      preferredBoardIds,
      setPreferredWorkspaceId,
      setPreferredBoard(workspaceId, boardId) {
        if (!boardId) return

        setPreferredBoardIds((current) => {
          if (current[workspaceId] === boardId) {
            return current
          }

          return {
            ...current,
            [workspaceId]: boardId,
          }
        })
      },
      getPreferredBoardId,
      getWorkspace,
      getHydratedBoard,
      getWorkspaceOverview,
    }
  }, [preferredBoardIds, preferredWorkspaceId])

  return <WorkspaceShellContext.Provider value={value}>{children}</WorkspaceShellContext.Provider>
}

export function useWorkspaceShell() {
  const context = useContext(WorkspaceShellContext)

  if (!context) {
    throw new Error('useWorkspaceShell must be used within WorkspaceShellProvider')
  }

  return context
}
