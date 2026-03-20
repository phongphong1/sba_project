import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BaseLayout from '@/layouts/BaseLayout'
import DashboardPage from '@/pages/DashboardPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import { Card } from '@/components/ui/card'
import { octomLoadingCardClass } from '@/constants/uiStyles'

const TasksPage = lazy(() => import('@/pages/TasksPage'))

const placeholderPages = [
  {
    path: '/timeline',
    title: 'Timeline',
    description: 'Timeline route is ready for milestones, gantt views, and sprint roadmaps.',
  },
  {
    path: '/messages',
    title: 'Messages',
    description: 'Messages route is ready for chat, inbox, and activity threads.',
  },
  {
    path: '/settings',
    title: 'Settings',
    description: 'Settings route is ready for workspace preferences and profile controls.',
  },
]

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/tasks"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-[320px] items-center justify-center px-6">
                    <Card className={octomLoadingCardClass}>Loading tasks page...</Card>
                  </div>
                }
              >
                <TasksPage />
              </Suspense>
            }
          />
          <Route path="/projects" element={<Navigate to="/tasks" replace />} />

          {placeholderPages.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<PlaceholderPage title={page.title} description={page.description} />}
            />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
