/**
 * Circular Progress Gauge for Stress Score
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  size = 'md',
  showLabel = true,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Determine color based on value
  const getColor = (val: number): string => {
    if (val <= 33) return '#10b981'; // green
    if (val <= 66) return '#f59e0b'; // yellow/amber
    return '#ef4444'; // red
  };

  const color = getColor(value);

  const sizes = {
    sm: { width: 120, strokeWidth: 8, fontSize: 'text-2xl' },
    md: { width: 160, strokeWidth: 10, fontSize: 'text-3xl' },
    lg: { width: 200, strokeWidth: 12, fontSize: 'text-4xl' },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${fontSize} font-bold`}
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {Math.round(displayValue)}
          </motion.span>
          <span className="text-sm text-gray-400 mt-1">Stress Level</span>
        </div>
      )}
    </div>
  );
}
