export interface BlogPost {
  image: string; // Updated type to string for image paths
  id: string;
  title: string;
  subtitle?: string;
  published: string;
  content: string[];
}

export const qualityPhilosophyPosts: BlogPost[] = [
  {
    id: "quality-is-a-system",
    title: "Quality Is a System, Not a Phase",
    subtitle: "Why quality must be designed, not inspected",
    published: "2026-01-07",
    content: [
      "Quality does not happen at the end of a delivery cycle.",
      "It emerges from how systems are designed, observed, tested, and evolved.",
      "As a Test Automation Architect, I treat quality as a first-class system concern — embedded into architecture, pipelines, and decision-making rather than inspected after the fact."
    ],
    image: '/public/images/quality-system.jpeg' // Fixed path
  },
  {
    id: "automation-is-telemetry",
    title: "Automation Is Telemetry",
    subtitle: "Tests as signals, not scripts",
    published: "2026-01-07",
    content: [
      "Automated tests are not just pass/fail checks — they are signals.",
      "When designed correctly, automation becomes a telemetry pipeline that exposes functional correctness, performance trends, and release risk.",
      "If automation cannot inform a decision, it is noise."
    ],
    image: '/public/images/automation-telemetry.jpeg' // Fixed path
  },
];