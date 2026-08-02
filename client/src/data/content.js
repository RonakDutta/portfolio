/**
 * All copy lives here. Sections are presentation only — swapping your details
 * in should never mean touching a component.
 */

export const identity = {
  name: "Ronak Dutta",
  given: "Ronak",
  family: "Dutta",
  initials: "RD",
  role: "Software Engineer",
  location: "New Delhi",
  region: "New Delhi, India",
  email: "ronakdutta100@gmail.com",
};

export const gates = {
  /** Blackletter eyebrow above the lockup. Dante, via the obvious route. */
  eyebrow: "Abandon all hope, ye who enter",
  /** Ghosted word set behind the name for depth. */
  ghost: "INFERNO",
  tagline:
    "Six chambers below, a record of everything built, broken and rebuilt. Descend at your own pace.",
  cta: { label: "Begin the Descent", target: "fallen" },
  secondary: { label: "The Chronicle", target: "chronicle" },
  scrollCue: "Descend",
};

export const fallen = {
  /**
   * Drop your photo at `client/public/portrait.jpg` and it appears here with no
   * code change. Until then the niche shows a carved stone slab instead.
   * Portrait reads best roughly 4:5, framed head-and-shoulders — the arch crops
   * the top corners hard.
   */
  portrait: "/portrait.jpg",
  portraitAlt: "Ronak Dutta",

  headline: "Software Engineer",
  headlineSub: "from New Delhi",

  body: [
    "I build for the browser — interfaces, tools, and the occasional thing that has no business running at sixty frames a second. Most of my work sits where product engineering meets realtime graphics: the place where the design file and the frame budget have to agree before anything ships.",
    "I care about the parts nobody names in a review. Whether the first paint lands fast, whether the animation survives a mid-range phone, whether someone navigating by keyboard reaches every place everyone else does.",
  ],

  /** Shown as a definition list. Keep the values short — they're set in caps. */
  facts: [
    { term: "Based in", value: "New Delhi, India" },
    { term: "Focus", value: "Product engineering, realtime graphics" },
    { term: "Working in", value: "React, TypeScript, WebGL" },
    { term: "Status", value: "Open to selected work" },
  ],
};
