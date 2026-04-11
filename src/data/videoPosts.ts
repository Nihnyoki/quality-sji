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
    youtubeId: '7CQa1KLeO-o',
    content: [
      "Keep critical inputs stable, but allow non-critical inputs to vary dynamically.",
      "Some of the most impactful defects appear during exploratory testing — often when people interact with the system in unexpected ways."
    ],
    image: '/images/quality-system.jpeg',
    authorName: 'Sandile Mnqayi',
    authorImage: '/images/author-placeholder.svg'
  }
];


