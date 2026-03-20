import { lazy, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import {
  Drawer,
  DrawerContent,
} from '@/components/ui/drawer'
import { octomDrawerContentClass, octomLoadingCardClass } from '@/constants/uiStyles'

const TaskDetailDrawerContent = lazy(() => import('@/components/tasks/TaskDetailDrawerContent'))

export default function TaskDetailModal({ task, onClose }) {
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
            <TaskDetailDrawerContent task={task} />
          </Suspense>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
