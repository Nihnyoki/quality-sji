import React, { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

const GA_ID = 'G-TY211RGRND';
const CONSENT_KEY = 'consent.v1';

export default function AnalyticsListener() {
  // Re-run on navigation without relying on window events.
  const href = useRouterState({
    select: (s: any) => s.location?.href ?? (typeof window !== 'undefined' ? window.location.href : ''),
  });

  useEffect(() => {
    const gtag = (window as any)?.gtag as undefined | ((...args: any[]) => void);
    if (typeof gtag !== 'function') return;

    // Only track after explicit consent.
    let consent: string | null = null;
    try {
      consent = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      // ignore
    }
    if (consent !== 'granted') return;

    try {
      const url = new URL(href || window.location.href);
      gtag('event', 'page_view', {
        page_path: url.pathname + url.search,
        page_location: url.href,
        send_to: GA_ID,
      });
    } catch {
      gtag('event', 'page_view', {
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
        send_to: GA_ID,
      });
    }
  }, [href]);

  return null;
}
