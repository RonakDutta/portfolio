/**
 * Nav model and the scroll-spy channel.
 *
 * Order here must match the order the sections are rendered in, since the spy
 * indexes into this array. Section ids are semantic now — the previous build
 * used themed ids, and those links are not worth preserving through a full
 * change of identity.
 */
export const SECTIONS = [
  { id: "hero", label: "Ronak Dutta", num: "" },
  { id: "about", label: "About", num: "01" },
  { id: "work", label: "Work", num: "02" },
  { id: "skills", label: "Skills", num: "03" },
  { id: "experience", label: "Experience", num: "04" },
  { id: "contact", label: "Contact", num: "06" },
];

/** Active section index, kept out of React so scrolling costs no renders. */
export const frame = { section: 0 };

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

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
