import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus, Sparkles, Upload, X } from 'lucide-react'

const navigation = [
  { label: 'Archive', path: '/vault' },
  { label: 'Opportunity', path: '/opportunity' },
  { label: 'Forge', path: '/forge' },
  { label: 'Simulation', path: '/simulation' },
  { label: 'Method', path: '/method' },
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
const forgeStages = ['Heating archive signals', 'Aligning ATS language', 'Forging resume structure']
const simulationStages = ['Opening private review', 'Testing recruiter signals', 'Writing evaluation notes']
const emptyVaultMemories = Object.fromEntries(archiveChapters.map((chapter) => [chapter.id, []]))
const vaultProfileVersionKey = 'aethra-vault-profile-version'
const supportedEvidenceTypes = ['application/pdf', 'image/png', 'image/jpeg']
const opportunityAnalysisKey = 'aethra-opportunity-analysis'
const forgedResumeKey = 'aethra-forged-resume'

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
  const personal = readArchive('aethra-vault-personal', {})

  if (isLegacySeededProfile(normalizedSkills, memories)) {
    return {
      personal: {},
      skills: [],
      memories: emptyVaultMemories,
    }
  }

  return {
    personal,
    skills: normalizedSkills,
    memories,
  }
}

function hasVaultData(profile) {
  return Object.values(profile.personal || {}).some(Boolean)
    || profile.skills.length > 0
    || Object.values(profile.memories).some((items) => items.length > 0)
}

function flattenProfileText(profile) {
  const personalText = Object.values(profile.personal || {}).join(' ')
  const memoryText = archiveChapters.flatMap((chapter) => (
    profile.memories[chapter.id].map((entry) => `${chapter.title}: ${entry.title} ${entry.detail} ${entry.date}`)
  ))
  return [personalText].concat(profile.skills, memoryText).join(' ').toLowerCase()
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

function normalizeResume(raw, profile) {
  const personal = profile.personal || {}
  return {
    name: String(raw.name || personal.fullName || 'Unnamed Candidate'),
    title: String(raw.title || personal.headline || 'Adaptive Resume'),
    professionalSummary: String(raw.professionalSummary || raw.summary || personal.summary || 'A focused candidate profile tailored to the analyzed opportunity.'),
    skills: toArray(raw.skills),
    projects: toArray(raw.projects),
    experience: toArray(raw.experience),
    education: toArray(raw.education),
    certifications: toArray(raw.certifications),
    atsKeywordsUsed: toArray(raw.atsKeywordsUsed || raw.atsKeywords),
    tailoringNotes: toArray(raw.tailoringNotes),
  }
}

function normalizeSimulation(raw) {
  return {
    shortlistDecision: String(raw.shortlistDecision || raw.decision || 'Maybe'),
    hiringProbability: Number.isFinite(Number(raw.hiringProbability)) ? Math.max(0, Math.min(100, Math.round(Number(raw.hiringProbability)))) : 50,
    recruiterSummary: String(raw.recruiterSummary || raw.summary || 'The recruiter review needs clearer evidence before making a strong decision.'),
    topStrengths: toArray(raw.topStrengths),
    redFlags: toArray(raw.redFlags),
    missingSignals: toArray(raw.missingSignals),
    interviewQuestions: toArray(raw.interviewQuestions),
    resumeImprovements: toArray(raw.resumeImprovements),
    finalAdvice: String(raw.finalAdvice || 'Tighten the resume around the role requirements and make the strongest proof easier to find.'),
  }
}

function hasUsableGeminiKey(apiKey) {
  return Boolean(
    apiKey
    && apiKey !== 'your_api_key_here'
    && !apiKey.includes('NOT_SET')
  )
}

function readOpportunityAnalysis() {
  return readArchive(opportunityAnalysisKey, null)
}

function readForgedResume() {
  return readArchive(forgedResumeKey, null)
}

function formatMemory(entry) {
  return [entry.title, entry.organization, entry.detail, entry.date, entry.technologies].filter(Boolean).join(' - ')
}

function createFallbackResume(profile, opportunity) {
  const memories = profile.memories || emptyVaultMemories
  const projects = (memories.projects || []).map(formatMemory).filter(Boolean).slice(0, 4)
  const experience = (memories.internships || []).map(formatMemory).filter(Boolean).slice(0, 4)
  const education = (memories.education || []).map(formatMemory).filter(Boolean).slice(0, 3)
  const certifications = (memories.certifications || []).map(formatMemory).filter(Boolean).slice(0, 4)
  const analysis = opportunity?.analysis || {}

  return normalizeResume({
    name: profile.personal?.fullName,
    title: analysis.detectedJobRole || profile.personal?.headline || 'Tailored Candidate',
    professionalSummary: analysis.recruiterFeedback || profile.personal?.summary || 'Career profile tailored to the analyzed role using archived experience, skills, and proof-backed memories.',
    skills: profile.skills || [],
    projects,
    experience,
    education,
    certifications,
    atsKeywordsUsed: [
      ...(analysis.matchingSkills || []),
      ...(analysis.resumeFocusAreas || []),
    ],
    tailoringNotes: analysis.improvementSuggestions || ['Prioritized archive evidence that best matches the analyzed opportunity.'],
  }, profile)
}

function createFallbackSimulation(profile, opportunity, resume) {
  const analysis = opportunity?.analysis || {}
  const matchScore = Number(analysis.matchScore || 56)
  const resumeSkills = resume?.skills || []
  const matchingSkills = analysis.matchingSkills || []
  const missingSkills = analysis.missingSkills || []

  return normalizeSimulation({
    shortlistDecision: matchScore >= 82 ? 'Strong Yes' : matchScore >= 68 ? 'Yes' : matchScore >= 48 ? 'Maybe' : 'No',
    hiringProbability: Math.max(20, Math.min(92, Math.round((matchScore + Number(analysis.hiringProbability || matchScore)) / 2))),
    recruiterSummary: analysis.recruiterFeedback || `The candidate shows relevant signals for ${resume?.title || 'the role'}, but the recruiter would still look for proof depth and clearer outcomes.`,
    topStrengths: matchingSkills.length ? matchingSkills : resumeSkills.slice(0, 4),
    redFlags: missingSkills.length ? missingSkills.slice(0, 4) : ['Some impact metrics may need to be more visible'],
    missingSignals: missingSkills.length ? missingSkills : ['Clearer quantified outcomes', 'Role-specific proof points'],
    interviewQuestions: [
      'Which project best proves your fit for this role, and what changed because of your work?',
      'Tell me about a time you handled ambiguity in a product or technical decision.',
      'Which missing requirement are you actively strengthening right now?',
    ],
    resumeImprovements: analysis.improvementSuggestions || resume?.tailoringNotes || ['Move the strongest matching evidence closer to the top of the resume.'],
    finalAdvice: 'Make the first scan effortless: mirror role language, prove outcomes, and keep the resume focused on the opportunity.',
  })
}

async function runRecruiterSimulation(profile, opportunity, resume) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const fallbackResult = createFallbackSimulation(profile, opportunity, resume)

  if (!hasUsableGeminiKey(apiKey)) {
    return {
      result: fallbackResult,
      source: 'fallback',
      note: 'Gemini API key is missing, so AETHRA used a local recruiter review draft.',
    }
  }

  const prompt = `Simulate how a human recruiter would evaluate this candidate for the selected job.
Use the candidate profile, job description, job analysis, and generated resume.
Return only valid JSON with exactly these fields:
{
  "shortlistDecision": "Strong Yes / Yes / Maybe / No",
  "hiringProbability": 0,
  "recruiterSummary": "",
  "topStrengths": [],
  "redFlags": [],
  "missingSignals": [],
  "interviewQuestions": [],
  "resumeImprovements": [],
  "finalAdvice": ""
}
Candidate profile: ${JSON.stringify(profile)}
Job description: ${opportunity.jobDescription}
Job analysis: ${JSON.stringify(opportunity.analysis)}
Generated resume: ${JSON.stringify(resume)}`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.25,
        },
      }),
    })

    if (!response.ok) {
      return {
        result: fallbackResult,
        source: 'fallback',
        note: `${await readGeminiError(response)} AETHRA used a local recruiter review draft instead.`,
      }
    }

    const payload = await response.json()
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n')

    if (!text) {
      return {
        result: fallbackResult,
        source: 'fallback',
        note: 'Gemini returned an empty recruiter review, so AETHRA used a local recruiter review draft instead.',
      }
    }

    return {
      result: normalizeSimulation(JSON.parse(extractJson(text))),
      source: 'gemini',
      note: 'Gemini simulated this private recruiter review from the full candidate packet.',
    }
  } catch (error) {
    return {
      result: fallbackResult,
      source: 'fallback',
      note: `Recruiter simulation could not complete cleanly (${error.message}). AETHRA used a local recruiter review draft instead.`,
    }
  }
}

async function generateAdaptiveResume(profile, opportunity) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  const fallbackResult = createFallbackResume(profile, opportunity)

  if (!hasUsableGeminiKey(apiKey)) {
    return {
      result: fallbackResult,
      source: 'fallback',
      note: 'Gemini API key is missing, so AETHRA forged a local resume draft from your archive.',
    }
  }

  const prompt = `Generate a tailored ATS-friendly resume using this Career Archive, Job Description, and Job Description Analyzer result.
Return only valid JSON with exactly these fields:
{
  "name": "",
  "title": "",
  "professionalSummary": "",
  "skills": [],
  "projects": [],
  "experience": [],
  "education": [],
  "certifications": [],
  "atsKeywordsUsed": [],
  "tailoringNotes": []
}
Career Archive: ${JSON.stringify(profile)}
Job Description: ${opportunity.jobDescription}
Job Description Analyzer Result: ${JSON.stringify(opportunity.analysis)}`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    })

    if (!response.ok) {
      return {
        result: fallbackResult,
        source: 'fallback',
        note: `${await readGeminiError(response)} AETHRA forged a local resume draft instead.`,
      }
    }

    const payload = await response.json()
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n')

    if (!text) {
      return {
        result: fallbackResult,
        source: 'fallback',
        note: 'Gemini returned an empty resume, so AETHRA forged a local resume draft instead.',
      }
    }

    return {
      result: normalizeResume(JSON.parse(extractJson(text)), profile),
      source: 'gemini',
      note: 'Gemini forged this resume from your archive and opportunity analysis.',
    }
  } catch (error) {
    return {
      result: fallbackResult,
      source: 'fallback',
      note: `Resume forging could not complete cleanly (${error.message}). AETHRA forged a local resume draft instead.`,
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
  const isForge = path === '/forge'
  const isSimulation = path === '/simulation'
  const insideArchive = isVault || isOpportunity || isForge || isSimulation

  return (
    <div className="exhibition relative min-h-screen overflow-hidden bg-black text-white" onPointerMove={handlePointerMove}>
      <Atmosphere pointerGlow={pointerGlow} vault={insideArchive} />
      <Header activePath={path} insideArchive={insideArchive} navigate={navigate} />
      <AnimatePresence mode="wait">
        {isVault ? (
          <CareerVault key="vault" navigate={navigate} />
        ) : isOpportunity ? (
          <OpportunityReader key="opportunity" navigate={navigate} />
        ) : isForge ? (
          <ResumeForge key="forge" navigate={navigate} />
        ) : isSimulation ? (
          <RecruiterSimulation key="simulation" navigate={navigate} />
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

const sectionSteps = [
  { id: 'personal', label: 'Personal Details' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'internships', label: 'Internships' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
]

const repeatableSections = sectionSteps.filter((step) => !['personal', 'skills'].includes(step.id)).map((step) => step.id)

const proofLabels = {
  education: 'Upload transcript or marksheet',
  projects: 'Upload project report, demo screenshot, or certificate',
  internships: 'Upload offer letter or completion certificate',
  certifications: 'Upload certificate PDF or image',
  achievements: 'Upload certificate or proof screenshot',
}

const emptyEntry = {
  title: '',
  detail: '',
  date: '',
  organization: '',
  technologies: '',
  proof: null,
}

function createEntry(seed = {}) {
  return { ...emptyEntry, ...seed, proof: seed.proof || null }
}

function normalizeBuilderEntries(memories) {
  return Object.fromEntries(
    archiveChapters.map((chapter) => [
      chapter.id,
      (memories[chapter.id] || []).map((entry) => createEntry(entry)),
    ]),
  )
}

function readPersonalDetails() {
  return readArchive('aethra-vault-personal', {
    fullName: '',
    headline: '',
    email: '',
    location: '',
    portfolio: '',
    summary: '',
  })
}

function persistVaultData(personal, skills, entries) {
  const memoryPayload = Object.fromEntries(
    archiveChapters.map((chapter) => [chapter.id, entries[chapter.id] || []]),
  )

  window.localStorage.setItem(vaultProfileVersionKey, '2')
  window.localStorage.setItem('aethra-vault-personal', JSON.stringify(personal))
  window.localStorage.setItem('aethra-vault-skills', JSON.stringify(skills))
  window.localStorage.setItem('aethra-vault-memories', JSON.stringify(memoryPayload))
  archiveChapters.forEach((chapter) => {
    window.localStorage.setItem(`aethra-vault-${chapter.id}`, JSON.stringify(memoryPayload[chapter.id] || []))
  })
}

function CareerVault({ navigate }) {
  const profile = readVaultProfile()
  const [activeSection, setActiveSection] = useState('personal')
  const [personal, setPersonal] = useState(() => readPersonalDetails())
  const [skills, setSkills] = useState(() => profile.skills)
  const [skillDraft, setSkillDraft] = useState('')
  const [entries, setEntries] = useState(() => normalizeBuilderEntries(profile.memories))
  const [forms, setForms] = useState(() => Object.fromEntries(
    repeatableSections.map((section) => [section, createEntry()]),
  ))
  const [editing, setEditing] = useState({})
  const [saveState, setSaveState] = useState('idle')

  const memoryCount = Object.values(entries).reduce((count, list) => count + list.length, 0)
  const completedSections = sectionSteps.filter((step) => sectionComplete(step.id, personal, skills, entries)).length
  const progress = Math.round((completedSections / sectionSteps.length) * 100)

  useEffect(() => {
    const timer = window.setTimeout(() => persistVaultData(personal, skills, entries), 350)
    return () => window.clearTimeout(timer)
  }, [personal, skills, entries])

  function persistArchive() {
    persistVaultData(personal, skills, entries)
  }

  function saveArchive() {
    persistArchive()
    setSaveState('saved')
    window.setTimeout(() => setSaveState('idle'), 1600)
  }

  function updatePersonal(field, value) {
    setPersonal({ ...personal, [field]: value })
  }

  function addSkill(event) {
    event.preventDefault()
    const nextSkill = skillDraft.trim()
    if (!nextSkill || skills.includes(nextSkill)) return
    setSkills([...skills, nextSkill])
    setSkillDraft('')
  }

  function updateForm(section, field, value) {
    setForms({ ...forms, [section]: { ...forms[section], [field]: value } })
  }

  function attachProof(section, file) {
    if (!file || !supportedEvidenceTypes.includes(file.type)) return
    updateForm(section, 'proof', {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    })
  }

  function saveEntry(section) {
    const draft = forms[section]
    if (!draft.title.trim() && !draft.detail.trim()) return
    const entry = createEntry({
      ...draft,
      title: draft.title.trim(),
      detail: draft.detail.trim(),
      date: draft.date.trim(),
      organization: draft.organization.trim(),
      technologies: draft.technologies.trim(),
    })
    const editIndex = editing[section]
    const nextList = Number.isInteger(editIndex)
      ? entries[section].map((item, index) => (index === editIndex ? entry : item))
      : [...entries[section], entry]

    setEntries({ ...entries, [section]: nextList })
    setForms({ ...forms, [section]: createEntry() })
    setEditing({ ...editing, [section]: null })
  }

  function editEntry(section, index) {
    setForms({ ...forms, [section]: createEntry(entries[section][index]) })
    setEditing({ ...editing, [section]: index })
  }

  function deleteEntry(section, index) {
    setEntries({ ...entries, [section]: entries[section].filter((_, entryIndex) => entryIndex !== index) })
    if (editing[section] === index) {
      setForms({ ...forms, [section]: createEntry() })
      setEditing({ ...editing, [section]: null })
    }
  }

  function resetEntry(section) {
    setForms({ ...forms, [section]: createEntry() })
    setEditing({ ...editing, [section]: null })
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
      <div className="relative z-10">
        <section className="vault-builder-hero">
          <div>
            <div className="eyebrow flex items-center gap-5">
              <span className="h-px w-14 bg-violet-200/45" />
              Structured career archive
            </div>
            <h1 className="vault-title mt-10">
              CAREER
              <span>PROFILE</span>
            </h1>
          </div>
          <div className="vault-save-panel">
            <p>A cleaner archive for the intelligence layer: profile fields, proof, and career memories saved as one living record.</p>
            <button className="save-archive" onClick={saveArchive} type="button">
              {saveState === 'saved' ? 'Archive saved' : 'Save Archive'}
            </button>
          </div>
        </section>

        <div className="vault-builder mt-14">
          <aside className="vault-steps">
            <div className="archive-caption">Profile completion</div>
            <div className="vault-progress mt-5"><span style={{ width: `${progress}%` }} /></div>
            <div className="mt-3 text-sm text-white/58">{progress}% remembered</div>
            <nav className="mt-8">
              {sectionSteps.map((step, index) => (
                <button
                  className={`vault-step ${activeSection === step.id ? 'is-active' : ''} ${sectionComplete(step.id, personal, skills, entries) ? 'is-complete' : ''}`}
                  key={step.id}
                  onClick={() => setActiveSection(step.id)}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {step.label}
                </button>
              ))}
            </nav>
            <ArchivePreview entries={entries} memoryCount={memoryCount} navigate={navigate} personal={personal} skills={skills} />
          </aside>

          <section className="vault-form-stage">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="vault-form-card"
                exit={{ opacity: 0, y: -12 }}
                initial={{ opacity: 0, y: 16 }}
                key={activeSection}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeSection === 'personal' ? (
                  <PersonalSection personal={personal} updatePersonal={updatePersonal} />
                ) : activeSection === 'skills' ? (
                  <SkillsSection addSkill={addSkill} setSkillDraft={setSkillDraft} skillDraft={skillDraft} skills={skills} setSkills={setSkills} />
                ) : (
                  <RepeatableSection
                    entries={entries[activeSection]}
                    form={forms[activeSection]}
                    isEditing={Number.isInteger(editing[activeSection])}
                    onAttachProof={(file) => attachProof(activeSection, file)}
                    onDelete={(index) => deleteEntry(activeSection, index)}
                    onEdit={(index) => editEntry(activeSection, index)}
                    onReset={() => resetEntry(activeSection)}
                    onSave={() => saveEntry(activeSection)}
                    onUpdate={(field, value) => updateForm(activeSection, field, value)}
                    section={activeSection}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </div>
    </motion.main>
  )
}

function sectionComplete(section, personal, skills, entries) {
  if (section === 'personal') return Boolean(personal.fullName || personal.headline || personal.email)
  if (section === 'skills') return skills.length > 0
  return (entries[section] || []).length > 0
}

function PersonalSection({ personal, updatePersonal }) {
  return (
    <>
      <SectionHeader eyebrow="01 / personal details" title="The human signal before the evidence." />
      <div className="profile-grid mt-8">
        <Field label="Full name" onChange={(value) => updatePersonal('fullName', value)} value={personal.fullName} />
        <Field label="Headline" onChange={(value) => updatePersonal('headline', value)} placeholder="Frontend engineer, product designer..." value={personal.headline} />
        <Field label="Email" onChange={(value) => updatePersonal('email', value)} value={personal.email} />
        <Field label="Location" onChange={(value) => updatePersonal('location', value)} value={personal.location} />
        <Field label="Portfolio / LinkedIn" onChange={(value) => updatePersonal('portfolio', value)} value={personal.portfolio} />
      </div>
      <Field area label="Profile summary" onChange={(value) => updatePersonal('summary', value)} placeholder="A short identity note for recruiters and AETHRA's analyzer..." value={personal.summary} />
    </>
  )
}

function SkillsSection({ addSkill, setSkillDraft, setSkills, skillDraft, skills }) {
  return (
    <>
      <SectionHeader eyebrow="03 / skills" title="Shape the vocabulary AETHRA should recognize." />
      <form className="builder-skill-input mt-8" onSubmit={addSkill}>
        <Plus className="h-4 w-4" />
        <input onChange={(event) => setSkillDraft(event.target.value)} placeholder="Add a skill, tool, technology, or method" value={skillDraft} />
        <button type="submit">Add</button>
      </form>
      <div className="builder-skill-cloud mt-7">
        {skills.map((skill) => (
          <span key={skill}>
            {skill}
            <button aria-label={`Remove ${skill}`} onClick={() => setSkills(skills.filter((item) => item !== skill))} type="button">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {skills.length === 0 && <p>No skills saved yet. Start with the language you want recruiters to notice.</p>}
      </div>
    </>
  )
}

function RepeatableSection({ entries, form, isEditing, onAttachProof, onDelete, onEdit, onReset, onSave, onUpdate, section }) {
  const labels = {
    education: { eyebrow: '02 / education', title: 'Academic foundations, with proof attached.', titleField: 'Degree / program', org: 'Institution' },
    projects: { eyebrow: '04 / projects', title: 'Work you built, shipped, tested, or imagined.', titleField: 'Project name', org: 'Role / context' },
    internships: { eyebrow: '05 / internships', title: 'Professional rooms where your practice changed.', titleField: 'Internship role', org: 'Company' },
    certifications: { eyebrow: '06 / certifications', title: 'Credentials and learning signals worth remembering.', titleField: 'Certification name', org: 'Issuing organization' },
    achievements: { eyebrow: '07 / achievements', title: 'Visible moments of recognition and momentum.', titleField: 'Achievement / event', org: 'Organization / event host' },
  }[section]

  return (
    <>
      <SectionHeader eyebrow={labels.eyebrow} title={labels.title} />
      <div className="entry-form mt-8">
        <div className="profile-grid">
          <Field label={labels.titleField} onChange={(value) => onUpdate('title', value)} value={form.title} />
          <Field label={labels.org} onChange={(value) => onUpdate('organization', value)} value={form.organization} />
          <Field label="Dates / year" onChange={(value) => onUpdate('date', value)} placeholder="2025, Jan-Mar 2026..." value={form.date} />
          <Field label="Technologies / keywords" onChange={(value) => onUpdate('technologies', value)} value={form.technologies} />
        </div>
        <Field area label="Details" onChange={(value) => onUpdate('detail', value)} placeholder="What happened, what you made, what changed, what can be verified..." value={form.detail} />
        <ProofUpload label={proofLabels[section]} onAttach={onAttachProof} proof={form.proof} />
        <div className="form-actions">
          <button onClick={onReset} type="button">Clear</button>
          <button className="add-entry" onClick={onSave} type="button">{isEditing ? 'Save edit' : 'Add another'}</button>
        </div>
      </div>
      <SavedEntries entries={entries} onDelete={onDelete} onEdit={onEdit} />
    </>
  )
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div>
      <div className="archive-caption">{eyebrow}</div>
      <h2 className="builder-section-title mt-4">{title}</h2>
    </div>
  )
}

function Field({ area = false, label, onChange, placeholder = '', value }) {
  return (
    <label className={`builder-field ${area ? 'is-area' : ''}`}>
      <span>{label}</span>
      {area ? (
        <textarea onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
      ) : (
        <input onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
      )}
    </label>
  )
}

function ProofUpload({ label, onAttach, proof }) {
  return (
    <label className="proof-upload">
      <input
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        onChange={(event) => {
          onAttach(event.target.files?.[0])
          event.target.value = ''
        }}
        type="file"
      />
      <Upload className="h-4 w-4" />
      <span>{proof?.name || label}</span>
      <small>{proof ? 'Proof attached locally' : 'PDF, PNG, JPG, JPEG'}</small>
    </label>
  )
}

function SavedEntries({ entries, onDelete, onEdit }) {
  return (
    <div className="saved-entry-list mt-8">
      <div className="archive-caption">Saved entries</div>
      {entries.length === 0 ? (
        <p className="empty-builder-copy">Nothing saved here yet.</p>
      ) : entries.map((entry, index) => (
        <article className="saved-entry" key={`${entry.title}-${index}`}>
          <div>
            <h3>{entry.title}</h3>
            <p>{entry.organization || entry.detail}</p>
            <small>{entry.date || 'Undated'}{entry.proof?.name ? ` / proof: ${entry.proof.name}` : ''}</small>
          </div>
          <div className="entry-actions">
            <button onClick={() => onEdit(index)} type="button">Edit</button>
            <button onClick={() => onDelete(index)} type="button">Delete</button>
          </div>
        </article>
      ))}
    </div>
  )
}

function ArchivePreview({ entries, memoryCount, navigate, personal, skills }) {
  const previewItems = archiveChapters.flatMap((chapter) => (
    entries[chapter.id].slice(0, 2).map((entry) => ({ ...entry, section: chapter.title }))
  )).slice(0, 5)

  return (
    <div className="archive-preview mt-10">
      <div className="archive-caption">Preview</div>
      <h3>{personal.fullName || 'Unnamed profile'}</h3>
      <p>{personal.headline || 'Add personal details to give this archive a face.'}</p>
      <div className="preview-metrics">
        <span>{skills.length} skills</span>
        <span>{memoryCount} memories</span>
      </div>
      <div className="preview-list">
        {previewItems.map((item, index) => (
          <div key={`${item.title}-${index}`}>
            <small>{item.section}</small>
            <span>{item.title}</span>
          </div>
        ))}
      </div>
      <button className="passage-link mt-8" onClick={() => navigate('/opportunity')} type="button">
        Read an opportunity <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function ResumeForge({ navigate }) {
  const [state, setState] = useState('idle')
  const [stage, setStage] = useState(0)
  const [resume, setResume] = useState(null)
  const [meta, setMeta] = useState(null)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (state !== 'forging') return undefined
    const timers = forgeStages.map((_, index) => window.setTimeout(() => setStage(index + 1), 360 + index * 520))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [state])

  async function forgeResume() {
    const profile = readVaultProfile()
    const opportunity = readOpportunityAnalysis()

    if (!hasVaultData(profile)) {
      setMessage('Complete your Career Archive first.')
      setState('blocked')
      return
    }

    if (!opportunity?.jobDescription || !opportunity?.analysis) {
      setMessage('Analyze an opportunity first.')
      setState('blocked')
      return
    }

    setResume(null)
    setMeta(null)
    setMessage('')
    setCopied(false)
    setStage(0)
    setState('forging')

    const { note, result, source } = await generateAdaptiveResume(profile, opportunity)
    setResume(result)
    setMeta({ note, source })
    window.localStorage.setItem(forgedResumeKey, JSON.stringify({
      resume: result,
      meta: { note, source },
      updatedAt: new Date().toISOString(),
    }))
    setState('complete')
  }

  async function copyResume() {
    if (!resume) return
    const text = resumeToText(resume)
    try {
      await window.navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <motion.main
      className="forge-page relative z-10 mx-auto w-full max-w-[1540px] px-6 pb-20 pt-10 md:px-10 lg:px-14 lg:pt-16"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="forge-hero">
        <div>
          <div className="eyebrow flex items-center gap-5">
            <span className="h-px w-14 bg-violet-200/45" />
            Resume Forge / adaptive document
          </div>
          <h1 className="forge-title mt-10">
            RESUME
            <span>FORGE</span>
          </h1>
        </div>
        <div className="forge-command">
          <p>AETHRA compresses your archive, opportunity reading, and ATS language into a focused resume draft.</p>
          <button className="forge-button group" disabled={state === 'forging'} onClick={forgeResume} type="button">
            {state === 'forging' ? 'Forging' : 'Generate Adaptive Resume'}
            <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === 'blocked' && (
          <motion.section className="forge-blocked mt-16" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="archive-caption">Forge paused</div>
            <p>{message}</p>
            <button className="return-vault mt-8" onClick={() => navigate(message.includes('Archive') ? '/vault' : '/opportunity')} type="button">
              <ArrowLeft className="h-4 w-4" />
              {message.includes('Archive') ? 'Open Career Archive' : 'Analyze opportunity'}
            </button>
          </motion.section>
        )}

        {state === 'forging' && (
          <ForgeSequence key="forging" stage={stage} />
        )}

        {state === 'complete' && resume && (
          <motion.section className="forge-output mt-16" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="forge-toolbar">
              <div>
                <div className="archive-caption">Forged resume</div>
                {meta?.note && <p>{meta.note}</p>}
              </div>
              <div>
                <button onClick={copyResume} type="button">{copied ? 'Copied' : 'Copy Resume'}</button>
                <button disabled type="button">Download as PDF later</button>
                <button onClick={forgeResume} type="button">Regenerate</button>
              </div>
            </div>
            <ResumeDocument resume={resume} />
          </motion.section>
        )}
      </AnimatePresence>
    </motion.main>
  )
}

function ForgeSequence({ stage }) {
  return (
    <motion.section className="forge-sequence mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
      <div className="archive-caption">Document being forged</div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {forgeStages.map((message, index) => (
          <motion.div className={`reading-stage ${stage > index ? 'is-heard' : ''}`} animate={{ opacity: stage > index ? 1 : 0.25 }} key={message}>
            <span>{`0${index + 1}`}</span>
            {message}
          </motion.div>
        ))}
      </div>
      <motion.div className="forge-heat mt-10" animate={{ scaleX: [0.1, 1, 0.68], opacity: [0.2, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
    </motion.section>
  )
}

function ResumeDocument({ resume }) {
  return (
    <article className="resume-document mt-10">
      <header>
        <h2>{resume.name}</h2>
        <p>{resume.title}</p>
      </header>
      <ResumeSection title="Professional Summary">
        <p>{resume.professionalSummary}</p>
      </ResumeSection>
      <ResumeSection title="Skills">
        <div className="resume-chip-row">{resume.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
      </ResumeSection>
      <ResumeList title="Projects" items={resume.projects} />
      <ResumeList title="Experience" items={resume.experience} />
      <ResumeList title="Education" items={resume.education} />
      <ResumeList title="Certifications" items={resume.certifications} />
      <ResumeSection title="ATS Keywords Used">
        <div className="resume-chip-row muted">{resume.atsKeywordsUsed.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
      </ResumeSection>
      <ResumeList title="Tailoring Notes" items={resume.tailoringNotes} />
    </article>
  )
}

function ResumeSection({ children, title }) {
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function ResumeList({ items, title }) {
  if (!items.length) return null
  return (
    <ResumeSection title={title}>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </ResumeSection>
  )
}

function resumeToText(resume) {
  const lines = [
    resume.name,
    resume.title,
    '',
    'PROFESSIONAL SUMMARY',
    resume.professionalSummary,
    '',
    'SKILLS',
    resume.skills.join(', '),
    '',
  ]

  ;[
    ['PROJECTS', resume.projects],
    ['EXPERIENCE', resume.experience],
    ['EDUCATION', resume.education],
    ['CERTIFICATIONS', resume.certifications],
    ['ATS KEYWORDS USED', resume.atsKeywordsUsed],
    ['TAILORING NOTES', resume.tailoringNotes],
  ].forEach(([title, items]) => {
    if (!items.length) return
    lines.push(title, ...items.map((item) => `- ${item}`), '')
  })

  return lines.join('\n')
}

function RecruiterSimulation({ navigate }) {
  const [state, setState] = useState('idle')
  const [stage, setStage] = useState(0)
  const [review, setReview] = useState(null)
  const [meta, setMeta] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (state !== 'simulating') return undefined
    const timers = simulationStages.map((_, index) => window.setTimeout(() => setStage(index + 1), 360 + index * 520))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [state])

  async function runSimulation() {
    const profile = readVaultProfile()
    const opportunity = readOpportunityAnalysis()
    const forged = readForgedResume()

    if (!hasVaultData(profile)) {
      setMessage('Complete your Career Archive first.')
      setState('blocked')
      return
    }

    if (!opportunity?.jobDescription || !opportunity?.analysis) {
      setMessage('Analyze an opportunity first.')
      setState('blocked')
      return
    }

    if (!forged?.resume) {
      setMessage('Generate an adaptive resume first.')
      setState('blocked')
      return
    }

    setReview(null)
    setMeta(null)
    setMessage('')
    setStage(0)
    setState('simulating')

    const { note, result, source } = await runRecruiterSimulation(profile, opportunity, forged.resume)
    setReview(result)
    setMeta({ note, source })
    setState('complete')
  }

  function destinationForMessage() {
    if (message.includes('Archive')) return '/vault'
    if (message.includes('opportunity')) return '/opportunity'
    return '/forge'
  }

  return (
    <motion.main
      className="simulation-page relative z-10 mx-auto w-full max-w-[1540px] px-6 pb-20 pt-10 md:px-10 lg:px-14 lg:pt-16"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="simulation-hero">
        <div>
          <div className="eyebrow flex items-center gap-5">
            <span className="h-px w-14 bg-violet-200/45" />
            Private recruiter review
          </div>
          <h1 className="simulation-title mt-10">
            RECRUITER
            <span>ROOM</span>
          </h1>
        </div>
        <div className="simulation-command">
          <p>AETHRA opens the packet like a recruiter would: archive, role, analysis, and forged resume in one quiet review.</p>
          <button className="simulation-button group" disabled={state === 'simulating'} onClick={runSimulation} type="button">
            {state === 'simulating' ? 'Reviewing' : 'Run Recruiter Simulation'}
            <Sparkles className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state === 'blocked' && (
          <motion.section className="simulation-blocked mt-16" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="archive-caption">Review unavailable</div>
            <p>{message}</p>
            <button className="return-vault mt-8" onClick={() => navigate(destinationForMessage())} type="button">
              <ArrowLeft className="h-4 w-4" />
              Continue setup
            </button>
          </motion.section>
        )}

        {state === 'simulating' && (
          <SimulationSequence key="simulating" stage={stage} />
        )}

        {state === 'complete' && review && (
          <RecruiterReview key="review" meta={meta} review={review} />
        )}
      </AnimatePresence>
    </motion.main>
  )
}

function SimulationSequence({ stage }) {
  return (
    <motion.section className="simulation-sequence mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
      <div className="archive-caption">Recruiter packet opening</div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {simulationStages.map((message, index) => (
          <motion.div className={`reading-stage ${stage > index ? 'is-heard' : ''}`} animate={{ opacity: stage > index ? 1 : 0.25 }} key={message}>
            <span>{`0${index + 1}`}</span>
            {message}
          </motion.div>
        ))}
      </div>
      <motion.div className="simulation-line mt-10" animate={{ scaleX: [0.06, 1, 0.72], opacity: [0.2, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
    </motion.section>
  )
}

function RecruiterReview({ meta, review }) {
  return (
    <motion.section className="recruiter-review mt-16" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="review-brief">
        <div>
          <div className="archive-caption">Shortlist decision</div>
          <h2>{review.shortlistDecision}</h2>
          {meta?.note && <p>{meta.note}</p>}
        </div>
        <div className="probability-seal">
          <span>{review.hiringProbability}%</span>
          Hiring probability
        </div>
      </div>

      <article className="review-summary">
        <div className="archive-caption">Recruiter summary</div>
        <p>{review.recruiterSummary}</p>
      </article>

      <div className="review-grid">
        <ReviewColumn title="Top strengths" items={review.topStrengths} tone="positive" />
        <ReviewColumn title="Red flags" items={review.redFlags} tone="alert" />
        <ReviewColumn title="Missing signals" items={review.missingSignals} />
        <ReviewColumn title="Interview questions" items={review.interviewQuestions} />
        <ReviewColumn title="Resume improvements" items={review.resumeImprovements} />
        <article className="review-card final-advice">
          <div className="archive-caption">Final advice</div>
          <p>{review.finalAdvice}</p>
          <button type="button">Improve Resume Based on Feedback</button>
        </article>
      </div>
    </motion.section>
  )
}

function ReviewColumn({ items, title, tone = '' }) {
  return (
    <article className={`review-card ${tone}`}>
      <div className="archive-caption">{title}</div>
      <ul>
        {(items.length ? items : ['No major signal detected.']).map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
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
    window.localStorage.setItem(opportunityAnalysisKey, JSON.stringify({
      jobDescription: jobText,
      analysis: result,
      meta: { note, source },
      updatedAt: new Date().toISOString(),
    }))
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


