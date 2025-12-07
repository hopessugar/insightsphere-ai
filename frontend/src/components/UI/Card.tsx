/**
 * Premium Glass Card Component with animations
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = false,
  glass = true,
  gradient = false,
  onClick,
}: CardProps) {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300';
  
  const glassClasses = glass
    ? 'bg-white/5 backdrop-blur-lg border border-white/10'
    : 'bg-dark-lighter border border-white/5';
  
  const gradientClasses = gradient
    ? 'bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10'
    : '';
  
  const hoverClasses = hover
    ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] cursor-pointer'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${baseClasses} ${glassClasses} ${gradientClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
    >
      {children}
    </motion.div>
  );
}
