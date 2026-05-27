import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BrainCircuit,
  ChevronRight,
  Compass,
  Fingerprint,
  LockKeyhole,
  Orbit,
  ScanEye,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Initialize', path: '/', id: '00' },
  { label: 'Career Vault', path: '/vault', id: '01' },
  { label: 'Resume Forge', path: '/forge', id: '02' },
  { label: 'Recruiter Sim', path: '/simulation', id: '03' },
  { label: 'Skill Gap Engine', path: '/skill-gap', id: '04' },
]

const particles = Array.from({ length: 26 }, (_, i) => ({
  x: `${(i * 37) % 98}%`,
  y: `${(i * 19 + 9) % 92}%`,
  size: i % 5 === 0 ? 3 : 1.5,
  duration: 7 + (i % 7) * 1.4,
}))

function AmbientLayer() {
  return (
    <>
      <div className="os-grid" />
      <div className="os-noise" />
      <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
        {particles.map((particle, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-ion"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              boxShadow: '0 0 10px rgba(112,247,255,.7)',
            }}
            animate={{ y: [0, -24, 5], opacity: [0.12, 0.65, 0.1] }}
            transition={{ duration: particle.duration, delay: index * 0.16, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </>
  )
}

function Shell({ children }) {
  return (
    <div className="relative min-h-screen bg-void text-white overflow-hidden">
      <AmbientLayer />
      <header className="fixed left-0 right-0 top-0 z-40 px-4 md:px-8 pt-5">
        <div className="glass mx-auto flex max-w-[1440px] items-center justify-between rounded-full px-4 py-3 md:px-6">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ion/25 bg-ion/[0.06]">
              <Fingerprint className="h-5 w-5 text-ion" strokeWidth={1.25} />
              <span className="absolute inset-[-4px] rounded-full border border-ion/10" />
            </div>
            <div>
              <div className="font-display text-sm font-medium tracking-[-0.04em] md:text-base">ResumeVault <span className="text-ion">AI</span></div>
              <div className="hidden font-mono text-[9px] uppercase tracking-[0.28em] text-white/35 sm:block">Career Intelligence OS</div>
            </div>
          </NavLink>
          <nav className="scrollbar-none hidden max-w-[62vw] items-center gap-1 overflow-x-auto lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
                    isActive ? 'bg-ion/[0.1] text-ion' : 'text-white/43 hover:text-white/80'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/vault" className="group flex items-center gap-2 rounded-full border border-ion/25 bg-ion/[0.08] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ion">
            Enter Vault
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </NavLink>
        </div>
      </header>
      <MobileNavigator />
      <main className="relative z-10 min-h-screen">{children}</main>
    </div>
  )
}

function MobileNavigator() {
  return (
    <div className="glass fixed bottom-4 left-4 right-4 z-50 flex justify-around rounded-full p-2 lg:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          aria-label={item.label}
          className={({ isActive }) =>
            `rounded-full px-3 py-2 font-mono text-[10px] tracking-[0.1em] ${isActive ? 'bg-ion/10 text-ion' : 'text-white/40'}`
          }
        >
          {item.id}
        </NavLink>
      ))}
    </div>
  )
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Label({ children }) {
  return <div className="mono-tag flex items-center gap-3"><span className="h-px w-8 bg-ion/50" />{children}</div>
}

function LandingPage() {
  return (
    <PageTransition>
      <section className="hero-aura relative flex min-h-screen items-center overflow-hidden bg-black px-5 pb-16 pt-32 text-white md:px-10 md:pt-40 lg:px-16">
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-[12%] top-[42%] h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-ultraviolet/15 blur-[120px]"
          animate={{ opacity: [0.35, 0.72, 0.35], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[1440px]">
          <div className="max-w-3xl">
            <Label>Identity kernel online / Version 4.8</Label>
            <motion.h1
              className="headline mt-8 text-[clamp(4rem,9.2vw,9.7rem)] font-semibold text-white drop-shadow-[0_0_42px_rgba(137,108,255,0.34)]"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
            >
              Your career,
              <br />
              <span className="spectral-text">alive.</span>
            </motion.h1>
            <p className="mt-7 max-w-md text-sm font-light leading-7 text-white/58 md:text-base">
              An intelligence system that turns every achievement, project and latent skill into a living digital identity recruiters can navigate.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <NavLink to="/vault" className="group flex items-center gap-8 rounded-full bg-white px-6 py-4 text-xs font-medium uppercase tracking-[0.16em] text-black">
                Initialize identity <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </NavLink>
              <NavLink to="/simulation" className="rounded-full border border-white/14 px-6 py-4 text-xs uppercase tracking-[0.16em] text-white/68">
                Run recruiter scan
              </NavLink>
            </div>
          </div>
          <CareerGraph />
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] md:mt-20 md:grid-cols-3">
            {[
              ['89.4%', 'Identity coherence', 'Signals aligned across 14 narratives'],
              ['12', 'Constellation nodes', 'Emerging skills discovered by AI'],
              ['0.84', 'Recruiter affinity', 'Product Engineering / Series B'],
            ].map(([number, name, detail]) => (
              <div key={name} className="bg-[#080a0d]/90 p-6 backdrop-blur-xl">
                <div className="font-display text-4xl tracking-[-0.07em] text-white">{number}</div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ion/75">{name}</div>
                <p className="mt-3 text-xs text-white/40">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

function CareerGraph() {
  const nodes = [
    { x: 12, y: 52, label: 'Research' },
    { x: 31, y: 27, label: 'React' },
    { x: 47, y: 57, label: 'AI Ops' },
    { x: 67, y: 24, label: 'Product' },
    { x: 87, y: 43, label: 'Lead' },
  ]
  return (
    <motion.div
      className="glass panel-edge relative mt-16 hidden h-[172px] max-w-[770px] rounded-3xl px-8 py-5 md:block"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.7 }}
    >
      <div className="mono-tag">Career signal stream</div>
      <svg className="absolute inset-x-8 bottom-9 h-[90px] w-[calc(100%_-_4rem)] overflow-visible">
        <motion.path
          d="M12 65 C100 65, 106 18, 194 18 S300 75, 382 52 S478 6, 548 14 S622 47, 690 34"
          fill="none"
          stroke="rgba(112,247,255,.34)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
      </svg>
      {nodes.map((node, index) => (
        <motion.div key={node.label} className="absolute bottom-[42px]" style={{ left: `${node.x}%`, marginBottom: `${node.y - 42}px` }}>
          <motion.div
            className="h-2.5 w-2.5 rounded-full border border-ion bg-ion/25 shadow-[0_0_16px_rgba(112,247,255,.85)]"
            animate={{ scale: [1, 1.45, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.45 }}
          />
          <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-white/34">{node.label}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

function SectionHeading({ code, title, subline }) {
  return (
    <div className="mb-10">
      <Label>{code}</Label>
      <h1 className="headline mt-6 max-w-4xl text-5xl font-medium md:text-7xl">{title}</h1>
      <p className="mt-5 max-w-xl text-sm leading-7 text-white/48">{subline}</p>
    </div>
  )
}

function VaultPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-10 lg:px-16">
        <SectionHeading
          code="01 / Career Vault"
          title={<>The encrypted shape of <span className="spectral-text">you.</span></>}
          subline="Projects, achievements and experience resolve into a verified signal field. Select a node to reveal the narrative beneath the resume."
        />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <Constellation />
          <div className="space-y-5">
            <IdentityIndex />
            <InsightFeed />
          </div>
        </div>
        <CareerTimeline />
      </div>
    </PageTransition>
  )
}

const skillNodes = [
  { label: 'System Design', x: 49, y: 22, power: '94' },
  { label: 'React', x: 25, y: 44, power: '92' },
  { label: 'Narrative', x: 66, y: 43, power: '87' },
  { label: 'ML', x: 40, y: 64, power: '76' },
  { label: 'Leadership', x: 74, y: 68, power: '82' },
  { label: 'Research', x: 15, y: 72, power: '68' },
]

function Constellation() {
  return (
    <div className="glass scanline relative min-h-[540px] overflow-hidden rounded-[32px] p-6 md:p-9">
      <div className="flex items-start justify-between">
        <div>
          <div className="mono-tag">Skill constellation / live</div>
          <div className="mt-3 font-display text-xl">Capability topology</div>
        </div>
        <Orbit className="h-5 w-5 text-ion/60" />
      </div>
      <svg className="absolute inset-x-5 bottom-10 top-24 h-[calc(100%_-_8rem)] w-[calc(100%_-_2.5rem)]">
        <g stroke="rgba(112,247,255,.19)" strokeWidth="1">
          <line x1="25%" y1="44%" x2="49%" y2="22%" />
          <line x1="49%" y1="22%" x2="66%" y2="43%" />
          <line x1="25%" y1="44%" x2="40%" y2="64%" />
          <line x1="40%" y1="64%" x2="74%" y2="68%" />
          <line x1="66%" y1="43%" x2="74%" y2="68%" />
          <line x1="15%" y1="72%" x2="40%" y2="64%" />
        </g>
        <circle cx="48%" cy="49%" r="34%" fill="none" stroke="rgba(112,247,255,.06)" className="orbital-dash" />
      </svg>
      <div className="absolute inset-x-5 bottom-10 top-24">
        {skillNodes.map((node, i) => (
          <motion.div
            key={node.label}
            className="absolute"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            animate={{ y: [-3, 4, -3] }}
            transition={{ duration: 4 + i / 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <span className="absolute -inset-4 rounded-full bg-ion/[0.06] blur-md" />
              <span className="relative block h-3 w-3 rounded-full bg-ion shadow-[0_0_22px_#70f7ff]" />
              <div className="absolute left-5 top-[-10px] whitespace-nowrap">
                <div className="text-xs text-white/72">{node.label}</div>
                <div className="font-mono text-[10px] text-ion/58">{node.power} strength</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function IdentityIndex() {
  return (
    <div className="glass panel-edge rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <span className="mono-tag">Identity index</span>
        <LockKeyhole className="h-4 w-4 text-ion" />
      </div>
      <div className="mt-8 flex items-end gap-4">
        <span className="font-display text-7xl tracking-[-0.08em]">93</span>
        <span className="pb-3 font-mono text-xs text-ion">/ 100</span>
      </div>
      <div className="mt-5 h-[2px] bg-white/8">
        <motion.div className="h-full bg-ion shadow-[0_0_14px_#70f7ff]" initial={{ width: 0 }} animate={{ width: '93%' }} transition={{ duration: 1.2 }} />
      </div>
      <p className="mt-5 text-xs leading-6 text-white/45">Evidence density is exceptional. One emerging leadership thread needs quantification.</p>
    </div>
  )
}

function InsightFeed() {
  const insights = [
    { icon: Sparkles, title: 'Hidden pattern', copy: 'Three shipped platforms imply strong zero-to-one ownership.' },
    { icon: TrendingUp, title: 'Trajectory', copy: 'AI systems relevance accelerated 2.4x over 18 months.' },
  ]
  return (
    <div className="glass rounded-[28px] p-6">
      <div className="mono-tag mb-5">AI transmissions</div>
      {insights.map((item) => (
        <div key={item.title} className="mb-4 flex gap-4 border-b border-white/[0.06] pb-4 last:mb-0 last:border-0 last:pb-0">
          <item.icon className="mt-1 h-4 w-4 shrink-0 text-ion" />
          <div>
            <div className="text-sm text-white/78">{item.title}</div>
            <p className="mt-1 text-xs leading-5 text-white/43">{item.copy}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function CareerTimeline() {
  const stages = [
    ['2019', 'Origins', 'Product Intern'],
    ['2021', 'Velocity', 'Frontend Engineer'],
    ['2023', 'Expansion', 'AI Platform Lead'],
    ['2025', 'Present', 'Product Architect'],
    ['2027', 'Forecast', 'Director trajectory'],
  ]
  return (
    <div className="glass mt-6 rounded-[30px] px-6 py-8 md:px-10">
      <div className="mono-tag mb-9">Career growth continuum</div>
      <div className="relative grid gap-8 md:grid-cols-5 md:gap-2">
        <span className="absolute left-3 top-3 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-ion/30 via-ion/50 to-ultraviolet/25 md:block" />
        {stages.map(([year, marker, title], index) => (
          <motion.div key={year} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.13 + 0.3 }} className="relative">
            <span className={`mb-5 block h-6 w-6 rounded-full border ${index === 4 ? 'border-ultraviolet bg-ultraviolet/20' : 'border-ion/50 bg-ion/10'} shadow-[0_0_18px_rgba(112,247,255,.25)]`} />
            <div className="font-mono text-[10px] tracking-[.22em] text-white/32">{year}</div>
            <div className="mt-2 text-sm text-ion/75">{marker}</div>
            <div className="mt-2 text-xs text-white/45">{title}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ForgePage() {
  const modules = [
    { title: 'Impact language', state: 'ENHANCED', metric: '+18 ATS' },
    { title: 'Evidence density', state: 'VERIFIED', metric: '9 proofs' },
    { title: 'Role calibration', state: 'ALIGNED', metric: '0.91 fit' },
  ]
  return (
    <PageTransition>
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-10 lg:px-16">
        <SectionHeading
          code="02 / Resume Forge"
          title={<>Shape the signal. <span className="spectral-text">Not the template.</span></>}
          subline="The forge rewrites raw history into high-resolution career evidence while preserving your distinct voice."
        />
        <div className="grid gap-6 lg:grid-cols-[.88fr_1.12fr]">
          <ATSCore />
          <div className="space-y-5">
            <div className="glass rounded-[30px] p-6 md:p-8">
              <div className="flex justify-between">
                <span className="mono-tag">Rewrite stream</span>
                <span className="font-mono text-[10px] text-ambercode">Generating / 84%</span>
              </div>
              <div className="mt-8 rounded-2xl border border-white/[0.06] bg-black/25 p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-white/28">Before / fragmented signal</p>
                <p className="mt-4 text-sm leading-7 text-white/37">Built dashboards and worked with product teams to improve features.</p>
              </div>
              <div className="relative mt-4 rounded-2xl border border-ion/15 bg-ion/[0.035] p-5">
                <div className="absolute right-5 top-5 rounded-full bg-ion/10 px-3 py-1 font-mono text-[9px] text-ion">FORGED</div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-ion/52">After / evidence-rich identity</p>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/77">
                  Architected an insight interface that shortened product decision cycles by <span className="text-ion">34%</span>, translating behavioral signals into launch priorities.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {modules.map((module) => (
                <div key={module.title} className="glass rounded-2xl p-4">
                  <div className="font-mono text-[9px] text-ion/65">{module.state}</div>
                  <div className="mt-3 text-xs text-white/58">{module.title}</div>
                  <div className="mt-4 font-display text-lg">{module.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function ATSCore() {
  const score = 91
  const radius = 108
  const circumference = 2 * Math.PI * radius
  return (
    <div className="glass panel-edge relative flex min-h-[525px] flex-col rounded-[32px] p-7 md:p-9">
      <div className="mono-tag">ATS compatibility core</div>
      <div className="relative mx-auto mt-10 flex h-[255px] w-[255px] items-center justify-center">
        <svg viewBox="0 0 250 250" className="absolute inset-0 -rotate-90">
          <circle cx="125" cy="125" r={radius} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="2" />
          <motion.circle
            cx="125"
            cy="125"
            r={radius}
            fill="none"
            stroke="#70f7ff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
            transition={{ duration: 1.4, delay: 0.25 }}
            style={{ filter: 'drop-shadow(0 0 9px rgba(112,247,255,.8))' }}
          />
          <circle cx="125" cy="125" r="92" fill="none" stroke="rgba(137,108,255,.19)" strokeDasharray="1 10" />
        </svg>
        <div className="text-center">
          <div className="font-display text-7xl tracking-[-0.08em]">{score}</div>
          <div className="mt-2 font-mono text-[10px] tracking-[.26em] text-ion">MATCH SIGNAL</div>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-6">
        <Metric title="Keywords" value="96%" />
        <Metric title="Clarity" value="A+" />
        <Metric title="Seniority" value="L5" />
        <Metric title="Drift" value="Low" />
      </div>
    </div>
  )
}

function Metric({ title, value }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[.18em] text-white/33">{title}</div>
      <div className="mt-2 font-display text-xl text-white/88">{value}</div>
    </div>
  )
}

function SimulationPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-10 lg:px-16">
        <SectionHeading
          code="03 / Recruiter Simulation"
          title={<>Enter the <span className="spectral-text">decision field.</span></>}
          subline="Run your identity through a synthetic hiring room. See attention, doubt and conversion probability before a recruiter does."
        />
        <div className="grid gap-6 lg:grid-cols-[1.12fr_.88fr]">
          <RecruiterRadar />
          <SimulationSignals />
        </div>
      </div>
    </PageTransition>
  )
}

function RecruiterRadar() {
  const axes = [
    ['Impact', 250, 43],
    ['Depth', 418, 154],
    ['Fit', 366, 338],
    ['Clarity', 132, 338],
    ['Trust', 82, 154],
  ]
  return (
    <div className="glass panel-edge rounded-[32px] p-6 md:p-9">
      <div className="flex items-center justify-between">
        <div className="mono-tag">Recruiter probability radar</div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-ion"><span className="h-2 w-2 animate-pulse rounded-full bg-ion" /> LIVE SIMULATION</div>
      </div>
      <div className="mt-6 flex justify-center">
        <svg viewBox="0 0 500 390" className="w-full max-w-[570px]">
          {[155, 114, 74, 35].map((radius) => (
            <polygon
              key={radius}
              points={`250,${195 - radius} ${250 + radius * 0.951},${195 - radius * -0.309} ${250 + radius * 0.588},${195 + radius * 0.809} ${250 - radius * 0.588},${195 + radius * 0.809} ${250 - radius * 0.951},${195 - radius * -0.309}`}
              fill="none"
              stroke="rgba(112,247,255,.12)"
            />
          ))}
          {axes.map(([label, x, y]) => (
            <g key={label}>
              <line x1="250" y1="195" x2={x} y2={y} stroke="rgba(112,247,255,.10)" />
              <text x={x} y={y + (label === 'Impact' ? -10 : 17)} fill="rgba(255,255,255,.48)" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" letterSpacing="2">{label.toUpperCase()}</text>
            </g>
          ))}
          <motion.polygon
            points="250,60 385,163 339,304 157,310 114,163"
            fill="rgba(112,247,255,.10)"
            stroke="#70f7ff"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.4, transformOrigin: '250px 195px' }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(112,247,255,.4))' }}
          />
          <circle cx="250" cy="60" r="4" fill="#70f7ff" />
          <circle cx="385" cy="163" r="4" fill="#70f7ff" />
          <circle cx="339" cy="304" r="4" fill="#70f7ff" />
          <circle cx="157" cy="310" r="4" fill="#70f7ff" />
          <circle cx="114" cy="163" r="4" fill="#70f7ff" />
        </svg>
      </div>
    </div>
  )
}

function SimulationSignals() {
  return (
    <div className="space-y-5">
      <div className="glass rounded-[28px] p-7">
        <div className="mono-tag">Interview probability</div>
        <div className="mt-7 flex items-baseline gap-3">
          <span className="font-display text-7xl tracking-[-.08em]">84</span>
          <span className="font-mono text-sm text-ion">%</span>
        </div>
        <p className="mt-4 text-sm text-white/48">High resonance for <span className="text-white/80">Staff Product Engineer</span></p>
      </div>
      {[
        { icon: ScanEye, name: 'Attention hotspot', text: 'AI platform launch story creates strongest first-read fixation.', state: 'STRONG' },
        { icon: TriangleAlert, name: 'Objection detected', text: 'Team-scale impact lacks a numeric hiring signal.', state: 'REPAIR' },
        { icon: Target, name: 'Conversion trigger', text: 'Expose architecture tradeoff in opening summary.', state: 'ACTIVATE' },
      ].map((signal) => (
        <div key={signal.name} className="glass flex gap-4 rounded-2xl p-5">
          <signal.icon className="mt-1 h-5 w-5 shrink-0 text-ion/75" />
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/75">{signal.name}</span>
              <span className="font-mono text-[9px] text-ion/68">{signal.state}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-white/43">{signal.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function SkillGapPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 md:px-10 lg:px-16">
        <SectionHeading
          code="04 / Skill Gap Engine"
          title={<>Map your next <span className="spectral-text">evolution.</span></>}
          subline="A forecast engine compares present capability against your target identity, illuminating precisely what unlocks the next role."
        />
        <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <TrajectoryPanel />
          <GapMatrix />
        </div>
      </div>
    </PageTransition>
  )
}

function TrajectoryPanel() {
  return (
    <div className="glass panel-edge rounded-[32px] p-7">
      <div className="mono-tag">Target identity</div>
      <h2 className="mt-6 font-display text-3xl tracking-[-.055em]">AI Product<br />Architect</h2>
      <p className="mt-4 text-xs leading-6 text-white/45">Forecast horizon: 9 months at current learning velocity.</p>
      <div className="mt-10 space-y-7">
        {[
          ['Current identity', '72', 'rgba(112,247,255,.72)'],
          ['Role threshold', '88', 'rgba(137,108,255,.86)'],
          ['Projected', '91', 'rgba(255,203,107,.86)'],
        ].map(([label, value, color]) => (
          <div key={label}>
            <div className="mb-3 flex justify-between text-xs text-white/50">
              <span>{label}</span>
              <span className="font-mono">{value}</span>
            </div>
            <div className="h-[3px] rounded-full bg-white/[.06]">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.2 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-2xl border border-ion/12 bg-ion/[.035] p-5">
        <BrainCircuit className="h-5 w-5 text-ion" />
        <p className="mt-4 text-xs leading-6 text-white/56">Acquiring <span className="text-ion">evaluation design</span> collapses the projected gap by 41%.</p>
      </div>
    </div>
  )
}

function GapMatrix() {
  const skills = [
    { skill: 'LLM Evaluation', current: 34, target: 82, priority: 'CRITICAL' },
    { skill: 'Experiment Design', current: 62, target: 85, priority: 'ADVANCE' },
    { skill: 'System Architecture', current: 78, target: 88, priority: 'REFINE' },
    { skill: 'Product Narrative', current: 90, target: 84, priority: 'MASTERED' },
  ]
  return (
    <div className="glass rounded-[32px] p-6 md:p-9">
      <div className="mb-9 flex items-center justify-between">
        <div className="mono-tag">Capability differential</div>
        <Compass className="h-5 w-5 text-ion/60" />
      </div>
      <div className="space-y-8">
        {skills.map((item, index) => (
          <div key={item.skill}>
            <div className="mb-4 flex justify-between gap-5">
              <span className="text-sm text-white/72">{item.skill}</span>
              <span className={`font-mono text-[9px] tracking-widest ${index === 0 ? 'text-ambercode' : 'text-ion/64'}`}>{item.priority}</span>
            </div>
            <div className="relative h-7">
              <span className="absolute left-0 top-[12px] h-px w-full bg-white/[.06]" />
              <motion.span
                className="absolute left-0 top-[11px] h-[3px] bg-ion/60"
                initial={{ width: 0 }}
                animate={{ width: `${item.current}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
              <span className="absolute top-[5px] h-[16px] w-px bg-ultraviolet shadow-[0_0_8px_#896cff]" style={{ left: `${item.target}%` }} />
              <span className="absolute top-[-12px] -translate-x-1/2 font-mono text-[9px] text-white/40" style={{ left: `${item.current}%` }}>{item.current}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-4 border-t border-white/[.06] pt-6">
        <Legend color="bg-ion/70" text="Present signal" />
        <Legend color="bg-ultraviolet" text="Target threshold" />
        <button className="ml-auto flex items-center gap-2 text-xs text-ion">
          Generate evolution path <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-white/40">
      <span className={`h-[2px] w-5 ${color}`} />
      {text}
    </div>
  )
}

function App() {
  const location = useLocation()
  return (
    <Shell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/forge" element={<ForgePage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/skill-gap" element={<SkillGapPage />} />
        </Routes>
      </AnimatePresence>
    </Shell>
  )
}

export default App
