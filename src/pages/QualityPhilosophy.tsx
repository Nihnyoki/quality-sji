import { Link } from '@tanstack/react-router';
import { qualityPhilosophyPosts } from "../data/qualityPhilosophy";
import BackButton from '../components/BackButton';

function getExcerpt(content: string[]) {
  for (const raw of content) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('## ') || line.startsWith('### ')) continue;
    if (line.startsWith('- ') || line.startsWith('• ')) continue;
    return line;
  }
  return '';
}

export default function QualityPhilosophy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-6">
        <BackButton className="inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-white">
          Back
        </BackButton>
      </div>
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
            className="relative col-span-4 md:col-span-2 flex items-stretch border-b border-gray-300 group"
          >
            <Link
              to="/quality/$id"
              params={{ id: post.id }}
              className="absolute inset-0 z-10"
              aria-label={`Navigate to ${post.title}`}
            />
            <div
              className="w-1/3 min-h-28 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            />
            <div className="w-2/3 pl-6 py-6">
              <h2
                className="text-xl font-medium leading-snug group-hover:underline"
                title={post.title}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.title}
              </h2>
              {post.subtitle && (
                <p className="text-gray-600 mt-1">{post.subtitle}</p>
              )}
              {getExcerpt(post.content) && (
                <p className="text-gray-700 mt-3 leading-relaxed">
                  {getExcerpt(post.content)}
                </p>
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