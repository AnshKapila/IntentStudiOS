import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  // Prevent body scroll when open (optional)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} // ease-out-expo approximation
            className="fixed inset-0 bg-[oklch(0%_0_0/20%)] z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}
            exit={{ x: '100%', boxShadow: '0 0 0 rgba(0,0,0,0)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // ease-out-expo approximation
            className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-white z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(90%_0.01_95)]">
              <h2 className="title-card text-[oklch(28%_0.01_95)]">{title || 'Details'}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[oklch(95%_0.01_95)] text-[oklch(48%_0.01_95)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
