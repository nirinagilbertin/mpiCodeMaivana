import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverable = true, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-shadow ${hoverable ? 'hover:shadow-md cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;
