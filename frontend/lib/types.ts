// ─────────────────────────────────────────────────────────────────────────────
// MoveMend — Shared TypeScript Types
// All interfaces used across the application defined here once.
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

// ── PAIN TRACKING ────────────────────────────────────────────────────────────

export interface PainEntry {
  date: string   // ISO date string e.g. '2026-06-06'
  level: number  // 0–10 inclusive
  day: string    // Display label e.g. 'Mon', 'Today'
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
  icon: string       // Material Symbol name e.g. 'home'
  badge?: number     // Red notification count badge
  hasLivePulse?: boolean  // Animated yellow pulse for live features
  isExternal?: boolean    // Opens in new tab
}

// ── 3D VIEWER ────────────────────────────────────────────────────────────────

export interface OverlaySettings {
  ligaments: boolean
  nerves: boolean
  muscles: boolean
}

export type ViewerStatus = 'empty' | 'loading' | 'loaded' | 'error'

// ── AI ANALYSIS ──────────────────────────────────────────────────────────────

export interface AIAnalysisResult {
  summary: string
  keyObservations: string[]
  suggestedFocusAreas: string[]
  redFlags: string
  nextStep: string
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

// ── UI COMPONENTS ────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'blue' | 'secondary' | 'warning' | 'live-review'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type StatusTagVariant = 'completed' | 'progress' | 'warning' | 'neutral'

// ── API RESPONSES ────────────────────────────────────────────────────────────

export interface APIError {
  error: string
  message: string
}

// ── CLERK USER EXTENSION ─────────────────────────────────────────────────────
// Extends Clerk's User type with MoveMend-specific metadata
export interface MoveMendUserMetadata {
  nhsNumber?: string
  patientId?: string
  assignedClinicianId?: string
  onboardingComplete?: boolean
}
