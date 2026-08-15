/**
 * Every word on the page lives here. Sections are presentation only.
 *
 * Adding a project screenshot: drop the file into `public/projects/` and set
 * `image` to its path. Until then the showcase renders a labelled placeholder
 * at the correct aspect ratio, so nothing shifts when the real asset lands.
 */

export const identity = {
  name: "Ronak Dutta",
  given: "Ronak",
  family: "Dutta",
  initials: "R",
  role: "Software Engineer",
  location: "New Delhi",
  region: "New Delhi, India",
  email: "ronakdutta100@gmail.com",
  github: "https://github.com/RonakDutta",

  // Set this to a profile URL and it appears in the contact section
  // automatically. Left empty because there is no LinkedIn URL in this repo
  // and guessing one would send people to the wrong person.
  linkedin: "",

  resume: "/resume.pdf",
};

export const hero = {
  // Small type set into the left and right margins of the arch.
  railLeft: "MMXXVI",
  railRight: "New Delhi",

  intro:
    "I build full-stack web applications: React interfaces on top of Node.js services and PostgreSQL. Currently a software development intern at RARS Innoventa, finishing a B.Tech in Industrial IoT.",

  primary: { label: "Selected Work", target: "chambers" },
  secondary: { label: "Résumé", href: "/resume.pdf" },

  scrollCue: "Scroll",
};

export const about = {
  index: "01",
  label: "About",
  title: "About",
  lede: "Short version: I like building the whole thing, front to back, and finding out what breaks.",

  portrait: {
    fallback: "/portrait.jpg",
    webp: [
      { src: "/portrait-560.webp", width: 560 },
      { src: "/portrait.webp", width: 1000 },
    ],
    sizes: "(min-width: 1024px) 26rem, 78vw",
  },
  portraitAlt: "Ronak Dutta",

  body: [
    "I build full-stack web applications. Right now I am a software development intern at RARS Innoventa, working on backend services and React interfaces for a B2B marketplace, covering product cataloguing, inventory control and order fulfillment.",
    "Alongside that I am finishing a B.Tech in Industrial Internet of Things at University School of Automation and Robotics, GGSIPU. Most of what I know came from building projects end to end and then finding out what broke.",
  ],

  facts: [
    { term: "Based in", value: "New Delhi, India" },
    { term: "Currently", value: "Software Development Intern, RARS Innoventa" },
    { term: "Working in", value: "React, Node.js, Express, PostgreSQL" },
    { term: "Studying", value: "B.Tech Industrial IoT, GGSIPU" },
  ],
};

export const work = {
  index: "02",
  label: "Projects",
  title: "Selected Work",
  lede: "Three systems built end to end, each one shipped and running.",

  projects: [
    {
      slug: "ats-workplace",
      name: "ATS Workplace",
      kind: "AI recruitment platform",
      featured: true,

      /* Screenshots. Replace the placeholder paths with real files in
         `public/projects/` — the layout already reserves the space. */
      image: "/projects/ats-workplace.png",
      imageAlt:
        "ATS Workplace dashboard showing ranked candidates and resume scores",
      imageAlt2: "ATS Workplace candidate analysis view",
      image2: null,
      thumb: null,

      summary:
        "A microservice-based applicant tracking system automating high-volume recruitment workflows, candidate analysis, and semantic NLP resume scoring.",

      highlights: [
        "Architected a microservice-based ATS featuring a React frontend, a Node.js API gateway, and a Python-based ML engine.",
        "Developed a high-performance NLP pipeline using FastAPI, SpaCy, and Hugging Face Transformers for real-time candidate analysis and semantic resume scoring.",
        "Engineered an automated screening system that generates AI-driven candidate summaries and ranking metrics, significantly reducing manual review time.",
      ],

      stack: ["React", "Node.js", "Python", "FastAPI", "PostgreSQL", "SpaCy"],

      live: "https://ats-workplace.vercel.app/",
      github: null,
    },

    {
      slug: "business-40",
      name: "Business 4.0",
      kind: "Community meetup platform",

      image: "/projects/business-40.png",
      imageAlt:
        "Business 4.0 event listing page with member registration and RSVP",
      image2: null,
      imageAlt2: null,
      thumb: null,

      summary:
        "A membership platform where members sign up, log in and RSVP to events, with a separate admin role for the organisers running them.",

      highlights: [
        "Built JWT authentication with a separate admin role for organisers.",
        "Created an admin panel to add, edit and cancel events and upload images, with photos on Cloudinary and event data in PostgreSQL.",
        "Automated the registration workflow with UPI payment proof verification, synchronising attendee seat allocations.",
      ],

      stack: ["React", "Node.js", "Express", "PostgreSQL", "Cloudinary"],

      live: "https://business40.vercel.app/",
      github: null,
    },

    {
      slug: "safarsaathi",
      name: "SafarSaathi",
      kind: "Cab booking application",

      image: "/projects/safarsaathi.png",
      imageAlt:
        "SafarSaathi admin dashboard showing fleet status and revenue tracking",
      image2: null,
      imageAlt2: null,
      thumb: null,

      summary:
        "A booking system with three distinct sides to it: customers hailing rides, drivers accepting them, and admins watching the fleet.",

      highlights: [
        "Implemented a multi-tier RBAC system managing separate authentication flows for admins, drivers and customers via JWT.",
        "Built an admin dashboard for revenue tracking, plus fleet management with real-time driver assignment and automated WhatsApp confirmations.",
        "Integrated Razorpay for payment processing and built the driver onboarding workflow end to end.",
      ],

      stack: ["React", "Node.js", "Express", "PostgreSQL", "Twilio", "Razorpay"],

      live: "https://safarsaathi-frontend.vercel.app/",
      github: null,
    },
  ],
};

export const skills = {
  index: "03",
  label: "Skills",
  title: "Toolkit",
  lede: "What I reach for, grouped by where it sits in the stack.",

  groups: [
    {
      name: "Languages",
      items: ["JavaScript (ES6+)", "C/C++", "SQL", "Python", "Java"],
    },
    {
      name: "Frontend",
      items: ["React.js", "Next.js", "Tailwind CSS", "Redux"],
    },
    { name: "Backend", items: ["Node.js", "Express.js"] },
    { name: "Databases", items: ["MongoDB", "PostgreSQL", "MySQL"] },
    {
      name: "Tools",
      items: ["Git", "GitHub", "Postman", "Vercel", "NeonDB"],
    },
  ],
};

export const record = {
  index: "04",
  label: "Experience",
  title: "Experience",
  lede: "Where I have been, most recent first.",

  experience: [
    {
      period: "June 2026 — Present",
      title: "Software Development Intern",
      org: "RARS Innoventa",
      detail:
        "Backend services and React interfaces for a B2B marketplace, plus a community platform with automated onboarding, event RSVPs and payment gateway integration. Built full-stack features alongside senior engineers.",
    },
  ],

  educationTitle: "Education",
  education: [
    {
      period: "Expected July 2027",
      title: "B.Tech, Industrial Internet of Things",
      org: "University School of Automation and Robotics, GGSIPU",
      detail: "GPA 8.83 out of 10.",
    },
    {
      period: "2022",
      title: "CBSE Class XII",
      org: "Bal Mandir Sr. Sec. School",
      detail: "92.6 percent.",
    },
  ],

  certificationsTitle: "Certifications & Recognition",
  certifications: [
    {
      name: "Smart India Hackathon",
      note: "Cleared Round 1 of the national innovation hackathon",
    },
    {
      name: "Samsung Innovation Campus",
      note: "Professional training and certification in Artificial Intelligence",
    },
    {
      name: "Google Cloud GenAI",
      note: "Prompt Engineering, via Google Cloud Skills Boost",
    },
  ],
};

export const contact = {
  index: "05",
  label: "Contact",
  title: "Get in Touch",
  lede: "Open to software engineering roles and interesting problems. The fastest way to reach me is email.",

  cta: { label: "Send an Email", href: `mailto:ronakdutta100@gmail.com` },

  /* Rendered in order; anything with an empty href is skipped, so filling in
     `identity.linkedin` above is all it takes to add that row. */
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
    {
      label: "LinkedIn",
      value: "",
      href: identity.linkedin,
    },
    {
      label: "Résumé",
      value: "resume.pdf",
      href: "/resume.pdf",
    },
  ],

  closing: "Ronak Dutta — New Delhi, India",
  ascend: "Back to top",
};
