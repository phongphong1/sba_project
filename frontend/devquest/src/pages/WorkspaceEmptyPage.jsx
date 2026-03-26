import { useNavigate } from 'react-router-dom'
import EmptyStatePanel from '@/components/common/EmptyStatePanel'

export default function WorkspaceEmptyPage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-[420px] items-center">
      <EmptyStatePanel
        eyebrow="Workspace access"
        title="No workspace available yet"
        description="This account does not have any workspace data right now. Once the backend returns a workspace list, this screen can route you directly into the first available workspace."
        primaryActionLabel="Refresh view"
        onPrimaryAction={() => window.location.reload()}
        secondaryActionLabel="Open profile"
        onSecondaryAction={() => navigate('/profile')}
      />
    </main>
  )
}
