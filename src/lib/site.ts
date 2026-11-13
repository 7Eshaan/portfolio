/**
 * Everything personal lives here — edit this file to change the copy,
 * links and tech stack shown across the site.
 */
export const site = {
  name: "Eshaan",
  role: "Software Developer",
  githubUsername: "7Eshaan",

  /** One-liner used for the page description / link previews. */
  short:
    "I build cool stuff that actually gets used. Second-year B.Tech CSE student, deep into Go, AI agents, MCPs, and backend systems.",

  /** Home page intro. */
  home: {
    greeting: "Hey there, I\u2019m",
    paragraphs: [
      "I build cool stuff that actually gets used. I\u2019m a second-year B.Tech CSE student, currently deep into Go, AI agents, MCPs, and backend systems. I care about clean architecture and good design, and I like when both show up in the same project.",
      "Off the keyboard, I\u2019m usually on a football pitch (my main sport), or playing badminton and table tennis, or really any sport that\u2019s fun. When I\u2019m not juggling college and DSA, you\u2019ll find me watching anime or gaming.",
    ],
  },

  /** Longer paragraphs for the About page. */
  about: [
    "It all started on a random day when a friend invited me over to play a new game his dad had bought for him. It was GTA: Vice City. I had the time of my life playing it, and it sparked a curiosity about computers that stayed with me.",
    "Back then, I had a fairly low-end laptop, so I got into tweaking and optimizing it to squeeze every bit of performance out of it. What started as an attempt to get better FPS in games gradually turned into an interest in understanding how computers actually worked.",
    "As I explored further, I discovered Linux. Installing it on my old laptop opened up an entirely different side of computing. I enjoyed experimenting with different tools, customizing my environment, and learning by breaking things and figuring them out.",
    "Outside of gaming and football, tinkering with computers became one of the few things I genuinely enjoyed. Over time, that curiosity evolved into an interest in building software and understanding the systems behind it.",
    "I started coding seriously during my first year of B.Tech, initially gravitating towards backend engineering and working with technologies like Java and Go.",
    "Today, I\u2019m particularly interested in AI agents, MCP, backend infrastructure, and distributed systems. I enjoy building things, exploring how systems work under the hood, and turning ideas into software.",
  ],

  socials: {
    github: "https://github.com/7Eshaan",
    linkedin: "https://www.linkedin.com/in/eshaan-dogra",
    x: "https://x.com/eshawwn",
    email: "eshaandogra7@gmail.com",
    discord: "https://discord.com/users/723084221413064745",
  },

  /** The "Listening to" card in the sidebar. */
  listening: {
    title: "Breathe",
    artist: "Yeat",
    album: "2093",
    cover: "/music/breathe.jpg",
    url: "https://open.spotify.com/track/5NAOhPAZ57eFAXr3qatS6i",
  },

  /**
   * The "Apps I like to use" belt. Icons live in public/apps.
   * `fullBleed` marks icons with no built-in padding, so they get shrunk to match the rest.
   */
  apps: [
    { name: "Brave", note: "Browser", icon: "/apps/brave.png", url: "https://brave.com" },
    { name: "Helium", note: "Browser", icon: "/apps/helium.png", url: "https://helium.computer" },
    { name: "Zed", note: "Code editor", icon: "/apps/zed.png", url: "https://zed.dev" },
    { name: "Vorssaint", note: "Swiss-army knife for macOS", icon: "/apps/vorssaint.png", fullBleed: true, url: "https://github.com/vorssaint/vorssaint-utils" },
    { name: "Ghostty", note: "Terminal emulator", icon: "/apps/ghostty.png", fullBleed: true, url: "https://ghostty.org" },
    { name: "T3 Code", note: "Control plane for AI agents", icon: "/apps/t3code.png", url: "https://github.com/pingdotgg/t3code" },
    { name: "Obsidian", note: "Notes", icon: "/apps/obsidian.png", url: "https://obsidian.md" },
  ],

  /** How many pinned repos to show, on the home page and the projects page. */
  projectLimit: 3,
} as const;

/**
 * Extra details for project cards, keyed by the repo name in lowercase.
 * The list of projects, their links and their tech still come live from GitHub;
 * anything set here replaces what GitHub says. Screenshots live in public/projects.
 */
export const projectDetails: Record<
  string,
  {
    title?: string;
    description?: string;
    image?: { src: string; width: number; height: number; position?: string };
  }
> = {
  plewtus: {
    description:
      "A self-hostable metasearch engine that aggregates and ranks results from multiple providers, extracts web content, and empowers AI agents through native MCP integration.",
    image: { src: "/projects/plewtus.webp", width: 2000, height: 1162 },
  },
  denco: {
    description:
      "A cross-platform BitTorrent client written in Go, featuring tracker and DHT support, resumable downloads, peer management, and a lightweight daemon\u2013CLI architecture.",
    image: {
      src: "/projects/denco.png",
      width: 1772,
      height: 684,
      position: "left top",
    },
  },
  "job-application-tracker": {
    title: "Job-Application-Tracker",
    description:
      "A full-stack job application tracker featuring a drag-and-drop Kanban board, secure authentication, and seamless application management.",
    image: {
      src: "/projects/job-application-tracker.webp",
      width: 2000,
      height: 1169,
    },
  },
};

export const techStack = [
  {
    title: "Languages",
    items: ["Java", "Go", "Python", "TypeScript", "JavaScript", "C++"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Svelte", "Tailwind CSS"],
  },
  {
    title: "Runtime & Backend",
    items: ["Node.js"],
  },
  {
    title: "Databases & Backend Services",
    items: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Firebase"],
  },
  {
    title: "Tools & DevOps",
    items: ["Git", "Docker", "Postman"],
  },
] as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
] as const;
