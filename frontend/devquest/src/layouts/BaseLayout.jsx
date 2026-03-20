import { Outlet, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import HeaderBar from '@/components/dashboard/HeaderBar'
import Sidebar from '@/components/dashboard/Sidebar'
import { pageMetaMap } from '@/constants/pageMeta'

export default function BaseLayout() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  const currentMeta = useMemo(() => {
    return pageMetaMap[location.pathname] ?? pageMetaMap['/dashboard']
  }, [location.pathname])

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
          />

          <Outlet context={{ searchQuery, setSearchQuery }} />
        </div>
      </div>
    </div>
  )
}
