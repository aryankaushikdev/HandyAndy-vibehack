// Geometry helpers over MediaPipe hand landmarks.
//
// MediaPipe gives us TWO sets each frame:
//   - image landmarks  : x,y in 0..1 of the frame, z relative. Used for DRAWING
//                        and for "did the whole hand drift in frame" checks.
//   - world landmarks  : x,y,z in METRES, origin at the hand's centre. Used for
//                        all the real geometry (distances, joint angles) because
//                        it is depth-aware and not distorted by how far the phone
//                        is from your hand.

export interface Pt {
  x: number
  y: number
  z: number
}

// Landmark indices (MediaPipe Hands), named for readability.
export const LM = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
} as const

// The four opposition targets, in the order the handout prescribes.
export const TARGETS = [
  { key: 'index', label: 'INDEX', tip: LM.INDEX_TIP, pip: LM.INDEX_PIP, mcp: LM.INDEX_MCP },
  { key: 'middle', label: 'MIDDLE', tip: LM.MIDDLE_TIP, pip: LM.MIDDLE_PIP, mcp: LM.MIDDLE_MCP },
  { key: 'ring', label: 'RING', tip: LM.RING_TIP, pip: LM.RING_PIP, mcp: LM.RING_MCP },
  { key: 'pinky', label: 'LITTLE', tip: LM.PINKY_TIP, pip: LM.PINKY_PIP, mcp: LM.PINKY_MCP },
] as const

export type TargetKey = (typeof TARGETS)[number]['key']

export function dist(a: Pt, b: Pt): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

// 2D distance in frame, for "did the hand drift" (z is noisy for that).
export function dist2d(a: Pt, b: Pt): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Your hand's own scale: wrist → middle-finger knuckle. We divide every distance
// by this so thresholds work for any hand size and any phone distance.
export function handScale(world: Pt[]): number {
  return dist(world[LM.WRIST], world[LM.MIDDLE_MCP]) || 1e-6
}

// Normalised thumb-tip → finger-tip distance (unitless).
export function tipDistance(world: Pt[], fingerTip: number): number {
  return dist(world[LM.THUMB_TIP], world[fingerTip]) / handScale(world)
}

// Angle in degrees at joint `b`, formed by points a-b-c.
export function angleDeg(a: Pt, b: Pt, c: Pt): number {
  const ba = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
  const bc = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z }
  const dot = ba.x * bc.x + ba.y * bc.y + ba.z * bc.z
  const magBA = Math.sqrt(ba.x * ba.x + ba.y * ba.y + ba.z * ba.z)
  const magBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y + bc.z * bc.z)
  const cos = Math.max(-1, Math.min(1, dot / (magBA * magBC || 1e-6)))
  return (Math.acos(cos) * 180) / Math.PI
}

// Thumb IP joint roundness: angle at the thumb IP (mcp-ip-tip).
export function thumbIpAngle(world: Pt[]): number {
  return angleDeg(world[LM.THUMB_MCP], world[LM.THUMB_IP], world[LM.THUMB_TIP])
}

// A finger's PIP angle (mcp-pip-tip-ish): how rounded the finger is.
export function fingerPipAngle(world: Pt[], mcp: number, pip: number, tip: number): number {
  return angleDeg(world[mcp], world[pip], world[tip])
}
