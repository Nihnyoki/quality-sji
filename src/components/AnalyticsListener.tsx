import React, { useEffect, useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';

const GA_ID = 'G-TY211RGRND';

export default function AnalyticsListener() {
  // Re-run on navigation without relying on window events.
  const href = useRouterState({
    select: (s: any) => s.location?.href ?? (typeof window !== 'undefined' ? window.location.href : ''),
  });

  const didInitRef = useRef(false);

  useEffect(() => {
    // Avoid double-counting the first page view (the inline gtag('config', ...) in index.html already fires once).
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }

    const gtag = (window as any)?.gtag as undefined | ((...args: any[]) => void);
    if (typeof gtag !== 'function') return;

    try {
      const url = new URL(href || window.location.href);
      gtag('config', GA_ID, { page_path: url.pathname + url.search });
    } catch {
      gtag('config', GA_ID, { page_path: window.location.pathname + window.location.search });
    }
  }, [href]);

  return null;
}
