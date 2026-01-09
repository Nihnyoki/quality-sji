import { Link } from '@tanstack/react-router';

export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="font-merriweather text-3xl font-semibold text-zinc-900">About</h1>
        <p className="mt-3 text-zinc-700 leading-relaxed">
          sandilem.com is a personal portfolio and writing space focused on quality engineering,
          test automation, and practical systems thinking.
        </p>
      </header>

      <section className="space-y-4 text-zinc-700 leading-relaxed">
        <p>
          This site includes posts, videos, and projects. Some pages may display ads.
        </p>
        <p>
          For how data is handled (including comments), see the Privacy Policy.
        </p>
      </section>

      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-white"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
