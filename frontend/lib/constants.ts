// ─────────────────────────────────────────────────────────────────────────────
// MoveMend — Application Constants
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Patient,
  Exercise,
  PainEntry,
  DashboardStats,
  NavItem,
  MobilityMetric,
  ClinicalMessage,
} from './types'

// ── ROUTING ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  home:       '/',
  dashboard:  '/dashboard',
  treatment:  '/dashboard/treatment',
  assessment: '/dashboard/assessment',
  messages:   '/dashboard/messages',
  liveReview: '/live-review',
} as const

export const LIVE_REVIEW_URL =
  process.env.NEXT_PUBLIC_LIVE_REVIEW_URL ?? ROUTES.liveReview

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
  condition:      'Right Wrist Rehabilitation',
  currentWeek:    3,
  totalWeeks:     8,
  nextReviewDate: 'Fri 13 Jun',
  nextReviewTime: '14:00',
}

// ── DEMO EXERCISES ────────────────────────────────────────────────────────────

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

// ── SIDEBAR NAVIGATION ────────────────────────────────────────────────────────

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Home',         href: ROUTES.dashboard,  icon: 'home' },
  { label: 'My Treatment', href: ROUTES.treatment,   icon: 'rebase_edit' },
  { label: 'Assessment',   href: ROUTES.assessment,  icon: 'clinical_notes' },
  { label: 'Live Reviews', href: ROUTES.liveReview,  icon: 'video_call', hasLivePulse: true },
  { label: 'Messages',     href: ROUTES.messages,    icon: 'mail', badge: 2 },
]

// ── MOBILITY METRICS ──────────────────────────────────────────────────────────

export const MOBILITY_METRICS: MobilityMetric[] = [
  {
    id:         'alignment',
    label:      'Structural Alignment',
    icon:       'analytics',
    status:     'Good',
    detail:     'Last checked: 14:02 Today',
    statusType: 'completed',
  },
  {
    id:         'velocity',
    label:      'Movement Velocity',
    icon:       'shutter_speed',
    status:     'Pending',
    detail:     'Awaiting new data stream',
    statusType: 'warning',
  },
  {
    id:         'range',
    label:      'Range of Motion',
    icon:       'straighten',
    status:     '↑ +8°',
    detail:     'Flexion: 62° / Extension: 55°',
    statusType: 'progress',
  },
]

// ── CLINICIAN MESSAGE ─────────────────────────────────────────────────────────

export const DEMO_MESSAGE: ClinicalMessage = {
  id:      'msg-001',
  from:    'Dr. Sarah Okonkwo',
  role:    'Physiotherapist, UCLH',
  sentAt:  '10 Jun, 09:15',
  content: 'Great progress this week, James. Continue with the extension sets and try to push the range slightly further if pain allows. See you Friday.',
  isRead:  false,
}

// ── AI SYSTEM PROMPT ──────────────────────────────────────────────────────────

export const AI_CLINICAL_SYSTEM_PROMPT = `You are a specialist physiotherapy AI assistant within the MoveMend NHS rehabilitation platform. Your role is to help patients understand their recovery progress by analysing their self-reported clinical notes.

Analyse the patient's clinical note and provide structured, clinically-grounded insights using this exact format:

**Summary:** One clear sentence summarising the reported symptoms and their context.

**Key Observations:**
- Observation 1 (specific, evidence-based)
- Observation 2
- Observation 3 (if applicable)

**Suggested Focus Areas:**
- Focus area 1: brief clinical rationale
- Focus area 2: brief clinical rationale

**Red Flags to Monitor:** Either list specific symptoms that warrant immediate clinician attention, or write exactly: "None identified in this note."

**Next Step Recommendation:** One clear, actionable sentence the patient can act on before their next session.

Rules:
- Tone: clinical, supportive, clear. Never alarming.
- Do NOT provide diagnoses or prescribe medications.
- Use NHS-appropriate language.
- Keep the total response under 300 words.`

// ── VIEWER OVERLAYS ───────────────────────────────────────────────────────────

export const VIEWER_OVERLAYS = [
  { key: 'ligaments' as const, label: 'Ligaments' },
  { key: 'nerves'    as const, label: 'Nerves' },
  { key: 'muscles'   as const, label: 'Muscles' },
]

// ── PAIN SCALE ────────────────────────────────────────────────────────────────

export const PAIN_SCALE_DESCRIPTORS: Record<number, string> = {
  0: 'No pain',   1: 'Minimal',       2: 'Mild',
  3: 'Mild–Mod',  4: 'Moderate',      5: 'Moderate',
  6: 'Mod–Severe',7: 'Severe',        8: 'Very severe',
  9: 'Worst possible', 10: 'Worst possible',
}
