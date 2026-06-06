export const RED_FLAGS = [
  "numb",
  "numbness",
  "blue",
  "black",
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
  "swelling getting worse",
];

export function safetyScan(text: string): { blocked: boolean; terms: string[] } {
  const lower = text.toLowerCase();
  const terms = RED_FLAGS.filter((flag) => lower.includes(flag));
  return { blocked: terms.length > 0, terms };
}
