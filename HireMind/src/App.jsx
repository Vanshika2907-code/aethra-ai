import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Plus, Sparkles, Upload, X } from 'lucide-react'

const navigation = [
  { label: 'Archive', path: '/vault' },
  { label: 'Opportunity', path: '/opportunity' },
  { label: 'Method', path: '#method' },
  { label: 'Stories', path: '#stories' },
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
const readingStages = ['Reading the opportunity', 'Extracting role signals', 'Shaping the resume guidance']
const emptyVaultMemories = Object.fromEntries(archiveChapters.map((chapter) => [chapter.id, []]))
const vaultProfileVersionKey = 'aethra-vault-profile-version'
const supportedEvidenceTypes = ['application/pdf', 'image/png', 'image/jpeg']

const sampleDescription = `Senior Product Designer - Intelligent Experiences

We are looking for a thoughtful designer to shape AI-powered products from early concept through launch. You will collaborate with product and engineering, build interaction prototypes, lead user research, and translate complex systems into clear human experiences.

Required: Figma, prototyping, user research, design systems, product strategy, and comfort partnering with React teams. Experience with accessibility and conversational AI is valued. 4+ years of product design experience preferred.`

const jobCards = [
  {
    title: 'AI Product Designer',
    meta: 'Design Lab / Senior',
    description: sampleDescription,
  },
  {
    title: 'Frontend Experience Engineer',
    meta: 'Creative Tools / Mid-level',
    description: `Frontend Experience Engineer

We need a frontend engineer who can craft polished, interactive product surfaces. You will build React interfaces, collaborate closely with designers, improve accessibility, and turn ambiguous product ideas into elegant prototypes.

Required: React, TypeScript, CSS, design systems, accessibility, animation, and strong product judgment. Preferred: Framer Motion, performance tuning, and experience working on AI-assisted creative tools. 3+ years preferred.`,
  },
  {
    title: 'AI Research Intern',
    meta: 'Human AI Studio / Internship',
    description: `AI Research Intern

Join a small research team exploring how people use intelligent interfaces. You will synthesize user interviews, evaluate prototypes, document insights, and support experiments around conversational AI and creative workflows.

Required: research methods, writing, data analysis, prototyping, collaboration, and curiosity about AI systems. Preferred: Python, survey design, and prior internship or project experience.`,
  },
]

const skillSignals = [
  { key: 'React', terms: ['react'] },
  { key: 'Interaction Design', terms: ['interaction design', 'interaction prototype', 'prototyping'] },
  { key: 'Research', terms: ['research', 'user research'] },
  { key: 'Design Systems', terms: ['design system'] },
  { key: 'Figma', terms: ['figma'] },
  { key: 'Product Strategy', terms: ['product strategy'] },
  { key: 'Accessibility', terms: ['accessibility'] },
  { key: 'Conversational AI', terms: ['conversational ai', 'ai-powered', 'artificial intelligence'] },
  { key: 'TypeScript', terms: ['typescript'] },
  { key: 'Python', terms: ['python'] },
  { key: 'Data Analysis', terms: ['data analysis', 'analytics'] },
]

function readArchive(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function normalizeMemories(memories) {
  return Object.fromEntries(
    archiveChapters.map((chapter) => [
      chapter.id,
      Array.isArray(memories?.[chapter.id]) ? memories[chapter.id] : [],
    ]),
  )
}

function isSameStringSet(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item))
}

function isSameMemory(left, right) {
  return left?.title === right.title && left?.detail === right.detail && left?.date === right.date
}

function isLegacySeededProfile(skills, memories) {
  const hasVersion = Boolean(window.localStorage.getItem(vaultProfileVersionKey))
  if (hasVersion || !isSameStringSet(skills, openingSkills)) return false

  return archiveChapters.every((chapter) => {
    const section = memories[chapter.id]
    return section.length === 1 && isSameMemory(section[0], chapter.example)
  })
}

function readVaultMemories() {
  const storedMemories = readArchive('aethra-vault-memories', emptyVaultMemories)
  const sectionMemories = Object.fromEntries(
    archiveChapters.map((chapter) => [
      chapter.id,
      readArchive(`aethra-vault-${chapter.id}`, storedMemories?.[chapter.id] || []),
    ]),
  )

  return normalizeMemories(sectionMemories)
}

function readVaultProfile() {
  const skills = readArchive('aethra-vault-skills', [])
  const normalizedSkills = Array.isArray(skills) ? skills : []
  const memories = readVaultMemories()

  if (isLegacySeededProfile(normalizedSkills, memories)) {
    return {
      skills: [],
      memories: emptyVaultMemories,
    }
  }

  return {
    skills: normalizedSkills,
    memories,
  }
}

function hasVaultData(profile) {
  return profile.skills.length > 0 || Object.values(profile.memories).some((items) => items.length > 0)
}

function flattenProfileText(profile) {
  const memoryText = archiveChapters.flatMap((chapter) => (
    profile.memories[chapter.id].map((entry) => `${chapter.title}: ${entry.title} ${entry.detail} ${entry.date}`)
  ))
  return profile.skills.concat(memoryText).join(' ').toLowerCase()
}

function createFallbackAnalysis(description, candidateProfile) {
  const text = description.toLowerCase()
  const profileText = flattenProfileText(candidateProfile)
  const requiredSkills = skillSignals
    .filter((signal) => signal.terms.some((term) => text.includes(term)))
    .map((signal) => signal.key)
  const detectedSkills = requiredSkills.length
    ? requiredSkills
    : ['Communication', 'Problem Solving', 'Collaboration']

  const matched = detectedSkills.filter((skill) => profileText.includes(skill.toLowerCase()))
  const missing = detectedSkills.filter((skill) => !matched.includes(skill))
  const score = Math.max(32, Math.round((matched.length / detectedSkills.length) * 100))
  const strongestProjects = (candidateProfile.memories.projects || [])
    .slice(0, 3)
    .map((project) => project.title)

  const role = text.includes('designer')
    ? (text.includes('product') ? 'Product Designer, Intelligent Experiences' : 'Experience Designer')
    : text.includes('frontend') || text.includes('front-end')
      ? 'Frontend Product Engineer'
      : text.includes('data')
        ? 'Data Experience Specialist'
        : 'Digital Product Specialist'

  const level = /lead|principal|staff|head of/i.test(description)
    ? 'Lead / strategic ownership'
    : /senior|4\+|5\+|6\+/i.test(description)
      ? 'Senior / independent practice'
      : /intern|graduate|junior|entry/i.test(description)
        ? 'Emerging / early career'
        : 'Mid-level / growing ownership'

  const intent = text.includes('collaborat') || text.includes('partner')
    ? 'They are searching for someone who can make complexity understandable across disciplines, with visible evidence of judgment and collaboration.'
    : 'They value a clear maker narrative: show finished work, the thinking behind it, and how it moved an outcome forward.'

  return normalizeAnalysis({
    detectedJobRole: role,
    experienceLevel: level,
    requiredSkills: detectedSkills,
    preferredSkills: detectedSkills.includes('Conversational AI') ? ['Conversational AI'] : ['Portfolio storytelling'],
    atsKeywords: detectedSkills.concat(['collaboration', 'product judgment']).slice(0, 10),
    missingSkills: missing,
    matchingSkills: matched,
    recruiterIntent: intent,
    recruiterFeedback: matched.length
      ? `Your archive already signals ${matched.join(', ')}. Make those threads more explicit in the resume before applying.`
      : 'The role language is not yet visible enough in your archive. Add a project, achievement, or certification that proves the requested skills.',
    matchScore: score,
    hiringProbability: Math.max(18, Math.min(92, score - 4)),
    improvementSuggestions: [
      'Echo the strongest role keywords in your summary and project descriptions.',
      'Add one concrete outcome beside each relevant project or internship.',
      'Make missing skills visible through a small project, certification, or learning artifact.',
    ],
    strongestProjects: strongestProjects.length ? strongestProjects : ['Add projects to reveal strongest evidence'],
    resumeFocusAreas: ['Relevant projects', 'Skill vocabulary', 'Measurable outcomes'],
  })
}

function extractJson(text) {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced) return fenced[1].trim()

  let start = -1
  let depth = 0
  let inString = false
  let escaped = false

  for (let index = 0; index < trimmed.length; index += 1) {
    const char = trimmed[index]

    if (escaped) {
      escaped = false
      continue
    }

    if (char === '\\') {
      escaped = true
      continue
    }

    if (char === '"') {
      inString = !inString
      continue
    }

    if (inString) continue

    if (char === '{') {
      if (depth === 0) start = index
      depth += 1
    }

    if (char === '}') {
      depth -= 1
      if (depth === 0 && start !== -1) {
        return trimmed.slice(start, index + 1)
      }
    }
  }

  return trimmed
}

async function readGeminiError(response) {
  const fallback = `Gemini request failed with status ${response.status}.`

  try {
    const payload = await response.json()
    return payload?.error?.message || fallback
  } catch {
    try {
      const text = await response.text()
      return text || fallback
    } catch {
      return fallback
    }
  }
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  if (typeof value === 'string' && value.trim()) {
    return value.split(/,|\n/).map((item) => item.trim()).filter(Boolean)
  }
  return []
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string' && value.trim()) return [value]
  return []
}

function normalizeAnalysis(raw) {
  return {
    detectedJobRole: String(raw.detectedJobRole || raw.role || 'Role not clearly named'),
    experienceLevel: String(raw.experienceLevel || raw.level || 'Experience level not explicit'),
    requiredSkills: toArray(raw.requiredSkills),
    preferredSkills: toArray(raw.preferredSkills),
    atsKeywords: toArray(raw.atsKeywords),
    matchingSkills: toArray(raw.matchingSkills),
    missingSkills: toArray(raw.missingSkills || raw.missing),
    recruiterIntent: String(raw.recruiterIntent || raw.intent || 'The recruiter appears to be evaluating fit through evidence, clarity, and role-specific language.'),
    recruiterFeedback: String(raw.recruiterFeedback || raw.recruiterIntent || 'The profile should make its strongest evidence easier for the recruiter to see.'),
    matchScore: Number.isFinite(Number(raw.matchScore || raw.score)) ? Math.max(0, Math.min(100, Math.round(Number(raw.matchScore || raw.score)))) : 62,
    hiringProbability: Number.isFinite(Number(raw.hiringProbability)) ? Math.max(0, Math.min(100, Math.round(Number(raw.hiringProbability)))) : 50,
    improvementSuggestions: toArray(raw.improvementSuggestions),
    strongestProjects: toArray(raw.strongestProjects),
    resumeFocusAreas: toArray(raw.resumeFocusAreas),
  }
}

function hasUsableGeminiKey(apiKey) {
  return Boolean(
    apiKey
    && apiKey !== 'your_api_key_here'
    && !apiKey.includes('NOT_SET')
  )
}

function normalizeExtractedItem(item) {
  if (typeof item === 'string') {
    return { title: item, detail: 'Extracted from uploaded evidence', date: '', confidence: 68 }
  }

  return {
    title: String(item?.title || item?.name || item?.eventName || item?.degree || 'Untitled evidence'),
    detail: String(item?.detail || item?.description || item?.organization || item?.issuer || item?.issuingOrganization || 'Extracted from uploaded evidence'),
    date: String(item?.date || item?.issuedDate || item?.period || ''),
    confidence: Number.isFinite(Number(item?.confidence)) ? Math.max(0, Math.min(100, Math.round(Number(item.confidence)))) : 72,
  }
}

function normalizeExtraction(raw, fileName = '') {
  const memories = Object.fromEntries(
    archiveChapters.map((chapter) => [
      chapter.id,
      asArray(raw?.[chapter.id]).map(normalizeExtractedItem),
    ]),
  )

  return {
    fileName,
    documentType: String(raw?.documentType || raw?.type || 'Career evidence'),
    confidence: Number.isFinite(Number(raw?.confidence)) ? Math.max(0, Math.min(100, Math.round(Number(raw.confidence)))) : 74,
    skills: asArray(raw?.skills).map((skill) => (
      typeof skill === 'string'
        ? { name: skill, confidence: 70 }
        : {
          name: String(skill?.name || skill?.title || 'Skill signal'),
          confidence: Number.isFinite(Number(skill?.confidence)) ? Math.max(0, Math.min(100, Math.round(Number(skill.confidence)))) : 70,
        }
    )),
    memories,
    organizations: toArray(raw?.issuingOrganizations || raw?.organizations),
    technologies: toArray(raw?.technologies),
    note: String(raw?.summary || raw?.note || 'AETHRA found career evidence in this document. Review each memory before saving it.'),
  }
}

function createFallbackExtraction(file) {
  const name = file.name.toLowerCase()

  if (name.includes('certificate') || name.includes('aws') || name.includes('cert')) {
    return normalizeExtraction({
      documentType: 'Certificate',
      confidence: 64,
      certifications: [{
        title: name.includes('aws') ? 'AWS Certification' : 'Professional Certification',
        detail: 'Issuing organization detected from uploaded certificate',
        date: '',
        confidence: 62,
      }],
      skills: ['Cloud fundamentals', 'Technical learning'],
      issuingOrganizations: name.includes('aws') ? ['Amazon Web Services'] : [],
      technologies: name.includes('aws') ? ['AWS'] : [],
    }, file.name)
  }

  if (name.includes('transcript')) {
    return normalizeExtraction({
      documentType: 'Transcript',
      confidence: 62,
      education: [{ title: 'Academic transcript', detail: 'Education evidence extracted from transcript', date: '', confidence: 61 }],
      skills: ['Academic foundation'],
    }, file.name)
  }

  return normalizeExtraction({
    documentType: file.type === 'application/pdf' ? 'Resume PDF' : 'Achievement image',
    confidence: 58,
    skills: ['Communication', 'Project ownership'],
    projects: [{ title: 'Uploaded portfolio evidence', detail: 'A project signal was detected in the document', date: '', confidence: 56 }],
    achievements: [{ title: 'Documented achievement', detail: 'Achievement evidence found in uploaded file', date: '', confidence: 54 }],
  }, file.name)
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = () => reject(new Error('AETHRA could not read this file.'))
    reader.readAsDataURL(file)
  })
}

async function analyzeArchiveDocument(file) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const fallbackResult = createFallbackExtraction(file)

  if (!hasUsableGeminiKey(apiKey)) {
    return {
      result: fallbackResult,
      source: 'fallback',
      note: 'Gemini API key is missing, so AETHRA created a cautious local extraction draft.',
    }
  }

  const base64Data = await readFileAsBase64(file)
  const prompt = `Analyze this uploaded career evidence document using vision understanding.
Return only valid JSON with these fields:
documentType,
confidence,
skills,
certifications,
projects,
education,
internships,
achievements,
issuingOrganizations,
dates,
technologies,
summary.
Each extracted skill or archive item should include confidence when possible.
If a field is not visible, return an empty array.`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.15,
        },
      }),
    })

    if (!response.ok) {
      return {
        result: fallbackResult,
        source: 'fallback',
        note: `${await readGeminiError(response)} AETHRA created a local extraction draft instead.`,
      }
    }

    const payload = await response.json()
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n')
    if (!text) {
      return {
        result: fallbackResult,
        source: 'fallback',
        note: 'Gemini returned no extraction text, so AETHRA created a local extraction draft instead.',
      }
    }

    return {
      result: normalizeExtraction(JSON.parse(extractJson(text)), file.name),
      source: 'gemini',
      note: 'Gemini Vision interpreted this evidence. Review the memories before saving.',
    }
  } catch (error) {
    return {
      result: fallbackResult,
      source: 'fallback',
      note: `Document understanding could not complete cleanly (${error.message}). AETHRA created a local extraction draft instead.`,
    }
  }
}

async function analyzeJobDescription(jobDescription, candidateProfile) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const fallbackResult = createFallbackAnalysis(jobDescription, candidateProfile)

  if (!hasUsableGeminiKey(apiKey)) {
    return {
      result: fallbackResult,
      source: 'fallback',
      note: 'Gemini API key is missing, so AETHRA used its local demo interpreter.',
    }
  }

  const prompt = `Analyze this candidate profile against this job description for resume optimization.
Compare the candidate profile with the job requirements.
Return only valid JSON with these fields:
matchScore,
matchingSkills,
missingSkills,
recruiterFeedback,
improvementSuggestions,
strongestProjects,
resumeFocusAreas,
hiringProbability.
Candidate profile: ${JSON.stringify(candidateProfile)}
Job description: ${jobDescription}`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    })

    if (!response.ok) {
      const message = await readGeminiError(response)
      return {
        result: fallbackResult,
        source: 'fallback',
        note: `${message} AETHRA used its local demo interpreter instead.`,
      }
    }

    const payload = await response.json()
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n')

    if (!text) {
      return {
        result: fallbackResult,
        source: 'fallback',
        note: 'Gemini returned an empty analysis, so AETHRA used its local demo interpreter instead.',
      }
    }

    return {
      result: normalizeAnalysis(JSON.parse(extractJson(text))),
      source: 'gemini',
      note: 'Gemini interpreted this opportunity from the pasted job description.',
    }
  } catch (error) {
    return {
      result: fallbackResult,
      source: 'fallback',
      note: `Gemini could not be used cleanly (${error.message}). AETHRA used its local demo interpreter instead.`,
    }
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
  const isOpportunity = path === '/opportunity'
  const insideArchive = isVault || isOpportunity

  return (
    <div className="exhibition relative min-h-screen overflow-hidden bg-black text-white" onPointerMove={handlePointerMove}>
      <Atmosphere pointerGlow={pointerGlow} vault={insideArchive} />
      <Header activePath={path} insideArchive={insideArchive} navigate={navigate} />
      <AnimatePresence mode="wait">
        {isVault ? (
          <CareerVault key="vault" navigate={navigate} />
        ) : isOpportunity ? (
          <OpportunityReader key="opportunity" navigate={navigate} />
        ) : (
          <Landing key="landing" navigate={navigate} />
        )}
      </AnimatePresence>
    </div>
  )
}

function Header({ activePath, insideArchive, navigate }) {
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
              className={`minimal-link ${activePath === item.path ? 'is-current' : ''}`}
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

      <button className="invitation-link group" onClick={() => navigate(insideArchive ? '/' : '/vault')} type="button">
        {insideArchive ? 'Return' : 'Enter'}
        {insideArchive ? (
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

function CareerVault({ navigate }) {
  const [skills, setSkills] = useState(() => readVaultProfile().skills)
  const [skillDraft, setSkillDraft] = useState('')
  const [editingSkill, setEditingSkill] = useState(null)
  const [editDraft, setEditDraft] = useState('')
  const [openChapter, setOpenChapter] = useState('projects')
  const [entries, setEntries] = useState(() => readVaultProfile().memories)
  const [ingestion, setIngestion] = useState({
    status: 'idle',
    fileName: '',
    extraction: null,
    note: '',
  })
  const [drafts, setDrafts] = useState(() => Object.fromEntries(
    archiveChapters.map((chapter) => [chapter.id, { title: '', detail: '', date: '' }]),
  ))

  useEffect(() => {
    window.localStorage.setItem(vaultProfileVersionKey, '2')
    window.localStorage.setItem('aethra-vault-skills', JSON.stringify(skills))
  }, [skills])

  useEffect(() => {
    window.localStorage.setItem('aethra-vault-memories', JSON.stringify(entries))
    archiveChapters.forEach((chapter) => {
      window.localStorage.setItem(`aethra-vault-${chapter.id}`, JSON.stringify(entries[chapter.id] || []))
    })
  }, [entries])

  function addSkill(event) {
    event.preventDefault()
    const nextSkill = skillDraft.trim()
    if (!nextSkill || skills.includes(nextSkill)) return
    setSkills([...skills, nextSkill])
    setSkillDraft('')
  }

  function addSuggestedSkill(skill) {
    if (skills.includes(skill)) return
    setSkills([...skills, skill])
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

  async function handleEvidenceUpload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!supportedEvidenceTypes.includes(file.type)) {
      setIngestion({
        status: 'error',
        fileName: file.name,
        extraction: null,
        note: 'AETHRA can read PDF, PNG, JPG, and JPEG evidence files.',
      })
      return
    }

    setIngestion({
      status: 'processing',
      fileName: file.name,
      extraction: null,
      note: 'Reading visual evidence and listening for career signals.',
    })

    const { note, result, source } = await analyzeArchiveDocument(file)
    setIngestion({
      status: 'review',
      fileName: file.name,
      extraction: result,
      note: `${note} Source: ${source}.`,
    })
  }

  function updateExtractedSkill(index, value) {
    const nextSkills = ingestion.extraction.skills.map((skill, skillIndex) => (
      skillIndex === index ? { ...skill, name: value } : skill
    ))
    setIngestion({ ...ingestion, extraction: { ...ingestion.extraction, skills: nextSkills } })
  }

  function removeExtractedSkill(index) {
    const nextSkills = ingestion.extraction.skills.filter((_, skillIndex) => skillIndex !== index)
    setIngestion({ ...ingestion, extraction: { ...ingestion.extraction, skills: nextSkills } })
  }

  function updateExtractedMemory(section, index, field, value) {
    const nextSection = ingestion.extraction.memories[section].map((entry, entryIndex) => (
      entryIndex === index ? { ...entry, [field]: value } : entry
    ))
    setIngestion({
      ...ingestion,
      extraction: {
        ...ingestion.extraction,
        memories: { ...ingestion.extraction.memories, [section]: nextSection },
      },
    })
  }

  function removeExtractedMemory(section, index) {
    const nextSection = ingestion.extraction.memories[section].filter((_, entryIndex) => entryIndex !== index)
    setIngestion({
      ...ingestion,
      extraction: {
        ...ingestion.extraction,
        memories: { ...ingestion.extraction.memories, [section]: nextSection },
      },
    })
  }

  function saveExtraction() {
    if (!ingestion.extraction) return
    const extractedSkills = ingestion.extraction.skills
      .map((skill) => skill.name.trim())
      .filter(Boolean)
    const nextSkills = Array.from(new Set([...skills, ...extractedSkills]))
    const nextEntries = Object.fromEntries(
      archiveChapters.map((chapter) => [
        chapter.id,
        [
          ...entries[chapter.id],
          ...ingestion.extraction.memories[chapter.id]
            .filter((entry) => entry.title.trim())
            .map((entry) => ({
              title: entry.title.trim(),
              detail: entry.detail.trim(),
              date: entry.date.trim(),
              confidence: entry.confidence,
            })),
        ],
      ]),
    )

    setSkills(nextSkills)
    setEntries(nextEntries)
    setIngestion({
      status: 'idle',
      fileName: '',
      extraction: null,
      note: 'Evidence remembered inside the archive.',
    })
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
            addSuggestedSkill={addSuggestedSkill}
            setEditDraft={setEditDraft}
            setSkillDraft={setSkillDraft}
            skillDraft={skillDraft}
            skills={skills}
            suggestedSkills={openingSkills}
          />
          <EvidenceIngestion
            ingestion={ingestion}
            onCancel={() => setIngestion({ status: 'idle', fileName: '', extraction: null, note: '' })}
            onFile={handleEvidenceUpload}
            onRemoveMemory={removeExtractedMemory}
            onRemoveSkill={removeExtractedSkill}
            onSave={saveExtraction}
            onUpdateMemory={updateExtractedMemory}
            onUpdateSkill={updateExtractedSkill}
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
          <motion.div
            className="vault-continuation mt-16 flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-end"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.65 }}
          >
            <div>
              <div className="archive-caption">Next passage</div>
              <p className="mt-4 max-w-[360px] text-sm leading-7 text-white/48">
                Bring an opportunity into the archive. AETHRA will read its language against the identity you have begun to shape.
              </p>
            </div>
            <RouteButton label="Read an opportunity" navigate={navigate} path="/opportunity" />
          </motion.div>
        </section>
      </div>
    </motion.main>
  )
}

function EvidenceIngestion({
  ingestion,
  onCancel,
  onFile,
  onRemoveMemory,
  onRemoveSkill,
  onSave,
  onUpdateMemory,
  onUpdateSkill,
}) {
  const extraction = ingestion.extraction
  const extractedMemoryCount = extraction
    ? Object.values(extraction.memories).reduce((count, list) => count + list.length, 0)
    : 0

  return (
    <motion.section
      className="evidence-ingestion mt-14"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.36, duration: 0.7 }}
    >
      <div className="archive-caption">Evidence ingestion / Gemini Vision</div>
      <label className={`evidence-drop mt-6 ${ingestion.status === 'processing' ? 'is-processing' : ''}`}>
        <input accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={onFile} type="file" />
        <span className="evidence-orb">
          {ingestion.status === 'processing' ? <Sparkles className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
        </span>
        <span>
          <strong>{ingestion.status === 'processing' ? 'Reading evidence' : 'Upload proof document'}</strong>
          <small>Resume PDFs, certificates, transcripts, internship letters, screenshots</small>
        </span>
      </label>

      {ingestion.note && (
        <p className={`evidence-note ${ingestion.status === 'error' ? 'is-error' : ''}`}>{ingestion.note}</p>
      )}

      <AnimatePresence>
        {ingestion.status === 'processing' && (
          <motion.div
            className="evidence-processing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <motion.span
              animate={{ x: ['-15%', '115%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p>{ingestion.fileName}</p>
          </motion.div>
        )}

        {ingestion.status === 'review' && extraction && (
          <motion.div
            className="extraction-review"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="extraction-header">
              <div>
                <div className="archive-caption">Draft memories detected</div>
                <h3>{extraction.documentType}</h3>
                <p>{extraction.fileName}</p>
              </div>
              <ConfidenceMark value={extraction.confidence} />
            </div>

            {extraction.note && <p className="extraction-summary">{extraction.note}</p>}

            {extraction.skills.length > 0 && (
              <div className="extraction-block">
                <div className="archive-caption">Skills</div>
                {extraction.skills.map((skill, index) => (
                  <div className="extracted-skill" key={`${skill.name}-${index}`}>
                    <input onChange={(event) => onUpdateSkill(index, event.target.value)} value={skill.name} />
                    <ConfidenceMark value={skill.confidence} />
                    <button aria-label={`Remove ${skill.name}`} onClick={() => onRemoveSkill(index)} type="button">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {archiveChapters.map((chapter) => (
              extraction.memories[chapter.id].length > 0 && (
                <div className="extraction-block" key={chapter.id}>
                  <div className="archive-caption">{chapter.title}</div>
                  {extraction.memories[chapter.id].map((entry, index) => (
                    <div className="extracted-memory" key={`${entry.title}-${index}`}>
                      <div className="extracted-memory-grid">
                        <input onChange={(event) => onUpdateMemory(chapter.id, index, 'title', event.target.value)} value={entry.title} />
                        <input onChange={(event) => onUpdateMemory(chapter.id, index, 'date', event.target.value)} value={entry.date} />
                      </div>
                      <textarea onChange={(event) => onUpdateMemory(chapter.id, index, 'detail', event.target.value)} value={entry.detail} />
                      <div className="extracted-actions">
                        <ConfidenceMark value={entry.confidence} />
                        <button onClick={() => onRemoveMemory(chapter.id, index)} type="button">Discard</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ))}

            <div className="extraction-footer">
              <span>{extraction.skills.length} skills / {extractedMemoryCount} memories</span>
              <div>
                <button onClick={onCancel} type="button">Cancel</button>
                <button className="remember-evidence" onClick={onSave} type="button">Remember evidence</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

function ConfidenceMark({ value }) {
  return (
    <span className="confidence-mark">
      {value}%
    </span>
  )
}

function RouteButton({ label, navigate, path }) {
  return (
    <button
      className="passage-link group"
      onClick={() => navigate(path)}
      type="button"
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
    </button>
  )
}

function OpportunityReader({ navigate }) {
  const [description, setDescription] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [state, setState] = useState('idle')
  const [stage, setStage] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [analysisMeta, setAnalysisMeta] = useState(null)
  const [error, setError] = useState('')
  const [candidateProfile, setCandidateProfile] = useState(() => readVaultProfile())

  useEffect(() => {
    if (state !== 'reading') return undefined

    const timers = readingStages.map((_, index) => window.setTimeout(() => setStage(index + 1), 400 + index * 520))

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [state])

  async function analyze(event) {
    event.preventDefault()
    const jobText = description.trim()
    if (!jobText) return
    const latestProfile = readVaultProfile()
    setCandidateProfile(latestProfile)

    if (!hasVaultData(latestProfile)) {
      setAnalysis(null)
      setAnalysisMeta(null)
      setError('')
      setStage(0)
      setState('empty')
      return
    }

    setAnalysis(null)
    setAnalysisMeta(null)
    setError('')
    setStage(0)
    setState('reading')

    const { note, result, source } = await analyzeJobDescription(jobText, latestProfile)
    setAnalysis(result)
    setAnalysisMeta({ note, source })
    setState('complete')
  }

  function selectJob(job) {
    setSelectedJob(job)
    setDescription(job.description)
    setCandidateProfile(readVaultProfile())
    setAnalysis(null)
    setAnalysisMeta(null)
    setError('')
    setState('idle')
    setStage(0)
  }

  function updateDescription(value) {
    setDescription(value)
    if (selectedJob && value !== selectedJob.description) {
      setSelectedJob(null)
    }
    setAnalysis(null)
    setAnalysisMeta(null)
    setError('')
    setState('idle')
    setStage(0)
  }

  function clearOpportunity() {
    setSelectedJob(null)
    setDescription('')
    setAnalysis(null)
    setAnalysisMeta(null)
    setError('')
    setState('idle')
    setStage(0)
  }

  const analysisSource = selectedJob && description === selectedJob.description
    ? 'Sample role'
    : 'Custom job description'

  return (
    <motion.main
      className="opportunity-page relative z-10 mx-auto w-full max-w-[1540px] px-6 pb-20 pt-10 md:px-10 lg:px-14 lg:pt-16"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <OpportunityContours />
      <div className="relative z-10">
        <div className="eyebrow flex items-center gap-5">
          <span className="h-px w-14 bg-violet-200/45" />
          From identity to opportunity
        </div>
        <div className="opportunity-intro mt-10 grid gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-20">
          <div>
            <h1 className="opportunity-title">
              READ THE
              <span>ROLE</span>
            </h1>
            <p className="manifesto mt-10 max-w-sm">
              Place an opportunity beside your archive. AETHRA listens for what the role asks, what it implies, and where your story already answers.
            </p>
            <button className="return-vault mt-10" onClick={() => navigate('/vault')} type="button">
              <ArrowLeft className="h-4 w-4" />
              Return to Career Vault
            </button>
            <ProfileWhisper candidateProfile={candidateProfile} />
          </div>

          <form className="opportunity-input" onSubmit={analyze}>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="archive-caption">Opportunity text / paste any description</div>
                <div className="source-indicator mt-4">
                  Analyzing <span>{analysisSource}</span>
                </div>
              </div>
              <button className="clear-opportunity" disabled={state === 'reading' || !description.trim()} onClick={clearOpportunity} type="button">
                Clear
              </button>
            </div>
            <div className="job-card-row mt-7">
              {jobCards.map((job) => (
                <button
                  className={`job-card ${selectedJob?.title === job.title && description === job.description ? 'is-selected' : ''}`}
                  key={job.title}
                  onClick={() => selectJob(job)}
                  type="button"
                >
                  <span>{job.title}</span>
                  <small>{job.meta}</small>
                </button>
              ))}
            </div>
            <textarea
              onChange={(event) => updateDescription(event.target.value)}
              placeholder="Paste any job description here. AETHRA will read this custom text first, even if you began from a sample role..."
              value={description}
            />
            <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <p className="text-xs leading-6 text-white/34">
                Gemini reads the role language and returns structured JSON. If no API key is present, AETHRA falls back to a local demo reading.
              </p>
              <button className="analyze-button group" disabled={state === 'reading'} type="submit">
                {state === 'reading' ? 'Reading' : 'Analyze'}
                <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
              </button>
            </div>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {state === 'reading' && (
            <ReadingSequence key="reading" stage={stage} stages={readingStages} />
          )}
          {state === 'error' && (
            <AnalysisError key="error" message={error} />
          )}
          {state === 'empty' && (
            <EmptyArchiveMessage key="empty" navigate={navigate} />
          )}
          {state === 'complete' && analysis && (
            <Interpretation analysis={analysis} key="complete" meta={analysisMeta} />
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  )
}

function ProfileWhisper({ candidateProfile }) {
  const memoryCount = Object.values(candidateProfile.memories).reduce((count, list) => count + list.length, 0)
  return (
    <div className="profile-whisper mt-12">
      <div className="archive-caption">Archive currently in memory</div>
      <div className="mt-5 flex flex-wrap gap-5 text-sm text-white/54">
        <span>{candidateProfile.skills.length} skills</span>
        <span>{memoryCount} memories</span>
      </div>
    </div>
  )
}

function EmptyArchiveMessage({ navigate }) {
  return (
    <motion.section
      className="empty-archive-message mt-20"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="archive-caption">Adaptive intelligence dormant</div>
      <p className="mt-5">Your archive is empty. Add career memories to activate adaptive intelligence.</p>
      <button className="return-vault mt-8" onClick={() => navigate('/vault')} type="button">
        <ArrowLeft className="h-4 w-4" />
        Open Career Vault
      </button>
    </motion.section>
  )
}

function AnalysisError({ message }) {
  return (
    <motion.section
      className="analysis-error mt-20"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="archive-caption">Interpretation interrupted</div>
      <p className="mt-5">{message}</p>
    </motion.section>
  )
}

function ReadingSequence({ stage, stages }) {
  return (
    <motion.section
      className="reading-sequence mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="archive-caption">AETHRA is interpreting</div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {stages.map((message, index) => (
          <motion.div
            className={`reading-stage ${stage > index ? 'is-heard' : ''}`}
            animate={{ opacity: stage > index ? 1 : 0.25 }}
            key={message}
          >
            <span>{`0${index + 1}`}</span>
            {message}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="reading-line mt-10 h-px"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 0.72] }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
    </motion.section>
  )
}

function Interpretation({ analysis, meta }) {
  return (
    <motion.section
      className="interpretation mt-20"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <div className="archive-caption">Personalized opportunity reading</div>
          <h2 className="interpretation-role mt-5">{analysis.recruiterFeedback}</h2>
          {meta?.note && <p className="analysis-note mt-5">{meta.note}</p>}
        </div>
        <div className="match-resonance">
          <div className="archive-caption">Match score</div>
          <div className="mt-3">{analysis.matchScore}<span>%</span></div>
          <small>{analysis.hiringProbability}% hiring probability</small>
        </div>
      </div>

      <div className="interpretation-grid">
        <ResultPassage title="Matching skills">
          <TagFlow items={analysis.matchingSkills.length ? analysis.matchingSkills : ['No strong overlap yet']} tone="present" />
        </ResultPassage>
        <ResultPassage title="Missing threads">
          <TagFlow items={analysis.missingSkills.length ? analysis.missingSkills : ['No clear gap detected']} tone="missing" />
        </ResultPassage>
        <ResultPassage title="Improvement suggestions">
          <TagFlow items={analysis.improvementSuggestions.length ? analysis.improvementSuggestions : ['Tailor evidence to the role language']} tone="missing" />
        </ResultPassage>
        <ResultPassage title="Strongest projects">
          <TagFlow items={analysis.strongestProjects.length ? analysis.strongestProjects : ['Add project memories to strengthen this reading']} tone="present" />
        </ResultPassage>
        <ResultPassage title="Resume focus areas">
          <TagFlow items={analysis.resumeFocusAreas.length ? analysis.resumeFocusAreas : ['Summary', 'Projects', 'Skills']} tone="present" />
        </ResultPassage>
      </div>
    </motion.section>
  )
}

function ResultPassage({ children, className = '', title }) {
  return (
    <motion.article
      className={`result-passage ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="archive-caption">{title}</div>
      <div className="mt-6">{children}</div>
    </motion.article>
  )
}

function TagFlow({ items, tone }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item, index) => (
        <motion.span
          className={`analysis-tag ${tone}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.06 }}
          key={item}
        >
          {item}
        </motion.span>
      ))}
    </div>
  )
}

function OpportunityContours() {
  return (
    <div className="opportunity-contours pointer-events-none absolute right-[-10%] top-[11rem] h-[380px] w-[680px] opacity-35">
      <ContourSvg />
    </div>
  )
}

function SkillField(props) {
  const availableSuggestions = props.suggestedSkills.filter((skill) => !props.skills.includes(skill))

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
      {props.skills.length === 0 && (
        <p className="skill-empty mt-6">
          Begin with one signal, then let the archive get more specific.
        </p>
      )}
      {availableSuggestions.length > 0 && (
        <div className="skill-suggestions mt-6">
          {availableSuggestions.map((skill) => (
            <button key={skill} onClick={() => props.addSuggestedSkill(skill)} type="button">
              {skill}
            </button>
          ))}
        </div>
      )}
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
              {entries.length === 0 && (
                <motion.div
                  className="memory-row is-ghost"
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="memory-title">{chapter.example.title}</div>
                  <div className="memory-detail">{chapter.example.detail}</div>
                  <div className="memory-date">{chapter.example.date}</div>
                </motion.div>
              )}
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
