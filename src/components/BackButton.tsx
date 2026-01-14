import React from 'react';
import { useNavigate } from '@tanstack/react-router';

type BackButtonProps = {
  className?: string;
  fallbackTo?: string;
  children?: React.ReactNode;
};

export default function BackButton({
  className,
  fallbackTo = '/',
  children = 'Back',
}: BackButtonProps) {
  const navigate = useNavigate();

  const onClick = () => {
    // Prefer true back navigation so linked posts return to the previous page.
    // Fallback to a safe route if there is no history (e.g., direct entry).
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }

    navigate({ to: fallbackTo });
  };

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
