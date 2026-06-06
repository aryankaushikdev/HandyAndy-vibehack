import { EXERCISE_IDS, type Analysis, type ExerciseId, type Finger, type JointName, type Side } from "@/types";
import { exerciseForJoint } from "./exercises";

export function clampExerciseId(id: string | undefined | null): ExerciseId {
  if (id && (EXERCISE_IDS as readonly string[]).includes(id)) return id as ExerciseId;
  return "open_close_hand";
}

/** Deterministic regex fallback so the demo survives an AI failure. */
export function localExtract(text: string): Analysis {
  const t = text.toLowerCase();

  const side: Side = /\bleft\b/.test(t) ? "left" : "right";

  let part: Finger = "index";
  if (/\blittle\b|\bpinky\b/.test(t)) part = "little";
  else if (/\bring\b/.test(t)) part = "ring";
  else if (/\bmiddle\b/.test(t)) part = "middle";
  else if (/\bindex\b|\bforefinger\b/.test(t)) part = "index";

  let joint: JointName = "PIP";
  if (/\bdip\b|fingertip|distal/.test(t)) joint = "DIP";
  else if (/\bpip\b|middle joint|proximal interphalangeal/.test(t)) joint = "PIP";
  else if (/\bmcp\b|knuckle|metacarp/.test(t)) joint = "MCP";

  const painMatch = t.match(/pain[^\d]{0,12}(\d{1,2})\s*\/?\s*10?/);
  const painLevel = painMatch ? Math.max(0, Math.min(10, parseInt(painMatch[1], 10))) : 4;

  return {
    affected_side: side,
    affected_part: part,
    affected_joint: joint,
    pain_level: painLevel,
    movement_problem: "Reduced range of motion during flexion / extension.",
    recommended_exercise_id: exerciseForJoint(part, joint),
    needs_clinician_confirmation: true,
    explanation:
      "Based on the notes, this looks like reduced movement at a single finger joint. We will guide gentle, approved exercises only — confirm with your clinician.",
  };
}
