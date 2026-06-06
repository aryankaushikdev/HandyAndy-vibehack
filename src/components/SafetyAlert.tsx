import { AlertTriangle, Phone } from "lucide-react";

export function SafetyAlert({ terms }: { terms: string[] }) {
  return (
    <section className="border-4 border-destructive bg-surface p-6">
      <header className="flex items-center gap-3 mb-3">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <h2 className="text-xl font-bold text-destructive">Important</h2>
      </header>

      <p className="text-[15px] text-foreground">
        The notes contain symptoms that need urgent clinical review. Do not attempt the
        prescribed exercises until reviewed by a clinician.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {terms.map((t) => (
          <span
            key={t}
            className="text-xs bg-destructive/10 border border-destructive/40 px-2.5 py-1 text-destructive font-semibold"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 border-l-4 border-destructive bg-destructive/5 px-4 py-3">
        <Phone className="h-4 w-4 text-destructive" />
        <p className="text-[15px] text-foreground">
          Contact <strong>NHS 111</strong> or your care team immediately.
        </p>
      </div>
    </section>
  );
}
