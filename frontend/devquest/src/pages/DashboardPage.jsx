import { useMemo, useState } from 'react'
import { Navigate, useOutletContext, useParams } from 'react-router-dom'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import AnalyticsChart from '@/components/dashboard/AnalyticsChart'
import RightPanel from '@/components/dashboard/RightPanel'
import StatsCard from '@/components/dashboard/StatsCard'
import TaskList from '@/components/dashboard/TaskList'
import { DEFAULT_WORKSPACE_ID } from '@/data/mockWorkspaceGraph'
import { useWorkspaceShell } from '@/contexts/WorkspaceShellContext'

function normalizePriority(priority) {
  return `${priority.slice(0, 1)}${priority.slice(1).toLowerCase()}`
}

export default function DashboardPage() {
  const { workspaceId } = useParams()
  const { searchQuery, currentWorkspace } = useOutletContext()
  const { getWorkspaceOverview } = useWorkspaceShell()
  const [quickTasks, setQuickTasks] = useState([])
  const [reminderState, setReminderState] = useState({})
  const [draftTask, setDraftTask] = useState({
    title: '',
    assigneeId: '',
    dueDate: '',
  })
  const workspaceOverview = currentWorkspace ? getWorkspaceOverview(currentWorkspace.id) : null

  const team = workspaceOverview?.members ?? []

  const effectiveDraftTask = useMemo(() => {
    if (draftTask.assigneeId || !team[0]) return draftTask

    return {
      ...draftTask,
      assigneeId: team[0].id,
    }
  }, [draftTask, team])

  if (!workspaceOverview || workspaceId !== currentWorkspace?.id) {
    return <Navigate to={DEFAULT_WORKSPACE_ID ? `/w/${DEFAULT_WORKSPACE_ID}/dashboard` : '/workspace-empty'} replace />
  }

  if (!workspaceOverview.boardSummaries.length) {
    return (
      <main className="flex min-h-[420px] items-center">
        <EmptyStatePanel
          eyebrow="Workspace boards"
          title="This workspace has no boards yet"
          description="The workspace is available, but there is no board to organize columns and tasks yet. Once the backend returns the first board, this dashboard will start summarizing activity automatically."
          primaryActionLabel="Refresh view"
          onPrimaryAction={() => window.location.reload()}
        />
      </main>
    )
  }

  const dashboardStats = [
    {
      id: 1,
      title: 'Boards in workspace',
      metric: String(workspaceOverview.boardSummaries.length),
      delta: `${workspaceOverview.boardSummaries.filter((board) => board.taskCount > 0).length} active`,
      trend: 'up',
      description: 'Boards currently carrying delivery work',
      icon: 'dashboard',
    },
    {
      id: 2,
      title: 'Workspace members',
      metric: String(team.length),
      delta: `${workspaceOverview.tasks.filter((task) => task.status !== 'done').length} open tasks`,
      trend: 'up',
      description: 'People assigned across current boards',
      icon: 'tasks',
    },
    {
      id: 3,
      title: 'Tasks in review',
      metric: String(workspaceOverview.tasks.filter((task) => task.status === 'review').length),
      delta: `${workspaceOverview.tasks.filter((task) => task.status === 'done').length} completed`,
      trend: 'down',
      description: 'Items waiting for sign-off right now',
      icon: 'sparkles',
    },
  ]

  const filteredTasks = useMemo(() => {
    const allTasks = [...quickTasks, ...workspaceOverview.tasks].map((task) => ({
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
  }, [quickTasks, reminderState, searchQuery, workspaceOverview.tasks])

  const handleToggleReminder = (taskId) => {
    setReminderState((current) => ({
      ...current,
      [taskId]: !current[taskId],
    }))
  }

  const handleDraftChange = (field, value) => {
    setDraftTask((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }))
  }

  const handleQuickAddTask = (event) => {
    event.preventDefault()

    if (!effectiveDraftTask.title.trim()) return

    const assignee =
      team.find((member) => member.id === effectiveDraftTask.assigneeId) ?? team[0]

    if (!assignee) return

    setQuickTasks((currentTasks) => [
      {
        id: `quick-${Date.now()}`,
        boardId: workspaceOverview.boardSummaries[0]?.id ?? null,
        boardName: workspaceOverview.boardSummaries[0]?.name ?? 'General board',
        position: currentTasks.length + 1,
        title: effectiveDraftTask.title.trim(),
        status: 'todo',
        priority: 'Medium',
        sprint: workspaceOverview.boardSummaries[0]?.name ?? 'Backlog',
        progress: 18,
        dueDate: effectiveDraftTask.dueDate.trim() || 'Tomorrow, 02:00 PM',
        reminderEnabled: false,
        assignee: {
          id: assignee.id,
          name: assignee.fullName,
          avatar: assignee.avatar,
          color: assignee.color,
        },
        members: [
          {
            id: assignee.id,
            name: assignee.fullName,
            avatar: assignee.avatar,
            color: assignee.color,
          },
        ],
        estimateHours: 6,
      },
      ...currentTasks,
    ])

    setDraftTask({
      title: '',
      assigneeId: team[0]?.id ?? '',
      dueDate: '',
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <main className="space-y-6">
        <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {dashboardStats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </section>

        <AnalyticsChart data={workspaceOverview.weeklyOutput} />
        <TaskList tasks={filteredTasks} onToggleReminder={handleToggleReminder} />
      </main>

      <RightPanel
        schedule={workspaceOverview.schedule}
        messages={workspaceOverview.updates}
        team={team.map((member) => ({ ...member, name: member.fullName }))}
        draftTask={effectiveDraftTask}
        onDraftChange={handleDraftChange}
        onSubmit={handleQuickAddTask}
      />
    </div>
  )
}
