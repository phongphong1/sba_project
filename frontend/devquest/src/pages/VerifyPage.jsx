import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, MailCheck } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from '@/components/common/BrandLogo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthActions } from '@/hooks/useAuthActions'

const resolveMessage = (payload, fallbackMessage) =>
  payload?.message ?? payload?.data?.message ?? fallbackMessage

export default function VerifyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const hasVerifiedRef = useRef(false)
  const [statusMessage, setStatusMessage] = useState('Verifying your account...')
  const { handleVerifyEmail } = useAuthActions()

  useEffect(() => {
    if (hasVerifiedRef.current) {
      return
    }

    hasVerifiedRef.current = true

    if (!token) {
      navigate('/login', {
        replace: true,
        state: {
          authNotice: {
            type: 'error',
            message: 'Verification token is missing or invalid.',
          },
        },
      })
      return
    }

    const verifyAccount = async () => {
      try {
        const result = await handleVerifyEmail(token)
        const message = resolveMessage(result?.data, 'Your email has been verified successfully.')

        setStatusMessage(message)

        navigate('/login', {
          replace: true,
          state: {
            authNotice: {
              type: 'success',
              message,
            },
          },
        })
      } catch (error) {
        const message = error?.response?.data?.message ?? 'Unable to verify your email. Please try again.'

        setStatusMessage(message)

        navigate('/login', {
          replace: true,
          state: {
            authNotice: {
              type: 'error',
              message,
            },
          },
        })
      }
    }

    verifyAccount()
  }, [handleVerifyEmail, navigate, token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4 py-6 text-slate-900 md:px-6">
      <div className="w-full max-w-[560px]">
        <div className="mb-6 flex justify-center">
          <BrandLogo iconClassName="h-9 w-8" textClassName="text-sm md:text-base" />
        </div>

        <Card className="rounded-[24px] border-none bg-white shadow-sm ring-1 ring-slate-200/70">
          <CardHeader className="px-6 pt-6 text-center sm:px-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-indigo-50 text-[#5051F9]">
              <MailCheck className="h-10 w-10" />
            </div>
            <CardTitle className="mt-4 text-3xl font-bold text-slate-900">Verifying your email</CardTitle>
            <CardDescription className="text-sm leading-7 text-slate-600">
              We are validating your confirmation link and will send you back to login in a moment.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-7 sm:px-8">
            <div className="flex items-center justify-center gap-3 rounded-[18px] bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600">
              <LoaderCircle className="h-4 w-4 animate-spin text-[#5051F9]" />
              <span>{statusMessage}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
