import React, { useEffect, useMemo, useState } from 'react';

interface TypingTextProps {
  text: string;
  startDelayMs?: number;
  charIntervalMs?: number;
  className?: string;
  showCursor?: boolean;
  persistCursor?: boolean;
}

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

const TypingText: React.FC<TypingTextProps> = ({
  text,
  startDelayMs = 0,
  charIntervalMs = 22,
  className,
  showCursor = true,
  persistCursor = false,
}) => {
  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return prefersReducedMotion();
  }, []);

  const [rendered, setRendered] = useState(reduceMotion ? text : '');

  useEffect(() => {
    if (reduceMotion) {
      setRendered(text);
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      let i = 0;
      intervalId = window.setInterval(() => {
        if (cancelled) return;
        i += 1;
        setRendered(text.slice(0, i));
        if (i >= text.length) {
          if (intervalId) window.clearInterval(intervalId);
        }
      }, charIntervalMs);
    }, startDelayMs);

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, startDelayMs, charIntervalMs, reduceMotion]);

  const done = rendered.length >= text.length;

  return (
    <span className={className}>
      {rendered}
      {showCursor && !reduceMotion && (
        <span
          className={
            persistCursor
              ? 'animate-terminal-cursor opacity-100'
              : done
                ? 'opacity-0'
                : 'animate-terminal-cursor opacity-100'
          }
          aria-hidden="true"
        >
          ▋
        </span>
      )}
    </span>
  );
};

export default TypingText;
