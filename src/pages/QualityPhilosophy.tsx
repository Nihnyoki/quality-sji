import { Link } from '@tanstack/react-router';
import { qualityPhilosophyPosts } from "../data/qualityPhilosophy";

export default function QualityPhilosophy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold mb-3">
          Quality Philosophy
        </h1>
        <p className="text-gray-600">
          A series of thoughts on quality, automation, and system design,
          shaped by years of testing complex, API-driven platforms.
        </p>
      </header>

      <ul className="grid grid-cols-4 gap-8 border-t border-gray-300">
        {qualityPhilosophyPosts.map(post => (
          <li
            key={post.id}
            className="relative col-span-4 md:col-span-2 flex items-center border-b border-gray-300"
          >
            <Link
              to={`/quality/${post.id}`}
              className="absolute inset-0 z-10"
              aria-label={`Navigate to ${post.title}`}
            />
            <div className="w-1/3 h-full bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }}></div>
            <div className="w-2/3 pl-6">
              <h2 className="text-xl font-medium hover:underline">
                {post.title}
              </h2>
              {post.subtitle && (
                <p className="text-gray-600 mt-1">{post.subtitle}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Published {post.published}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}