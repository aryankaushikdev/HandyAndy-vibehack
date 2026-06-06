// On-device session history. Lives in localStorage on this phone/browser only —
// nothing leaves the device. (Switch to a backend later if you want cross-device
// sync; see README.)

import type { SessionResult } from './exercise'

const KEY = 'thumb-coach.sessions.v1'

export function loadSessions(): SessionResult[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SessionResult[]) : []
  } catch {
    return []
  }
}

export function saveSession(s: SessionResult): SessionResult[] {
  const all = loadSessions()
  all.push(s)
  localStorage.setItem(KEY, JSON.stringify(all))
  return all
}

export function clearSessions() {
  localStorage.removeItem(KEY)
}

export function exportSessions(): string {
  return JSON.stringify(loadSessions(), null, 2)
}

// All-time game stats, derived from saved sessions (handles pre-game sessions
// that lack the fields via ?? 0).
export interface AllTimeStats {
  bestStreak: number
  totalPoints: number
  totalPerfect: number
}

export function allTimeStats(): AllTimeStats {
  const s = loadSessions()
  return {
    bestStreak: s.reduce((m, x) => Math.max(m, x.bestStreak ?? 0), 0),
    totalPoints: s.reduce((a, x) => a + (x.points ?? 0), 0),
    totalPerfect: s.reduce((a, x) => a + (x.perfectCount ?? 0), 0),
  }
}

// --- Levels: all-time points are XP -----------------------------------------
// Cumulative points needed to REACH level L: 25*(L-1)*(L+2)
//   L1=0, L2=100, L3=250, L4=450, L5=700, ...
export interface LevelInfo {
  level: number
  intoLevel: number   // points earned past the current level threshold
  span: number        // points between this level and the next
  toNext: number      // points still needed for the next level
  progress: number    // 0..1 toward next level
}

function cumulativeForLevel(L: number): number {
  return 25 * (L - 1) * (L + 2)
}

export function levelInfo(totalPoints: number): LevelInfo {
  const p = Math.max(0, totalPoints)
  const level = Math.max(1, Math.floor((-1 + Math.sqrt(9 + (4 * p) / 25)) / 2))
  const base = cumulativeForLevel(level)
  const next = cumulativeForLevel(level + 1)
  const span = next - base
  const intoLevel = p - base
  return { level, intoLevel, span, toNext: next - p, progress: span ? intoLevel / span : 0 }
}

// --- Daily goal + day streak ------------------------------------------------
export interface DailyStats {
  todayRotations: number
  goal: number
  goalMet: boolean
  dayStreak: number   // consecutive days the goal was met (today counts once met)
}

function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function dailyStats(goal: number): DailyStats {
  const byDay: Record<string, number> = {}
  for (const s of loadSessions()) {
    const k = dayKey(s.endedAt)
    byDay[k] = (byDay[k] || 0) + (s.reps ?? s.rotations?.length ?? 0)
  }
  const met = (ts: number) => (byDay[dayKey(ts)] || 0) >= goal

  const now = Date.now()
  const todayRotations = byDay[dayKey(now)] || 0
  const goalMet = todayRotations >= goal

  // Count back from today (or yesterday, if today isn't met yet so the streak
  // survives until the day actually ends) while each day met the goal.
  const DAY = 86_400_000
  let cursor = goalMet ? now : now - DAY
  let dayStreak = 0
  while (met(cursor)) {
    dayStreak++
    cursor -= DAY
  }

  return { todayRotations, goal, goalMet, dayStreak }
}

// --- Progress helpers -------------------------------------------------------

export interface FingerTrend {
  key: string
  label: string
  bestReach: number      // best (lowest) avg distance ever — lower is better
  lastReach: number      // this session's avg distance
  touchRate: number      // fraction of rotations the thumb reached it this session
}

// Average closest-distance per finger for a single session (lower = better reach).
export function fingerReach(session: SessionResult): Record<string, { avg: number; touchRate: number; label: string }> {
  const acc: Record<string, { sum: number; n: number; touched: number; label: string }> = {}
  for (const rot of session.rotations ?? []) {
    for (const t of Object.values(rot.targets)) {
      const a = (acc[t.key] ??= { sum: 0, n: 0, touched: 0, label: t.label })
      if (isFinite(t.bestDistance)) { a.sum += t.bestDistance; a.n++ }
      if (t.touched) a.touched++
    }
  }
  const out: Record<string, { avg: number; touchRate: number; label: string }> = {}
  for (const [k, a] of Object.entries(acc)) {
    out[k] = { avg: a.n ? a.sum / a.n : Infinity, touchRate: a.n ? a.touched / a.n : 0, label: a.label }
  }
  return out
}
