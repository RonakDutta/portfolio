/**
 * Portfolio content: concise, direct, human.
 *
 * `script` fields are the words set in Ephesis. They are always a fragment of
 * a longer line, never the whole thing: the cursive is an accent on the page,
 * and a paragraph of it would be unreadable.
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
  linkedin: "https://www.linkedin.com/in/ronak-dutta",
  resume: "/resume.pdf",
};

export const hero = {
  headline: {
    line1: "I build",
    script: "scalable systems",
    line2: "and modern web experiences.",
  },
  introGreeting: "Hi, I’m",
  introRole: "a software engineer from New Delhi.",
  role: "Software Engineer",
  location: "New Delhi, India",

  status: "Open to work",

  primary: { label: "Have a look", target: "work" },
  secondary: { label: "Resume", href: "/resume.pdf" },

  scrollCue: "Scroll",

  ticker: [
    "React",
    "Node.js",
    "PostgreSQL",
    "TypeScript",
    "FastAPI",
    "Express",
    "Next.js",
    "Tailwind",
    "Python",
  ],

  portrait: {
    fallback: "/portrait.jpg",
    webp: [
      { src: "/portrait-560.webp", width: 560 },
      { src: "/portrait.webp", width: 1000 },
    ],
    sizes: "(min-width: 1024px) 34rem, 84vw",
    alt: "Ronak Dutta",
  },
};

export const about = {
  title: "About",
  script: "me",

  body: [
    "I am a software engineer based in New Delhi, currently a software development intern at RARS Innoventa. My work spans backend services and React interfaces: product cataloguing, inventory, and order fulfillment systems.",
    "Alongside work I am finishing a B.Tech in Industrial Internet of Things at GGSIPU. Most of what I know came from building things and then fixing what broke.",
  ],

  signature: "Ronak",

  facts: [
    { term: "Based in", value: "New Delhi, India" },
    { term: "Currently", value: "SDE Intern, RARS Innoventa" },
    { term: "Studying", value: "B.Tech Industrial IoT, GGSIPU" },
    { term: "Working in", value: "Full-stack development" },
  ],
};

export const work = {
  title: "Selected",
  script: "work",

  openLabel: "Open it",
  sourceLabel: "Code",

  projects: [
    {
      slug: "ats-workplace",
      name: "ATS Workplace",
      category: "AI recruitment platform",
      year: "2026",
      featured: true,

      image: "/projects/ats-workplace",
      imageAlt: "ATS Workplace resume screening interface",

      description:
        "An applicant tracking system featuring candidate screening, resume parsing, and semantic match scoring.",

      highlights: [
        "Built a microservices architecture using React for the interface, Node.js for API routing, and FastAPI for NLP services.",
        "Implemented NLP pipelines with SpaCy and Transformers for candidate analysis and resume scoring.",
        "Created screening dashboards that summarise candidate qualifications and match scores.",
      ],

      stack: ["React", "Node.js", "Python", "FastAPI", "PostgreSQL", "SpaCy"],

      liveUrl: "https://ats-workplace.vercel.app/",
      githubUrl: null,
    },

    {
      slug: "business40",
      name: "Business 4.0",
      category: "Community platform",
      year: "2026",

      image: "/projects/business-40",
      imageAlt: "Business 4.0 community meetup platform",

      description:
        "A membership and event management platform with role-based access, event scheduling, and attendee registrations.",

      highlights: [
        "Implemented JWT authentication with separate permissions for members and organisers.",
        "Built an admin panel for creating and managing events, with media on Cloudinary and data in PostgreSQL.",
        "Automated event registration flows and seat allocation sync.",
      ],

      stack: ["React", "Node.js", "Express", "PostgreSQL", "Cloudinary"],

      liveUrl: "https://business40.vercel.app/",
      githubUrl: null,
    },

    {
      slug: "safarsaathi",
      name: "SafarSaathi",
      category: "Ride booking application",
      year: "2025",

      image: "/projects/safarsaathi",
      imageAlt: "SafarSaathi ride booking interface",

      description:
        "A ride booking system connecting passengers, drivers, and administrators through dedicated portals.",

      highlights: [
        "Implemented role-based access control for riders, drivers, and admins via JWT.",
        "Built fleet management dashboards with driver dispatching and automated notifications.",
        "Integrated Razorpay for payments and built driver onboarding workflows.",
      ],

      stack: ["React", "Node.js", "Express", "PostgreSQL", "Twilio", "Razorpay"],

      liveUrl: "https://safarsaathi-frontend.vercel.app/",
      githubUrl: null,
    },
  ],
};

export const skills = {
  title: "The",
  script: "toolkit",
  note: "Printed plainly, because a wall of glowing badges tells you nothing about what someone can actually do.",

  groups: [
    {
      name: "Frontend",
      items: ["React.js", "Next.js", "Tailwind CSS", "Redux"],
    },
    { name: "Backend", items: ["Node.js", "Express.js", "FastAPI"] },
    {
      name: "Languages",
      items: ["JavaScript (ES6+)", "Python", "SQL", "C/C++", "Java"],
    },
    { name: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL"] },
    { name: "Tools", items: ["Git", "GitHub", "Postman", "Vercel", "NeonDB"] },
  ],
};

export const experience = {
  title: "The",
  script: "record",

  workTitle: "Work",
  roles: [
    {
      year: "2026",
      period: "June 2026 to now",
      title: "Software Development Intern",
      org: "RARS Innoventa",
      detail:
        "Developing backend services and React interfaces for a B2B marketplace and community platform, covering event RSVPs, member onboarding, and payment integrations.",
    },
  ],

  educationTitle: "Education",
  education: [
    {
      year: "2027",
      period: "Expected July 2027",
      title: "B.Tech, Industrial Internet of Things",
      org: "University School of Automation and Robotics, GGSIPU",
      detail: "GPA 8.83 / 10.",
    },
    {
      year: "2022",
      period: "2022",
      title: "CBSE Class XII",
      org: "Bal Mandir Sr. Sec. School",
      detail: "92.6%.",
    },
  ],
};

export const achievements = {
  title: "",
  script: "Recognition",

  items: [
    {
      name: "Smart India Hackathon",
      org: "Government of India",
      note: "Qualified Round 1 of the national innovation hackathon.",
    },
    {
      name: "Samsung Innovation Campus",
      org: "Samsung",
      note: "Artificial Intelligence training and certification.",
    },
    {
      name: "Generative AI: Prompt Engineering",
      org: "Google Cloud",
      note: "Certified in prompt engineering for generative AI systems.",
    },
  ],
};

export const contact = {
  title: "Let’s",
  script: "talk",

  lede: "Open to software engineering roles, and happy to talk about anything you are building.",
  responseTime: "I usually reply within a day.",

  formTitle: "Write me a note",
  sendLabel: "Send",
  copyLabel: "Copy it",
  copiedLabel: "Copied",
  againLabel: "Write another",

  channels: [
    { key: "email", label: "Email", value: "ronakdutta100@gmail.com" },
    { key: "github", label: "GitHub", value: "github.com/RonakDutta" },
    { key: "linkedin", label: "LinkedIn", value: "in/ronak-dutta" },
    { key: "resume", label: "Resume", value: "resume.pdf" },
  ],

  availability:
    "Based in New Delhi. Available for full-time roles, internships and remote work.",

  closing: "Designed and built by",
  backToTop: "Back to top",
};
