'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TokenDisplayProps {
  amount: string | number;
  symbol: string;
  usdValue?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showUsd?: boolean;
  loading?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeVariants = {
  xs: {
    amount: 'text-xs font-medium',
    symbol: 'text-xs',
    usd: 'text-xs',
    icon: 'w-3 h-3',
    spacing: 'gap-1'
  },
  sm: {
    amount: 'text-sm font-semibold',
    symbol: 'text-sm',
    usd: 'text-xs',
    icon: 'w-4 h-4',
    spacing: 'gap-1.5'
  },
  md: {
    amount: 'text-base font-semibold',
    symbol: 'text-base',
    usd: 'text-sm',
    icon: 'w-5 h-5',
    spacing: 'gap-2'
  },
  lg: {
    amount: 'text-lg font-bold',
    symbol: 'text-lg',
    usd: 'text-sm',
    icon: 'w-6 h-6',
    spacing: 'gap-2'
  },
  xl: {
    amount: 'text-xl font-bold',
    symbol: 'text-xl',
    usd: 'text-base',
    icon: 'w-7 h-7',
    spacing: 'gap-3'
  }
};

const getTokenIcon = (symbol: string) => {
  const icons: { [key: string]: string } = {
    'MYTH': '⟠',
    'PENGU': '🐧',
    'ETH': 'Ξ',
    'BTC': '₿',
    'SOL': '◎'
  };
  return icons[symbol.toUpperCase()] || '●';
};

const getTokenColor = (symbol: string) => {
  const colors: { [key: string]: string } = {
    'MYTH': 'text-[#8E1EFE]',
    'PENGU': 'text-[#30FFE6]',
    'ETH': 'text-blue-400',
    'BTC': 'text-orange-400',
    'SOL': 'text-purple-400'
  };
  return colors[symbol.toUpperCase()] || 'text-[#30FFE6]';
};

export function TokenDisplay({
  amount,
  symbol,
  usdValue,
  size = 'md',
  showUsd = true,
  loading = false,
  animated = true,
  className
}: TokenDisplayProps) {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);

  const variant = sizeVariants[size];
  const tokenColor = getTokenColor(symbol);
  const tokenIcon = getTokenIcon(symbol);

  // Animate number changes
  useEffect(() => {
    if (animated && amount !== displayAmount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayAmount(amount);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [amount, displayAmount, animated]);

  // Format amount for display
  const formatAmount = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(num)) return value;
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  // Format USD value
  const formatUsdValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className={cn('flex items-center', variant.spacing, className)}>
        <div className={cn('animate-pulse bg-gray-600 rounded', variant.icon)} />
        <div className="space-y-1">
          <div className={cn('animate-pulse bg-gray-600 rounded h-4 w-16')} />
          {showUsd && usdValue !== undefined && (
            <div className={cn('animate-pulse bg-gray-600 rounded h-3 w-12')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', variant.spacing, className)}>
      {/* Token Icon */}
      <motion.div
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-800/50 border border-gray-600',
          variant.icon,
          tokenColor
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-center leading-none">{tokenIcon}</span>
      </motion.div>

      <div className="flex flex-col">
        {/* Amount and Symbol */}
        <div className="flex items-baseline gap-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayAmount}
              className={cn(
                'text-white',
                variant.amount,
                isAnimating && 'text-[#30FFE6]'
              )}
              initial={animated ? { opacity: 0, y: -10 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              exit={animated ? { opacity: 0, y: 10 } : undefined}
              transition={{ duration: 0.2 }}
            >
              {formatAmount(displayAmount)}
            </motion.span>
          </AnimatePresence>
          
          <motion.span
            className={cn('text-gray-300', variant.symbol)}
            whileHover={{ color: 'rgb(255, 255, 255)' }}
            transition={{ duration: 0.2 }}
          >
            {symbol}
          </motion.span>
        </div>

        {/* USD Value */}
        {showUsd && usdValue !== undefined && (
          <AnimatePresence>
            <motion.div
              className={cn('text-gray-400', variant.usd)}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {formatUsdValue(usdValue)}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}