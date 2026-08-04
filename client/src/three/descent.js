

export const DESCENT_DEPTH = 64;
export const DESCENT_START_Y = 4;

export const depthAt = (progress) => DESCENT_START_Y - progress * DESCENT_DEPTH;
