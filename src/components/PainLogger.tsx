import { useState } from "react";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PainEntry } from "@/types";

export function PainLogger({
  entries,
  onLog,
  onCompleteSession,
}: {
  entries: PainEntry[];
  onLog: (before: number) => void;
  onCompleteSession: (after: number) => void;
}) {
  const [before, setBefore] = useState(5);
  const [after, setAfter] = useState(3);

  const open = entries.find((e) => e.after === null);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <header className="flex items-center gap-2 mb-4">
        <Frown className="h-5 w-5 text-destructive" />
        <h2 className="font-display text-xl font-semibold">Pain Logger</h2>
      </header>

      {!open ? (
        <div>
          <label className="text-sm font-medium">Pain before session: <span className="text-primary">{before}/10</span></label>
          <input
            type="range"
            min={0}
            max={10}
            value={before}
            onChange={(e) => setBefore(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
          <Button className="mt-3" onClick={() => onLog(before)}>
            Start session
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Session #{open.sessionId} in progress · started at {open.before}/10
          </p>
          <label className="text-sm font-medium">Pain after session: <span className="text-primary">{after}/10</span></label>
          <input
            type="range"
            min={0}
            max={10}
            value={after}
            onChange={(e) => setAfter(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
          <Button className="mt-3" onClick={() => onCompleteSession(after)}>
            Complete session
          </Button>
        </div>
      )}
    </section>
  );
}
