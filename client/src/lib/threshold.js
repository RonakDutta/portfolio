const SESSION_KEY = "curtain:opened";

let crossed =
  typeof document === "undefined" || !document.getElementById("curtain");

const waiters = new Set();

/** Runs `fn` once the curtain has opened, or immediately if it already has. */
export function onCrossed(fn) {
  if (crossed) {
    fn();
    return () => {};
  }
  waiters.add(fn);
  return () => waiters.delete(fn);
}

export function markCrossed() {
  if (crossed) return;
  crossed = true;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* Private mode. The curtain simply performs again. */
  }
  for (const fn of waiters) fn();
  waiters.clear();
}

export function alreadyCrossed() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}
