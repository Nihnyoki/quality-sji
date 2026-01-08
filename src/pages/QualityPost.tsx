import { useParams } from '@tanstack/react-router'
import { qualityPhilosophyPosts } from '../data/qualityPhilosophy'
import PostContent from '../components/PostContent'

export default function QualityPost() {
  const { id } = useParams({ from: '/quality/$id' })

  const post = qualityPhilosophyPosts.find((p) => p.id === id)

  if (!post) {
    return <p className="p-6">Post not found.</p>
  }

  return (
    <article className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold mb-2">{post.title}</h1>

        {post.subtitle && (
          <p className="text-gray-600">{post.subtitle}</p>
        )}

        <p className="text-sm text-gray-400 mt-2">
          Published {post.published}
        </p>
      </header>

      <section className="text-gray-800">
        <PostContent content={post.content} authorName={post.authorName} authorImage={post.authorImage} />
      </section>
    </article>
  )
}
