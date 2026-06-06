// Pure DOM rendering — no exercise logic here.

import type { LiveView, MovementResult, SessionResult } from './exercise'
import { config } from './config'
import { allTimeStats, dailyStats, levelInfo, loadSessions } from './storage'

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T

// All-time best streak (the number to beat), captured once at session start.
let allTimeBest = 0
let lastFlashId = -1

// Call at the start of each session: refresh the number-to-beat and reset the
// flash de-dupe so the first movement of the new session flashes.
export function startGameHud() {
  allTimeBest = allTimeStats().bestStreak
  lastFlashId = -1
  lastRepsKey = ''
  renderHomeStats()
}

// The persistent strip (level, today's goal, day streak) — shown on both the menu
// and the live screen.
function homeStatsHtml(): string {
  const lvl = levelInfo(allTimeStats().totalPoints)
  const day = dailyStats(config.dailyGoalRotations)
  const goalPct = Math.min(100, Math.round((day.todayRotations / day.goal) * 100))
  return (
    `<span class="hs-item"><strong>Level ${lvl.level}</strong>` +
    `<span class="hs-bar"><span style="width:${Math.round(lvl.progress * 100)}%"></span></span></span>` +
    `<span class="hs-item">Today ${day.todayRotations}/${day.goal} reps` +
    `<span class="hs-bar"><span style="width:${goalPct}%"></span></span></span>` +
    `<span class="hs-item">🗓️ ${day.dayStreak}-day${day.goalMet ? ' ✓' : ''}</span>`
  )
}

export function renderHomeStats() {
  const html = homeStatsHtml()
  const live = document.getElementById('homestats')
  if (live) live.innerHTML = html
  const menu = document.getElementById('menu-stats')
  if (menu) menu.innerHTML = html
}

// ---- Menu ----------------------------------------------------------------
export interface MenuItem { id: string; name: string; level: number; desc: string }

export function renderMenu(items: MenuItem[], onSelect: (id: string) => void) {
  const list = $('exercise-list')
  list.innerHTML = ''
  for (const it of items) {
    const card = document.createElement('button')
    card.className = 'ex-card'
    card.innerHTML =
      `<span class="ex-level">Level ${it.level}</span>` +
      `<span class="ex-name">${it.name}</span>` +
      `<span class="ex-desc">${it.desc}</span>`
    card.addEventListener('click', () => onSelect(it.id))
    list.appendChild(card)
  }
}

export function showMenu() {
  $('report').hidden = true
  $('live').hidden = true
  $('menu').hidden = false
  renderHomeStats()
}

// ---- Calibration (shown on the live screen before a generic exercise) ------
export function setCalibrating(on: boolean) {
  $('live').classList.toggle('calibrating', on)
}
export function renderCalibration(cue: string, progress: number) {
  $('cue').textContent = cue
  ;($('hold') as HTMLElement).style.width = `${Math.round(progress * 100)}%`
}

function ratingLabel(score: number): string {
  if (score >= 10) return 'Perfect!'
  if (score >= config.streakThreshold) return 'Great'
  if (score >= 6) return 'Good'
  if (score >= 4) return 'Hold longer'
  return 'Reach all the way'
}

function flashRating(m: MovementResult) {
  const el = $('rating-flash')
  const combo = m.multiplier > 1 ? `  +${m.earned} (×${m.multiplier})` : ''
  el.textContent = `${m.score}/10  ${ratingLabel(m.score)}${m.perfect ? '  🔥' : ''}${combo}`
  el.className =
    'rating-flash ' +
    (m.perfect ? 'perfect' : m.score >= config.streakThreshold ? 'good' : 'meh')
  el.animate(
    [
      { opacity: 0, transform: 'translate(-50%,-50%) scale(.6)' },
      { opacity: 1, transform: 'translate(-50%,-50%) scale(1.12)', offset: 0.25 },
      { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: 0.6 },
      { opacity: 0, transform: 'translate(-50%,-50%) scale(1)' },
    ],
    { duration: 1100, easing: 'ease-out' },
  )
}

// The 5 movements that make up one rep, in order.
const STEP_PHASES = ['index', 'middle', 'ring', 'pinky', 'slide']
const STEP_LETTERS = ['I', 'M', 'R', 'L', 'S']
let lastRepsKey = ''

export function renderLive(v: LiveView) {
  $('cue').textContent = v.cue
  ;($('hold') as HTMLElement).style.width = `${Math.round(v.holdProgress * 100)}%`

  // Points + streak (now shown above the video).
  $('points').textContent = `${v.points} points`
  const best = Math.max(v.bestStreak, allTimeBest)
  const streakEl = $('streak')
  streakEl.textContent = `🔥 ${v.streak} · best ${best}`
  streakEl.classList.toggle('hot', v.streak >= 3)

  // Rep progress — how many reps, and how I'm contributing to the current one.
  // Opposition shows I/M/R/L/S step pips; the other exercises use the live hold/
  // reach progress as the within-rep fraction.
  const isOpp = v.mode === 'opposition'
  const stepsTotal = config.enableSlide ? 5 : 4
  const stepsDone = v.finished ? stepsTotal : Math.max(0, STEP_PHASES.indexOf(v.phase))
  const withinRep = isOpp ? (v.finished ? 1 : stepsDone / stepsTotal) : v.holdProgress
  const repsDone = v.finished ? v.targetRotations : Math.max(0, v.rotation - 1)
  $('reps-text').textContent = v.finished
    ? `Done — ${v.targetRotations} of ${v.targetRotations} reps`
    : `Rep ${Math.min(v.rotation, v.targetRotations)} of ${v.targetRotations}`
  const overall = ((repsDone + withinRep) / v.targetRotations) * 100
  ;($('reps-fill') as HTMLElement).style.width = `${Math.min(100, overall)}%`

  // Step pips (I/M/R/L/S) — opposition only, rebuilt when the current step changes.
  const repsKey = `${isOpp}/${stepsDone}/${v.finished}`
  if (repsKey !== lastRepsKey) {
    lastRepsKey = repsKey
    const steps = $('reps-steps')
    steps.innerHTML = ''
    if (isOpp) {
      for (let i = 0; i < stepsTotal; i++) {
        const pip = document.createElement('span')
        pip.className =
          'pip' + (i < stepsDone ? ' done' : i === stepsDone && !v.finished ? ' active' : '')
        pip.textContent = STEP_LETTERS[i]
        steps.appendChild(pip)
      }
    }
  }

  // Combo badge.
  const combo = $('combo')
  if (v.multiplier > 1) {
    combo.hidden = false
    combo.textContent = `×${v.multiplier} COMBO`
  } else {
    combo.hidden = true
  }

  // Flash the rating whenever a new movement is scored.
  if (v.lastMovement && v.movementId !== lastFlashId) {
    lastFlashId = v.movementId
    flashRating(v.lastMovement)
  }

  const warn = $('warnings')
  warn.innerHTML = ''
  for (const w of v.warnings) {
    const chip = document.createElement('div')
    chip.className = 'warn-chip'
    chip.textContent = w
    warn.appendChild(chip)
  }
}

export function showReport(session: SessionResult, summaryLines: string[]) {
  $('menu').hidden = true
  $('live').hidden = true
  $('report').hidden = false
  $('report-title').textContent = session.exerciseName ? `${session.exerciseName} — summary` : 'Session summary'

  // Game scoreboard at the top of the report.
  const stats = allTimeStats()
  const beatBest = (session.bestStreak ?? 0) >= stats.bestStreak && stats.bestStreak > 0
  const board = $('scoreboard')
  board.innerHTML =
    statCard(`${session.points ?? 0}`, 'points') +
    statCard(`${session.perfectCount ?? 0}`, 'perfect 10s') +
    statCard(`${session.bestStreak ?? 0}${beatBest ? ' 🏆' : ''}`, 'best streak')

  renderLevelBar()

  $('coaching-heading').hidden = false
  const box = $('summary')
  box.innerHTML = ''
  summaryLines.forEach((line, i) => {
    const el = document.createElement('div')
    el.className = i === 0 ? 'line headline' : 'line'
    el.textContent = line
    box.appendChild(el)
  })
  renderHistory()
}

function statCard(value: string, label: string): string {
  return `<div class="stat"><div class="stat-val">${value}</div><div class="stat-label">${label}</div></div>`
}

// Level progress + daily goal block, shown on both report views.
function renderLevelBar() {
  const lvl = levelInfo(allTimeStats().totalPoints)
  const day = dailyStats(config.dailyGoalRotations)
  const goalPct = Math.min(100, Math.round((day.todayRotations / day.goal) * 100))
  $('levelbar').innerHTML =
    `<div class="lb-row"><span><strong>Level ${lvl.level}</strong></span>` +
    `<span class="lb-sub">${lvl.intoLevel}/${lvl.span} XP · ${lvl.toNext} to Level ${lvl.level + 1}</span></div>` +
    `<div class="lb-track"><span style="width:${Math.round(lvl.progress * 100)}%"></span></div>` +
    `<div class="lb-row"><span>Today's goal</span>` +
    `<span class="lb-sub">${day.todayRotations}/${day.goal} reps${day.goalMet ? ' ✓' : ''} · 🗓️ ${day.dayStreak}-day streak</span></div>` +
    `<div class="lb-track"><span style="width:${goalPct}%"></span></div>`
}

export function showHistoryOnly() {
  $('menu').hidden = true
  $('live').hidden = true
  $('report').hidden = false
  $('report-title').textContent = 'Progress'
  $('coaching-heading').hidden = true
  $('summary').innerHTML = ''
  const stats = allTimeStats()
  $('scoreboard').innerHTML =
    statCard(`${stats.totalPoints}`, 'total points') +
    statCard(`${stats.totalPerfect}`, 'perfect 10s') +
    statCard(`${stats.bestStreak}`, 'best streak ever')
  renderLevelBar()
  renderHistory()
}

export function renderHistory() {
  const hist = loadSessions().slice().reverse()
  const box = $('history')
  box.innerHTML = ''
  if (!hist.length) {
    box.innerHTML = '<div class="hrow"><span class="date">No sessions yet — finish one to start your trend.</span></div>'
    return
  }
  for (const s of hist) {
    const row = document.createElement('div')
    row.className = 'hrow'
    const d = new Date(s.endedAt)
    const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    const reps = s.reps ?? s.rotations?.length ?? 0
    const name = s.exerciseName ?? 'Session'
    row.innerHTML =
      `<span class="date">${date} · ${name} · ${reps} reps</span>` +
      `<span class="bar"><span style="width:${s.formScore}%"></span></span>` +
      `<span class="val">${s.formScore}</span>`
    box.appendChild(row)
  }
}

export function setStatus(msg: string) { $('status').textContent = msg }
