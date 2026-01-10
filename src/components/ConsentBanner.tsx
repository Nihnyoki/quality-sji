import React, { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';

const GA_ID = 'G-TY211RGRND';
const CONSENT_KEY = 'consent.v1';

type ConsentChoice = 'granted' | 'denied';

function updateConsent(choice: ConsentChoice) {
  const gtag = (window as any)?.gtag as undefined | ((...args: any[]) => void);
  if (typeof gtag !== 'function') return;

  const granted = choice === 'granted';

  gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  });
}

function sendPageView() {
  const gtag = (window as any)?.gtag as undefined | ((...args: any[]) => void);
  if (typeof gtag !== 'function') return;

  const page_path = window.location.pathname + window.location.search;
  const page_location = window.location.href;

  gtag('event', 'page_view', { page_path, page_location, send_to: GA_ID });
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  const existingChoice = useMemo(() => {
    try {
      const raw = window.localStorage.getItem(CONSENT_KEY);
      if (raw === 'granted' || raw === 'denied') return raw as ConsentChoice;
    } catch {
      // ignore
    }
    return null;
  }, []);

  useEffect(() => {
    // If there is already a stored choice, apply it and do not show the banner.
    if (existingChoice) {
      updateConsent(existingChoice);
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [existingChoice]);

  const choose = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // ignore
    }

    updateConsent(choice);

    // Only start analytics tracking after explicit acceptance.
    if (choice === 'granted') {
      sendPageView();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-300 bg-white shadow-xl">
        <div className="px-5 py-4">
          <div className="font-merriweather text-base font-semibold text-zinc-900">Cookies & analytics</div>
          <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
            This site uses cookies for analytics and (later) ads. You can accept or decline non-essential cookies.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => choose('granted')}
              className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose('denied')}
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
            >
              Decline
            </button>
            <Link
              to="/privacy-policy"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:underline"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
