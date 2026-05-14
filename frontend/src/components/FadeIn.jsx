import React from 'react';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, type: 'spring', stiffness: 130, damping: 18 }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
