import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Mail, MailOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import BrandLogo from '@/components/common/BrandLogo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usePasswordRecoveryActions } from '@/hooks/usePasswordRecoveryActions'

const requestSchema = z.object({
  email: z.email('Please enter a valid email address.'),
})

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

const panelMotion = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.22, ease: 'easeIn' } },
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const initialView = token ? 'reset' : 'request'
  const [view, setView] = useState(initialView)
  const [emailSentTo, setEmailSentTo] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { handleSendMagicLink, handleResetPassword } = usePasswordRecoveryActions()

  useEffect(() => {
    setView(token ? 'reset' : 'request')
    setResetSuccess(false)
    setSubmitError('')
  }, [token])

  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  })

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  })

  const cardTitle = useMemo(() => {
    if (view === 'check-email') return 'Check your email'
    if (view === 'reset') return resetSuccess ? 'Password updated' : 'Create a new password'
    return 'Forgot your password?'
  }, [resetSuccess, view])

  const cardDescription = useMemo(() => {
    if (view === 'check-email') {
      return 'We sent a secure magic link to your inbox. Open it to continue resetting your password.'
    }

    if (view === 'reset') {
      return resetSuccess
        ? 'Your password has been updated successfully. You can continue to your workspace.'
        : 'Set a fresh password after verifying your reset token from the magic link.'
    }

    return 'Enter your email address and we will send you a magic link to securely reset your password.'
  }, [resetSuccess, view])

  const onSendMagicLink = async (values) => {
    setSubmitError('')

    try {
      await handleSendMagicLink(values)
      setEmailSentTo(values.email)
      setView('check-email')
    } catch (error) {
      setSubmitError(error?.response?.data?.message ?? 'Unable to send magic link right now.')
    }
  }

  const onResetPassword = async (values) => {
    setSubmitError('')

    try {
      await handleResetPassword({
        token,
        password: values.password,
        confirm_password: values.confirmPassword,
      })

      setResetSuccess(true)
    } catch (error) {
      setSubmitError(error?.response?.data?.message ?? 'Unable to update your password right now.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4 py-6 text-slate-900 md:px-6">
      <div className="w-full max-w-[560px]">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/">
            <BrandLogo iconClassName="h-9 w-8" textClassName="text-sm md:text-base" />
          </Link>
          <Button asChild variant="ghost" className="rounded-[18px] text-slate-600 hover:bg-white">
            <Link to="/login">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>

        <Card className="rounded-[24px] border-none bg-white shadow-sm ring-1 ring-slate-200/70">
          <CardHeader className="px-6 pt-6 sm:px-8">
            <CardTitle className="text-3xl font-bold text-slate-900">{cardTitle}</CardTitle>
            <CardDescription className="text-sm leading-7 text-slate-600">
              {cardDescription}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-7 sm:px-8">
            <AnimatePresence mode="wait">
              {view === 'request' ? (
                <motion.div key="request" {...panelMotion}>
                  <Form {...requestForm}>
                    <form
                      onSubmit={requestForm.handleSubmit(onSendMagicLink)}
                      className="space-y-5"
                    >
                      <FormField
                        control={requestForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="you@company.com"
                                  className="h-14 rounded-[20px] border-none bg-slate-50 pl-14 pr-5 text-sm text-slate-700 shadow-none focus-visible:ring-2 focus-visible:ring-[#5051F9]"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              We will send a secure sign-in link to this inbox.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {submitError ? (
                        <div className="rounded-[18px] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-500">
                          {submitError}
                        </div>
                      ) : null}

                      <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                        <Button
                          type="submit"
                          disabled={requestForm.formState.isSubmitting}
                          className="h-14 w-full rounded-[20px] bg-[#5051F9] text-base font-semibold text-white shadow-lg shadow-indigo-200/70 hover:bg-[#4344dd]"
                        >
                          Send Magic Link
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </motion.div>
              ) : null}

              {view === 'check-email' ? (
                <motion.div key="check-email" {...panelMotion} className="text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0], scale: [1, 1.04, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-indigo-50 text-[#5051F9]"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <MailOpen className="h-11 w-11" />
                    </motion.div>
                  </motion.div>

                  <div className="mt-6 rounded-[20px] bg-slate-50 px-5 py-4 text-left">
                    <p className="text-sm font-semibold text-slate-900">Magic link sent to</p>
                    <p className="mt-1 text-sm text-slate-600">{emailSentTo}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                      type="button"
                      onClick={() => setView('request')}
                      variant="ghost"
                      className="rounded-[18px] text-slate-600 hover:bg-slate-100"
                    >
                      Use another email
                    </Button>
                    <Button asChild className="rounded-[18px] bg-[#5051F9] text-white hover:bg-[#4344dd]">
                      <Link to="/login">Back to Login</Link>
                    </Button>
                  </div>
                </motion.div>
              ) : null}

              {view === 'reset' ? (
                <motion.div key="reset" {...panelMotion}>
                  {!resetSuccess ? (
                    <Form {...resetForm}>
                      <form
                        onSubmit={resetForm.handleSubmit(onResetPassword)}
                        className="space-y-5"
                      >
                        <FormField
                          control={resetForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Create a new password"
                                    className="h-14 rounded-[20px] border-none bg-slate-50 pl-14 pr-5 text-sm text-slate-700 shadow-none focus-visible:ring-2 focus-visible:ring-[#5051F9]"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resetForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="Confirm your new password"
                                    className="h-14 rounded-[20px] border-none bg-slate-50 pl-14 pr-5 text-sm text-slate-700 shadow-none focus-visible:ring-2 focus-visible:ring-[#5051F9]"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {!token ? (
                          <div className="rounded-[18px] bg-amber-50 px-4 py-3 text-sm font-medium text-amber-600">
                            Missing or invalid reset token. Please request a new magic link.
                          </div>
                        ) : null}

                        {submitError ? (
                          <div className="rounded-[18px] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-500">
                            {submitError}
                          </div>
                        ) : null}

                        <motion.div whileHover={{ scale: 1.02, y: -2 }}>
                          <Button
                            type="submit"
                            disabled={!token || resetForm.formState.isSubmitting}
                            className="h-14 w-full rounded-[20px] bg-[#5051F9] text-base font-semibold text-white shadow-lg shadow-indigo-200/70 hover:bg-[#4344dd]"
                          >
                            Update Password
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </form>
                    </Form>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-emerald-50 text-emerald-500">
                        <CheckCircle2 className="h-11 w-11" />
                      </div>
                      <p className="mt-6 text-sm leading-7 text-slate-600">
                        Your password is ready. Continue to the workspace and log in with your new credentials.
                      </p>
                      <div className="mt-6 flex justify-center">
                        <Button
                          type="button"
                          onClick={() => navigate('/dashboard')}
                          className="h-14 rounded-[20px] bg-[#5051F9] px-6 text-base font-semibold text-white shadow-lg shadow-indigo-200/70 hover:bg-[#4344dd]"
                        >
                          Go to Dashboard
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
