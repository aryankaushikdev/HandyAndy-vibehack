import { Home, ClipboardList, Activity, MessageSquare } from "lucide-react";

export type SidebarKey = "assessment" | "analysis" | "recovery" | "summary";

const items: { key: SidebarKey; label: string; icon: typeof Home }[] = [
  { key: "recovery", label: "Home", icon: Home },
  { key: "analysis", label: "My Treatment", icon: Activity },
  { key: "assessment", label: "Assessment", icon: ClipboardList },
  { key: "summary", label: "Messages", icon: MessageSquare },
];

export function Sidebar({
  active,
  onSelect,
}: {
  active: SidebarKey;
  onSelect: (k: SidebarKey) => void;
}) {
  return (
    <aside className="w-64 shrink-0">
      <div className="px-5 py-5 border-b border-border bg-surface">
        <p className="text-lg font-bold text-foreground leading-tight">Patient Portal</p>
        <p className="mt-1 text-sm text-muted-foreground">NHS No: 485 777 3456</p>
      </div>

      <nav className="bg-surface">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={[
                "w-full flex items-center gap-3 px-5 py-3 text-[15px] font-semibold text-left border-l-4 transition-colors",
                isActive
                  ? "border-nhs-blue text-nhs-blue bg-primary-soft/40"
                  : "border-transparent text-foreground hover:bg-surface-muted",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
