import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import AuthPage from '@/pages/AuthPage'
import DashboardPage from '@/pages/DashboardPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import LandingPage from '@/pages/LandingPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import VerifyPage from '@/pages/VerifyPage'
import WorkspaceEmptyPage from '@/pages/WorkspaceEmptyPage'
import { useWorkspaceShell } from '@/contexts/WorkspaceShellContext'
import ProtectedLayout from '@/routes/ProtectedLayout'
import { Card } from '@/components/ui/card'
import { octomLoadingCardClass } from '@/constants/uiStyles'

const TasksPage = lazy(() => import('@/pages/TasksPage'))
const TimelinePage = lazy(() => import('@/pages/TimelinePage'))
const ProfilePage = lazy(() => import('@/pages/account/profile/ProfilePage'))
const MessagesPage = lazy(() => import('@/pages/MessagesPage'))

const placeholderPages = [
  {
    path: 'settings',
    title: 'Settings',
    description: 'Settings route is ready for workspace preferences and profile controls.',
  },
]

function WorkspaceRedirectFallback({ label }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6">
      <Card className={octomLoadingCardClass}>{label}</Card>
    </div>
  )
}

function RedirectToDefaultDashboard() {
  const { isLoadingWorkspaces, preferredWorkspaceId, workspaces } = useWorkspaceShell()
  const resolvedWorkspaceId = preferredWorkspaceId ?? workspaces[0]?.id ?? null

  if (isLoadingWorkspaces) {
    return <WorkspaceRedirectFallback label="Loading workspace..." />
  }

  if (!resolvedWorkspaceId) {
    return <Navigate to="/workspace-empty" replace />
  }

  return <Navigate to={`/w/${resolvedWorkspaceId}/dashboard`} replace />
}

function RedirectToDefaultBoard() {
  const { isLoadingWorkspaces, preferredWorkspaceId, workspaces, getPreferredBoardId } = useWorkspaceShell()
  const resolvedWorkspaceId = preferredWorkspaceId ?? workspaces[0]?.id ?? null

  if (isLoadingWorkspaces) {
    return <WorkspaceRedirectFallback label="Loading workspace..." />
  }

  if (!resolvedWorkspaceId) {
    return <Navigate to="/workspace-empty" replace />
  }

  const nextBoardId = getPreferredBoardId(resolvedWorkspaceId)

  return (
    <Navigate
      to={
        nextBoardId
          ? `/w/${resolvedWorkspaceId}/boards/${nextBoardId}`
          : `/w/${resolvedWorkspaceId}/boards`
      }
      replace
    />
  )
}

function RedirectToDefaultTimeline() {
  const { isLoadingWorkspaces, preferredWorkspaceId, workspaces } = useWorkspaceShell()
  const resolvedWorkspaceId = preferredWorkspaceId ?? workspaces[0]?.id ?? null

  if (isLoadingWorkspaces) {
    return <WorkspaceRedirectFallback label="Loading workspace..." />
  }

  if (!resolvedWorkspaceId) {
    return <Navigate to="/workspace-empty" replace />
  }

  return <Navigate to={`/w/${resolvedWorkspaceId}/timeline`} replace />
}

function RedirectToDefaultMessages() {
  const { isLoadingWorkspaces, preferredWorkspaceId, workspaces } = useWorkspaceShell()
  const resolvedWorkspaceId = preferredWorkspaceId ?? workspaces[0]?.id ?? null

  if (isLoadingWorkspaces) {
    return <WorkspaceRedirectFallback label="Loading workspace..." />
  }

  if (!resolvedWorkspaceId) {
    return <Navigate to="/workspace-empty" replace />
  }

  return <Navigate to={`/w/${resolvedWorkspaceId}/messages`} replace />
}

function RedirectToDefaultSettings() {
  const { isLoadingWorkspaces, preferredWorkspaceId, workspaces } = useWorkspaceShell()
  const resolvedWorkspaceId = preferredWorkspaceId ?? workspaces[0]?.id ?? null

  if (isLoadingWorkspaces) {
    return <WorkspaceRedirectFallback label="Loading workspace..." />
  }

  if (!resolvedWorkspaceId) {
    return <Navigate to="/workspace-empty" replace />
  }

  return <Navigate to={`/w/${resolvedWorkspaceId}/settings`} replace />
}

function RedirectWorkspaceIndex() {
  const { workspaceId } = useParams()

  return <Navigate to={`/w/${workspaceId}/dashboard`} replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route element={<ProtectedLayout />}>
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
          <Route path="/workspace-empty" element={<WorkspaceEmptyPage />} />
          <Route path="/dashboard" element={<RedirectToDefaultDashboard />} />
          <Route path="/tasks" element={<RedirectToDefaultBoard />} />
          <Route path="/projects" element={<RedirectToDefaultBoard />} />
          <Route path="/timeline" element={<RedirectToDefaultTimeline />} />
          <Route path="/messages" element={<RedirectToDefaultMessages />} />
          <Route path="/settings" element={<RedirectToDefaultSettings />} />

          <Route path="/w/:workspaceId">
            <Route index element={<RedirectWorkspaceIndex />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route
              path="boards"
              element={
                <Suspense
                  fallback={
                    <div className="flex min-h-[320px] items-center justify-center px-6">
                      <Card className={octomLoadingCardClass}>Loading board...</Card>
                    </div>
                  }
                >
                  <TasksPage />
                </Suspense>
              }
            />
            <Route
              path="boards/:boardId"
              element={
                <Suspense
                  fallback={
                    <div className="flex min-h-[320px] items-center justify-center px-6">
                      <Card className={octomLoadingCardClass}>Loading board...</Card>
                    </div>
                  }
                >
                  <TasksPage />
                </Suspense>
              }
            />
            <Route
              path="timeline"
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
              path="messages"
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

            {placeholderPages.map((page) => (
              <Route
                key={page.path}
                path={page.path}
                element={<PlaceholderPage title={page.title} description={page.description} />}
              />
            ))}
          </Route>

          <Route path="*" element={<RedirectToDefaultDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
