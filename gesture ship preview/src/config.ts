// ---------------------------------------------------------------------------
// Tunable thresholds. ALL the "what counts as good/bad" lives here so you can
// adjust the app to your own hand after trying it once. The live screen shows a
// calibration readout (the current normalised thumb→finger distance) so you can
// see exactly where to set CONTACT_DISTANCE for your hand.
// ---------------------------------------------------------------------------

export const config = {
  // Reps the handout asks for (8–12 rotations). The session "completes" at this.
  targetRotations: 10,

  // --- Contact detection -------------------------------------------------
  // Normalised distance (thumb tip → finger tip, divided by your hand length)
  // below which we count the tips as "touching". Watch the calibration number
  // on screen while you pinch and set this just above your touching value.
  contactDistance: 0.30,
  // Hysteresis so a contact doesn't flicker on/off right at the threshold.
  releaseExtra: 0.08,

  // --- Hold timing -------------------------------------------------------
  minHoldSeconds: 5, // handout: hold 3–5s
  goodHoldSeconds: 5,

  // --- "Slightly rounded" joints ----------------------------------------
  // Joint angle in degrees. ~180 = dead straight, smaller = more bent.
  // We want rounded, not clenched and not straight.
  roundedMin: 95,   // below this = clenched / over-curled
  roundedMax: 172,  // above this = too straight

  // --- Compensation ------------------------------------------------------
  // How much the whole hand is allowed to drift in the frame during a rotation
  // (fraction of frame width/height). Bigger drift = "keep your forearm still".
  wristDriftMax: 0.10,
  // If the target finger is curled tighter than this AND the thumb barely moved,
  // you're bringing the finger to the thumb instead of the thumb to the finger.
  fingerCurlFlag: 90,

  // --- Slide phase (thumb down the little finger to its base) ------------
  enableSlide: true,
  slideDistance: 0.40, // thumb tip → pinky base (landmark 17), normalised

  // --- Game / scoring ----------------------------------------------------
  // Each finger touch is rated 0–10. A movement scoring at least this keeps
  // your streak alive; anything below resets the streak to zero.
  streakThreshold: 8,

  // Combo multipliers: the first tier whose minStreak <= your current streak
  // applies. Points earned per movement = rating × multiplier.
  comboTiers: [
    { minStreak: 12, mult: 3 },
    { minStreak: 8, mult: 2.5 },
    { minStreak: 5, mult: 2 },
    { minStreak: 3, mult: 1.5 },
    { minStreak: 0, mult: 1 },
  ],

  // Daily goal: total rotations completed across all sessions in a day.
  // Physio prescription is ~2–3 sessions × 8–12 rotations ≈ 16–36/day.
  dailyGoalRotations: 16,
}

export type Config = typeof config
