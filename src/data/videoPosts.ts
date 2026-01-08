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
    title: "Telemetry in Test Automation",
    subtitle: "Making your tests talk",
    published: "2026-01-08",
    youtubeId: 'ukwRYUE3cMk',
    content: [
      "How to use telemetry to get more value from your automated tests.",
      "Includes real-world examples and dashboards."
    ],
    image: '/images/quality-system.jpeg',
    authorName: 'Sandile Mnqayi',
    authorImage: '/images/author-placeholder.svg'
  }
];
