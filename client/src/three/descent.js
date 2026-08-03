/**
 * Descent geometry, shared between the camera rig and the canvas that seeds it.
 *
 * Its own module on purpose: a file that exports both a component and constants
 * cannot be hot-reloaded reliably, and CameraRig is the one file you most want
 * to tweak with the page running.
 */

/** How far the camera falls, in world units, across the whole page. */
export const DESCENT_DEPTH = 64;
export const DESCENT_START_Y = 4;

/** World-space Y for a given 0 to 1 scroll progress. */
export const depthAt = (progress) => DESCENT_START_Y - progress * DESCENT_DEPTH;
