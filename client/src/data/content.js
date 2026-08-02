/**
 * All copy lives here. Sections are presentation only, so swapping your details
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
  github: "https://github.com/RonakDutta",
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
   * Portrait reads best at roughly 4:5, framed head and shoulders, since the
   * arch crops the top corners hard.
   */
  portrait: "/portrait.jpg",
  portraitAlt: "Ronak Dutta",

  headline: "Software Engineer",
  headlineSub: "from New Delhi",

  body: [
    "I build full-stack web applications. Right now I am a software development intern at RARS Innoventa, working on backend services and React interfaces for a B2B marketplace, covering product cataloguing, inventory control and order fulfillment.",
    "Alongside that I am finishing a B.Tech in Industrial Internet of Things at University School of Automation and Robotics, GGSIPU. Most of what I know came from building projects end to end and then finding out what broke.",
  ],

  /** Shown as a definition list. Keep the values short, they are set in caps. */
  facts: [
    { term: "Based in", value: "New Delhi, India" },
    { term: "Currently", value: "Software Development Intern, RARS Innoventa" },
    { term: "Working in", value: "React, Node.js, Express, PostgreSQL" },
    { term: "Studying", value: "B.Tech Industrial IoT, GGSIPU" },
  ],
};

export const arsenal = {
  headline: "Arsenal",
  headlineSub: "what I build with",
  lede: "The tools I reach for, grouped by where they sit in the stack.",

  racks: [
    { name: "Languages", items: ["JavaScript (ES6+)", "C/C++", "SQL", "Python", "Java"] },
    { name: "Front-End", items: ["React.js", "Next.js", "Tailwind CSS", "Redux"] },
    { name: "Back-End", items: ["Node.js", "Express.js"] },
    { name: "Databases", items: ["MongoDB", "PostgreSQL", "MySQL"] },
    { name: "Tools & Platforms", items: ["Git", "GitHub", "Postman", "Vercel", "NeonDB"] },
  ],
};
