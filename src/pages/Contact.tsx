import { Link } from '@tanstack/react-router';

export default function Contact() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="font-merriweather text-3xl font-semibold text-zinc-900">Contact</h1>
        <p className="mt-3 text-zinc-700 leading-relaxed">
          For questions, collaboration, or privacy-related requests, you can reach me here:
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white/60 px-6 py-6">
        <div className="text-sm text-zinc-500">Email</div>
        <a
          href="mailto:wifizi.gokhinki@gmail.com"
          className="mt-1 block text-lg font-medium text-zinc-900 hover:underline"
        >
          wifizi.gokhinki@gmail.com
        </a>
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
