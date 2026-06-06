import { BarChart3 } from "lucide-react";
import type { PainEntry } from "@/types";

export function ProgressSummary({ entries }: { entries: PainEntry[] }) {
  const completed = entries.filter((e) => e.after !== null);
  const avgBefore =
    completed.length === 0 ? 0 : completed.reduce((s, e) => s + e.before, 0) / completed.length;
  const avgAfter =
    completed.length === 0 ? 0 : completed.reduce((s, e) => s + (e.after ?? 0), 0) / completed.length;
  const delta = avgBefore - avgAfter;

  const max = 10;
  const points = completed.slice(-8);
  const w = 240;
  const h = 60;

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <header className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Progress Summary</h2>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Stat label="Sessions" value={String(completed.length)} />
        <Stat label="Avg pain before" value={avgBefore.toFixed(1)} />
        <Stat
          label="Avg pain after"
          value={avgAfter.toFixed(1)}
          tone={delta > 0 ? "good" : "neutral"}
        />
      </div>

      {points.length > 1 ? (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
          <polyline
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2}
            points={points
              .map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p.after ?? 0) / max) * h}`)
              .join(" ")}
          />
        </svg>
      ) : (
        <p className="text-xs text-muted-foreground">Log a couple of sessions to see your trend.</p>
      )}
    </section>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "neutral" }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted p-3">
      <p className="text-[10px] tracking-wider uppercase text-muted-foreground">{label}</p>
      <p
        className={[
          "mt-1 text-lg font-semibold",
          tone === "good" ? "text-success-foreground" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
