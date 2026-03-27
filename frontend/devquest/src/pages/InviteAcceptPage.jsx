import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import workspaceApi from '@/api/workspaceApi'
import { octomPrimaryButtonClass } from '@/constants/uiStyles'

export default function InviteAcceptPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('loading') // loading | success | error | requires_login
  const [errorMessage, setErrorMessage] = useState('')
  const [workspaceId, setWorkspaceId] = useState(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('No invitation token found in the URL.')
      return
    }

    workspaceApi.acceptInvitation(token)
      .then((res) => {
        const data = res.data
        // If backend returns a new JWT, store it (user joined)
        if (data.jwtToken) {
          localStorage.setItem('token', data.jwtToken)
        }
        setWorkspaceId(data.workspaceId)
        setStatus('success')
      })
      .catch((err) => {
        const statusCode = err?.response?.status
        if (statusCode === 401 || statusCode === 403) {
          // Not logged in — redirect to login then come back
          const returnUrl = encodeURIComponent(window.location.href)
          navigate(`/login?redirect=${returnUrl}`)
        } else {
          setStatus('error')
          setErrorMessage(
            err?.response?.data?.message ?? 'The invitation link is invalid or has expired.'
          )
        }
      })
  }, [token, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4">
      <Card className="w-full max-w-md rounded-[24px] border-0 bg-white p-10 shadow-xl text-center">
        {/* Logo */}
        <p className="text-2xl font-bold tracking-tight text-[#5051F9] mb-8">DEVQUEST.</p>

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#5051F9]" />
            <p className="text-slate-500 text-sm">Accepting your invitation...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <h1 className="text-xl font-semibold text-slate-900">You're in!</h1>
            <p className="text-sm text-slate-500">You've been added to the workspace. Start collaborating now.</p>
            <Button
              type="button"
              className={`mt-4 w-full ${octomPrimaryButtonClass}`}
              onClick={() => navigate(workspaceId ? `/w/${workspaceId}/dashboard` : '/dashboard')}
            >
              Go to workspace
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-12 w-12 text-red-400" />
            <h1 className="text-xl font-semibold text-slate-900">Invitation unavailable</h1>
            <p className="text-sm text-slate-500">{errorMessage}</p>
            <Button
              type="button"
              className={`mt-4 w-full ${octomPrimaryButtonClass}`}
              onClick={() => navigate('/')}
            >
              Back to home
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
