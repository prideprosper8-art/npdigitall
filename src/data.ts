export const company = {
  name: "NP Digital",
  tagline: "Ideas | Systems | Solutions | Beyond",
  description:
    "NP Digital is a modern technology and digital solutions company that transforms ideas into powerful digital products and systems for individuals, startups, and businesses.",
  email: "npdigitalinfo@gmail.com",
  phone: "+263 71 694 2118",
  phoneHref: "+263716942118",
  phone2: "+91 88665 9566",
  phone2Href: "+91886659566",
  location: "Harare, Zimbabwe",
  website: "www.npdigital.in",
  url: "https://www.npdigital.in",
} as const;

export type Service = {
  id: string;
  no: string;
  title: string;
  description: string;
  glyph: string;
  image: string;
};

export const services: Service[] = [
  {
    id: "website-development",
    no: "01",
    title: "Website Development",
    description:
      "Modern, responsive, and professional websites for businesses, individuals, and organizations.",
    glyph: "◫",
    image: "/assets/services/website-development.png",
  },
  {
    id: "systems-development",
    no: "02",
    title: "Systems Development",
    description:
      "Custom business systems designed to streamline operations and improve workflows.",
    glyph: "⌘",
    image: "/assets/services/systems-development.png",
  },
  {
    id: "ai-systems-automation",
    no: "03",
    title: "AI Systems & Automation",
    description:
      "Intelligent solutions that automate tasks, improve efficiency, and unlock new possibilities.",
    glyph: "✦",
    image: "/assets/services/ai-systems-automation.png",
  },
  {
    id: "tracking-systems",
    no: "04",
    title: "Tracking Systems",
    description:
      "Real-time tracking solutions for vehicles, assets, people, and business operations, depending on requirements.",
    glyph: "◎",
    image: "/assets/services/tracking-systems.png",
  },
  {
    id: "mobile-applications",
    no: "05",
    title: "Mobile Applications",
    description: "Android and iOS applications tailored to client needs.",
    glyph: "▣",
    image: "/assets/services/mobile-applications.png",
  },
  {
    id: "desktop-applications",
    no: "06",
    title: "Desktop Applications",
    description:
      "Powerful desktop software for supported operating systems and business environments.",
    glyph: "▤",
    image: "/assets/services/desktop-applications.png",
  },
  {
    id: "e-commerce-solutions",
    no: "07",
    title: "E-Commerce Solutions",
    description:
      "Online stores with product management, payment integration, and scalable functionality.",
    glyph: "◈",
    image: "/assets/services/e-commerce-solutions.png",
  },
  {
    id: "database-solutions",
    no: "08",
    title: "Database Solutions",
    description:
      "Structured data systems designed to organize, secure, and manage business information.",
    glyph: "⊞",
    image: "/assets/services/database-solutions.png",
  },
  {
    id: "digital-marketing-branding",
    no: "09",
    title: "Digital Marketing & Branding",
    description:
      "Digital presence, brand identity, and marketing solutions tailored to client goals.",
    glyph: "↗",
    image: "/assets/services/digital-marketing-branding.png",
  },
  {
    id: "custom-solutions",
    no: "10",
    title: "Custom Solutions & More",
    description:
      "Have a unique idea? We will explore a solution designed around your requirements.",
    glyph: "+",
    image: "/assets/services/custom-solutions.png",
  },
];

export type Capability = {
  title: string;
  description: string;
};

export const capabilities: Capability[] = [
  {
    title: "Web Development",
    description:
      "Clear, fast digital experiences shaped around your brand, audience, and business goals.",
  },
  {
    title: "AI & Automation",
    description:
      "Practical automation that reduces repetitive work and creates clearer paths through complex tasks.",
  },
  {
    title: "Business Systems",
    description:
      "Purpose-built systems that bring your workflows, information, and team operations together.",
  },
  {
    title: "Tracking",
    description:
      "Connected visibility for movements, assets, activity, and operations when the use case calls for it.",
  },
  {
    title: "Mobile Apps",
    description:
      "Useful native and cross-platform mobile experiences made around how people actually work.",
  },
  {
    title: "Data & Infrastructure",
    description:
      "Structured data and reliable foundations that help a digital product evolve over time.",
  },
];

export type Solution = {
  no: string;
  title: string;
  challenge: string;
  approach: string;
  audience: string;
};

export const solutions: Solution[] = [
  {
    no: "01",
    title: "BUSINESS AUTOMATION",
    challenge:
      "Repetitive tasks and disconnected steps can slow down everyday work.",
    approach:
      "We can map key processes and explore systems or automations that bring work into a clearer flow.",
    audience: "Teams handling repeatable operational tasks.",
  },
  {
    no: "02",
    title: "DIGITAL PRESENCE",
    challenge:
      "A business needs a credible place to show its value and make an impression.",
    approach:
      "We can shape a website and digital presence around the people you need to reach.",
    audience: "Growing businesses, professionals, and organizations.",
  },
  {
    no: "03",
    title: "OPERATIONAL SYSTEMS",
    challenge:
      "Information often sits across tools, documents, and informal processes.",
    approach:
      "We can design a central system around the workflow and information your team needs.",
    audience: "Businesses with evolving internal operations.",
  },
  {
    no: "04",
    title: "AI-POWERED WORKFLOWS",
    challenge:
      "New AI capabilities should serve a useful, specific purpose — not a gimmick.",
    approach:
      "We can identify suitable tasks and prototype practical AI-supported workflow improvements.",
    audience: "Teams exploring responsible AI adoption.",
  },
  {
    no: "05",
    title: "CUSTOM SOFTWARE",
    challenge:
      "Some challenges need more than an off-the-shelf tool can provide.",
    approach:
      "We can explore an application designed around the operations and experience you need.",
    audience: "Businesses with specialised requirements.",
  },
];

export type ProcessStep = {
  no: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    no: "01",
    title: "DISCOVER",
    description:
      "We start with your goals, constraints, and context. No assumptions — we ask until the problem is clear.",
  },
  {
    no: "02",
    title: "DESIGN",
    description:
      "We shape the user experience, system structure, and technical approach before any code is written.",
  },
  {
    no: "03",
    title: "BUILD",
    description:
      "We develop in focused iterations, so you see working progress early and can steer as we go.",
  },
  {
    no: "04",
    title: "LAUNCH & SUPPORT",
    description:
      "We deploy, monitor, and stay available for improvements as your needs evolve.",
  },
];

export const navLinks = [
  { label: "Home", href: "index.html#top" },
  { label: "About", href: "index.html#about" },
  { label: "Services", href: "index.html#services" },
  { label: "Solutions", href: "index.html#solutions" },
  { label: "Projects", href: "projects.html" },
  { label: "Contact", href: "index.html#contact" },
] as const;
