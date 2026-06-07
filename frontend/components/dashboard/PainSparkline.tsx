'use client'

import { NHS_COLORS } from '@/lib/constants'
import type { PainEntry } from '@/lib/types'

interface PainSparklineProps {
  data: PainEntry[]
  todayLevel?: number   // override the last entry when user logs today
}

// ── Chart geometry constants ─────────────────────────────────────────────────
const W  = 400
const H  = 90
const PT = 10   // padding top
const PB = 22   // padding bottom (for day labels)
const PL = 28   // padding left  (for y-axis labels)
const PR = 12   // padding right

function yOf(level: number): number {
  const drawH = H - PT - PB
  return PT + drawH - (level / 10) * drawH
}

function xOf(i: number, total: number): number {
  const drawW = W - PL - PR
  return PL + (i / Math.max(total - 1, 1)) * drawW
}

export default function PainSparkline({ data, todayLevel }: PainSparklineProps) {
  // Apply today's override if provided
  const display = todayLevel !== undefined
    ? data.map((d, i) => (i === data.length - 1 ? { ...d, level: todayLevel } : d))
    : data

  const pts = display.map((d, i) => ({
    x:     xOf(i, display.length),
    y:     yOf(d.level),
    level: d.level,
    day:   d.day,
  }))

  const linePath  = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath  = `${linePath} L${pts[pts.length - 1].x},${H - PB} L${pts[0].x},${H - PB} Z`

  // Trend: compare last vs first
  const first = pts[0].level
  const last  = pts[pts.length - 1].level
  const diff  = last - first
  const trend = diff < -0.5 ? 'improving' : diff > 0.5 ? 'worsening' : 'stable'
  const TREND_CFG = {
    improving: { label: '↓ Improving',  colour: NHS_COLORS.green },
    worsening: { label: '↑ Worsening',  colour: NHS_COLORS.error },
    stable:    { label: '→ Stable',     colour: NHS_COLORS.blue  },
  }

  const GRID_LEVELS = [0, 5, 10]

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: `${H}px`, display: 'block' }}
        role="img"
        aria-label={`7-day pain level chart. Trend: ${TREND_CFG[trend].label}`}
      >
        <defs>
          <linearGradient id="painGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={NHS_COLORS.blue} stopOpacity="0.22" />
            <stop offset="100%" stopColor={NHS_COLORS.blue} stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Y-axis grid */}
        {GRID_LEVELS.map((lvl) => {
          const y = yOf(lvl)
          return (
            <g key={lvl}>
              <line
                x1={PL} y1={y} x2={W - PR} y2={y}
                stroke="#c2c6d4" strokeWidth="1"
              />
              <text x={PL - 5} y={y + 4} fontSize="9" fill={NHS_COLORS.outline} textAnchor="end">
                {lvl}
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#painGrad)" />

        {/* Line */}
        <path
          d={linePath}
          stroke={NHS_COLORS.blue}
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {pts.map((p, i) => {
          const isToday = i === pts.length - 1
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={isToday ? 7 : 5}
              fill={isToday ? NHS_COLORS.green : NHS_COLORS.blue}
              stroke="white"
              strokeWidth="2"
            >
              <title>{p.day}: Pain {p.level}/10</title>
            </circle>
          )
        })}

        {/* Day labels */}
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={H - 4}
            fontSize="9"
            fill={NHS_COLORS.outline}
            textAnchor="middle"
          >
            {display[i].day.slice(0, 3)}
          </text>
        ))}
      </svg>

      {/* Trend indicator */}
      <div className="mt-1 flex items-center gap-2 text-[14px] leading-[20px] text-on-surface-variant">
        <span>7-day trend:</span>
        <span
          className="font-bold"
          style={{ color: TREND_CFG[trend].colour }}
          aria-label={`Pain trend: ${TREND_CFG[trend].label}`}
        >
          {TREND_CFG[trend].label}
        </span>
        <span className="ml-auto text-[13px]">
          Avg:{' '}
          <strong>
            {(display.reduce((s, d) => s + d.level, 0) / display.length).toFixed(1)}
          </strong>
          /10
        </span>
      </div>
    </div>
  )
}
