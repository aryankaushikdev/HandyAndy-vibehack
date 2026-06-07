import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icons";
import { PhaseBanner } from "@/components/PhaseBanner";
import { HeroScene } from "@/components/HeroScene";

const benefits = [
  {
    icon: "chart" as const,
    title: "Track your progress",
    text: "See your improvements over time with intuitive charts. Monitor pain levels and mobility milestones set by your specialist."
  },
  {
    icon: "person" as const,
    title: "Clear visual guidance",
    text: "Access high-quality 3D animations of your exercises. No more guessing—ensure your form is correct every time."
  },
  {
    icon: "shield" as const,
    title: "Securely connected",
    text: "Your clinician sees your logs in real-time. They can adjust your plan instantly based on how you are feeling."
  }
];

const steps = [
  {
    title: "Your clinician sets up your plan",
    text: "After your assessment, your physical therapist or doctor creates a bespoke recovery program tailored to your specific injury and goals."
  },
  {
    title: "Access your 3D recovery guide",
    text: "Open HandyAndy on any device to see your daily exercise schedule. Follow detailed 3D models that guide you through every movement."
  },
  {
    title: "Log your pain and progress daily",
    text: "Quickly record how difficult each exercise was and any pain you experienced. This data helps your clinician keep your recovery on track."
  }
];

export default function PatientLandingPage() {
  return (
    <>
      <Header variant="landing" />
      <PhaseBanner />

      <section className="hero" aria-labelledby="hero-title">
        <div className="nhs-width hero__grid">
          <div>
            <h1 id="hero-title">Your recovery, in your hands.</h1>
            <p>
              Personalised physical rehabilitation guided by clinical expertise. HandyAndy connects you with your clinician to ensure every step of your journey is safe and effective.
            </p>
            <Link className="btn btn--green" href="/dashboard">
              Start your recovery
            </Link>
          </div>
          <div className="hero__media">
            <div className="hero__media-inner">
              <HeroScene />
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="main nhs-width">
        <section id="benefits" aria-labelledby="benefits-title">
          <h2 id="benefits-title" className="section-heading">Better recovery for patients</h2>
          <div className="card-grid">
            {benefits.map((benefit) => (
              <article className="feature-card" key={benefit.title}>
                <span className="feature-card__icon"><Icon name={benefit.icon} /></span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="how-it-works" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          {steps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <strong className="step-card__number">0{index + 1}</strong>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </section>

        <section id="safety" className="disclaimer" aria-labelledby="safety-title">
          <h2 id="safety-title"><Icon name="warning" /> Medical Disclaimer</h2>
          <p><strong>HandyAndy is a clinician-led rehabilitation tool.</strong></p>
          <p>
            Do not attempt any exercises without a formal recommendation from your healthcare provider. If you experience sharp pain, dizziness, or shortness of breath while exercising, stop immediately and contact your clinician or call 111.
          </p>
          <p>In an emergency, always call 999.</p>
        </section>

        <section id="support" className="final-cta" aria-labelledby="cta-title">
          <h2 id="cta-title">Ready to start your journey?</h2>
          <p>Speak with your NHS clinician about using HandyAndy for your recovery plan today.</p>
          <div className="cta-row">
            <Link className="btn btn--blue" href="/dashboard">Start your recovery</Link>
            <a className="btn btn--secondary" href="#provider">Find a provider</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
