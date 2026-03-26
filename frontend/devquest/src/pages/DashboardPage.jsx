import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AnalyticsChart from '@/components/dashboard/AnalyticsChart'
import RightPanel from '@/components/dashboard/RightPanel'
import StatsCard from '@/components/dashboard/StatsCard'
import TaskList from '@/components/dashboard/TaskList'
import { Card } from '@/components/ui/card'
import { octomLoadingCardClass } from '@/constants/uiStyles'
import { MOCK_DASHBOARD_DATA } from '@/data/mockDashboard'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const { searchQuery } = useOutletContext()
  const [draftTask, setDraftTask] = useState({
    title: '',
    assigneeId: MOCK_DASHBOARD_DATA.team[0].id,
    dueDate: '',
  })

  useEffect(() => {
    // Mock bootstrapping today; swap with axios.get('/api/dashboard') later.
    const timer = window.setTimeout(() => {
      setDashboardData(MOCK_DASHBOARD_DATA)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const filteredTasks = useMemo(() => {
    if (!dashboardData) return []

    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) return dashboardData.tasks

    return dashboardData.tasks.filter((task) => {
      const combined =
        `${task.title} ${task.assignee.name} ${task.status} ${task.sprint}`.toLowerCase()
      return combined.includes(normalizedQuery)
    })
  }, [dashboardData, searchQuery])

  const handleToggleReminder = (taskId) => {
    setDashboardData((currentData) => ({
      ...currentData,
      tasks: currentData.tasks.map((task) =>
        task.id === taskId ? { ...task, reminderEnabled: !task.reminderEnabled } : task,
      ),
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

    if (!draftTask.title.trim()) return

    setDashboardData((currentData) => {
      const assignee =
        currentData.team.find((member) => member.id === draftTask.assigneeId) ?? currentData.team[0]

      return {
        ...currentData,
        tasks: [
          {
            id: Date.now(),
            projectId: currentData.workspace.id,
            position: currentData.tasks.length + 1,
            title: draftTask.title.trim(),
            status: 'todo',
            priority: 'Medium',
            sprint: 'Backlog',
            progress: 18,
            dueDate: draftTask.dueDate.trim() || 'Tomorrow, 02:00 PM',
            reminderEnabled: false,
            assignee: {
              id: assignee.id,
              name: assignee.name,
              avatar: assignee.avatar,
              color: assignee.color,
            },
            members: [
              {
                id: assignee.id,
                name: assignee.name,
                avatar: assignee.avatar,
                color: assignee.color,
              },
            ],
            estimateHours: 6,
          },
          ...currentData.tasks,
        ],
      }
    })

    setDraftTask({
      title: '',
      assigneeId: MOCK_DASHBOARD_DATA.team[0].id,
      dueDate: '',
    })
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <Card className={octomLoadingCardClass}>
          Loading dashboard...
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <main className="space-y-6">
        <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {dashboardData.stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </section>

        <AnalyticsChart data={dashboardData.chart} />
        <TaskList tasks={filteredTasks} onToggleReminder={handleToggleReminder} />
      </main>

      <RightPanel
        schedule={dashboardData.schedule}
        messages={dashboardData.messages}
        team={dashboardData.team}
        draftTask={draftTask}
        onDraftChange={handleDraftChange}
        onSubmit={handleQuickAddTask}
      />
    </div>
  )
}
