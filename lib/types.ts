// ─────────────────────────────────────────────────────────────────────────────
// HandyAndy — Shared TypeScript Types
// Merged with HandyAndy types for exercise extraction and hand analysis.
// ─────────────────────────────────────────────────────────────────────────────

// ── PATIENT ──────────────────────────────────────────────────────────────────

export interface Patient {
  id: string
  name: string
  nhsNumber: string
  clinician: string
  clinicianRole: string
  hospital: string
  condition: string
  currentWeek: number
  totalWeeks: number
  nextReviewDate: string
  nextReviewTime: string
}

// ── EXERCISES ────────────────────────────────────────────────────────────────

export interface Exercise {
  id: number
  name: string
  duration: string
  description?: string
  completed: boolean
  completedAt?: string
}

// HandyAndy exercise IDs — used in AI-driven exercise recommendations
export type HandExerciseId =
  | 'little_finger_dip_flexion_extension'
  | 'little_finger_pip_flexion_extension'
  | 'open_close_hand'
  | 'hook_fist'
  | 'full_fist'

export interface HandExercise {
  id: HandExerciseId
  name: string
  steps: string[]
  clinicalNote: string
  gestureCoachId?: string // maps to Thumb Coach exercise ID
}

// ── PAIN TRACKING ────────────────────────────────────────────────────────────

export interface PainEntry {
  date: string
  level: number
  day: string
}

// ── DASHBOARD STATS ──────────────────────────────────────────────────────────

export interface DashboardStats {
  exercisesDone: number
  exercisesTotal: number
  streakDays: number
  avgPain: number
  weekProgressPercent: number
}

// ── NAVIGATION ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
  hasLivePulse?: boolean
  isExternal?: boolean
}

// ── 3D VIEWER ────────────────────────────────────────────────────────────────

export interface OverlaySettings {
  ligaments: boolean
  nerves: boolean
  muscles: boolean
}

// ── AI ANALYSIS ──────────────────────────────────────────────────────────────

// Structured extraction from clinical notes (ported from HandyAndy analyze.functions.ts)
export type Finger = 'index' | 'middle' | 'ring' | 'little'
export type JointName = 'MCP' | 'PIP' | 'DIP'
export type Side = 'left' | 'right'

export interface HandAnalysis {
  affected_side: Side
  affected_part: Finger
  affected_joint: JointName
  pain_level: number
  movement_problem: string
  recommended_exercise_id: HandExerciseId
  needs_clinician_confirmation: boolean
  explanation: string
}

export type AIStatus = 'idle' | 'loading' | 'success' | 'error'

// ── MOBILITY METRICS ─────────────────────────────────────────────────────────

export type StatusTagType = 'completed' | 'progress' | 'warning' | 'neutral'

export interface MobilityMetric {
  id: string
  label: string
  icon: string
  status: string
  detail: string
  statusType: StatusTagType
}

// ── CLINICIAN MESSAGES ───────────────────────────────────────────────────────

export interface ClinicalMessage {
  id: string
  from: string
  role: string
  sentAt: string
  content: string
  isRead: boolean
}

// ── SAFETY ───────────────────────────────────────────────────────────────────

export interface SafetyCheckResult {
  blocked: boolean
  terms: string[]
}

// ── UI COMPONENTS ────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'blue' | 'secondary' | 'warning' | 'live-review'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type StatusTagVariant = 'completed' | 'progress' | 'warning' | 'neutral'
