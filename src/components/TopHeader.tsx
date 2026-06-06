import { CircleUser } from "lucide-react";
import type { SidebarKey } from "@/components/Sidebar";

const NAV: { key: SidebarKey; label: string }[] = [
  { key: "recovery", label: "Dashboard" },
  { key: "analysis", label: "Exercises" },
  { key: "summary", label: "Progress" },
  { key: "assessment", label: "Resources" },
];

export function TopHeader({
  active,
  onSelect,
}: {
  active: SidebarKey;
  onSelect: (k: SidebarKey) => void;
}) {
  return (
    <header className="bg-nhs-blue text-white">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-10">
          <a href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center bg-white text-nhs-blue font-extrabold">
              M
            </span>
            MoveMend
          </a>
          <nav className="hidden md:flex items-center gap-1 h-16">
            {NAV.map((item) => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelect(item.key)}
                  className={[
                    "h-16 px-4 text-[15px] font-semibold transition-colors border-b-4",
                    isActive
                      ? "border-white text-white"
                      : "border-transparent text-white/90 hover:border-white/60",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <button
          aria-label="Account"
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          <CircleUser className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
