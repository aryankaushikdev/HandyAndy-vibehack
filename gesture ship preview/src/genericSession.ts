// Wraps the calibrated ExerciseTracker (src/exerciseModule.ts) in the SAME game
// layer the opposition exercise uses: each completed rep is scored 0–10, feeds
// points / streak / combos, flashes a rating, and speaks coaching. Produces the
// shared LiveView so the existing UI renders it unchanged.

import { config } from './config'
import { comboMultiplier, type LiveView, type MovementResult, type SessionResult } from './exercise'
import {
  ExerciseTracker, EXERCISES, type ExerciseId, type Landmarks,
} from './exerciseModule'
import type { Pt } from './landmarks'

// What to say / show for each exercise. `go` is a voice-clip id (see src/audio.ts).
const PROMPTS: Record<ExerciseId, { action: string; release: string; go: string }> = {
  thumbIpFlexion: { action: 'Bend your thumb tip', release: 'and straighten', go: 'go_ip' },
  thumbMcpFlexion: { action: 'Bend your thumb knuckle', release: 'and straighten', go: 'go_mcp' },
  thumbAbduction: { action: 'Move your thumb out, slowly', release: 'and back', go: 'go_abduction' },
  thumbToPinkyBase: { action: 'Reach your thumb across to your little-finger base', release: 'and hold', go: 'go_pinky' },
  thumbOpposition: { action: 'Touch your thumb to your fingertip', release: 'and release', go: 'go_pinky' },
}

export class GenericGameSession {
  private tracker: ExerciseTracker
  private readonly id: ExerciseId
  private readonly startedAt: number

  // game state (mirrors OppositionTracker)
  private points = 0
  private streak = 0
  private bestStreak = 0
  private perfectCount = 0
  private movementsTotal = 0
  private sumScore = 0
  private lastMovement: MovementResult | null = null
  private movementId = 0
  private sounds: string[] = []

  private overshootRep = false
  private overshootSpoken = false
  private prevPhase = 'relaxed'
  private completeSpoken = false

  constructor(id: ExerciseId, relaxed: number, engaged: number, startedAt: number) {
    this.id = id
    this.startedAt = startedAt
    this.tracker = new ExerciseTracker(id)
    this.tracker.setCalibration(relaxed, engaged)
    this.emitSound(PROMPTS[id].go)
    this.emitSound(`say:Rep 1 of ${this.tracker.cfg.repTarget}`)
  }

  private emitSound(s: string) { this.sounds.push(s) }

  private applyMovement(score: number) {
    const perfect = score >= 10
    this.movementsTotal++
    this.sumScore += score
    if (perfect) this.perfectCount++
    if (score >= config.streakThreshold) {
      this.streak++
      this.bestStreak = Math.max(this.bestStreak, this.streak)
    } else {
      this.streak = 0
    }
    const multiplier = comboMultiplier(this.streak)
    const earned = Math.round(score * multiplier)
    this.points += earned
    this.lastMovement = { key: this.id, label: EXERCISES[this.id].name, score, perfect, multiplier, earned }
    this.movementId++
  }

  update(world: Pt[], _image: Pt[], dtSeconds: number): LiveView {
    const f = this.tracker.update(world as unknown as Landmarks, dtSeconds * 1000)
    const isHold = EXERCISES[this.id].detector === 'reachHold'

    // Overshoot (abduction safety cap): warn once per episode, dock the rep score.
    if (f.overshoot) {
      this.overshootRep = true
      if (!this.overshootSpoken) { this.emitSound('ease_back'); this.overshootSpoken = true }
    } else {
      this.overshootSpoken = false
    }

    // Dropped a hold before completing it → nudge to hold longer.
    if (isHold && this.prevPhase === 'holding' && f.phase !== 'holding' && !f.justCompletedRep) {
      this.emitSound('hold_longer')
    }
    this.prevPhase = f.phase

    if (f.justCompletedRep) {
      const score = this.overshootRep ? 5 : 10
      this.applyMovement(score)
      this.emitSound(score >= 10 ? 'perfect' : 'good')
      if (!f.setComplete) this.emitSound(`say:Rep ${f.reps + 1} of ${f.repTarget}`)
      this.overshootRep = false
    }

    if (f.setComplete && !this.completeSpoken) {
      this.emitSound('complete')
      this.completeSpoken = true
    }

    // --- build the live view ---
    const p = PROMPTS[this.id]
    let cue: string
    if (f.setComplete) cue = 'Session complete — great work'
    else if (isHold && f.phase === 'holding') cue = `Hold… ${Math.max(1, Math.ceil((f.holdTargetMs - f.holdMs) / 1000))}`
    else if (f.phase === 'reached' || f.phase === 'returning') cue = p.release
    else cue = p.action

    const bar = isHold
      ? (f.phase === 'holding' ? f.holdMs / f.holdTargetMs : Math.min(1, f.progress))
      : Math.min(1, f.progress)

    const sounds = this.sounds
    this.sounds = []
    return {
      sounds,
      mode: 'generic',
      overshoot: f.overshoot,
      phase: f.setComplete ? 'done' : 'index',
      rotation: Math.min(f.reps + 1, f.repTarget),
      targetRotations: f.repTarget,
      cue,
      warnings: f.overshoot ? ['Ease back — stay in control'] : [],
      holdProgress: Math.max(0, Math.min(1, bar)),
      calibrationDistance: 0,
      contactDistance: 0,
      finished: f.setComplete,
      points: this.points,
      streak: this.streak,
      bestStreak: this.bestStreak,
      multiplier: comboMultiplier(this.streak),
      lastMovement: this.lastMovement,
      movementId: this.movementId,
    }
  }

  finish(endedAt: number): SessionResult {
    const formScore = this.movementsTotal ? Math.round((10 * this.sumScore) / this.movementsTotal) : 0
    return {
      startedAt: this.startedAt,
      endedAt,
      handedness: 'Right',
      exerciseId: this.id,
      exerciseName: EXERCISES[this.id].name,
      reps: this.movementsTotal,
      formScore,
      points: this.points,
      movementsTotal: this.movementsTotal,
      perfectCount: this.perfectCount,
      bestStreak: this.bestStreak,
    }
  }
}
