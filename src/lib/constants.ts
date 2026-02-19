// ============================================
// PROBLEM SOLVERS — Constants & Configuration
// ============================================

export const SITE = {
  name: "Problem Solvers",
  domain: "problemsolvers.ca",
  title: "Problem Solvers | Got a Problem? We Can Solve 'Em!",
  description:
    "One man, with an army of 100 bots with a thousand and one ways to automate your business to minimize expense, while generating leads to maximize sales!",
  location: "Calgary, AB",
} as const;

export const COLORS = {
  dormant: {
    bg: "#07070d",
    surface: "#0e0e18",
    border: "#1a1a2e",
    text: "#2a2a3e",
    textDim: "#18182a",
    accent: "#1e1e35",
  },
  neon: {
    blue: "#00f0ff",
    pink: "#ff2d7b",
    green: "#39ff14",
    cyan: "#00fff7",
    amber: "#ffb800",
    purple: "#bf5af2",
  },
} as const;

export const SECTIONS = [
  { id: "gate", label: "The Gate", index: 0 },
  { id: "wow", label: "The Wow", index: 1 },
  { id: "pitch", label: "The Pitch", index: 2 },
  { id: "machine", label: "The Machine", index: 3 },
  { id: "proof", label: "The Proof", index: 4 },
  { id: "ask", label: "The Ask", index: 5 },
] as const;

export const COPY = {
  heroDormant: "GOT A PROBLEM?",
  heroAlive: "WE CAN SOLVE 'EM!",
  tagline:
    "One man, with an army of 100 bots with a thousand and one ways to automate your business to minimize expense, while generating leads to maximize sales!",
  meetSal: "Hey, I'm Sal, your friendly neighborhood problem solver!",
  cta: "Got a problem? Tell us about it.",
} as const;

export const PROCESS_STEPS = [
  {
    id: "research",
    title: "Research",
    description: "Become an uber-expert. Data flowing, knowledge graphs, documents assembling.",
  },
  {
    id: "simulate",
    title: "Simulate",
    description: "Rapid-fire solution trials. Iterations spawning, testing, failing, succeeding at speed.",
  },
  {
    id: "solve",
    title: "Solve",
    description: "Everything converges into one clean, custom-tailored deliverable.",
  },
] as const;

export const CAPABILITIES = [
  "Business Automation",
  "Lead Generation",
  "Web Development",
  "AI Integration",
] as const;
