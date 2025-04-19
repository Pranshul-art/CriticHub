import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  // Animation variants for the spinner
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }
    }
  };
  
  // Animation variants for the text
  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-cream dark:bg-navy-900 z-50">
      <div className="relative">
        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 bg-coral-500 rounded-full"></div>
        </div>
        
        {/* Inner spinning circle */}
        <motion.div
          variants={spinnerVariants}
          animate="animate"
          className="h-16 w-16 rounded-full border-4 border-transparent border-t-coral-500 border-b-teal opacity-75"
        ></motion.div>
        
        {/* Outer spinning circle */}
        <motion.div
          variants={spinnerVariants}
          animate="animate"
          className="absolute -inset-4 rounded-full border-4 border-transparent border-t-coral-500 border-r-teal opacity-40"
          style={{ animationDirection: "reverse" }}
        ></motion.div>
      </div>
      
      <motion.p
        variants={textVariants}
        animate="animate"
        className="mt-6 text-navy-900 dark:text-cream font-medium"
      >
        Discovering experiences...
      </motion.p>
      
      {/* Subtle progress dots */}
      <div className="flex mt-4 space-x-2">
        <LoadingDot delay={0} />
        <LoadingDot delay={0.2} />
        <LoadingDot delay={0.4} />
      </div>
    </div>
  );
};

// Animated dot component
const LoadingDot = ({ delay }) => {
  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.3, 1, 0.3],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        delay: delay,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <motion.div
      variants={dotVariants}
      animate="animate"
      className="h-2 w-2 bg-coral-500 rounded-full"
    ></motion.div>
  );
};

export default LoadingSpinner;