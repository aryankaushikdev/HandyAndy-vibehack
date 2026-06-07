// Lightweight, deterministic clinical-note extractor for HandyAndy.
// Runs entirely client-side so the demo works with no API key. It only extracts
// structured fields — it never diagnoses or invents exercises.

export const RED_FLAGS = [
  "numb",
  "numbness",
  "blue finger",
  "black finger",
  "cold finger",
  "no sensation",
  "severe pain",
  "can't move",
  "cannot move",
  "deformed",
  "deformity",
  "infection",
  "pus",
  "fever",
];

export type Analysis = {
  side: "left" | "right";
  part: "index" | "middle" | "ring" | "little";
  joint: "MCP" | "PIP" | "DIP";
  pain: number;
  exercise: string;
  explanation: string;
};

const EXERCISE_BY_JOINT: Record<Analysis["joint"], string> = {
  MCP: "Open & close hand (gentle MCP flexion)",
  PIP: "Hook fist (targeted PIP flexion / extension)",
  DIP: "Fingertip bend (isolated DIP flexion / extension)",
};

export function analyzeNote(text: string, painOverride?: number): Analysis {
  const t = text.toLowerCase();

  const side: Analysis["side"] = /\bleft\b/.test(t) ? "left" : "right";

  let part: Analysis["part"] = "index";
  if (/\blittle\b|\bpinky\b/.test(t)) part = "little";
  else if (/\bring\b/.test(t)) part = "ring";
  else if (/\bmiddle\b/.test(t)) part = "middle";
  else if (/\bindex\b|\bforefinger\b/.test(t)) part = "index";

  let joint: Analysis["joint"] = "PIP";
  if (/\bdip\b|fingertip|distal/.test(t)) joint = "DIP";
  else if (/\bpip\b|middle joint|proximal/.test(t)) joint = "PIP";
  else if (/\bmcp\b|knuckle|metacarp/.test(t)) joint = "MCP";

  const painMatch = t.match(/pain[^\d]{0,12}(\d{1,2})\s*\/?\s*10?/);
  const pain =
    painOverride ??
    (painMatch ? Math.max(0, Math.min(10, parseInt(painMatch[1], 10))) : 4);

  return {
    side,
    part,
    joint,
    pain,
    exercise: EXERCISE_BY_JOINT[joint],
    explanation: `This looks like reduced movement at the ${side} ${part} finger ${joint} joint. HandyAndy will guide gentle, approved movements only — always confirm with your clinician.`,
  };
}
