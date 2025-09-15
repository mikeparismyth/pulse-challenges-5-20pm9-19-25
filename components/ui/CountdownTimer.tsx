'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  urgencyThreshold?: number; // minutes
  className?: string;
  onComplete?: () => void;
}

interface TimeUnit {
  value: number;
  label: string;
  shortLabel: string;
}

const sizeVariants = {
  sm: {
    container: 'text-sm',
    number: 'text-sm font-semibold',
    label: 'text-xs',
    icon: 'w-4 h-4',
    spacing: 'gap-1'
  },
  md: {
    container: 'text-base',
    number: 'text-lg font-bold',
    label: 'text-sm',
    icon: 'w-5 h-5',
    spacing: 'gap-2'
  },
  lg: {
    container: 'text-lg',
    number: 'text-xl font-bold',
    label: 'text-base',
    icon: 'w-6 h-6',
    spacing: 'gap-3'
  }
};

export function CountdownTimer({
  targetDate,
  size = 'md',
  showIcon = true,
  urgencyThreshold = 60, // 1 hour in minutes
  className,
  onComplete
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const variant = sizeVariants[size];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsComplete(true);
        setTimeLeft([]);
        onComplete?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Check urgency (convert to minutes)
      const totalMinutes = Math.floor(difference / (1000 * 60));
      setIsUrgent(totalMinutes <= urgencyThreshold);

      const units: TimeUnit[] = [];
      
      if (days > 0) {
        units.push({ value: days, label: days === 1 ? 'day' : 'days', shortLabel: 'd' });
      }
      if (hours > 0 || days > 0) {
        units.push({ value: hours, label: hours === 1 ? 'hour' : 'hours', shortLabel: 'h' });
      }
      if (minutes > 0 || hours > 0 || days > 0) {
        units.push({ value: minutes, label: minutes === 1 ? 'minute' : 'minutes', shortLabel: 'm' });
      }
      if (days === 0 && hours === 0) {
        units.push({ value: seconds, label: seconds === 1 ? 'second' : 'seconds', shortLabel: 's' });
      }

      setTimeLeft(units);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, urgencyThreshold, onComplete]);

  const formatTimeDisplay = () => {
    if (isComplete) {
      return 'Time\'s up!';
    }

    if (timeLeft.length === 0) {
      return 'Loading...';
    }

    // For mobile/small displays, show compact format
    if (size === 'sm' && timeLeft.length > 2) {
      return timeLeft.slice(0, 2).map(unit => `${unit.value}${unit.shortLabel}`).join(' ');
    }

    // For larger displays, show full format
    if (timeLeft.length === 1) {
      return `${timeLeft[0].value} ${timeLeft[0].label}`;
    }

    if (timeLeft.length === 2) {
      return `${timeLeft[0].value}${timeLeft[0].shortLabel} ${timeLeft[1].value}${timeLeft[1].shortLabel}`;
    }

    // Show first two units for readability
    return timeLeft.slice(0, 2).map(unit => `${unit.value}${unit.shortLabel}`).join(' ');
  };

  const getUrgencyColor = () => {
    if (isComplete) return 'text-gray-400';
    if (isUrgent) return 'text-red-400';
    return 'text-white';
  };

  const getUrgencyBgColor = () => {
    if (isComplete) return 'bg-gray-500/20';
    if (isUrgent) return 'bg-red-500/20';
    return 'bg-[#30FFE6]/20';
  };

  return (
    <motion.div
      className={cn(
        'flex items-center',
        variant.spacing,
        variant.container,
        className
      )}
      animate={isUrgent && !isComplete ? {
        scale: [1, 1.02, 1],
      } : {}}
      transition={{
        duration: 2,
        repeat: isUrgent && !isComplete ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {/* Icon */}
      {showIcon && (
        <motion.div
          className={cn(
            'flex items-center justify-center rounded-full border',
            variant.icon,
            getUrgencyBgColor(),
            isUrgent && !isComplete ? 'border-red-400/50' : 'border-[#30FFE6]/50'
          )}
          animate={isUrgent && !isComplete ? {
            borderColor: ['rgba(248, 113, 113, 0.5)', 'rgba(248, 113, 113, 0.8)', 'rgba(248, 113, 113, 0.5)']
          } : {}}
          transition={{
            duration: 1.5,
            repeat: isUrgent && !isComplete ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {isUrgent && !isComplete ? (
            <AlertTriangle className={cn(variant.icon, 'text-red-400')} />
          ) : (
            <Clock className={cn(variant.icon, isComplete ? 'text-gray-400' : 'text-[#30FFE6]')} />
          )}
        </motion.div>
      )}

      {/* Time Display */}
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={formatTimeDisplay()}
            className={cn(
              variant.number,
              getUrgencyColor()
            )}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
          >
            {formatTimeDisplay()}
          </motion.div>
        </AnimatePresence>

        {/* Status Label */}
        <motion.div
          className={cn(
            'text-gray-400',
            variant.label
          )}
          animate={isUrgent && !isComplete ? {
            color: ['rgb(156, 163, 175)', 'rgb(248, 113, 113)', 'rgb(156, 163, 175)']
          } : {}}
          transition={{
            duration: 2,
            repeat: isUrgent && !isComplete ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {isComplete ? 'Completed' : isUrgent ? 'Ending Soon!' : 'Remaining'}
        </motion.div>
      </div>
    </motion.div>
  );
}