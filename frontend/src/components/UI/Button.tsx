/**
 * Premium Button Component with loading states and variants
 */

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 hover:scale-105',
    secondary:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost:
      'text-white hover:bg-white/10',
  };

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-lg'
    : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    >
      {/* Shimmer effect */}
      {variant === 'primary' && !disabled && !loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
          }}
        />
      )}

      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
