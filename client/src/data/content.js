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
  portrait: "/portrait.png",
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
    {
      name: "Languages",
      items: ["JavaScript (ES6+)", "C/C++", "SQL", "Python", "Java"],
    },
    {
      name: "Front-End",
      items: ["React.js", "Next.js", "Tailwind CSS", "Redux"],
    },
    { name: "Back-End", items: ["Node.js", "Express.js"] },
    { name: "Databases", items: ["MongoDB", "PostgreSQL", "MySQL"] },
    {
      name: "Tools & Platforms",
      items: ["Git", "GitHub", "Postman", "Vercel", "NeonDB"],
    },
  ],
};

export const chambers = {
  headline: "Chambers",
  headlineSub: "what I have built",
  lede: "Three rooms below, each one a thing that shipped and the work it took.",

  /**
   * Edit, reorder, add or delete freely. The section renders whatever is in
   * this array, at any length, and the roman numerals renumber themselves.
   *
   *   name     required, the project title
   *   kind     required, one line under the title
   *   summary  required, a short paragraph
   *   work     optional, what you actually did on it
   *   stack    optional, tags along the bottom
   *   links    optional, [{ label, href }]. Leave the array off entirely and
   *            no links render, rather than dead buttons pointing nowhere.
   */
  projects: [
    {
      name: "Business 4.0",
      kind: "Community meetup platform",
      summary:
        "A membership platform where members sign up, log in and RSVP to events, with a separate admin role for the organisers running them.",
      work: [
        "Built JWT authentication with a separate admin role for organisers.",
        "Created an admin panel to add, edit and cancel events and upload images, with photos on Cloudinary and event data in PostgreSQL.",
        "Automated the registration workflow with UPI payment proof verification, synchronising attendee seat allocations.",
      ],
      stack: ["React", "Node.js", "Express", "PostgreSQL", "Cloudinary"],
    },
    {
      name: "SafarSaathi",
      kind: "Cab booking application",
      summary:
        "A booking system with three distinct sides to it: customers hailing rides, drivers accepting them, and admins watching the fleet.",
      work: [
        "Implemented a multi-tier RBAC system managing separate authentication flows for admins, drivers and customers via JWT.",
        "Built an admin dashboard for revenue tracking, plus fleet management with real-time driver assignment and automated WhatsApp confirmations.",
        "Integrated Razorpay for payment processing and built the driver onboarding workflow end to end.",
      ],
      stack: [
        "React",
        "Node.js",
        "Express",
        "PostgreSQL",
        "Twilio",
        "Razorpay",
      ],
    },
    {
      name: "Descent",
      kind: "This portfolio",
      summary:
        "The site you are reading. Six chambers and one continuous fall, with your scroll position driving every layer of the scene at once.",
      work: [
        "Built the scroll engine on Lenis and GSAP ScrollTrigger sharing a single animation loop, since separate loops are what make this kind of site stutter.",
        "Kept scroll and pointer state out of React entirely, so scrolling never costs a rerender.",
        "Falls back to a still, high-contrast layout for anyone who asks for reduced motion.",
      ],
      stack: ["React", "Vite", "Tailwind CSS", "GSAP"],
    },
  ],
};

export const chronicle = {
  headline: "Infernal Chronicle",
  headlineSub: "the record so far",
  lede: "Where I have been, earliest first, in the order it happened.",

  /**
   * Same rules as the chambers: edit, reorder or extend freely, the timeline
   * renders whatever is here. `detail` is optional.
   */
  entries: [
    {
      period: "2022",
      title: "CBSE Class XII",
      org: "Bal Mandir Sr. Sec. School",
      kind: "Study",
      detail: "92.6 percent.",
    },
    {
      period: "Expected July 2027",
      title: "B.Tech, Industrial Internet of Things",
      org: "University School of Automation and Robotics, GGSIPU",
      kind: "Study",
      detail: "GPA 8.83 out of 10.",
    },
    {
      period: "June 2026 to now",
      title: "Software Development Intern",
      org: "RARS Innoventa",
      kind: "Role",
      detail:
        "Backend services and React interfaces for a B2B marketplace, plus a community platform with automated onboarding, event RSVPs and payment gateway integration. Built full-stack features alongside senior engineers.",
    },
  ],

  /** Undated, so they sit below the timeline rather than inside it. */
  honoursTitle: "Sigils",
  honours: [
    { name: "Smart India Hackathon", note: "Cleared Round 1 of the national innovation hackathon" },
    { name: "Samsung Innovation Campus", note: "Professional training and certification in Artificial Intelligence" },
    { name: "Google Cloud GenAI", note: "Prompt Engineering, via Google Cloud Skills Boost" },
  ],
};

export const summoning = {
  headline: "Summoning Circle",
  headlineSub: "call and I answer",
  lede: "The descent ends here. If you have something worth building, the circle is drawn.",

  /**
   * Direct links only, no contact form. A form with no backend behind it is a
   * lie: it looks like it sent and it did not. Add one when there is something
   * to receive it.
   *
   * Your phone number is on your resume but deliberately not here, since a
   * resume goes to people you chose and a website goes to everyone. Add it to
   * this array if you want it public.
   */
  channels: [
    {
      label: "Email",
      value: "ronakdutta100@gmail.com",
      href: "mailto:ronakdutta100@gmail.com",
      copy: true,
    },
    {
      label: "GitHub",
      value: "github.com/RonakDutta",
      href: "https://github.com/RonakDutta",
    },
  ],

  cta: { label: "Send word", href: "mailto:ronakdutta100@gmail.com" },
  closing: "Ronak Dutta, New Delhi",
};
