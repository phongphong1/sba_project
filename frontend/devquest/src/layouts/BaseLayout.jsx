import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import HeaderBar from '@/components/dashboard/HeaderBar'
import Sidebar from '@/components/dashboard/Sidebar'
import { getPageMeta } from '@/constants/pageMeta'
import { Card } from '@/components/ui/card'
import { octomLoadingCardClass } from '@/constants/uiStyles'
import { useWorkspaceShell } from '@/contexts/WorkspaceShellContext'

export default function BaseLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { workspaceId: routeWorkspaceId, boardId: routeBoardId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const {
    workspaces,
    preferredWorkspaceId,
    setPreferredWorkspaceId,
    setPreferredBoard,
    getPreferredBoardId,
    getWorkspace,
    isLoadingWorkspaces,
  } = useWorkspaceShell()

  const currentMeta = useMemo(() => {
    return getPageMeta(location.pathname)
  }, [location.pathname])

  const activeWorkspaceId =
    (routeWorkspaceId && getWorkspace(routeWorkspaceId)?.id) ?? preferredWorkspaceId ?? workspaces[0]?.id ?? null
  const currentWorkspace = activeWorkspaceId ? getWorkspace(activeWorkspaceId) : null
  const hasInvalidWorkspaceRoute =
    Boolean(routeWorkspaceId) &&
    !isLoadingWorkspaces &&
    !getWorkspace(routeWorkspaceId) &&
    Boolean(activeWorkspaceId)

  useEffect(() => {
    if (routeWorkspaceId && getWorkspace(routeWorkspaceId)) {
      setPreferredWorkspaceId(routeWorkspaceId)
    }
  }, [getWorkspace, routeWorkspaceId, setPreferredWorkspaceId])

  useEffect(() => {
    if (routeWorkspaceId && routeBoardId) {
      setPreferredBoard(routeWorkspaceId, routeBoardId)
    }
  }, [routeBoardId, routeWorkspaceId, setPreferredBoard])

  const handleWorkspaceSelect = (nextWorkspaceId) => {
    if (!nextWorkspaceId) return

    setPreferredWorkspaceId(nextWorkspaceId)

    if (location.pathname.includes('/boards/')) {
      const nextBoardId = getPreferredBoardId(nextWorkspaceId)
      navigate(nextBoardId ? `/w/${nextWorkspaceId}/boards/${nextBoardId}` : `/w/${nextWorkspaceId}/boards`)
      return
    }

    if (location.pathname.endsWith('/boards')) {
      navigate(`/w/${nextWorkspaceId}/boards`)
      return
    }

    if (location.pathname.includes('/timeline')) {
      navigate(`/w/${nextWorkspaceId}/timeline`)
      return
    }

    if (location.pathname.includes('/messages')) {
      navigate(`/w/${nextWorkspaceId}/messages`)
      return
    }

    if (location.pathname.includes('/settings')) {
      navigate(`/w/${nextWorkspaceId}/settings`)
      return
    }

    navigate(`/w/${nextWorkspaceId}/dashboard`)
  }

  if (isLoadingWorkspaces && !currentWorkspace && !activeWorkspaceId) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-4 text-slate-900 md:p-6 xl:p-8">
        <div className="flex min-h-[320px] items-center justify-center px-6">
          <Card className={octomLoadingCardClass}>Loading workspace shell...</Card>
        </div>
      </div>
    )
  }

  if (hasInvalidWorkspaceRoute) {
    return (
      <Navigate
        to={location.pathname.replace(`/w/${routeWorkspaceId}`, `/w/${activeWorkspaceId}`)}
        replace
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 text-slate-900 md:p-6 xl:p-8">
      <div className="mx-auto grid max-w-[1700px] gap-6 xl:grid-cols-[104px_minmax(0,1fr)] xl:items-start">
        <Sidebar />

        <div className="min-w-0 space-y-6">
          <HeaderBar
            eyebrow={currentMeta.eyebrow}
            title={currentMeta.title}
            description={currentMeta.description}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSearch={currentMeta.showSearch}
            workspaces={workspaces}
            activeWorkspaceId={currentWorkspace?.id ?? null}
            activeBoardName=""
            onWorkspaceSelect={handleWorkspaceSelect}
          />

          <Outlet
            context={{
              searchQuery,
              setSearchQuery,
              currentWorkspace,
              currentBoard: null,
            }}
          />
        </div>
      </div>
    </div>
  )
}
