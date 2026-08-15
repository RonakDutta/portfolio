/**
 * Every word on the page. Sections are presentation only.
 *
 * Project screenshots: drop a file into `public/projects/` and point `image`
 * at it. The showcase reserves the space at the right ratio beforehand, so
 * adding the real asset shifts nothing.
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

  // No LinkedIn URL exists anywhere in this repository. Set it here and the
  // row appears in the contact section automatically; guessing one would send
  // people to the wrong person.
  linkedin: "",

  resume: "/resume.pdf",
};

export const hero = {
  /* Role first, name second. The name lives in the RD monogram, the document
     title, and one line of metadata under the composition. */
  role: "Software Engineer",
  lead: "I build full-stack",
  accent: "web products.",

  statement:
    "React interfaces over Node.js services and PostgreSQL, built end to end. Currently a software development intern at RARS Innoventa, finishing a B.Tech in Industrial IoT.",

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

  // The one large serif statement in this section. Kept factual on purpose:
  // a slogan here would undo everything the rest of the page is doing.
  statement:
    "I like building the whole thing, front to back, and finding out what breaks.",

  body: [
    "I build full-stack web applications. Right now I am a software development intern at RARS Innoventa, working on backend services and React interfaces for a B2B marketplace, covering product cataloguing, inventory control and order fulfillment.",
    "Alongside that I am finishing a B.Tech in Industrial Internet of Things at University School of Automation and Robotics, GGSIPU. Most of what I know came from building projects end to end and then finding out what broke.",
  ],

  facts: [
    { term: "Location", value: "New Delhi, India" },
    { term: "Currently", value: "Software Development Intern, RARS Innoventa" },
    { term: "Education", value: "B.Tech Industrial IoT, GGSIPU" },
    { term: "Focus", value: "Full-stack development, web applications" },
  ],
};

export const work = {
  index: "02",
  label: "Work",
  title: "Selected",
  accent: "Work",
  featuredLabel: "Featured Work",

  projects: [
    {
      slug: "ats-workplace",
      name: "ATS Workplace",
      category: "AI Recruitment Platform",
      featured: true,

      image: "/projects/ats-workplace.png",
      imageAlt:
        "Candidate screening view: resumes ranked by semantic match score, each with an AI insight summary and its matched and missing skills",
      secondaryImage: null,
      secondaryImageAlt: null,

      description:
        "A microservice-based applicant tracking system automating high-volume recruitment workflows, candidate analysis, and semantic NLP resume scoring.",

      highlights: [
        "Architected a microservice-based ATS featuring a React frontend, a Node.js API gateway, and a Python-based ML engine.",
        "Developed a high-performance NLP pipeline using FastAPI, SpaCy and Hugging Face Transformers for real-time candidate analysis and semantic resume scoring.",
        "Engineered an automated screening system that generates AI-driven candidate summaries and ranking metrics, significantly reducing manual review time.",
      ],

      stack: ["React", "Node.js", "Python", "FastAPI", "PostgreSQL", "SpaCy"],

      liveUrl: "https://ats-workplace.vercel.app/",
      githubUrl: null,
    },

    {
      slug: "business40",
      name: "Business 4.0",
      category: "Community Meetup Platform",

      image: "/projects/business-40.png",
      imageAlt:
        "Business 4.0 landing page with member navigation, log in and sign up, introducing the meetup",
      secondaryImage: null,
      secondaryImageAlt: null,

      description:
        "A membership platform where members sign up, log in and RSVP to events, with a separate admin role for the organisers running them.",

      highlights: [
        "Built JWT authentication with a separate admin role for organisers.",
        "Created an admin panel to add, edit and cancel events and upload images, with photos on Cloudinary and event data in PostgreSQL.",
        "Automated the registration workflow with UPI payment proof verification, synchronising attendee seat allocations.",
      ],

      stack: ["React", "Node.js", "Express", "PostgreSQL", "Cloudinary"],

      liveUrl: "https://business40.vercel.app/",
      githubUrl: null,
    },

    {
      slug: "safarsaathi",
      name: "SafarSaathi",
      category: "Cab Booking Application",

      image: "/projects/safarsaathi.png",
      imageAlt:
        "SafarSaathi ride booking form with pickup location, duration and payment options, signed in as an administrator",
      secondaryImage: null,
      secondaryImageAlt: null,

      description:
        "A booking system with three distinct sides to it: customers hailing rides, drivers accepting them, and admins watching the fleet.",

      highlights: [
        "Implemented a multi-tier RBAC system managing separate authentication flows for admins, drivers and customers via JWT.",
        "Built an admin dashboard for revenue tracking, plus fleet management with real-time driver assignment and automated WhatsApp confirmations.",
        "Integrated Razorpay for payment processing and built the driver onboarding workflow end to end.",
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
  title: "Technical",
  accent: "Index",

  groups: [
    {
      name: "Frontend",
      items: ["React.js", "Next.js", "Tailwind CSS", "Redux"],
    },
    { name: "Backend", items: ["Node.js", "Express.js", "FastAPI"] },
    {
      name: "Languages",
      items: ["JavaScript (ES6+)", "Python", "C/C++", "Java", "SQL"],
    },
    { name: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL"] },
    { name: "Tools", items: ["Git", "GitHub", "Postman", "Vercel", "NeonDB"] },
  ],
};

export const experience = {
  index: "04",
  label: "Experience",
  title: "The",
  accent: "Record",

  roles: [
    {
      year: "2026",
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
      year: "2027",
      period: "Expected July 2027",
      title: "B.Tech, Industrial Internet of Things",
      org: "University School of Automation and Robotics, GGSIPU",
      detail: "GPA 8.83 out of 10.",
    },
    {
      year: "2022",
      period: "2022",
      title: "CBSE Class XII",
      org: "Bal Mandir Sr. Sec. School",
      detail: "92.6 percent.",
    },
  ],
};

export const achievements = {
  index: "05",
  label: "Achievements",
  title: "Awards &",
  accent: "Certifications",

  items: [
    {
      name: "Smart India Hackathon",
      org: "Government of India",
      note: "Cleared Round 1 of the national innovation hackathon.",
    },
    {
      name: "Samsung Innovation Campus",
      org: "Samsung",
      note: "Professional training and certification in Artificial Intelligence.",
    },
    {
      name: "Generative AI — Prompt Engineering",
      org: "Google Cloud Skills Boost",
      note: "Certified in prompt engineering for generative AI systems.",
    },
  ],
};

export const contact = {
  index: "06",
  label: "Contact",
  title: "Let’s Work",
  accent: "Together",
  lede: "Open to software engineering roles and interesting problems. The fastest way to reach me is email.",

  cta: { label: "Send an Email", href: "mailto:ronakdutta100@gmail.com" },

  /* Rendered in order; any row with an empty href is skipped. */
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
