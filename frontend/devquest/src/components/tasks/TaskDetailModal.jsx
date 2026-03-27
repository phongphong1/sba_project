import { lazy, Suspense, useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import workspaceApi from '@/api/workspaceApi'
import {
  Drawer,
  DrawerContent,
} from '@/components/ui/drawer'
import { octomDrawerContentClass, octomLoadingCardClass } from '@/constants/uiStyles'

const TaskDetailDrawerContent = lazy(() => import('@/components/tasks/TaskDetailDrawerContent'))

export default function TaskDetailModal({ task, onClose, onDeleteTask, onEditTask }) {
  const [subtasks, setSubtasks] = useState(null)
  const taskNumericId = task ? String(task.id).replace('tsk_', '') : null

  const fetchSubtasks = useCallback(async () => {
    if (!taskNumericId) return
    try {
      const data = await workspaceApi.getSubtasks(taskNumericId)
      const list = Array.isArray(data) ? data : (data?.data || [])
      setSubtasks(list.map((i) => ({ ...i, done: !!i.done })))
    } catch (err) {
      setSubtasks([])
    }
  }, [taskNumericId])

  useEffect(() => {
    if (task) {
      void fetchSubtasks()
    } else {
      setSubtasks(null)
    }
  }, [task, fetchSubtasks])

  return (
    <Drawer open={Boolean(task)} onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className={octomDrawerContentClass}>
        {task ? (
          <Suspense
            fallback={
              <Card className={octomLoadingCardClass}>
                Loading task detail...
              </Card>
            }
          >
            {subtasks === null ? (
              <Card className={octomLoadingCardClass}>
                Loading task detail...
              </Card>
            ) : (
              <TaskDetailDrawerContent
                task={task}
                subtasks={subtasks}
                onRefreshSubtasks={fetchSubtasks}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
              />
            )}
          </Suspense>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
