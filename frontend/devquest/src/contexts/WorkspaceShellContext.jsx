/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import userApi from '@/api/userApi'

const WorkspaceShellContext = createContext(null)

function resolveEntityId(source, ...keys) {
  const matchedKey = keys.find((key) => source?.[key] !== undefined && source?.[key] !== null)
  return matchedKey ? source[matchedKey] : null
}

function normalizeWorkspace(workspace, index) {
  return {
    id: String(resolveEntityId(workspace, 'id', 'workspaceId') ?? index + 1),
    name: workspace?.name ?? 'Untitled workspace',
    description: workspace?.description ?? 'No description yet.',
    role: workspace?.role ?? 'Member',
    boardCount: Number(workspace?.boardCount ?? 0),
    activeSince: workspace?.activeSince ?? '',
    boardSummaries: Array.isArray(workspace?.boardSummaries)
      ? workspace.boardSummaries.map((board, boardIndex) => ({
          id: String(resolveEntityId(board, 'id', 'boardId') ?? boardIndex + 1),
          name: board?.name ?? 'Untitled board',
        }))
      : [],
  }
}

export function WorkspaceShellProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([])
  const [preferredWorkspaceId, setPreferredWorkspaceId] = useState(null)
  const [preferredBoardIds, setPreferredBoardIds] = useState({})
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true)
  const [workspaceLoadError, setWorkspaceLoadError] = useState('')

  const refreshWorkspaces = useCallback(async () => {
    setIsLoadingWorkspaces(true)
    setWorkspaceLoadError('')

    try {
      const data = await userApi.getWorkspaces()
      const normalizedWorkspaces = (Array.isArray(data) ? data : []).map(normalizeWorkspace)

      setWorkspaces(normalizedWorkspaces)
      setPreferredWorkspaceId((current) => {
        if (current && normalizedWorkspaces.some((workspace) => workspace.id === current)) {
          return current
        }

        return normalizedWorkspaces[0]?.id ?? null
      })
    } catch (error) {
      setWorkspaces([])
      setPreferredWorkspaceId(null)
      setWorkspaceLoadError(
        error?.response?.data?.message ?? error?.message ?? 'Unable to load workspaces.',
      )
    } finally {
      setIsLoadingWorkspaces(false)
    }
  }, [])

  useEffect(() => {
    void refreshWorkspaces()
  }, [refreshWorkspaces])

  const value = useMemo(() => {
    const getWorkspace = (workspaceId) =>
      workspaces.find((workspace) => workspace.id === workspaceId) ?? null

    const getPreferredBoardId = (workspaceId) =>
      preferredBoardIds[workspaceId] ??
      getWorkspace(workspaceId)?.boardSummaries?.[0]?.id ??
      null

    return {
      workspaces,
      preferredWorkspaceId,
      preferredBoardIds,
      isLoadingWorkspaces,
      workspaceLoadError,
      refreshWorkspaces,
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
    }
  }, [
    isLoadingWorkspaces,
    preferredBoardIds,
    preferredWorkspaceId,
    refreshWorkspaces,
    workspaceLoadError,
    workspaces,
  ])

  return <WorkspaceShellContext.Provider value={value}>{children}</WorkspaceShellContext.Provider>
}

export function useWorkspaceShell() {
  const context = useContext(WorkspaceShellContext)

  if (!context) {
    throw new Error('useWorkspaceShell must be used within WorkspaceShellProvider')
  }

  return context
}
