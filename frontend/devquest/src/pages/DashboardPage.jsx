import { useMemo, useState } from 'react'
import { Navigate, useOutletContext, useParams } from 'react-router-dom'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import AnalyticsChart from '@/components/dashboard/AnalyticsChart'
import RightPanel from '@/components/dashboard/RightPanel'
import StatsCard from '@/components/dashboard/StatsCard'
import TaskList from '@/components/dashboard/TaskList'
import { Card } from '@/components/ui/card'
import { octomLoadingCardClass } from '@/constants/uiStyles'
import { useDashboardData } from '@/hooks/useDashboardData'

function normalizePriority(priority) {
  return `${priority.slice(0, 1)}${priority.slice(1).toLowerCase()}`
}

export default function DashboardPage() {
  const { workspaceId } = useParams()
  const { searchQuery } = useOutletContext()

  if (!workspaceId) {
    return <Navigate to="/workspace-empty" replace />
  }

  return <DashboardWorkspaceView key={workspaceId} workspaceId={workspaceId} searchQuery={searchQuery} />
}

function DashboardWorkspaceView({ workspaceId, searchQuery }) {
  const { dashboardData, isLoadingDashboard, dashboardError, refreshDashboard } =
    useDashboardData(workspaceId)
  const [reminderState, setReminderState] = useState({})
  const team = useMemo(() => dashboardData?.members ?? [], [dashboardData?.members])
  const boardSummaries = useMemo(
    () => dashboardData?.boardSummaries ?? [],
    [dashboardData?.boardSummaries],
  )
  const workspaceTasks = useMemo(() => dashboardData?.tasks ?? [], [dashboardData?.tasks])
  const schedule = useMemo(() => dashboardData?.schedule ?? [], [dashboardData?.schedule])
  const weeklyOutput = useMemo(
    () => dashboardData?.weeklyOutput ?? [],
    [dashboardData?.weeklyOutput],
  )

  const dashboardStats = useMemo(
    () => [
      {
        id: 1,
        title: 'Boards in workspace',
        metric: String(boardSummaries.length),
        delta: `${boardSummaries.filter((board) => board.taskCount > 0).length} active`,
        trend: 'up',
        description: 'Boards currently carrying delivery work',
        icon: 'dashboard',
      },
      {
        id: 2,
        title: 'Workspace members',
        metric: String(team.length),
        delta: `${workspaceTasks.filter((task) => task.status !== 'done').length} open tasks`,
        trend: 'up',
        description: 'People assigned across current boards',
        icon: 'tasks',
      },
      {
        id: 3,
        title: 'Tasks in review',
        metric: String(workspaceTasks.filter((task) => task.status === 'review').length),
        delta: `${workspaceTasks.filter((task) => task.status === 'done').length} completed`,
        trend: 'down',
        description: 'Items waiting for sign-off right now',
        icon: 'sparkles',
      },
    ],
    [boardSummaries, team.length, workspaceTasks],
  )

  const filteredTasks = useMemo(() => {
    const allTasks = workspaceTasks.map((task) => ({
      ...task,
      priority: normalizePriority(task.priority),
      reminderEnabled: reminderState[task.id] ?? task.reminderEnabled ?? false,
    }))

    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) return allTasks

    return allTasks.filter((task) => {
      const combined =
        `${task.title} ${task.assignee?.name ?? ''} ${task.status} ${task.sprint}`.toLowerCase()
      return combined.includes(normalizedQuery)
    })
  }, [reminderState, searchQuery, workspaceTasks])

  if (isLoadingDashboard && !dashboardData) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <Card className={octomLoadingCardClass}>Loading dashboard overview...</Card>
      </div>
    )
  }

  if (dashboardError && !dashboardData) {
    return (
      <main className="flex min-h-[420px] items-center">
        <EmptyStatePanel
          eyebrow="Dashboard overview"
          title="Unable to load this workspace"
          description={dashboardError}
          primaryActionLabel="Try again"
          onPrimaryAction={() => {
            void refreshDashboard()
          }}
        />
      </main>
    )
  }

  if (!dashboardData) {
    return <Navigate to="/workspace-empty" replace />
  }

  const handleToggleReminder = (taskId) => {
    setReminderState((current) => ({
      ...current,
      [taskId]: !current[taskId],
    }))
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <main className="space-y-6">
        <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {dashboardStats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </section>

        <AnalyticsChart data={weeklyOutput} />
        <TaskList
          tasks={filteredTasks}
          onToggleReminder={handleToggleReminder}
          hasActiveSearch={Boolean(searchQuery.trim())}
        />
      </main>

      <RightPanel schedule={schedule} />
    </div>
  )
}
