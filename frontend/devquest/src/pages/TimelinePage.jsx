import { useEffect, useMemo, useRef, useState } from 'react'
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  endOfDay,
  format,
  getDaysInMonth,
  parseISO,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { CalendarDays, Search } from 'lucide-react'
import { useOutletContext, useParams } from 'react-router-dom'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'
import {
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from '@/components/kibo-ui/gantt'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  octomAvatarBaseClass,
  octomAvatarFallbackClass,
  octomCardClass,
  octomInlineInputClass,
  octomLoadingCardClass,
  octomSecondaryButtonClass,
  octomSelectTriggerClass,
} from '@/constants/uiStyles'
import workspaceApi from '@/api/workspaceApi'

const timelineViewOptions = {
  month: { label: 'Month', range: 'daily', columnWidth: 50 },
  quarter: { label: 'Quarter', range: 'monthly', columnWidth: 150 },
  year: { label: 'Year', range: 'quarterly', columnWidth: 100 },
}

function getTimelineBoardStart(referenceDate = new Date()) {
  return new Date(referenceDate.getFullYear() - 1, 0, 1)
}

function calculateDateOffset(date, boardStartDate, timelineView) {
  const normalizedDate = startOfDay(date)
  const config = timelineViewOptions[timelineView]

  if (timelineView === 'month') {
    return differenceInCalendarDays(normalizedDate, boardStartDate) * config.columnWidth
  }

  const fullMonths = differenceInCalendarMonths(startOfMonth(normalizedDate), boardStartDate)
  const dayOffset = normalizedDate.getDate() - 1
  const pixelsPerDay = config.columnWidth / getDaysInMonth(normalizedDate)

  return fullMonths * config.columnWidth + dayOffset * pixelsPerDay
}

// Mirrors API-ready bar math so the UI can derive pixel left/width from raw dates.
function calculateTaskBarMetrics(task, boardStartDate, timelineView) {
  const startDate = parseISO(task.startDate)
  const dueDate = parseISO(task.dueDate)
  const left = calculateDateOffset(startDate, boardStartDate, timelineView)
  const endOffset = calculateDateOffset(endOfDay(dueDate), boardStartDate, timelineView)
  const width = Math.max(endOffset - left, timelineViewOptions[timelineView].columnWidth / 3)

  return {
    left,
    width,
    leftDays: differenceInCalendarDays(startDate, boardStartDate),
    durationDays: Math.max(differenceInCalendarDays(dueDate, startDate) + 1, 1),
  }
}

export default function TimelinePage() {
  const { workspaceId } = useParams()
  const { searchQuery, setSearchQuery } = useOutletContext()
  const [timelineView, setTimelineView] = useState('month')
  const [activeMemberId, setActiveMemberId] = useState('ALL')
  const [ganttKey, setGanttKey] = useState(0)
  const [timelineData, setTimelineData] = useState({ members: [], tasks: [] })
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false)
  const [timelineError, setTimelineError] = useState('')
  const ganttShellRef = useRef(null)
  const boardStartDate = useMemo(() => getTimelineBoardStart(), [])

  useEffect(() => {
    if (!workspaceId) {
      setTimelineData({ members: [], tasks: [] })
      return
    }

    let isMounted = true

    const loadTimeline = async () => {
      setIsLoadingTimeline(true)
      setTimelineError('')

      try {
        const data = await workspaceApi.getTimeline(workspaceId)

        if (!isMounted) {
          return
        }

        setTimelineData({
          members: Array.isArray(data?.members) ? data.members : [],
          tasks: Array.isArray(data?.tasks) ? data.tasks : [],
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        setTimelineData({ members: [], tasks: [] })
        setTimelineError(
          error?.response?.data?.message ?? error?.message ?? 'Unable to load timeline data.',
        )
      } finally {
        if (isMounted) {
          setIsLoadingTimeline(false)
        }
      }
    }

    void loadTimeline()

    return () => {
      isMounted = false
    }
  }, [workspaceId])

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return timelineData.tasks.filter((task) => {
      const matchesMember = activeMemberId === 'ALL' || task.assignee.id === activeMemberId
      const matchesSearch =
        !normalizedQuery ||
        `${task.title} ${task.assignee.name}`.toLowerCase().includes(normalizedQuery)

      return matchesMember && matchesSearch
    })
  }, [activeMemberId, searchQuery, timelineData.tasks])

  const features = useMemo(
    () =>
      filteredTasks.map((task) => ({
        id: String(task.id),
        name: task.title,
        startAt: parseISO(task.startDate),
        endAt: parseISO(task.dueDate),
        status: { color: task.color },
        task,
        metrics: calculateTaskBarMetrics(task, boardStartDate, timelineView),
      })),
    [boardStartDate, filteredTasks, timelineView],
  )

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const scroller = ganttShellRef.current?.querySelector('.roadmap-gantt')

      if (!scroller) return

      const todayOffset = calculateDateOffset(new Date(), boardStartDate, timelineView)

      scroller.scrollTo({
        left: Math.max(todayOffset - 240, 0),
        behavior: 'auto',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [boardStartDate, ganttKey, timelineView])

  const handleTodayClick = () => {
    setGanttKey((current) => current + 1)
  }

  if (isLoadingTimeline && !timelineData.tasks.length) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6">
        <Card className={octomLoadingCardClass}>Loading timeline view...</Card>
      </div>
    )
  }

  if (timelineError && !timelineData.tasks.length) {
    return (
      <main className="flex min-h-[420px] items-center">
        <EmptyStatePanel
          eyebrow="Timeline data"
          title="Unable to load timeline"
          description={timelineError}
          primaryActionLabel="Refresh view"
          onPrimaryAction={() => window.location.reload()}
        />
      </main>
    )
  }

  if (!timelineData.tasks.length) {
    return (
      <main className="flex min-h-[420px] items-center">
        <EmptyStatePanel
          eyebrow="Timeline data"
          title="No timeline tasks available"
          description="This workspace does not have timeline data yet, and the page is no longer falling back to mock tasks."
        />
      </main>
    )
  }

  return (
    <div className="space-y-6">
      <Card className={`space-y-5 ${octomCardClass}`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Roadmap view</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Timeline and delivery pacing
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Track work across a horizontal timeline with task bars, assignees, and progress at a glance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={timelineView} onValueChange={setTimelineView}>
              <SelectTrigger className={`min-w-[140px] ${octomSelectTriggerClass}`}>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(timelineViewOptions).map(([value, option]) => (
                  <SelectItem key={value} value={value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="secondary"
              onClick={handleTodayClick}
              className={`h-12 ${octomSecondaryButtonClass}`}
            >
              <CalendarDays className="h-4 w-4" />
              Today
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <label className="flex w-full items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-3 text-slate-400 ring-1 ring-slate-200 transition focus-within:ring-[#5051F9] xl:max-w-md">
            <Search className="h-4 w-4" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search timeline tasks..."
              className={octomInlineInputClass}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={activeMemberId} onValueChange={setActiveMemberId}>
              <SelectTrigger className={`min-w-[200px] ${octomSelectTriggerClass}`}>
                <SelectValue placeholder="Filter by member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All members</SelectItem>
                {timelineData.members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              {filteredTasks.length} tasks
            </Badge>
          </div>
        </div>
      </Card>

      <Card className={`overflow-hidden ${octomCardClass}`}>
        {features.length ? (
          <div ref={ganttShellRef} className="h-[640px]">
            <GanttProvider
              key={`${timelineView}-${ganttKey}`}
              range={timelineViewOptions[timelineView].range}
              className="roadmap-gantt rounded-[28px] bg-white"
            >
              <GanttSidebar className="border-slate-200/70 bg-white/95">
                <GanttSidebarGroup name="Tasks" className="space-y-0">
                  {features.map((feature) => (
                    <GanttSidebarItem
                      key={feature.id}
                      feature={feature}
                      className="border-slate-200/60 hover:bg-slate-50"
                    />
                  ))}
                </GanttSidebarGroup>
              </GanttSidebar>

              <GanttTimeline className="bg-[#F8F9FB]">
                <GanttHeader className="bg-white" />

                <GanttFeatureList className="space-y-0">
                  <GanttFeatureListGroup>
                    {features.map((feature) => (
                      <GanttFeatureRow key={feature.id} features={[feature]} className="">
                        {(featureItem) => (
                          <HoverCard openDelay={120} closeDelay={80}>
                            <HoverCardTrigger asChild>
                              <div
                                className="-m-2 flex h-[calc(100%+1rem)] w-[calc(100%+1rem)] items-center overflow-hidden px-4 text-white"
                                style={{ backgroundColor: featureItem.task.color }}
                                data-left={Math.round(featureItem.metrics.left)}
                                data-width={Math.round(featureItem.metrics.width)}
                              >
                                <div className="flex w-full items-center justify-between gap-3">
                                  <span className="truncate text-xs font-semibold">
                                    {featureItem.task.title}
                                  </span>
                                  <span className="shrink-0 text-[11px] font-medium text-white/80">
                                    {featureItem.task.progress}%
                                  </span>
                                </div>
                              </div>
                            </HoverCardTrigger>

                            <HoverCardContent className="w-72 rounded-[20px] border-0 bg-white p-4 shadow-xl ring-1 ring-slate-200/70">
                              <p className="text-sm font-semibold text-slate-900">
                                {featureItem.task.title}
                              </p>
                              <div className="mt-4 flex items-center gap-3">
                                <Avatar
                                  className={`${octomAvatarBaseClass} h-10 w-10 rounded-[16px]`}
                                  style={{ backgroundColor: featureItem.task.assignee.color }}
                                >
                                  <AvatarFallback
                                    className={octomAvatarFallbackClass}
                                    style={{ backgroundColor: featureItem.task.assignee.color }}
                                  >
                                    {featureItem.task.assignee.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">
                                    {featureItem.task.assignee.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {featureItem.task.assignee.role}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                <span>
                                  {format(featureItem.startAt, 'MMM d')} -{' '}
                                  {format(featureItem.endAt, 'MMM d')}
                                </span>
                                <span>{featureItem.task.progress}% complete</span>
                              </div>
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${featureItem.task.progress}%`,
                                    backgroundColor: featureItem.task.color,
                                  }}
                                />
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )}
                      </GanttFeatureRow>
                    ))}
                  </GanttFeatureListGroup>
                </GanttFeatureList>

                <GanttToday className="bg-[#5051F9] text-white" />
              </GanttTimeline>
            </GanttProvider>
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center">
            <Card className={octomLoadingCardClass}>No tasks match the current timeline filters.</Card>
          </div>
        )}
      </Card>
    </div>
  )
}
