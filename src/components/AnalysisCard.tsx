import { Sparkles, Hand, CheckCircle2, Circle } from "lucide-react";
import type { Analysis, AiSource } from "@/types";
import { EXERCISES } from "@/lib/exercises";

export function AnalysisCard({ analysis, source }: { analysis: Analysis; source: AiSource }) {
  const exercise = EXERCISES[analysis.recommended_exercise_id];
  const rom = Math.max(20, Math.min(95, 100 - analysis.pain_level * 6));

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold">AI Analysis</h2>
        </div>
        <span
          className={[
            "text-[10px] tracking-wider uppercase rounded-full px-2 py-0.5 border",
            source === "ai"
              ? "border-primary/30 text-primary bg-primary-soft"
              : "border-warning/40 text-warning-foreground bg-warning/20",
          ].join(" ")}
        >
          {source === "ai" ? "Live AI" : "Local fallback"}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface-muted p-4">
          <p className="text-[10px] tracking-wider uppercase text-muted-foreground">Affected Area</p>
          <div className="mt-1 flex items-center gap-2">
            <h3 className="text-lg font-semibold capitalize">
              {analysis.affected_part} {analysis.affected_joint} Joint
            </h3>
            <Hand className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Range of Motion</span>
              <span>{rom}% of target</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${rom}%` }}
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            {analysis.explanation}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface-muted p-4">
          <p className="text-[10px] tracking-wider uppercase text-muted-foreground">Action Plan</p>
          <h3 className="mt-1 text-sm font-semibold capitalize text-foreground">{exercise.name}</h3>
          <ul className="mt-3 space-y-2">
            {exercise.steps.map((step, i) => (
              <li key={step} className="flex items-start gap-2 text-sm">
                {i === 0 ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                )}
                <span className="text-foreground/90">{step}</span>
              </li>
            ))}
          </ul>

          {analysis.needs_clinician_confirmation && (
            <p className="mt-4 text-[11px] text-muted-foreground italic">
              Awaiting clinician confirmation before progression.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
