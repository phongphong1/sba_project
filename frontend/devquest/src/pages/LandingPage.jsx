import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Facebook, Instagram, Linkedin, Play, Sparkles } from 'lucide-react'
import { motion, useAnimationControls, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import BrandLogo from '@/components/common/BrandLogo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FEATURES, FOOTER_LINKS, HERO_PREVIEW_CARDS, LANDING_STATS } from '@/data/mockLanding'

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function RevealSection({ className = '', children, ...props }) {
  return (
    <motion.section
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      {...props}
    >
      {children}
    </motion.section>
  )
}

function AnimatedStat({ value, suffix, label }) {
  const [displayValue, setDisplayValue] = useState(0)
  const controls = useAnimationControls()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const duration = 1100
    const startedAt = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = Math.round(value * eased)
      start = nextValue
      setDisplayValue(nextValue)

      if (progress < 1) {
        window.requestAnimationFrame(tick)
      }
    }

    controls.start('visible')
    window.requestAnimationFrame(tick)

    return () => {
      start = value
      void start
    }
  }, [controls, isInView, value])

  const formattedValue = useMemo(() => {
    if (value >= 1000000) {
      return `${Math.round(displayValue / 100000) / 10}M`
    }

    if (value >= 1000) {
      return `${Math.round(displayValue / 100) / 10}k`
    }

    return displayValue.toString()
  }, [displayValue, value])

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={controls}
      className="rounded-[24px] bg-white px-6 py-6 shadow-lg shadow-slate-200/60 ring-1 ring-slate-200/70"
    >
      <p className="text-4xl font-extrabold tracking-tight text-slate-900">
        {formattedValue}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
    </motion.div>
  )
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-[#5051F9]/25 via-white to-sky-200/40 blur-3xl" />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-2xl shadow-indigo-200/50 backdrop-blur-md"
      >
        <div className="rounded-[28px] bg-[#F6F7FB] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5051F9]">
                Workspace Pulse
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">Launch sprint board</h3>
            </div>
            <div className="rounded-full bg-[#5051F9]/10 px-3 py-1 text-xs font-semibold text-[#5051F9]">
              Live
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {HERO_PREVIEW_CARDS.map((card, index) => {
              const Icon = card.icon

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.12, duration: 0.5 }}
                  className="rounded-[24px] bg-white p-4 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/70"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-[18px] text-white"
                        style={{ backgroundColor: card.accent }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                        <p className="mt-1 text-xs text-slate-500">Motion-rich workflow preview</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{card.progress}%</div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${card.progress}%`, backgroundColor: card.accent }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute left-[-180px] top-[-160px] h-[420px] w-[420px] rounded-full bg-[#5051F9]/12 blur-3xl" />
        <div className="absolute right-[-120px] top-[80px] h-[360px] w-[360px] rounded-full bg-sky-200/45 blur-3xl" />

        <div className="mx-auto max-w-[1380px] px-4 py-4 md:px-6 xl:px-8">
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="sticky top-4 z-40"
          >
            <div className="flex items-center justify-between rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 shadow-lg shadow-slate-200/40 backdrop-blur-md">
              <Link to="/">
                <BrandLogo iconClassName="h-9 w-8" textClassName="text-sm md:text-base" />
              </Link>

              <nav className="hidden items-center gap-8 md:flex">
                {FOOTER_LINKS.map((item) => (
                  <a key={item.id} href={item.href} className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="rounded-[18px] px-4 text-slate-600 hover:bg-white">
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-[18px] bg-[#5051F9] px-5 text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4344dd]"
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </motion.header>

          <RevealSection className="grid gap-10 pb-20 pt-16 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-center lg:pt-24">
            <motion.div variants={itemVariants} className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5051F9] shadow-sm ring-1 ring-slate-200/70">
                <Sparkles className="h-4 w-4" />
                Modern workspace system for fast-moving teams
              </div>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
                Plan, ship, and scale every sprint with DevQuest.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                A beautifully structured workspace for kanban planning, timeline visibility, analytics, and team collaboration in one elegant flow.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <motion.div whileHover={{ y: -5 }}>
                  <Button
                    asChild
                    className="h-14 rounded-[20px] bg-gradient-to-r from-[#6366F1] via-[#5051F9] to-[#7C3AED] px-6 text-base font-semibold text-white shadow-xl shadow-indigo-200/70"
                  >
                    <Link to="/signup">
                      Get Started for Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <Button
                  variant="outline"
                  className="h-14 rounded-[20px] border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 shadow-sm"
                >
                  <Play className="h-4 w-4" />
                  Watch Preview
                </Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <HeroPreview />
            </motion.div>
          </RevealSection>

          <RevealSection id="features" className="pb-20">
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5051F9]">Features</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                Everything your team needs to move with clarity
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                From smooth planning boards to performance insights and instant collaboration, DevQuest keeps work flowing end-to-end.
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon

                return (
                  <motion.div key={feature.id} variants={itemVariants}>
                    <Card className="rounded-[24px] border-0 bg-white px-6 py-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/60">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#5051F9]/10 text-[#5051F9]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-6 text-2xl font-extrabold text-slate-900">{feature.title}</h3>
                      <p className="mt-3 text-base leading-7 text-slate-600">{feature.description}</p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </RevealSection>

          <RevealSection id="solutions" className="pb-20">
            <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
              {LANDING_STATS.map((stat) => (
                <AnimatedStat
                  key={stat.id}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </motion.div>
          </RevealSection>

          <RevealSection id="pricing" className="pb-20">
            <motion.div
              variants={itemVariants}
              className="rounded-[32px] bg-gradient-to-r from-[#5051F9] via-[#5B5CF6] to-[#7C3AED] px-8 py-10 text-white shadow-2xl shadow-indigo-300/50"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">Start now</p>
                  <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
                    Build a faster, calmer operating system for your team.
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-white/80">
                    Set up boards, analytics, and collaboration flows in minutes with a workspace designed to feel clear from day one.
                  </p>
                </div>

                <motion.div whileHover={{ y: -5 }}>
                  <Button
                    asChild
                    variant="secondary"
                    className="h-14 rounded-[20px] bg-white px-6 text-base font-semibold text-[#5051F9] shadow-lg hover:bg-slate-50"
                  >
                    <Link to="/signup">
                      Create free workspace
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </RevealSection>
        </div>
      </div>

      <footer className="border-t border-slate-200/70 bg-white/70">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6 xl:px-8">
          <div>
            <BrandLogo iconClassName="h-7 w-6" textClassName="text-xs sm:text-sm" />
            <p className="mt-2 text-sm text-slate-500">© 2026 DevQuest. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {FOOTER_LINKS.map((item) => (
              <a key={item.id} href={item.href} className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <a href="https://linkedin.com" className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
