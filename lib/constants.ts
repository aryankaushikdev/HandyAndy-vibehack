// ─────────────────────────────────────────────────────────────────────────────
// HandyAndy — Application Constants
// Merged with HandyAndy exercise definitions, safety rules, and analysis logic.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Patient, Exercise, PainEntry, DashboardStats, NavItem,
  MobilityMetric, ClinicalMessage, HandExercise, HandExerciseId,
  Finger, JointName, SafetyCheckResult,
} from './types'

// ── ROUTING ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  home:        '/',
  dashboard:   '/dashboard',
  treatment:   '/dashboard/treatment',
  assessment:  '/dashboard/assessment',
  messages:    '/dashboard/messages',
  liveReview:  '/live-review',
} as const

export const LIVE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GESTURE_COACH_URL ??
  process.env.NEXT_PUBLIC_LIVE_REVIEW_URL ??
  ROUTES.liveReview

// ── NHS DESIGN VALUES ─────────────────────────────────────────────────────────

export const NHS_COLORS = {
  blue:        '#005EB8',
  blueDark:    '#003087',
  white:       '#FFFFFF',
  green:       '#00703C',
  greenDark:   '#002d18',
  error:       '#D4351C',
  errorDark:   '#55140b',
  focusYellow: '#FFDD00',
  black:       '#0B0C0C',
  greyLight:   '#F3F2F1',
  greyMid:     '#B1B4B6',
  onSurface:   '#191c21',
  outline:     '#727783',
} as const

// ── DEMO PATIENT ──────────────────────────────────────────────────────────────

export const DEMO_PATIENT: Patient = {
  id:             'demo-patient-001',
  name:           'James Smith',
  nhsNumber:      '485 777 3456',
  clinician:      'Dr. Sarah Okonkwo',
  clinicianRole:  'Physiotherapist',
  hospital:       'UCLH',
  condition:      'Right Wrist & Hand Rehabilitation',
  currentWeek:    3,
  totalWeeks:     8,
  nextReviewDate: 'Fri 13 Jun',
  nextReviewTime: '14:00',
}

// ── WRIST / PRIMARY EXERCISES (existing plan) ─────────────────────────────────

export const DEMO_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Wrist Extension (Set A)',
    duration: '3 × 10 reps',
    description: 'Slowly extend wrist upward, hold 2 seconds, return.',
    completed: true,
    completedAt: '2026-06-06T09:15:00Z',
  },
  {
    id: 2,
    name: 'Finger Flexion',
    duration: '3 × 15 reps',
    description: 'Curl fingers into a fist, hold 1 second, fully extend.',
    completed: true,
    completedAt: '2026-06-06T09:28:00Z',
  },
  {
    id: 3,
    name: 'Pronation & Supination',
    duration: '2 × 12 reps',
    description: 'Rotate forearm palm-up then palm-down in a controlled motion.',
    completed: false,
  },
  {
    id: 4,
    name: 'Grip Strength Squeeze',
    duration: '3 × 30 sec hold',
    description: 'Squeeze therapy putty or soft ball. Maintain steady pressure.',
    completed: false,
  },
  {
    id: 5,
    name: 'Wrist Circles (both directions)',
    duration: '2 × 20 reps',
    description: 'Rotate wrist clockwise 10 times, then anti-clockwise 10 times.',
    completed: false,
  },
]

// ── HAND EXERCISES (HandyAndy — AI-recommended based on notes) ────────────────

export const HAND_EXERCISES: Record<HandExerciseId, HandExercise> = {
  little_finger_dip_flexion_extension: {
    id:           'little_finger_dip_flexion_extension',
    name:         'Little Finger DIP Flexion / Extension',
    steps:        ['Passive flexion stretches (3 × 10)', 'Active extension hold (5 sec)'],
    clinicalNote: 'Targets the distal interphalangeal joint of the little finger.',
    gestureCoachId: 'thumbToPinkyBase',
  },
  little_finger_pip_flexion_extension: {
    id:           'little_finger_pip_flexion_extension',
    name:         'Little Finger PIP Flexion / Extension',
    steps:        ['Passive flexion stretches (3 × 10)', 'Active extension hold (5 sec)'],
    clinicalNote: 'Targets the proximal interphalangeal joint of the little finger.',
    gestureCoachId: 'thumbToPinkyBase',
  },
  open_close_hand: {
    id:           'open_close_hand',
    name:         'Open / Close Hand',
    steps:        ['Slow open & close (3 × 10)', 'Hold full extension (5 sec)'],
    clinicalNote: 'Full MCP flexion and extension — improves global hand mobility.',
    gestureCoachId: 'thumbOpposition',
  },
  hook_fist: {
    id:           'hook_fist',
    name:         'Hook Fist',
    steps:        ['Bend PIP & DIP, keep MCP straight (3 × 10)', 'Hold hook (5 sec)'],
    clinicalNote: 'Isolates PIP and DIP joints; preserves MCP extension.',
    gestureCoachId: 'thumbMcpFlexion',
  },
  full_fist: {
    id:           'full_fist',
    name:         'Full Fist',
    steps:        ['Curl all joints into a fist (3 × 10)', 'Hold (5 sec)'],
    clinicalNote: 'Maximum MCP + PIP + DIP flexion — increases grip range.',
    gestureCoachId: 'thumbOpposition',
  },
}

// ── SAFETY RED FLAGS (ported from HandyAndy safety.ts) ────────────────────────
// If any of these terms appear in clinical notes, block AI analysis and show a
// clinical emergency callout instead.

export const RED_FLAG_TERMS = [
  'numb', 'numbness', 'blue', 'black', 'cold finger', 'no sensation',
  'severe pain', 'can\'t move', 'cannot move', 'deformed', 'deformity',
  'infection', 'pus', 'fever', 'swelling getting worse', 'paralysis',
  'sudden weakness', 'pins and needles won\'t stop',
] as const

export function safetyScan(text: string): SafetyCheckResult {
  const lower = text.toLowerCase()
  const terms = RED_FLAG_TERMS.filter((flag) => lower.includes(flag))
  return { blocked: terms.length > 0, terms }
}

// ── LOCAL EXERCISE EXTRACTION (regex fallback if AI fails) ────────────────────
// Ported from HandyAndy extract.ts — ensures demo works without API key.

export function exerciseForJoint(finger: Finger, joint: JointName): HandExerciseId {
  if (finger === 'little' && joint === 'DIP') return 'little_finger_dip_flexion_extension'
  if (finger === 'little' && joint === 'PIP') return 'little_finger_pip_flexion_extension'
  if (joint === 'MCP') return 'open_close_hand'
  if (joint === 'PIP') return 'hook_fist'
  return 'full_fist'
}

export function localExtractExercise(text: string): HandExerciseId {
  const t = text.toLowerCase()
  let part: Finger = 'index'
  if (/\blittle\b|\bpinky\b/.test(t))            part = 'little'
  else if (/\bring\b/.test(t))                     part = 'ring'
  else if (/\bmiddle\b/.test(t))                   part = 'middle'
  else if (/\bindex\b|\bforefinger\b/.test(t))     part = 'index'

  let joint: JointName = 'PIP'
  if (/\bdip\b|fingertip|distal/.test(t))          joint = 'DIP'
  else if (/\bpip\b|middle joint|proximal/.test(t)) joint = 'PIP'
  else if (/\bmcp\b|knuckle|metacarp/.test(t))      joint = 'MCP'

  return exerciseForJoint(part, joint)
}

// Parse RECOMMENDED_EXERCISE tag from AI response text
export function parseRecommendedExercise(text: string): HandExerciseId | null {
  const match = text.match(/RECOMMENDED_EXERCISE:\s*([a-z_]+)/i)
  if (!match) return null
  const id = match[1].toLowerCase()
  if (id in HAND_EXERCISES) return id as HandExerciseId
  return null
}

// ── DEMO PAIN HISTORY ─────────────────────────────────────────────────────────

export const DEMO_PAIN_HISTORY: PainEntry[] = [
  { date: '2026-05-31', level: 5, day: 'Mon' },
  { date: '2026-06-01', level: 6, day: 'Tue' },
  { date: '2026-06-02', level: 4, day: 'Wed' },
  { date: '2026-06-03', level: 5, day: 'Thu' },
  { date: '2026-06-04', level: 3, day: 'Fri' },
  { date: '2026-06-05', level: 4, day: 'Sat' },
  { date: '2026-06-06', level: 4, day: 'Today' },
]

// ── DASHBOARD STATS ───────────────────────────────────────────────────────────

export const DEMO_STATS: DashboardStats = {
  exercisesDone:       14,
  exercisesTotal:      20,
  streakDays:          5,
  avgPain:             3.2,
  weekProgressPercent: 70,
}

// ── SIDEBAR NAV ───────────────────────────────────────────────────────────────

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Home',         href: ROUTES.dashboard,  icon: 'home' },
  { label: 'My Treatment', href: ROUTES.treatment,  icon: 'rebase_edit' },
  { label: 'Assessment',   href: ROUTES.assessment, icon: 'clinical_notes' },
  { label: 'Live Reviews', href: ROUTES.liveReview, icon: 'video_call', hasLivePulse: true },
  { label: 'Messages',     href: ROUTES.messages,   icon: 'mail', badge: 2 },
]

// ── MOBILITY METRICS ──────────────────────────────────────────────────────────

export const MOBILITY_METRICS: MobilityMetric[] = [
  {
    id: 'alignment', label: 'Structural Alignment', icon: 'analytics',
    status: 'Good', detail: 'Last checked: 14:02 Today', statusType: 'completed',
  },
  {
    id: 'velocity', label: 'Movement Velocity', icon: 'shutter_speed',
    status: 'Pending', detail: 'Awaiting data stream', statusType: 'warning',
  },
  {
    id: 'range', label: 'Range of Motion', icon: 'straighten',
    status: '↑ +8°', detail: 'Flexion: 62° / Extension: 55°', statusType: 'progress',
  },
]

// ── CLINICIAN MESSAGE ─────────────────────────────────────────────────────────

export const DEMO_MESSAGE: ClinicalMessage = {
  id:     'msg-001',
  from:   'Dr. Sarah Okonkwo',
  role:   'Physiotherapist, UCLH',
  sentAt: '10 Jun, 09:15',
  content:
    'Great progress this week, James. Continue with the extension sets and try to push the range slightly further if pain allows. See you Friday.',
  isRead: false,
}

// ── AI SYSTEM PROMPT ──────────────────────────────────────────────────────────

export const AI_CLINICAL_SYSTEM_PROMPT = `You are a specialist physiotherapy AI assistant within the HandyAndy NHS rehabilitation platform.

Analyse the patient's clinical note and provide structured, clinically-grounded insights using this exact format:

**Summary:** One clear sentence summarising the reported symptoms.

**Key Observations:**
- Observation 1
- Observation 2

**Suggested Focus Areas:**
- Focus area 1: brief rationale
- Focus area 2: brief rationale

**Red Flags to Monitor:** Either list specific concerns for the clinician, or write: "None identified in this note."

**Next Step Recommendation:** One clear, actionable sentence.

RECOMMENDED_EXERCISE: [choose exactly one: open_close_hand | hook_fist | full_fist | little_finger_pip_flexion_extension | little_finger_dip_flexion_extension]

Rules:
- Clinical, supportive tone. Never alarming.
- Do NOT diagnose or prescribe medications.
- Use NHS-appropriate language.
- Keep total response under 320 words.
- The RECOMMENDED_EXERCISE line must always be present as the last line.
- Pick the exercise most appropriate to the movement problem described.`

// ── VIEWER OVERLAYS ───────────────────────────────────────────────────────────

export const VIEWER_OVERLAYS = [
  { key: 'ligaments' as const, label: 'Ligaments' },
  { key: 'nerves'    as const, label: 'Nerves' },
  { key: 'muscles'   as const, label: 'Muscles' },
]

// ── PAIN SCALE ────────────────────────────────────────────────────────────────

export const PAIN_SCALE_DESCRIPTORS: Record<number, string> = {
  0: 'No pain',   1: 'Minimal',    2: 'Mild',
  3: 'Mild–Mod',  4: 'Moderate',   5: 'Moderate',
  6: 'Mod–Severe',7: 'Severe',     8: 'Very severe',
  9: 'Worst possible', 10: 'Worst possible',
}
