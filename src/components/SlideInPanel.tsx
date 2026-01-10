import React, { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface SlideInPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: '-12%', opacity: 0.98 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '-12%', opacity: 0.98 },
};

function getFocusableElements(root: HTMLElement) {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
}

const SlideInPanel: React.FC<SlideInPanelProps> = ({ isOpen, onClose, children }) => {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const panelTransition = useMemo(() => {
    if (reduceMotion) return { duration: 0.01 };
    return { type: 'spring', stiffness: 340, damping: 34 };
  }, [reduceMotion]);

  const backdropTransition = useMemo(() => {
    if (reduceMotion) return { duration: 0.01 };
    return { duration: 0.18, ease: 'easeOut' };
  }, [reduceMotion]);

  const effectivePanelVariants = useMemo(() => {
    if (reduceMotion) {
      return {
        hidden: { x: 0, opacity: 1 },
        visible: { x: 0, opacity: 1 },
        exit: { x: 0, opacity: 1 },
      };
    }
    return panelVariants;
  }, [reduceMotion]);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;
      const root = panelRef.current;
      if (!root) return;

      const focusables = getFocusableElements(root);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;
    const el = restoreFocusRef.current;
    if (el && typeof el.focus === 'function') {
      el.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          transition={backdropTransition}
          onClick={onClose}
          role="presentation"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.aside
            className="absolute inset-0 sm:left-4 sm:top-4 sm:bottom-4 sm:inset-x-auto sm:rounded-2xl border border-gray-300 bg-white shadow-2xl overflow-hidden w-full sm:w-[80vw] sm:max-w-[80vw] sm:min-w-[320px]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={effectivePanelVariants}
            transition={panelTransition}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            ref={(el) => {
              panelRef.current = el;
            }}
          >
            <div className="relative h-full">
              <button
                ref={closeButtonRef}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 ring-1 ring-gray-300 hover:bg-gray-50 transition"
                onClick={onClose}
                aria-label="Close panel"
                type="button"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>

              <div className="h-full overflow-y-auto px-4 sm:px-6 pb-10 pt-16 sm:pt-20">
                <div className="relative rounded-2xl border border-gray-200 bg-white">
                  <div className="px-6 py-6 text-zinc-900">
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                      <div className="min-w-0 flex-1">{children}</div>

                      <div className="hidden lg:flex shrink-0 items-stretch">
                        <div className="stardust-divider self-stretch" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideInPanel;
