import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  active?: boolean;
};

type HeaderProps = {
  variant: "landing" | "dashboard";
};

const landingNav: NavItem[] = [
  { href: "#how-it-works", label: "How it works", active: true },
  { href: "#benefits", label: "Benefits" },
  { href: "#safety", label: "Safety" },
  { href: "#support", label: "Support" }
];

const dashboardNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", active: true },
  { href: "#exercises", label: "Exercises" },
  { href: "#progress", label: "Progress" },
  { href: "#resources", label: "Resources" }
];

export function Header({ variant }: HeaderProps) {
  const nav = variant === "landing" ? landingNav : dashboardNav;

  return (
    <header className="header" role="banner">
      <div className={variant === "landing" ? "nhs-width header__inner" : "header__inner"} style={variant === "dashboard" ? { paddingInline: 15 } : undefined}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link href="/" className="logo" aria-label="MoveMend home">
            {variant === "dashboard" && <span className="logo__icon" aria-hidden="true" />}
            <span>MoveMend</span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            {nav.map((item) => (
              <Link key={item.label} href={item.href} aria-current={item.active ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {variant === "landing" ? (
          <Link className="header__action" href="/dashboard">
            Start recovery
          </Link>
        ) : (
          <span aria-label="Account" title="Account" style={{ color: "#fff", fontSize: 34, lineHeight: 1 }}>
            ◎
          </span>
        )}
      </div>
    </header>
  );
}
