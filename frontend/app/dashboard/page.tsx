import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icons";
import { PhaseBanner } from "@/components/PhaseBanner";
import { DashboardClient } from "@/components/DashboardClient";

const sideNav = [
  { icon: "home" as const, label: "Home", href: "/dashboard", active: true },
  { icon: "treatment" as const, label: "My Treatment", href: "#treatment" },
  { icon: "notes" as const, label: "Assessment", href: "#assessment" },
  { icon: "mail" as const, label: "Messages", href: "#messages" }
];

export default function DashboardPage() {
  return (
    <>
      <Header variant="dashboard" />
      <PhaseBanner />

      <div className="dashboard-layout">
        <aside className="sidebar" aria-label="Patient portal navigation">
          <div className="sidebar__meta">
            <div className="sidebar__title">Patient Portal</div>
            <div className="sidebar__nhs">NHS No: 485 777 3456</div>
          </div>
          <nav className="side-nav">
            {sideNav.map((item) => (
              <Link key={item.label} href={item.href} aria-current={item.active ? "page" : undefined}>
                <Icon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main id="main-content" className="dashboard-main">
          <div className="dashboard-width">
            <Link href="/" className="back-link">‹ Back to dashboard</Link>
            <h1 className="dashboard-title">Recovery Progress Overview</h1>

            <section className="warning-callout" role="alert" aria-labelledby="important-title">
              <h2 id="important-title"><Icon name="warning" /> Important</h2>
              <p>
                This tool is for rehabilitation monitoring only and does not provide medical advice. If you experience sudden, severe pain, contact your clinician or call 111 immediately.
              </p>
            </section>

            <DashboardClient />
          </div>
        </main>
      </div>
      <Footer dashboard />
    </>
  );
}
