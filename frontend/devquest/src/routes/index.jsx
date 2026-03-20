import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import BaseLayout from '@/layouts/BaseLayout'
import AuthPage from '@/pages/AuthPage'
import DashboardPage from '@/pages/DashboardPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import LandingPage from '@/pages/LandingPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import { Card } from '@/components/ui/card'
import { octomLoadingCardClass } from '@/constants/uiStyles'

const TasksPage = lazy(() => import('@/pages/TasksPage'))
const TimelinePage = lazy(() => import('@/pages/TimelinePage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const MessagesPage = lazy(() => import('@/pages/MessagesPage'))

const placeholderPages = [
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<BaseLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
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
          <Route
            path="/timeline"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-[320px] items-center justify-center px-6">
                    <Card className={octomLoadingCardClass}>Loading timeline view...</Card>
                  </div>
                }
              >
                <TimelinePage />
              </Suspense>
            }
          />
          <Route
            path="/messages"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-[320px] items-center justify-center px-6">
                    <Card className={octomLoadingCardClass}>Loading messages...</Card>
                  </div>
                }
              >
                <MessagesPage />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense
                fallback={
                  <div className="flex min-h-[320px] items-center justify-center px-6">
                    <Card className={octomLoadingCardClass}>Loading profile...</Card>
                  </div>
                }
              >
                <ProfilePage />
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

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
