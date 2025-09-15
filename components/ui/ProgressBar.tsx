'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  max: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  showNumbers?: boolean;
}

const sizeClasses = {
  xs: {
    height: 'h-1',
    text: 'text-xs',
    spacing: 'gap-1',
    iconSize: 'w-3 h-3'
  },
  sm: {
    height: 'h-2',
    text: 'text-sm',
    spacing: 'gap-2',
    iconSize: 'w-4 h-4'
  },
  md: {
    height: 'h-3',
    text: 'text-base',
    spacing: 'gap-3',
    iconSize: 'w-5 h-5'
  },
  lg: {
    height: 'h-4',
    text: 'text-lg',
    spacing: 'gap-4',
    iconSize: 'w-6 h-6'
  }
};

export function ProgressBar({
  current,
  max,
  size = 'md',
  animated = true,
  className,
  showNumbers = true,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const isComplete = percentage >= 100;

  const getProgressColor = () => {
    if (percentage >= 100) {
      return 'bg-gradient-to-r from-green-500 to-emerald-400';
    } else if (percentage >= 75) {
      return 'bg-gradient-to-r from-[#8E1EFE] to-[#30FFE6]';
    } else if (percentage >= 50) {
      return 'bg-gradient-to-r from-blue-500 to-cyan-400';
    } else if (percentage >= 25) {
      return 'bg-gradient-to-r from-yellow-500 to-orange-400';
    } else {
      return 'bg-gradient-to-r from-red-500 to-pink-400';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        {showNumbers && (
          <>
            <motion.span
              key={current}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn('text-white font-semibold', sizeClasses[size].text)}
            >
              {current.toLocaleString()}
            </motion.span>
            <span className={cn('text-gray-400', sizeClasses[size].text)}>
              / {max.toLocaleString()}
            </span>
          </>
        )}
      </div>
      
      <div className={cn(
        'relative bg-gray-700/50 rounded-full overflow-hidden',
        sizeClasses[size].height
      )}>
        {/* Progress Fill */}
        <motion.div
          className={cn(
            'h-full rounded-full relative overflow-hidden',
            getProgressColor()
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: animated ? Infinity : 0,
              repeatDelay: 2,
              ease: 'linear'
            }}
          />
        </motion.div>

        {/* Completion Particles */}
        {isComplete && animated && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#30FFE6] rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}