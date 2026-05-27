import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ChevronDown, Plus, X } from 'lucide-react'

const navigation = [
  { label: 'Archive', path: '/vault' },
  { label: 'Method', path: '#method' },
  { label: 'Stories', path: '#stories' },
  { label: 'Contact', path: '#contact' },
]

const contourPaths = [
  'M10 530 C80 454 38 325 132 258 C215 198 246 97 360 114 C490 134 502 266 630 292 C755 317 852 250 938 318 C1038 395 1004 525 1125 563',
  'M-4 553 C85 479 70 347 153 282 C231 221 269 124 374 140 C492 159 522 282 638 311 C757 339 858 278 941 343 C1031 412 1021 528 1145 587',
  'M-14 578 C100 510 90 378 170 309 C248 242 288 151 390 166 C498 182 541 303 651 330 C770 360 872 306 956 368 C1048 436 1050 546 1160 612',
  'M-24 603 C115 542 110 410 188 337 C260 270 310 179 402 192 C512 207 556 326 666 352 C783 380 892 337 970 395 C1063 462 1084 571 1174 635',
  'M-36 628 C128 572 132 441 202 365 C277 289 328 210 417 218 C526 230 572 348 682 376 C800 406 910 370 986 423 C1076 487 1113 594 1189 657',
  'M-45 651 C141 604 150 470 218 395 C293 311 348 237 433 245 C539 254 589 370 699 399 C815 428 926 402 1000 451 C1094 513 1140 615 1200 680',
]

const markers = [
  { label: 'curiosity', x: '21%', y: '39%' },
  { label: 'craft', x: '60%', y: '47%' },
  { label: 'becoming', x: '82%', y: '68%' },
]

const archiveChapters = [
  {
    id: 'projects',
    title: 'Projects',
    number: '01',
    prompt: 'Things you brought into the world.',
    example: { title: 'Memory Atlas', detail: 'A visual archive for personal histories', date: '2025' },
  },
  {
    id: 'internships',
    title: 'Internships',
    number: '02',
    prompt: 'Places where your perspective shifted.',
    example: { title: 'Studio Signal', detail: 'Product design fellow', date: 'Summer 2024' },
  },
  {
    id: 'certifications',
    title: 'Certifications',
    number: '03',
    prompt: 'Disciplines explored with intention.',
    example: { title: 'Human-Centered AI', detail: 'DeepLearning.AI', date: '2025' },
  },
  {
    id: 'achievements',
    title: 'Achievements',
    number: '04',
    prompt: 'Moments that left a visible trace.',
    example: { title: 'National Build Night', detail: 'Finalist / experience design', date: '2025' },
  },
  {
    id: 'education',
    title: 'Education',
    number: '05',
    prompt: 'Foundations and formative spaces.',
    example: { title: 'B.Tech Computer Science', detail: 'Design systems and intelligent interfaces', date: '2022 - 2026' },
  },
]

const openingSkills = ['Creative Coding', 'Interaction Design', 'React', 'Story Systems', 'Research']

function readArchive(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const pointerX = useMotionValue(66)
  const pointerY = useMotionValue(44)
  const glowX = useSpring(pointerX, { stiffness: 70, damping: 28 })
  const glowY = useSpring(pointerY, { stiffness: 70, damping: 28 })
  const pointerGlow = useMotionTemplate`radial-gradient(540px circle at ${glowX}% ${glowY}%, rgba(117, 84, 225, 0.13), transparent 66%)`

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname)
    window.addEventListener('popstate', syncPath)
    return () => window.removeEventListener('popstate', syncPath)
  }, [])

  function navigate(nextPath) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePointerMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100)
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100)
  }

  const isVault = path === '/vault'

  return (
    <div className="exhibition relative min-h-screen overflow-hidden bg-black text-white" onPointerMove={handlePointerMove}>
      <Atmosphere pointerGlow={pointerGlow} vault={isVault} />
      <Header isVault={isVault} navigate={navigate} />
      <AnimatePresence mode="wait">
        {isVault ? (
          <CareerVault key="vault" />
        ) : (
          <Landing key="landing" navigate={navigate} />
        )}
      </AnimatePresence>
    </div>
  )
}

function Header({ isVault, navigate }) {
  return (
    <motion.header
      className="relative z-20 mx-auto flex w-full max-w-[1540px] items-start justify-between px-6 pb-5 pt-7 md:px-10 md:pt-10 lg:px-14"
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <button className="brand group" onClick={() => navigate('/')} type="button">
        <span className="brand-mark" />
        <span className="text-base font-medium tracking-[0.42em] text-white md:text-lg">AETHRA</span>
      </button>

      <nav className="hidden items-center gap-9 pt-1 md:flex">
        {navigation.map((item) => (
          item.path.startsWith('/') ? (
            <button
              className={`minimal-link ${isVault ? 'is-current' : ''}`}
              key={item.label}
              onClick={() => navigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ) : (
            <a className="minimal-link" href={item.path} key={item.label}>
              {item.label}
            </a>
          )
        ))}
      </nav>

      <button className="invitation-link group" onClick={() => navigate(isVault ? '/' : '/vault')} type="button">
        {isVault ? 'Return' : 'Enter'}
        {isVault ? (
          <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
        ) : (
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
        )}
      </button>
    </motion.header>
  )
}

function Landing({ navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.6 }}
    >
      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-86px)] w-full max-w-[1540px] grid-cols-1 px-6 pb-10 md:px-10 lg:grid-cols-[1.08fr_.92fr] lg:px-14">
        <section className="relative flex flex-col justify-between pb-14 pt-[11vh] lg:pb-12 lg:pt-[16vh]">
          <motion.div
            className="eyebrow flex items-center gap-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.8 }}
          >
            <span className="h-px w-14 bg-violet-200/45" />
            An interactive portrait of a working life
          </motion.div>

          <div className="mt-12 lg:mt-10">
            <RevealWord>YOUR</RevealWord>
            <div className="lg:ml-[13vw]">
              <RevealWord gradient delay={0.28}>STORY</RevealWord>
            </div>
          </div>

          <motion.div
            className="mt-10 flex max-w-xl flex-col gap-10 md:flex-row md:items-end lg:mt-auto"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.88, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="manifesto max-w-sm">
              Not a document. A living archive of choices, risks, unfinished ideas, and the work that quietly changed you.
            </p>
            <button className="discover group shrink-0" onClick={() => navigate('/vault')} type="button">
              Explore the archive
              <span className="discover-line"><span /></span>
            </button>
          </motion.div>
        </section>

        <section className="relative min-h-[44vh] lg:min-h-0">
          <ContourPortrait />
        </section>
      </main>

      <motion.footer
        className="relative z-20 mx-auto hidden max-w-[1540px] items-center justify-between px-14 pb-9 text-[10px] uppercase tracking-[0.34em] text-white/30 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <span>Digital Identity Exhibition / 2026</span>
        <span>Enter to unfold</span>
        <span>01 - Opening</span>
      </motion.footer>
    </motion.div>
  )
}

function RevealWord({ children, gradient = false, delay = 0.17 }) {
  return (
    <div className="overflow-hidden pb-4">
      <motion.h1
        className={`display-type text-[clamp(4.8rem,11.5vw,12.4rem)] ${gradient ? 'spectral-word' : ''}`}
        initial={{ y: '108%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.04, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.h1>
    </div>
  )
}

function CareerVault() {
  const [skills, setSkills] = useState(() => readArchive('aethra-vault-skills', openingSkills))
  const [skillDraft, setSkillDraft] = useState('')
  const [editingSkill, setEditingSkill] = useState(null)
  const [editDraft, setEditDraft] = useState('')
  const [openChapter, setOpenChapter] = useState('projects')
  const [entries, setEntries] = useState(() => readArchive(
    'aethra-vault-memories',
    Object.fromEntries(archiveChapters.map((chapter) => [chapter.id, [chapter.example]])),
  ))
  const [drafts, setDrafts] = useState(() => Object.fromEntries(
    archiveChapters.map((chapter) => [chapter.id, { title: '', detail: '', date: '' }]),
  ))

  useEffect(() => {
    window.localStorage.setItem('aethra-vault-skills', JSON.stringify(skills))
  }, [skills])

  useEffect(() => {
    window.localStorage.setItem('aethra-vault-memories', JSON.stringify(entries))
  }, [entries])

  function addSkill(event) {
    event.preventDefault()
    const nextSkill = skillDraft.trim()
    if (!nextSkill || skills.includes(nextSkill)) return
    setSkills([...skills, nextSkill])
    setSkillDraft('')
  }

  function beginSkillEdit(skill) {
    setEditingSkill(skill)
    setEditDraft(skill)
  }

  function commitSkillEdit() {
    const renamed = editDraft.trim()
    if (renamed) {
      setSkills(skills.map((skill) => (skill === editingSkill ? renamed : skill)))
    }
    setEditingSkill(null)
  }

  function removeSkill(skillToRemove) {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  function updateDraft(section, field, value) {
    setDrafts({ ...drafts, [section]: { ...drafts[section], [field]: value } })
  }

  function addMemory(event, section) {
    event.preventDefault()
    const draft = drafts[section]
    if (!draft.title.trim()) return
    setEntries({ ...entries, [section]: [...entries[section], draft] })
    setDrafts({ ...drafts, [section]: { title: '', detail: '', date: '' } })
  }

  return (
    <motion.main
      className="vault-page relative z-10 mx-auto max-w-[1540px] px-6 pb-20 pt-12 md:px-10 lg:px-14 lg:pt-16"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <VaultContours />
      <div className="relative z-10 grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
        <section className="lg:sticky lg:top-12 lg:self-start">
          <div className="eyebrow flex items-center gap-5">
            <span className="h-px w-14 bg-violet-200/45" />
            Personal archive / in progress
          </div>
          <h1 className="vault-title mt-10">
            CAREER
            <span>VAULT</span>
          </h1>
          <p className="manifesto mt-10 max-w-sm">
            Gather the fragments of your practice. Name what you know, remember what you made, and let a portrait slowly emerge.
          </p>

          <SkillField
            addSkill={addSkill}
            beginSkillEdit={beginSkillEdit}
            commitSkillEdit={commitSkillEdit}
            editDraft={editDraft}
            editingSkill={editingSkill}
            removeSkill={removeSkill}
            setEditDraft={setEditDraft}
            setSkillDraft={setSkillDraft}
            skillDraft={skillDraft}
            skills={skills}
          />
        </section>

        <section className="archive-stream pt-4 lg:pt-16">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <div className="archive-caption">Memories collected</div>
              <div className="mt-4 text-4xl font-light tracking-[-0.06em] text-white">
                {Object.values(entries).reduce((count, list) => count + list.length, 0).toString().padStart(2, '0')}
              </div>
            </div>
            <p className="max-w-[220px] text-right text-xs leading-6 text-white/36">
              Open a chapter to preserve a new moment in your evolving identity.
            </p>
          </div>

          {archiveChapters.map((chapter, index) => (
            <ArchiveChapter
              chapter={chapter}
              draft={drafts[chapter.id]}
              entries={entries[chapter.id]}
              index={index}
              key={chapter.id}
              open={openChapter === chapter.id}
              onAdd={addMemory}
              onChange={updateDraft}
              onToggle={() => setOpenChapter(openChapter === chapter.id ? null : chapter.id)}
            />
          ))}
        </section>
      </div>
    </motion.main>
  )
}

function SkillField(props) {
  return (
    <motion.div
      className="skill-field mt-14"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.7 }}
    >
      <div className="archive-caption">Skills / living vocabulary</div>
      <div className="mt-7 flex flex-wrap gap-x-3 gap-y-4">
        <AnimatePresence>
          {props.skills.map((skill, index) => (
            <motion.div
              className="skill-memory"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, index % 2 ? 3 : -3, 0] }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ opacity: { duration: 0.3 }, y: { duration: 6 + index, repeat: Infinity, ease: 'easeInOut' } }}
              key={`${skill}-${index}`}
            >
              {props.editingSkill === skill ? (
                <input
                  autoFocus
                  className="skill-edit"
                  onBlur={props.commitSkillEdit}
                  onChange={(event) => props.setEditDraft(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && props.commitSkillEdit()}
                  value={props.editDraft}
                />
              ) : (
                <button onClick={() => props.beginSkillEdit(skill)} type="button">{skill}</button>
              )}
              <button aria-label={`Remove ${skill}`} className="remove-skill" onClick={() => props.removeSkill(skill)} type="button">
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form className="add-skill mt-8 flex items-center gap-3" onSubmit={props.addSkill}>
        <Plus className="h-4 w-4 text-violet-200/55" />
        <input
          onChange={(event) => props.setSkillDraft(event.target.value)}
          placeholder="Add a skill to the portrait"
          value={props.skillDraft}
        />
      </form>
    </motion.div>
  )
}

function ArchiveChapter({ chapter, draft, entries, index, open, onAdd, onChange, onToggle }) {
  return (
    <motion.article
      className={`archive-chapter ${open ? 'is-open' : ''}`}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 + 0.18, duration: 0.6 }}
    >
      <button className="chapter-heading" onClick={onToggle} type="button">
        <span className="chapter-number">{chapter.number}</span>
        <span className="chapter-name">
          <span>{chapter.title}</span>
          <small>{chapter.prompt}</small>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="chapter-toggle">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="chapter-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="memory-list">
              {entries.map((entry, entryIndex) => (
                <motion.div
                  className="memory-row"
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${entry.title}-${entryIndex}`}
                >
                  <div className="memory-title">{entry.title}</div>
                  <div className="memory-detail">{entry.detail || 'A new fragment added to your archive.'}</div>
                  <div className="memory-date">{entry.date || 'Undated'}</div>
                </motion.div>
              ))}
            </div>
            <form className="memory-composer" onSubmit={(event) => onAdd(event, chapter.id)}>
              <input
                onChange={(event) => onChange(chapter.id, 'title', event.target.value)}
                placeholder={`Add ${chapter.title.toLowerCase().replace(/s$/, '')}`}
                value={draft.title}
              />
              <input
                onChange={(event) => onChange(chapter.id, 'detail', event.target.value)}
                placeholder="A detail worth remembering"
                value={draft.detail}
              />
              <div className="flex items-center gap-5">
                <input
                  className="date-input"
                  onChange={(event) => onChange(chapter.id, 'date', event.target.value)}
                  placeholder="When"
                  value={draft.date}
                />
                <button className="inscribe" type="submit">
                  Inscribe <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function Atmosphere({ pointerGlow, vault }) {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className={`cinema-mesh absolute inset-0 ${vault ? 'vault-mesh' : ''}`} />
      <motion.div className="absolute inset-0" style={{ background: pointerGlow }} />
      <div className="soft-grain absolute inset-0" />
      <motion.div
        className="absolute -right-24 top-[18%] h-[36rem] w-[36rem] rounded-full bg-violet-500/[0.075] blur-[130px]"
        animate={{ opacity: [0.28, 0.62, 0.28], scale: [0.96, 1.08, 0.96] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[21%] h-64 w-64 rounded-full bg-cyan-300/[0.05] blur-[110px]"
        animate={{ x: [-12, 16, -12], y: [0, -14, 0], opacity: [0.24, 0.52, 0.24] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function ContourPortrait() {
  return (
    <motion.div
      className="contour-stage absolute inset-x-0 bottom-4 top-8 lg:bottom-14 lg:left-[-10%] lg:right-0 lg:top-10"
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.15, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <ContourSvg />
      {markers.map((marker, index) => (
        <motion.div
          className="contour-marker absolute"
          key={marker.label}
          style={{ left: marker.x, top: marker.y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, index % 2 === 0 ? -6 : 6, 0] }}
          transition={{ opacity: { delay: 1.1 + index * 0.18 }, y: { duration: 5 + index, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <span className="marker-dot" />
          <span className="marker-label">{marker.label}</span>
        </motion.div>
      ))}
      <motion.div
        className="portrait-note absolute bottom-[8%] right-[4%] max-w-[180px]"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.94, duration: 0.8 }}
      >
        Traces of experience form an identity no template can contain.
      </motion.div>
    </motion.div>
  )
}

function VaultContours() {
  return (
    <div className="vault-contours pointer-events-none absolute left-[-18%] top-24 h-[490px] w-[720px] opacity-50">
      <ContourSvg />
    </div>
  )
}

function ContourSvg() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1150 700" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="contour" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#805ad5" stopOpacity=".12" />
          <stop offset=".44" stopColor="#c4b5fd" stopOpacity=".68" />
          <stop offset=".76" stopColor="#67e8f9" stopOpacity=".44" />
          <stop offset="1" stopColor="#67e8f9" stopOpacity=".04" />
        </linearGradient>
        <radialGradient id="contour-halo">
          <stop stopColor="#9774e9" stopOpacity=".13" />
          <stop offset="1" stopColor="#9774e9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="591" cy="362" rx="344" ry="268" fill="url(#contour-halo)" />
      {contourPaths.map((curve, index) => (
        <motion.path
          key={curve}
          d={curve}
          fill="none"
          stroke="url(#contour)"
          strokeWidth={index === 0 ? 1.4 : 1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.22, 0.86, 0.44] }}
          transition={{
            pathLength: { duration: 1.8, delay: 0.46 + index * 0.1, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 6 + index * 0.6, delay: 1.2 + index * 0.12, repeat: Infinity, repeatType: 'mirror' },
          }}
        />
      ))}
      <motion.path
        d={contourPaths[2]}
        fill="none"
        stroke="#c4b5fd"
        strokeOpacity=".6"
        strokeWidth="1.2"
        strokeDasharray="34 1220"
        animate={{ strokeDashoffset: [0, -1254] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  )
}

export default App
