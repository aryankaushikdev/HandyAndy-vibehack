export type Finger = "index" | "middle" | "ring" | "little";
export type JointName = "MCP" | "PIP" | "DIP";
export type Side = "left" | "right";

export const EXERCISE_IDS = [
  "little_finger_dip_flexion_extension",
  "little_finger_pip_flexion_extension",
  "open_close_hand",
  "hook_fist",
  "full_fist",
] as const;
export type ExerciseId = (typeof EXERCISE_IDS)[number];

export type Analysis = {
  affected_side: Side;
  affected_part: Finger;
  affected_joint: JointName;
  pain_level: number;
  movement_problem: string;
  recommended_exercise_id: ExerciseId;
  needs_clinician_confirmation: boolean;
  explanation: string;
};

export type PainEntry = {
  sessionId: number;
  before: number;
  after: number | null;
  at: number;
};

export type AiSource = "ai" | "fallback";
