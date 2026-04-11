export interface VideoPost {
  image: string;
  authorName?: string;
  authorImage?: string;
  youtubeId?: string;
  id: string;
  title: string;
  subtitle?: string;
  published: string;
  content: string[];
}

export const videoPosts: VideoPost[] = [
  {
    id: "video-2",
    title: "Dynamic Criteria Based Test Automation",
    subtitle: "Explorative Tests",
    published: "2026-04-11",
    youtubeId: "7CQa1KLeO-o",
    content: [
      "In this video, QA Software Architect Sandile Mnqayi explains how to move beyond static, fixed-input test automation toward more intelligent and adaptive testing frameworks.",
      
      "Traditional automation often fails to uncover defects because it relies on static datasets, while real-world production systems operate on dynamic, evolving data.",
      
      "The limitation of static testing: Fixed inputs such as hardcoded dates, user IDs, or regions create predictable and rigid test environments that do not reflect real user behavior.",
      
      "Constrained dynamic inputs: Instead of fixed values, tests should operate within controlled ranges of valid inputs, allowing variability while maintaining stability.",
      
      "Mimicking production behavior: Test environments should embrace the 'living' nature of data. Avoid excessive cleanup patterns like before-all resets, and allow data to persist and evolve naturally.",
      
      "Implementing intelligent automation: Build lightweight backend services or APIs to dynamically fetch test data from databases instead of relying on static files like JSON or Excel.",
      
      "This enables more powerful, keyword-driven frameworks that can generate valid test scenarios on demand.",
      
      "Mindset shift for SDETs: Engineers should think of themselves as developers building systems to test other systems, leveraging modern tools and AI to create more realistic and resilient automation frameworks."
    ],
    image: "/images/quality-system.jpeg",
    authorName: "Sandile Mnqayi",
    authorImage: "/images/author-placeholder.svg"
  }
];