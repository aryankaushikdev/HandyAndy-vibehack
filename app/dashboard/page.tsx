'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

import { WarningCallout } from '@/components/ui/StatusTag'
import RecoveryProgressStrip from '@/components/dashboard/RecoveryProgressStrip'
import ClinicalNotes from '@/components/dashboard/ClinicalNotes'
import ExerciseChecklist from '@/components/dashboard/ExerciseChecklist'
import PainLogger from '@/components/dashboard/PainLogger'
import MobilityAnalysis from '@/components/dashboard/MobilityAnalysis'
import ClinicianMessage from '@/components/dashboard/ClinicianMessage'
import ThreeDViewer from '@/components/dashboard/ThreeDViewer/ThreeDViewer'

import { DEMO_EXERCISES, DEMO_PATIENT, DEMO_STATS, ROUTES } from '@/lib/constants'
import type { Exercise, HandExerciseId } from '@/lib/types'

export default function DashboardPage() {
  const [exercises, setExercises] = useState<Exercise[]>(DEMO_EXERCISES)
  const [recommendedExerciseId, setRecommendedExerciseId] = useState<HandExerciseId | null>(null)

  const toggleExercise = useCallback((id: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, completed: !ex.completed, completedAt: !ex.completed ? new Date().toISOString() : undefined }
          : ex
      )
    )
  }, [])

  const handleExerciseRecommended = useCallback((exerciseId: HandExerciseId) => {
    setRecommendedExerciseId(exerciseId)
  }, [])

  // Live stats
  const demoStartDone   = DEMO_EXERCISES.filter((e) => e.completed).length
  const sessionDone     = exercises.filter((e) => e.completed).length
  const baseHistoryDone = DEMO_STATS.exercisesDone - demoStartDone
  const totalDone       = Math.min(baseHistoryDone + sessionDone, DEMO_STATS.exercisesTotal)
  const weekProgressPct = Math.round((totalDone / DEMO_STATS.exercisesTotal) * 100)

  return (
    <main className="px-[15px] py-[40px] max-w-[900px] mx-auto" id="main-content">
      <h1 className="font-bold text-gds-black mb-[20px]" style={{ fontSize: 'clamp(28px, 5vw, 42px)', lineHeight: '1.15' }}>
        Recovery Progress Overview
      </h1>

      <WarningCallout className="mb-[30px]">
        This tool is for rehabilitation monitoring only and does not provide medical advice.
        If you experience sudden, severe pain, contact your clinician or call{' '}
        <strong>111</strong> immediately. In an emergency, call <strong>999</strong>.
      </WarningCallout>

      <RecoveryProgressStrip
        patient={DEMO_PATIENT}
        exercisesDone={totalDone}
        exercisesTotal={DEMO_STATS.exercisesTotal}
        streakDays={DEMO_STATS.streakDays}
        avgPain={DEMO_STATS.avgPain}
        weekProgressPercent={weekProgressPct}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-[30px] items-start">

        {/* Left column */}
        <div className="md:col-span-7 space-y-[40px]">
          <ClinicalNotes
            patientName={DEMO_PATIENT.name.split(' ')[0]}
            onExerciseRecommended={handleExerciseRecommended}
          />
          <ExerciseChecklist
            exercises={exercises}
            onToggle={toggleExercise}
            recommendedHandExerciseId={recommendedExerciseId}
          />
          <PainLogger />
        </div>

        {/* Right column */}
        <div className="md:col-span-5 space-y-[30px]">
          <ThreeDViewer />
          <MobilityAnalysis />
          <ClinicianMessage />
        </div>
      </div>

      {/* Next review reminder */}
      <div className="mt-[60px] p-4 bg-white border-2 border-gds-grey-mid border-l-8 border-l-nhs-green flex flex-wrap items-center gap-4">
        <span className="material-symbols-outlined material-symbols-filled text-nhs-green flex-shrink-0" style={{ fontSize: '28px' }} aria-hidden="true">event</span>
        <div>
          <div className="font-bold text-[16px] leading-[24px]">
            Next session with {DEMO_PATIENT.clinician}
          </div>
          <div className="text-[16px] leading-[24px] text-on-surface-variant">
            {DEMO_PATIENT.nextReviewDate} at {DEMO_PATIENT.nextReviewTime} &middot; UCLH Physiotherapy
          </div>
        </div>
        <Link href={ROUTES.liveReview} className="gds-btn-blue ml-auto">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">video_call</span>
          Join Gesture Coach
        </Link>
      </div>
    </main>
  )
}
