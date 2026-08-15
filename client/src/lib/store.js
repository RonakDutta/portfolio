/**
 * Order here must match the order the sections are rendered in, since the
 * scroll spy indexes into this array. Ids are unchanged from the original
 * build so existing deep links keep working.
 */
export const SECTIONS = [
  { id: "gates", label: "Home", num: "00" },
  { id: "fallen", label: "About", num: "01" },
  { id: "chambers", label: "Projects", num: "02" },
  { id: "arsenal", label: "Skills", num: "03" },
  { id: "chronicle", label: "Experience", num: "04" },
  { id: "summoning", label: "Contact", num: "05" },
];

export const frame = {
  scroll: 0,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  smoothPointer: { x: 0, y: 0 },
  section: 0,
  quality: 1,
  portal: 0,
  entered: false,
};

const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setSection(next) {
  if (next === frame.section) return;
  frame.section = next;
  for (const fn of listeners) fn(next);
}

export function initPointer() {
  const onMove = (e) => {
    frame.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    frame.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => window.removeEventListener("pointermove", onMove);
}

export function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const range = (v, inMin, inMax) =>
  clamp01((v - inMin) / (inMax - inMin));
