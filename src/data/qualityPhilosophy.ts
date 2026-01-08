export interface BlogPost {
  image: string; // thumbnail image path
  model?: string; // optional GLB model path for 3D
  authorName?: string;
  authorImage?: string;
  id: string;
  title: string;
  subtitle?: string;
  published: string;
  content: string[];
}

export const qualityPhilosophyPosts: BlogPost[] = [
  {
    id: "dynamic-test-data",
    title: "Automation should validate intent, while allowing reality to vary.",
    subtitle: "Dynamic Test Data: Getting More Value from Test Automation",
    published: "2026-01-08",
    content: [
      "## Context",
      "Test automation is a powerful tool for enabling fast feedback — I love that about it.",
      "However, many teams struggle to get full value out of automation because their tests run with overly static inputs.",
      "",
      "## The problem with purely static data",
      "Most automated tests validate a specific intent (a function or feature) and therefore need some controlled inputs.",
      "The mistake is treating every input as equally static, even when some values could safely vary without changing the intent being validated.",
      "",
      "## A dynamic test data approach",
      "Keep critical inputs stable, but allow non-critical inputs to vary dynamically.",
      "",
      "By doing this, you can:",
      "- Increase coverage",
      "- Explore edge cases naturally",
      "- Surface defects that static data would never expose",
      "",
      "All without compromising the intent of the test.",
      "",
      "## A practical example (login)",
      "To validate authentication:",
      "- Username and password must be correct and controlled",
      "",
      "But these can vary without invalidating the intent:",
      "- Browser type",
      "- Screen resolution",
      "- Network conditions",
      "- Device characteristics",
      "",
      "You still validate login correctness, while learning how the system behaves under realistic variability.",
      "",
      "## Why this matters",
      "Some of the most impactful defects appear during exploratory testing — often when people interact with the system in unexpected ways.",
      "Even mistakes during manual testing can reveal meaningful defects. That randomness is not a flaw — it’s a signal.",
      "",
      "## Systems are more complex than we admit",
      "Modern systems involve state transitions, backward compatibility, legacy users, partial data ownership, and many internal/third‑party integrations.",
      "Legacy users may carry null or missing values, while newer services assume data that never existed.",
      "A 'garbage in, garbage out' mindset doesn’t survive in competitive environments where reliability and UX affect customer retention.",
      "",
      "## A practical, high-impact strategy",
      "- Anonymize production data",
      "- Use it to create a realistic test dataset",
      "- Write end-to-end automated tests that assert only what is required",
      "- Allow the rest of the payload to vary naturally",
      "",
      "When tests fail, do the due diligence: if the data is realistic, it’s rarely 'just bad data' — it’s exposing assumptions you didn’t know you were making.",
      "",
      "## Closing thought",
      "Automation shouldn’t attempt to predict every scenario.",
      "It should validate intent, embrace variability, and continuously challenge our assumptions about real system behavior."
    ],
    image: '/images/quality-system.jpeg',
    model: '/images/dynamic_quality_system.glb',
    authorName: 'Sandile Mnqayi',
    authorImage: '/images/author-placeholder.svg'
  },
];