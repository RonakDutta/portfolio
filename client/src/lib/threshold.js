

const SESSION_KEY = "descent:crossed";

let crossed =
  typeof document === "undefined" || !document.getElementById("threshold");

const crossWaiters = new Set();

export function onCrossed(fn) {
  if (crossed) {
    fn();
    return () => {};
  }
  crossWaiters.add(fn);
  return () => crossWaiters.delete(fn);
}

export function markCrossed() {
  if (crossed) return;
  crossed = true;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    
  }
  for (const fn of crossWaiters) fn();
  crossWaiters.clear();
}

export function alreadyCrossed() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

let sceneReady = false;
const sceneWaiters = new Set();

export function markSceneReady() {
  if (sceneReady) return;
  sceneReady = true;
  for (const fn of sceneWaiters) fn();
  sceneWaiters.clear();
}

export function onSceneReady(fn) {
  if (sceneReady) {
    fn();
    return () => {};
  }
  sceneWaiters.add(fn);
  return () => sceneWaiters.delete(fn);
}
