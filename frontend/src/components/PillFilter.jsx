import React from 'react';
import { motion } from 'framer-motion';

const PillFilter = ({ label, active, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      animate={{ scale: active ? 1.05 : 1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
    >
      {label}
    </motion.button>
  );
};

export default PillFilter;
