// Post-session coaching. This is the FREE/offline rule-based version: it reads the
// numbers and writes plain-language feedback + a comparison to your history. If you
// later switch on the optional Claude endpoint (api/coach.ts), main.ts will prefer
// that for richer wording and fall back to this if it's unavailable.

import type { SessionResult } from './exercise'
import { fingerReach, loadSessions } from './storage'

export function localSummary(session: SessionResult): string[] {
  const lines: string[] = []
  const allPrev = loadSessions().filter((s) => s.endedAt < session.endedAt)
  const prevSame = allPrev.filter((s) => s.exerciseId === session.exerciseId)
  const last = prevSame[prevSame.length - 1]
  const reps = session.reps ?? session.rotations?.length ?? 0

  // Headline — lead with the game stats.
  lines.push(
    `${session.exerciseName}: ${session.points ?? 0} points · ${session.perfectCount ?? 0} perfect 10s · ` +
    `best streak ${session.bestStreak ?? 0} · ${reps} rep${reps === 1 ? '' : 's'}.`,
  )
  const prevBestStreak = allPrev.reduce((m, s) => Math.max(m, s.bestStreak ?? 0), 0)
  if (prevBestStreak > 0 && (session.bestStreak ?? 0) > prevBestStreak)
    lines.push(`🏆 New best streak — ${session.bestStreak} in a row.`)

  // Trend vs your last session of THIS exercise (form scores aren't comparable
  // across different exercises).
  if (last) {
    const delta = session.formScore - last.formScore
    if (delta > 3) lines.push(`Up ${delta} on your last ${session.exerciseName} session — clear improvement.`)
    else if (delta < -3) lines.push(`Down ${Math.abs(delta)} vs your last ${session.exerciseName} session. An off day is normal.`)
    else lines.push(`About the same as your last ${session.exerciseName} session. Consistency is good.`)
  } else {
    lines.push(`First ${session.exerciseName} session saved — your baseline to beat.`)
  }

  // Opposition has per-finger detail; the other exercises are rep-based.
  if (session.rotations && session.rotations.length) {
    const reach = fingerReach(session)
    const entries = Object.values(reach)
    if (entries.length) {
      const weakest = entries.reduce((w, e) => (e.avg > w.avg ? e : w))
      const pct = Math.round(weakest.touchRate * 100)
      lines.push(
        `Weakest reach: the ${weakest.label.toLowerCase()} finger ` +
        `(reached on ${pct}% of reps). The little/ring fingers are the hardest in opposition — ` +
        `that's expected, and it's where the gains are.`,
      )
    }
    const allTargets = session.rotations.flatMap((r) => Object.values(r.targets))
    const total = allTargets.length || 1
    const holdPct = Math.round((allTargets.filter((t) => t.holdMet).length / total) * 100)
    if (holdPct < 70) lines.push(`Holds: only ${holdPct}% reached the full 5 seconds. Slow down — the hold is where the work happens.`)
    else lines.push(`Holds: ${holdPct}% reached the full 5 seconds. Good control.`)
    if (allTargets.filter((t) => t.curlFlag).length > total * 0.2)
      lines.push('Watch the compensation: move the thumb across to the finger instead of curling the finger in.')
  } else if (session.movementsTotal) {
    const cleanPct = Math.round((100 * (session.perfectCount ?? 0)) / session.movementsTotal)
    lines.push(`${cleanPct}% of your reps were clean — full range and in control.`)
    if (cleanPct < 100 && session.exerciseId === 'thumbAbduction')
      lines.push('On the docked reps you pushed past the safe range. Reward is for control, not maximum spread.')
  }

  return lines
}

// Build the compact JSON we'd send to the optional Claude endpoint.
export function sessionDigest(session: SessionResult) {
  const reach = fingerReach(session)
  return {
    exercise: session.exerciseName,
    formScore: session.formScore,
    points: session.points,
    perfectCount: session.perfectCount,
    bestStreak: session.bestStreak,
    movementsTotal: session.movementsTotal,
    reps: session.reps ?? session.rotations?.length ?? 0,
    perFinger: Object.fromEntries(
      Object.entries(reach).map(([k, v]) => [k, {
        avgDistance: Number(v.avg.toFixed(3)),
        touchRate: Number(v.touchRate.toFixed(2)),
      }]),
    ),
    history: loadSessions().slice(-6).map((s) => ({ at: s.endedAt, exercise: s.exerciseName, formScore: s.formScore })),
  }
}
