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
    title: "Partial Dynamic Test Inputs",
    subtitle: "Explorative Tests",
    published: "2026-01-08",
    youtubeId: 'ukwRYUE3cMk',
    content: [
      "Keep critical inputs stable, but allow non-critical inputs to vary dynamically.",
      "Some of the most impactful defects appear during exploratory testing — often when people interact with the system in unexpected ways."
    ],
    image: '/images/quality-system.jpeg',
    authorName: 'Sandile Mnqayi',
    authorImage: '/images/author-placeholder.svg'
  }
];


