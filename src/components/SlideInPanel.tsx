import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const SlideInPanel: React.FC<SlideInPanelProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={onClose}
          role="presentation"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.aside
            className="absolute left-0 top-0 h-full bg-white border-r border-gray-200 shadow-2xl overflow-hidden"
            style={{ width: '80vw', maxWidth: '80vw', minWidth: '320px' }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="h-full flex flex-col">
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
                <div className="px-6 py-4 flex items-center justify-end">
                  <button
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    onClick={onClose}
                    aria-label="Close panel"
                    type="button"
                  >
                    <span className="text-2xl leading-none">&times;</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {children}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideInPanel;
