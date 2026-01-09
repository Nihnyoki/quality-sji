import { Link } from '@tanstack/react-router';

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h1 className="font-merriweather text-3xl font-semibold text-zinc-900">Privacy Policy</h1>
        <p className="mt-3 text-zinc-700 leading-relaxed">
          This page describes how sandilem.com handles information when you use the site.
        </p>
      </header>

      <section className="space-y-6 text-zinc-700 leading-relaxed">
        <div>
          <h2 className="font-merriweather text-xl font-semibold text-zinc-900">Comments</h2>
          <p className="mt-2">
            If you choose to comment, you may sign in with Google. Comments are stored in Firebase
            Firestore along with basic profile information provided by your Google account (such as
            display name and avatar) to show attribution next to your comment.
          </p>
        </div>

        <div>
          <h2 className="font-merriweather text-xl font-semibold text-zinc-900">Cookies & Advertising</h2>
          <p className="mt-2">
            This site may use cookies or similar technologies for functionality and for serving ads.
            Google AdSense and its partners may use cookies to personalize ads or measure performance,
            depending on your settings and region.
          </p>
        </div>

        <div>
          <h2 className="font-merriweather text-xl font-semibold text-zinc-900">Third-party Services</h2>
          <p className="mt-2">
            The site uses third-party services such as Firebase (Authentication and Firestore). These
            providers may process data according to their own privacy policies.
          </p>
        </div>

        <div>
          <h2 className="font-merriweather text-xl font-semibold text-zinc-900">Contact</h2>
          <p className="mt-2">
            If you have questions about this Privacy Policy, please use the Contact page.
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-white"
        >
          Back home
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-white"
        >
          Contact
        </Link>
      </div>
    </main>
  );
}
