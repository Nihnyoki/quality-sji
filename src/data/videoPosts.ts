export interface VideoPost {
  image: string;
  id: string;
  title: string;
  subtitle?: string;
  published: string;
  content: string[];
}

export const videoPosts: VideoPost[] = [
  {
    id: "video-1",
    title: "How to Build a Quality System",
    subtitle: "A practical guide to system thinking",
    published: "2026-01-08",
    content: [
      "Learn the basics of building a robust quality system in your organization.",
      "Covers architecture, automation, and measurement."
    ],
    image: '/public/images/automation-telemetry.jpeg'
  },
  {
    id: "video-2",
    title: "Telemetry in Test Automation",
    subtitle: "Making your tests talk",
    published: "2026-01-08",
    content: [
      "How to use telemetry to get more value from your automated tests.",
      "Includes real-world examples and dashboards."
    ],
    image: '/public/images/quality-system.jpeg'
  }
];
