'use client'

import { useState, useEffect } from 'react'
import { NHS_COLORS } from '@/lib/constants'
import type { PainEntry } from '@/lib/types'

interface PainSparklineProps {
  data: PainEntry[]
  todayLevel?: number
}

const W = 400; const H = 90; const PT = 10; const PB = 22; const PL = 28; const PR = 12

function yOf(level: number): number {
  const drawH = H - PT - PB
  return PT + drawH - (level / 10) * drawH
}
function xOf(i: number, total: number): number {
  const drawW = W - PL - PR
  return PL + (i / Math.max(total - 1, 1)) * drawW
}

export default function PainSparkline({ data, todayLevel }: PainSparklineProps) {
  // Fix: only render SVG on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const display = todayLevel !== undefined
    ? data.map((d, i) => (i === data.length - 1 ? { ...d, level: todayLevel } : d))
    : data

  const pts = display.map((d, i) => ({ x: xOf(i, display.length), y: yOf(d.level), level: d.level, day: d.day }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${H - PB} L${pts[0].x},${H - PB} Z`
  const first = pts[0].level; const last = pts[pts.length - 1].level; const diff = last - first
  const trend = diff < -0.5 ? 'improving' : diff > 0.5 ? 'worsening' : 'stable'
  const TREND = { improving: { label: '↓ Improving', colour: NHS_COLORS.green }, worsening: { label: '↑ Worsening', colour: NHS_COLORS.error }, stable: { label: '→ Stable', colour: NHS_COLORS.blue } }

  if (!mounted) {
    return <div style={{ height: `${H}px` }} className="bg-gds-grey-light animate-pulse" />
  }

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: `${H}px`, display: 'block' }}
        role="img" aria-label={`7-day pain chart. Trend: ${TREND[trend].label}`}>
        <defs>
          <linearGradient id="painGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NHS_COLORS.blue} stopOpacity="0.22" />
            <stop offset="100%" stopColor={NHS_COLORS.blue} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 5, 10].map((lvl) => {
          const y = yOf(lvl)
          return (
            <g key={lvl}>
              <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#c2c6d4" strokeWidth="1" />
              <text x={PL - 5} y={y + 4} fontSize="9" fill={NHS_COLORS.outline} textAnchor="end">{lvl}</text>
            </g>
          )
        })}
        <path d={areaPath} fill="url(#painGrad)" />
        <path d={linePath} stroke={NHS_COLORS.blue} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 7 : 5}
            fill={i === pts.length - 1 ? NHS_COLORS.green : NHS_COLORS.blue} stroke="white" strokeWidth="2">
            <title suppressHydrationWarning>{p.day}: Pain {p.level}/10</title>
          </circle>
        ))}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 4} fontSize="9" fill={NHS_COLORS.outline} textAnchor="middle" suppressHydrationWarning>
            {display[i].day.slice(0, 3)}
          </text>
        ))}
      </svg>
      <div className="mt-1 flex items-center gap-2 text-[14px] leading-[20px] text-on-surface-variant">
        <span>7-day trend:</span>
        <span className="font-bold" style={{ color: TREND[trend].colour }}>{TREND[trend].label}</span>
        <span className="ml-auto text-[13px]">Avg: <strong>{(display.reduce((s, d) => s + d.level, 0) / display.length).toFixed(1)}</strong>/10</span>
      </div>
    </div>
  )
}
