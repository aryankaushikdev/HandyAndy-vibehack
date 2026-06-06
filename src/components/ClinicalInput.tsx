import { useState } from "react";

const HAPPY_EXAMPLE =
  "Right hand, index finger PIP joint, week 4 post-op. Patient reports pain 3/10 during flexion. Range of motion improving. Continue passive flexion stretches 3x10 and active extension holds for 5 seconds.";

const RED_FLAG_EXAMPLE =
  "Patient reports the ring finger has gone numb and cold since yesterday. Swelling getting worse. Severe pain when attempting any movement.";

export function ClinicalInput({
  busy,
  initialNotes,
  onAnalyze,
}: {
  busy: boolean;
  initialNotes: string;
  onAnalyze: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(initialNotes);

  return (
    <section className="bg-surface border-l-4 border-nhs-blue p-6">
      <h2 className="text-xl font-bold text-foreground">Clinical Notes</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Record your daily observation or symptoms for your physiotherapist.
      </p>

      <label htmlFor="notes" className="sr-only">
        Session notes
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
        placeholder="e.g. Stiffness in morning, improved after 10 mins of exercise…"
        className="mt-4 w-full resize-none border-2 border-foreground bg-surface px-3 py-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setNotes(HAPPY_EXAMPLE)}
          className="text-xs border border-border bg-surface px-3 py-1.5 text-foreground hover:bg-surface-muted"
        >
          Use happy-path example
        </button>
        <button
          type="button"
          onClick={() => setNotes(RED_FLAG_EXAMPLE)}
          className="text-xs border border-destructive bg-surface px-3 py-1.5 text-destructive hover:bg-destructive/5"
        >
          Use red-flag example
        </button>
      </div>

      <div className="mt-5 flex justify-start">
        <button
          onClick={() => onAnalyze(notes)}
          disabled={busy || notes.trim().length === 0}
          className="bg-nhs-green text-white font-semibold px-5 py-2.5 text-[15px] shadow-[0_2px_0_#002d18] hover:bg-[#005a30] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "Analysing…" : "Save clinical notes"}
        </button>
      </div>
    </section>
  );
}
