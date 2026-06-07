'use client'

import type { Exercise } from '@/lib/types'

interface ExerciseChecklistProps {
  exercises: Exercise[]
  onToggle: (id: number) => void
}

export default function ExerciseChecklist({ exercises, onToggle }: ExerciseChecklistProps) {
  const completedCount = exercises.filter((e) => e.completed).length

  return (
    <section
      className="border-t-4 border-nhs-blue pt-4"
      aria-labelledby="exercises-heading"
    >
      <div className="flex justify-between items-baseline mb-3 gap-4 flex-wrap">
        <h2 id="exercises-heading" className="font-bold text-[24px] leading-[32px]">
          Today&apos;s Exercises
        </h2>
        <span
          className="text-[16px] leading-[24px] text-on-surface-variant"
          aria-live="polite"
          aria-atomic="true"
        >
          {completedCount} / {exercises.length} done
        </span>
      </div>

      <div
        className="bg-white border-2 border-gds-grey-mid"
        role="list"
        aria-label="Exercise checklist"
      >
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            role="listitem"
            className={`exercise-item ${exercise.completed ? 'exercise-item-done' : ''}`}
          >
            {/* GDS 44×44px checkbox */}
            <input
              type="checkbox"
              className="gds-checkbox"
              id={`exercise-${exercise.id}`}
              checked={exercise.completed}
              onChange={() => onToggle(exercise.id)}
              aria-label={`Mark "${exercise.name}" as ${exercise.completed ? 'not done' : 'done'}`}
            />

            <div className="flex-1 min-w-0">
              <label
                htmlFor={`exercise-${exercise.id}`}
                className={`font-bold text-[16px] leading-[24px] cursor-pointer block ${
                  exercise.completed ? 'exercise-name-done' : ''
                }`}
              >
                {exercise.name}
              </label>
              <div className="text-[14px] leading-[20px] text-on-surface-variant mt-0.5">
                {exercise.duration}
                {exercise.description && (
                  <> &middot; <span className="opacity-80">{exercise.description}</span></>
                )}
              </div>
              {exercise.completed && exercise.completedAt && (
                <div className="text-[12px] leading-[16px] text-nhs-green mt-1">
                  ✓ Completed{' '}
                  {new Date(exercise.completedAt).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>

            {/* Completion tick */}
            {exercise.completed && (
              <span
                className="material-symbols-outlined material-symbols-filled text-nhs-green flex-shrink-0"
                style={{ fontSize: '24px' }}
                aria-hidden="true"
              >
                check_circle
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Completion message */}
      {completedCount === exercises.length && (
        <div
          className="mt-4 p-3 bg-secondary-container border-l-4 border-nhs-green flex items-center gap-3"
          role="alert"
          aria-live="polite"
        >
          <span
            className="material-symbols-outlined material-symbols-filled text-nhs-green"
            style={{ fontSize: '24px' }}
            aria-hidden="true"
          >
            celebration
          </span>
          <div>
            <div className="font-bold text-[16px] leading-[24px] text-nhs-green">
              All exercises complete!
            </div>
            <div className="text-[14px] leading-[20px] text-on-surface-variant">
              Excellent work today. Your clinician will see your progress.
            </div>
          </div>
        </div>
      )}

      <a href="#" className="gds-link text-[16px] leading-[24px] font-bold mt-4 inline-block">
        View full exercise library →
      </a>
    </section>
  )
}
