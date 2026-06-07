// Text-only exercise instructions shown inside the hero phone.
const EXERCISES = [
  "Bend your fingers at the knuckles, then straighten.",
  "Curl your fingertips towards the top of your palm, then straighten.",
  "Bend your fingers into a flat fist, then straighten.",
  "Touch your thumb to each fingertip in turn.",
];

export function HeroSteps() {
  return (
    <div className="hero-phone__screen">
      <div className="hero-phone__appbar">
        <span className="hero-phone__brand">HandyAndy</span>
        <span className="hero-phone__appbar-sub">Hand exercises</span>
      </div>

      <div className="hero-ex__text">
        <p className="hero-ex__lead">Today&rsquo;s exercises — do each slowly, 5 times:</p>
        <ol className="hero-ex__list">
          {EXERCISES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
