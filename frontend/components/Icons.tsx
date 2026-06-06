export function Icon({ name }: { name: "chart" | "person" | "shield" | "warning" | "home" | "treatment" | "notes" | "mail" | "analytics" | "velocity" | "check" }) {
  const glyphs = {
    chart: "↗",
    person: "⚕",
    shield: "♢",
    warning: "⚠",
    home: "⌂",
    treatment: "⌘",
    notes: "▧",
    mail: "✉",
    analytics: "▣",
    velocity: "◉",
    check: "✓"
  } as const;
  return <span aria-hidden="true">{glyphs[name]}</span>;
}
