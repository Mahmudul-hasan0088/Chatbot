import React from 'react';
import { motion } from 'framer-motion';

const AIButton = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      className={`px-8 py-3 text-lg font-medium text-white rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default AIButton;