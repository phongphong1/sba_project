import { Toaster } from '@/components/ui/sonner'
import { WorkspaceShellProvider } from '@/contexts/WorkspaceShellContext'
import AppRouter from '@/routes'

export default function App() {
  return (
    <WorkspaceShellProvider>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </WorkspaceShellProvider>
  )
}
