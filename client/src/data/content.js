/**
 * Portfolio content — concise, direct, human.
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
  linkedin: "",
  resume: "/resume.pdf",
};

export const hero = {
  role: "Software Engineer",
  location: "New Delhi, India",
  tagline: "Building for the web.",

  primary: { label: "View Work", target: "work" },
  secondary: { label: "Résumé", href: "/resume.pdf" },

  scrollCue: "Scroll",

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
  index: "01",
  label: "About",
  title: "About",

  body: [
    "I am a software engineer based in New Delhi, currently working as a software development intern at RARS Innoventa. My work spans backend services and React interfaces, focusing on product cataloguing, inventory, and order fulfillment systems.",
    "Alongside work, I am completing a B.Tech in Industrial Internet of Things at GGSIPU. I focus on building reliable full-stack web applications with clean architecture and solid fundamentals.",
  ],

  facts: [
    { term: "Location", value: "New Delhi, India" },
    { term: "Current Role", value: "Software Development Intern, RARS Innoventa" },
    { term: "Education", value: "B.Tech Industrial IoT, GGSIPU" },
    { term: "Focus", value: "Full-Stack Development" },
  ],
};

export const work = {
  index: "02",
  label: "Work",
  title: "Selected",
  accent: "Work",
  featuredLabel: "Featured Project",

  projects: [
    {
      slug: "ats-workplace",
      name: "ATS Workplace",
      category: "AI Recruitment Platform",
      featured: true,

      image: "/projects/ats-workplace.png",
      imageAlt: "ATS Workplace resume screening interface",
      secondaryImage: null,
      secondaryImageAlt: null,

      description:
        "An applicant tracking system featuring candidate screening, resume parsing, and semantic match scoring.",

      highlights: [
        "Built microservices architecture using React for the interface, Node.js for API routing, and FastAPI for NLP services.",
        "Implemented NLP pipelines using FastAPI, SpaCy, and Transformers for candidate analysis and resume scoring.",
        "Created screening dashboards that summarize candidate qualifications and match scores.",
      ],

      stack: ["React", "Node.js", "Python", "FastAPI", "PostgreSQL", "SpaCy"],

      liveUrl: "https://ats-workplace.vercel.app/",
      githubUrl: null,
    },

    {
      slug: "business40",
      name: "Business 4.0",
      category: "Community Platform",

      image: "/projects/business-40.png",
      imageAlt: "Business 4.0 community meetup platform",
      secondaryImage: null,
      secondaryImageAlt: null,

      description:
        "A membership and event management platform with role-based access, event scheduling, and attendee registrations.",

      highlights: [
        "Implemented JWT authentication with separate permissions for members and organisers.",
        "Built an admin panel for creating and managing events, storing media on Cloudinary and data in PostgreSQL.",
        "Automated event registration flows and seat allocation sync.",
      ],

      stack: ["React", "Node.js", "Express", "PostgreSQL", "Cloudinary"],

      liveUrl: "https://business40.vercel.app/",
      githubUrl: null,
    },

    {
      slug: "safarsaathi",
      name: "SafarSaathi",
      category: "Ride Booking Application",

      image: "/projects/safarsaathi.png",
      imageAlt: "SafarSaathi ride booking interface",
      secondaryImage: null,
      secondaryImageAlt: null,

      description:
        "A ride booking system connecting passengers, drivers, and administrators through dedicated portals.",

      highlights: [
        "Implemented role-based access control and authentication for riders, drivers, and admins via JWT.",
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
  index: "03",
  label: "Skills",
  title: "Skills",
  accent: "",

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
  index: "04",
  label: "Experience",
  title: "Experience",
  accent: "",

  roles: [
    {
      year: "2026",
      period: "June 2026 — Present",
      title: "Software Development Intern",
      org: "RARS Innoventa",
      detail:
        "Developing backend services and React interfaces for a B2B marketplace and community platform, working on event RSVPs, member onboarding, and payment integrations.",
    },
  ],

  educationTitle: "Education",
  education: [
    {
      year: "2027",
      period: "Expected July 2027",
      title: "B.Tech, Industrial Internet of Things",
      org: "University School of Automation and Robotics, GGSIPU",
      detail: "GPA: 8.83 / 10.",
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
  index: "05",
  label: "Achievements",
  title: "Achievements",
  accent: "",

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
  index: "06",
  label: "Contact",
  title: "Contact",
  accent: "",
  lede: "Open to software engineering opportunities and technical collaborations. The best way to reach me is email.",

  cta: { label: "Send Email", href: "mailto:ronakdutta100@gmail.com" },

  channels: [
    {
      label: "Email",
      value: "ronakdutta100@gmail.com",
      href: "mailto:ronakdutta100@gmail.com",
      copy: true,
    },
    { label: "LinkedIn", value: "", href: identity.linkedin },
    {
      label: "GitHub",
      value: "github.com/RonakDutta",
      href: "https://github.com/RonakDutta",
    },
    { label: "Résumé", value: "resume.pdf", href: "/resume.pdf" },
  ],

  closing: "Ronak Dutta — New Delhi, India",
  backToTop: "Back to top",
};
