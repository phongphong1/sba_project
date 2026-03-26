import { useCallback, useEffect, useMemo, useState } from 'react'
import workspaceApi from '@/api/workspaceApi'

function resolveEntityId(source, ...keys) {
  const matchedKey = keys.find((key) => source?.[key] !== undefined && source?.[key] !== null)
  return matchedKey ? source[matchedKey] : null
}

function normalizeMember(member, index) {
  return {
    id: String(resolveEntityId(member, 'id', 'memberId', 'userId') ?? index + 1),
    fullName: member?.fullName ?? member?.name ?? 'Unknown member',
    name: member?.name ?? member?.fullName ?? 'Unknown member',
    role: member?.role ?? 'Member',
    avatar: member?.avatar ?? member?.initials ?? 'NA',
    color: member?.color ?? '#E2E8F0',
  }
}

function normalizeBoardSummary(board, workspaceId, index) {
  return {
    id: String(resolveEntityId(board, 'id', 'boardId') ?? index + 1),
    workspaceId: String(resolveEntityId(board, 'workspaceId', 'id') ?? workspaceId ?? ''),
    name: board?.name ?? 'Untitled board',
    description: board?.description ?? 'No description yet.',
    columnCount: Number(board?.columnCount ?? board?.columns?.length ?? 0),
    taskCount: Number(board?.taskCount ?? board?.tasks?.length ?? 0),
    completedTaskCount: Number(board?.completedTaskCount ?? 0),
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
    boardId: task?.boardId !== undefined && task?.boardId !== null
      ? String(task.boardId)
      : resolveEntityId(task, 'boardId') !== null
        ? String(resolveEntityId(task, 'boardId'))
        : null,
    boardName: task?.boardName ?? task?.sprint ?? 'General board',
    position: Number(task?.position ?? index + 1),
    title: task?.title ?? 'Untitled task',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'Medium',
    sprint: task?.sprint ?? task?.boardName ?? 'Backlog',
    progress: Number(task?.progress ?? 0),
    dueDate: task?.dueDate ?? 'TBD',
    reminderEnabled: Boolean(task?.reminderEnabled),
    assignee: {
      id: String(resolveEntityId(task?.assignee, 'id', 'memberId', 'userId') ?? task?.assigneeId ?? 'unassigned'),
      name: task?.assignee?.name ?? task?.assignee?.fullName ?? 'Unassigned',
      avatar: task?.assignee?.avatar ?? 'NA',
      color: task?.assignee?.color ?? '#E2E8F0',
    },
    members: members.map(normalizeTaskMember),
    estimateHours: Number(task?.estimateHours ?? 0),
  }
}

function normalizeScheduleItem(item, index) {
  return {
    id: String(item?.id ?? index + 1),
    title: item?.title ?? 'Untitled event',
    position: item?.position ?? index + 1,
    startTime: item?.startTime ?? '--:--',
    endTime: item?.endTime ?? '--:--',
    location: item?.location ?? 'TBD',
    type: item?.type ?? 'General',
  }
}

function normalizeWeeklyOutputItem(item, index) {
  return {
    id: String(item?.id ?? index + 1),
    label: item?.label ?? `Day ${index + 1}`,
    completedTasks: Number(item?.completedTasks ?? 0),
    goalTasks: Number(item?.goalTasks ?? 0),
  }
}

function normalizeWorkspaceOverview(payload, workspaceId) {
  const resolvedPayload = payload && typeof payload === 'object' ? payload : {}
  const workspace =
    resolvedPayload.workspace && typeof resolvedPayload.workspace === 'object'
      ? resolvedPayload.workspace
      : {}

  const boardSource = Array.isArray(resolvedPayload.boardSummaries)
    ? resolvedPayload.boardSummaries
    : Array.isArray(resolvedPayload.boards)
      ? resolvedPayload.boards
      : []

  return {
    workspace: {
      id: String(resolveEntityId(workspace, 'id', 'workspaceId') ?? workspaceId ?? ''),
      name: workspace?.name ?? 'Workspace overview',
      description: workspace?.description ?? '',
    },
    members: (Array.isArray(resolvedPayload.members) ? resolvedPayload.members : []).map(normalizeMember),
    boardSummaries: boardSource.map((board, index) =>
      normalizeBoardSummary(board, resolveEntityId(workspace, 'id', 'workspaceId') ?? workspaceId, index),
    ),
    tasks: (Array.isArray(resolvedPayload.tasks) ? resolvedPayload.tasks : []).map(normalizeTask),
    schedule: (Array.isArray(resolvedPayload.schedule) ? resolvedPayload.schedule : []).map(
      normalizeScheduleItem,
    ),
    weeklyOutput: (
      Array.isArray(resolvedPayload.weeklyOutput) ? resolvedPayload.weeklyOutput : []
    ).map(normalizeWeeklyOutputItem),
  }
}

function createEmptyDashboardData(workspaceId) {
  return normalizeWorkspaceOverview({}, workspaceId)
}

function resolveDashboardError(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    'Failed to load dashboard overview.'
  )
}

export function useDashboardData(workspaceId) {
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(Boolean(workspaceId))
  const [dashboardError, setDashboardError] = useState('')

  const loadDashboard = useCallback(async () => {
    if (!workspaceId) {
      setDashboardData(null)
      setDashboardError('')
      return
    }

    setIsLoadingDashboard(true)
    setDashboardError('')

    try {
      const [
        workspaceResult,
        boardsResult,
        tasksResult,
        scheduleResult,
        weeklyOutputResult,
      ] = await Promise.allSettled([
        workspaceApi.getById(workspaceId),
        workspaceApi.getBoards(workspaceId),
        workspaceApi.getTaskSummary(workspaceId),
        workspaceApi.getSchedule(workspaceId),
        workspaceApi.getWeeklyOutput(workspaceId),
      ])

      const nextDashboardData = createEmptyDashboardData(workspaceId)
      const errors = []

      if (workspaceResult.status === 'fulfilled') {
        nextDashboardData.workspace = normalizeWorkspaceOverview(
          { workspace: workspaceResult.value },
          workspaceId,
        ).workspace
      } else {
        errors.push(resolveDashboardError(workspaceResult.reason))
      }

      if (boardsResult.status === 'fulfilled') {
        nextDashboardData.boardSummaries = normalizeWorkspaceOverview(
          { boardSummaries: boardsResult.value },
          workspaceId,
        ).boardSummaries
      } else {
        errors.push(resolveDashboardError(boardsResult.reason))
      }

      if (tasksResult.status === 'fulfilled') {
        const normalizedTasksData = normalizeWorkspaceOverview(
          {
            members: tasksResult.value?.members,
            tasks: tasksResult.value?.tasks ?? tasksResult.value,
          },
          workspaceId,
        )

        nextDashboardData.members = normalizedTasksData.members
        nextDashboardData.tasks = normalizedTasksData.tasks
      } else {
        errors.push(resolveDashboardError(tasksResult.reason))
      }

      if (scheduleResult.status === 'fulfilled') {
        nextDashboardData.schedule = normalizeWorkspaceOverview(
          { schedule: scheduleResult.value },
          workspaceId,
        ).schedule
      } else {
        errors.push(resolveDashboardError(scheduleResult.reason))
      }

      if (weeklyOutputResult.status === 'fulfilled') {
        nextDashboardData.weeklyOutput = normalizeWorkspaceOverview(
          { weeklyOutput: weeklyOutputResult.value },
          workspaceId,
        ).weeklyOutput
      } else {
        errors.push(resolveDashboardError(weeklyOutputResult.reason))
      }

      if (errors.length === 5) {
        setDashboardData(null)
        setDashboardError(errors[0])
      } else if (errors.length > 0) {
        setDashboardData(nextDashboardData)
        setDashboardError(errors[0])
      } else {
        setDashboardData(nextDashboardData)
      }
    } catch (error) {
      setDashboardData(null)
      setDashboardError(resolveDashboardError(error))
    } finally {
      setIsLoadingDashboard(false)
    }
  }, [workspaceId])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  return useMemo(
    () => ({
      dashboardData,
      isLoadingDashboard,
      dashboardError,
      refreshDashboard: loadDashboard,
    }),
    [dashboardData, dashboardError, isLoadingDashboard, loadDashboard],
  )
}

export default useDashboardData
