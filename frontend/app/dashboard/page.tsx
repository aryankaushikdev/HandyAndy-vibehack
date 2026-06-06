import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icons";
import { PhaseBanner } from "@/components/PhaseBanner";

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

            <div className="dashboard-grid">
              <div>
                <section className="panel" aria-labelledby="clinical-notes-title">
                  <h2 id="clinical-notes-title">Clinical Notes</h2>
                  <label htmlFor="notes">Record your daily observation or symptoms for your physiotherapist.</label>
                  <textarea className="textarea" id="notes" name="notes" placeholder="e.g. Stiffness in morning, improved after 10 mins of exercise..." />
                  <button className="btn btn--green" type="button" style={{ marginTop: 14 }}>Save clinical notes</button>
                </section>

                <section className="ai-card" aria-labelledby="ai-title">
                  <div className="ai-card__header">
                    <h2 id="ai-title">AI Mobility Analysis</h2>
                    <span className="status">In Progress</span>
                  </div>
                  <p>Our model is processing your last exercise session data to identify range-of-motion improvements.</p>
                  <div className="metric">
                    <Icon name="analytics" />
                    <span><strong>Structural Alignment</strong><span>Last checked: 14:02 Today</span></span>
                  </div>
                  <div className="metric">
                    <Icon name="velocity" />
                    <span><strong>Movement Velocity</strong><span>Awaiting new data stream</span></span>
                  </div>
                </section>

                <section className="pain" aria-labelledby="pain-title">
                  <h2 id="pain-title">Pain Intensity Logger</h2>
                  <p>Rate your average pain level over the last 24 hours (0 is no pain, 10 is worst possible).</p>
                  <label htmlFor="pain" className="visually-hidden">Pain level from 0 to 10</label>
                  <input id="pain" className="range" type="range" min="0" max="10" step="1" defaultValue="4" />
                  <div className="range-labels" aria-hidden="true">
                    <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
                  </div>
                </section>
              </div>

              <div>
                <section className="viewer" aria-labelledby="viewer-title">
                  <h2 id="viewer-title">3D Recovery Viewer</h2>
                  <div className="viewer__canvas">
                    <Image className="viewer__image" src="/images/hand-recovery-viewer.png" alt="Clinical 3D wrist and hand recovery viewer showing wrist structures" width={318} height={320} priority />
                    <div className="viewer__hud" aria-hidden="true">
                      <div>
                        <button className="icon-button" type="button">⌕</button>{" "}
                        <button className="icon-button" type="button">↻</button>
                      </div>
                      <span className="hud-tag">Active: Right Wrist</span>
                    </div>
                  </div>
                  <h3 style={{ marginTop: 18 }}>Overlay Settings</h3>
                  <div className="checkbox-row">
                    <label className="check-pill check-pill--active">
                      <input type="checkbox" defaultChecked /> Ligaments
                    </label>
                    <label className="check-pill">
                      <input type="checkbox" /> Nerves
                    </label>
                  </div>
                </section>

                <section className="activity" aria-labelledby="activity-title">
                  <h2 id="activity-title">Recent Activity</h2>
                  <ul>
                    <li><span className="activity__icon"><Icon name="check" /></span><span><strong>Wrist Extension (Set A)</strong><br />Completed 2 hours ago</span></li>
                    <li><span className="activity__icon"><Icon name="check" /></span><span><strong>Finger Flexion</strong><br />Completed 2 hours ago</span></li>
                  </ul>
                  <a href="#history">View full activity history</a>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer dashboard />
    </>
  );
}
