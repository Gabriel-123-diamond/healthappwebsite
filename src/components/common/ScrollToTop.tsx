'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUi } from '@/context/UiContext';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isChatbotOpen } = useUi();

  // Handle window resize to detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    if (scrolled > 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Initial check
    toggleVisibility();
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Determine bottom position based on device and chatbot state
  const getBottomPosition = () => {
    if (isMobile) {
      return isChatbotOpen ? '80vh' : '80px';
    }
    // Desktop positions
    return isChatbotOpen ? '680px' : '112px';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          // initial 'bottom' must match 'animate' to prevent side/bottom drift
          // 'y' handles the fly-in from top
          initial={{ opacity: 0, y: -1200, bottom: getBottomPosition() }} 
          animate={{ 
            opacity: 1, 
            y: 0, 
            bottom: getBottomPosition()
          }}
          exit={{ opacity: 0, y: -1200 }} 
          transition={{ 
            y: { type: "spring", stiffness: 120, damping: 20 },
            bottom: { duration: 0.4, ease: "easeInOut" },
            opacity: { duration: 0.2 }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          // Use style for 'right' to keep it absolutely fixed during animation
          style={{ right: isMobile ? '16px' : '32px' }}
          className="fixed z-[100] p-3 sm:p-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-colors border border-blue-400/20 active:scale-90"
          aria-label="Scroll to top"
        >
          <ChevronUp size={isMobile ? 20 : 24} strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
