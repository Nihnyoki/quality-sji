export interface ProjectPost {
  image: string;
  id: string;
  title: string;
  subtitle?: string;
  published: string;
  content: string[];
}

export const projectPosts: ProjectPost[] = [
  {
    id: "project-1",
    title: "Open Source Test Runner",
    subtitle: "A fast, reliable JS test runner",
    published: "2026-01-08",
    content: [
      "A blazing fast test runner for JavaScript and TypeScript projects.",
      "Supports parallel execution and rich reporting."
    ],
    image: '/public/images/quality-system.jpeg'
  },
  {
    id: "project-2",
    title: "CI/CD Telemetry Plugin",
    subtitle: "Telemetry for your pipelines",
    published: "2026-01-08",
    content: [
      "A plugin to add telemetry and quality signals to any CI/CD pipeline.",
      "Works with GitHub Actions, GitLab, and Jenkins."
    ],
    image: '/public/images/automation-telemetry.jpeg'
  }
];
