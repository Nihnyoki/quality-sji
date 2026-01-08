import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideInPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const panelVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

const SlideInPanel: React.FC<SlideInPanelProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-40 z-50 flex"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div
            className="bg-white shadow-lg h-full p-6 overflow-y-auto relative"
            style={{ width: '60vw', maxWidth: '60vw', minWidth: '320px' }}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={onClose}
              aria-label="Close panel"
            >
              &times;
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideInPanel;
