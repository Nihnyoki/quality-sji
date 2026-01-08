export interface ProjectPost {
  image: string;
  authorName?: string;
  authorImage?: string;
  id: string;
  title: string;
  subtitle?: string;
  published: string;
  content: string[];
}

export const projectPosts: ProjectPost[] = [
  {
    id: "project-1",
    title: "A dynamic test approach test automation methodology",
    subtitle: "Partial test inputs contrsaints, leveraging dynamicity in test data for a wider coverage",
    published: "2026-01-08",
    content: [
      "xxx",
    ],
    image: '/images/quality-system.jpeg',
    authorName: 'Sandile Mnqayi',
    authorImage: '/images/author-placeholder.svg'
  }
];
