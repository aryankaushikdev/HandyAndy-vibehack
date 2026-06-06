import type { ExerciseId, Finger, JointName } from "@/types";

export type ExerciseDef = {
  id: ExerciseId;
  name: string;
  steps: string[];
  /** joints animated (curl) — keyed by `{finger}_{joint_lower}` */
  joints: string[];
};

const FINGERS: Finger[] = ["index", "middle", "ring", "little"];

const all = (joint: JointName) => FINGERS.map((f) => `${f}_${joint.toLowerCase()}`);

export const EXERCISES: Record<ExerciseId, ExerciseDef> = {
  little_finger_dip_flexion_extension: {
    id: "little_finger_dip_flexion_extension",
    name: "Little finger DIP flexion / extension",
    steps: ["Passive flexion stretches (3×10)", "Active extension hold (5 secs)"],
    joints: ["little_dip"],
  },
  little_finger_pip_flexion_extension: {
    id: "little_finger_pip_flexion_extension",
    name: "Little finger PIP flexion / extension",
    steps: ["Passive flexion stretches (3×10)", "Active extension hold (5 secs)"],
    joints: ["little_pip"],
  },
  open_close_hand: {
    id: "open_close_hand",
    name: "Open / close hand",
    steps: ["Slow open & close (3×10)", "Hold full extension (5 secs)"],
    joints: all("MCP"),
  },
  hook_fist: {
    id: "hook_fist",
    name: "Hook fist",
    steps: ["Bend PIP & DIP, keep MCP straight (3×10)", "Hold hook (5 secs)"],
    joints: [...all("PIP"), ...all("DIP")],
  },
  full_fist: {
    id: "full_fist",
    name: "Full fist",
    steps: ["Curl all joints into a fist (3×10)", "Hold (5 secs)"],
    joints: [...all("MCP"), ...all("PIP"), ...all("DIP")],
  },
};

/** Curl amplitude (radians) per joint type. */
export const JOINT_AMPLITUDE: Record<string, number> = {
  mcp: 0.9,
  pip: 1.05,
  dip: 0.85,
};

export function exerciseForJoint(finger: Finger, joint: JointName): ExerciseId {
  if (finger === "little" && joint === "DIP") return "little_finger_dip_flexion_extension";
  if (finger === "little" && joint === "PIP") return "little_finger_pip_flexion_extension";
  if (joint === "MCP") return "open_close_hand";
  if (joint === "PIP") return "hook_fist";
  return "full_fist";
}
