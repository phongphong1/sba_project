import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Github, Lock, Mail, Sparkles, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import BrandLogo from '@/components/common/BrandLogo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import { useAuthActions } from '@/hooks/useAuthActions'

const loginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

const signUpSchema = z
  .object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
    email: z.email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

const floatingCards = [
  { id: 'todo', title: 'Product backlog', detail: '14 tasks aligned for sprint launch', color: '#22C55E', x: 18, y: 0 },
  { id: 'progress', title: 'Realtime insights', detail: 'Velocity up 18% across squads', color: '#22C55E', x: 64, y: 56 },
  { id: 'collab', title: 'Team sync', detail: '4 teammates active in workspace', color: '#F97316', x: 8, y: 132 },
]

const resolveAuthNotice = (state) => {
  if (state?.authNotice?.message) {
    return state.authNotice
  }

  if (state?.signupSuccess) {
    return {
      type: 'success',
      message: state.signupSuccess,
    }
  }

  return null
}

const resolveMessage = (payload, fallbackMessage) =>
  payload?.message ?? payload?.data?.message ?? fallbackMessage

function SocialButton({ children }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-14 rounded-[20px] border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-none hover:bg-slate-50"
    >
      {children}
    </Button>
  )
}

function AuthIllustration() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-[32px] border border-white/15 bg-gradient-to-br from-[#4344dd] via-[#5051F9] to-[#7C3AED] p-8 text-white shadow-2xl shadow-indigo-400/30">
      <div className="max-w-md">
        <BrandLogo iconClassName="h-10 w-9" textClassName="text-base text-white" />
        <h2 className="mt-10 text-4xl font-extrabold leading-tight">
          Turn ambitious product plans into calm execution.
        </h2>
        <p className="mt-5 text-base leading-8 text-white/80">
          Build momentum with a workspace designed for clear priorities, analytics, and collaboration.
        </p>
      </div>

      <div className="relative mt-12 h-[320px]">
        {floatingCards.map((card, index) => (
          <motion.div
            key={card.id}
            animate={{ y: [card.y, card.y - 12, card.y] }}
            transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[260px] rounded-[28px] border border-white/20 bg-white/12 p-5 shadow-xl backdrop-blur-md"
            style={{ left: `${card.x}%`, top: card.y }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-[18px] text-sm font-bold text-white"
              style={{ backgroundColor: card.color }}
            >
              {index + 1}
            </div>
            <p className="mt-4 text-lg font-semibold">{card.title}</p>
            <p className="mt-2 text-sm leading-6 text-white/75">{card.detail}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${68 + index * 10}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AuthForm({ mode, onSwitch, onSuccess }) {
  const { handleLogin, handleSignUp } = useAuthActions()
  const [shakeKey, setShakeKey] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const isSignUp = mode === 'signup'

  const form = useForm({
    resolver: zodResolver(isSignUp ? signUpSchema : loginSchema),
    defaultValues: isSignUp
      ? { fullName: '', email: '', password: '', confirmPassword: '' }
      : { email: '', password: '' },
    mode: 'onChange',
  })

  const onInvalid = () => {
    setShakeKey((current) => current + 1)
  }

  const onSubmit = async (values) => {
    setSubmitError('')

    try {
      if (isSignUp) {
        const result = await handleSignUp(values)
        onSuccess({ mode: 'signup', values, result })
      } else {
        const result = await handleLogin(values)
        onSuccess({ mode: 'login', values, result })
      }
    } catch (error) {
      setSubmitError(error?.response?.data?.message ?? 'Something went wrong. Please try again.')
      setShakeKey((current) => current + 1)
    }
  }

  return (
    <Form {...form}>
      <motion.div
        key={`${mode}-${shakeKey}`}
        initial={{ opacity: 0, x: mode === 'signup' ? 24 : -24 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.35, ease: 'easeOut' },
        }}
        exit={{
          opacity: 0,
          x: mode === 'signup' ? -24 : 24,
          transition: { duration: 0.25, ease: 'easeIn' },
        }}
        whileInView={{}}
      >
        <motion.div
          animate={{
            x: submitError || Object.keys(form.formState.errors).length ? [0, -8, 8, -6, 6, 0] : 0,
          }}
          transition={{ duration: 0.35 }}
        >
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-5">
            {isSignUp ? (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          {...field}
                          placeholder="Enter your full name"
                          className="h-14 rounded-[20px] border-none bg-slate-50 pl-14 pr-5 text-sm text-slate-700 shadow-none focus-visible:ring-2 focus-visible:ring-[#5051F9]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <FormField
              control={form.control}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="h-14 rounded-[20px] border-none bg-slate-50 pl-14 pr-5 text-sm text-slate-700 shadow-none focus-visible:ring-2 focus-visible:ring-[#5051F9]"
                      />
                    </div>
                  </FormControl>
                  {!isSignUp ? (
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        to="/forgot-password"
                        className="text-sm font-semibold text-[#5051F9] transition hover:text-[#4344dd]"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSignUp ? (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm your password"
                          className="h-14 rounded-[20px] border-none bg-slate-50 pl-14 pr-5 text-sm text-slate-700 shadow-none focus-visible:ring-2 focus-visible:ring-[#5051F9]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {submitError ? (
              <div className="rounded-[18px] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-500">
                {submitError}
              </div>
            ) : null}

            <motion.div whileHover={{ scale: 1.02, y: -2 }}>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-14 w-full rounded-[20px] bg-[#5051F9] text-base font-semibold text-white shadow-lg shadow-indigo-200/70 hover:bg-[#4344dd]"
              >
                {isSignUp ? 'Create Account' : 'Login'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              or continue with
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SocialButton>
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.8-2.7-5.8-6s2.6-6 5.8-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.5 14.5 2.6 12 2.6 6.9 2.6 2.8 6.8 2.8 12s4.1 9.4 9.2 9.4c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.1-1.5H12Z" />
            </svg>
            Google
          </SocialButton>
          <SocialButton>
            <Github className="h-4 w-4" />
            GitHub
          </SocialButton>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-[#5051F9] transition hover:text-[#4344dd]"
        >
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </div>
    </Form>
  )
}

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isSignUp = location.pathname === '/signup'
  const mode = isSignUp ? 'signup' : 'login'
  const [authNotice, setAuthNotice] = useState(resolveAuthNotice(location.state))

  useEffect(() => {
    const nextAuthNotice = resolveAuthNotice(location.state)

    if (nextAuthNotice) {
      setAuthNotice(nextAuthNotice)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.pathname, location.state, navigate])

  const handleSwitchMode = () => {
    navigate(isSignUp ? '/login' : '/signup')
  }

  const handleAuthSuccess = ({ mode: authMode, values, result }) => {
    if (authMode === 'signup') {
      const message = resolveMessage(result?.data, `We've sent a confirmation email to ${values.email}.`)
      navigate('/login', {
        state: {
          authNotice: {
            type: 'success',
            message,
          },
        },
      })
      return
    }

    setAuthNotice(null)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-4 text-slate-900 md:px-6 xl:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1560px] overflow-hidden rounded-[36px] bg-white shadow-2xl shadow-slate-200/60 ring-1 ring-slate-200/70 lg:grid-cols-2">
        <div className="hidden p-6 lg:block">
          <AuthIllustration />
        </div>

        <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[520px]">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/">
                <BrandLogo iconClassName="h-9 w-8" textClassName="text-sm md:text-base" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-semibold text-[#5051F9]">
                <Sparkles className="h-4 w-4" />
                DevQuest Auth
              </div>
            </div>

            <Card className="rounded-[24px] border-0 bg-white px-6 py-7 shadow-sm ring-1 ring-slate-200/70 sm:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                      {isSignUp ? 'Create your workspace account' : 'Welcome back to DevQuest'}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {isSignUp
                        ? 'Start planning smarter with a clean workspace built for shipping faster.'
                        : 'Sign in to continue working across tasks, roadmap, and collaboration flows.'}
                    </p>
                  </div>

                  {!isSignUp && authNotice?.message ? (
                    <div
                      className={`mt-5 rounded-[18px] px-4 py-3 text-sm font-medium ${
                        authNotice.type === 'error'
                          ? 'bg-rose-50 text-rose-500'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {authNotice.message}
                    </div>
                  ) : null}

                  <div className="mt-8">
                    <AuthForm mode={mode} onSwitch={handleSwitchMode} onSuccess={handleAuthSuccess} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
