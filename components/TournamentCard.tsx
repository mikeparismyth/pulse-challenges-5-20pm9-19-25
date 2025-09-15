'use client';

import { motion } from 'framer-motion';
import { Clock, Trophy, Users, Gamepad2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TokenDisplay } from '@/components/ui/TokenDisplay';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface TournamentCardProps {
  id?: string;
  title: string;
  status: 'LIVE' | 'UPCOMING' | 'ENDED';
  prizePool: string;
  participants: number;
  maxParticipants: number;
  entryFee?: string;
  timeRemaining?: string;
  startTime?: string;
}

export default function TournamentCard({
  id,
  title,
  status,
  prizePool,
  participants,
  maxParticipants,
  entryFee,
  timeRemaining,
  startTime,
}: TournamentCardProps) {
  const statusStyles = {
    LIVE: 'bg-red-500/90 text-white border-red-500/50 shadow-glow-red backdrop-blur-sm',
    UPCOMING: 'bg-yellow-500/90 text-white border-yellow-500/50 shadow-glow-yellow backdrop-blur-sm',
    ENDED: 'bg-gray-500/90 text-white border-gray-500/50 backdrop-blur-sm',
  };

  // Game-specific hero images and themes
  const getGameTheme = (title: string) => {
    if (title.toLowerCase().includes('fortnite')) {
      return {
        heroImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
        gradient: 'from-purple-900/80 via-blue-900/60 to-transparent',
        gameName: 'Fortnite'
      };
    }
    if (title.toLowerCase().includes('valorant')) {
      return {
        heroImage: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800',
        gradient: 'from-red-900/80 via-orange-900/60 to-transparent',
        gameName: 'Valorant'
      };
    }
    if (title.toLowerCase().includes('league')) {
      return {
        heroImage: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=800',
        gradient: 'from-blue-900/80 via-cyan-900/60 to-transparent',
        gameName: 'League of Legends'
      };
    }
    if (title.toLowerCase().includes('cs2') || title.toLowerCase().includes('counter')) {
      return {
        heroImage: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
        gradient: 'from-gray-900/80 via-slate-900/60 to-transparent',
        gameName: 'Counter-Strike 2'
      };
    }
    if (title.toLowerCase().includes('rocket league')) {
      return {
        heroImage: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800',
        gradient: 'from-orange-900/80 via-yellow-900/60 to-transparent',
        gameName: 'Rocket League'
      };
    }
    if (title.toLowerCase().includes('apex')) {
      return {
        heroImage: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=800',
        gradient: 'from-green-900/80 via-emerald-900/60 to-transparent',
        gameName: 'Apex Legends'
      };
    }
    // Default gaming theme
    return {
      heroImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
      gradient: 'from-purple-900/80 via-indigo-900/60 to-transparent',
      gameName: 'Gaming Tournament'
    };
  };

  // Extract token info from prizePool string
  const extractTokenInfo = (tokenStr: string) => {
    const match = tokenStr.match(/^([\d,]+)\s+(\w+)$/);
    if (match) {
      const amount = match[1];
      const symbol = match[2];
      // Mock USD conversion rates
      const rates: { [key: string]: number } = {
        'MYTH': 0.02,
        'PENGU': 0.15
      };
      const numAmount = parseFloat(amount.replace(/,/g, ''));
      const usdValue = numAmount * (rates[symbol] || 0.01);
      return { amount, symbol, usdValue };
    }
    return { amount: tokenStr, symbol: '', usdValue: 0 };
  };

  // Get token icon
  const getTokenIcon = (symbol: string) => {
    if (symbol === 'MYTH') return '⟠'; // ETH-like symbol
    if (symbol === 'PENGU') return '🐧'; // Penguin emoji
    return '●';
  };

  // Format date/time display
  const getTimeDisplay = () => {
    if (status === 'UPCOMING' && startTime) {
      const date = new Date(startTime);
      return `Starts: ${date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    if (status === 'LIVE') {
      return 'Ends: Fri, 10:00 PM';
    }
    if (status === 'ENDED') {
      return 'Ended: Wed, 2:15 PM';
    }
    return timeRemaining || 'Starting Soon';
  };

  const prizeInfo = extractTokenInfo(prizePool);
  const entryInfo = entryFee ? extractTokenInfo(entryFee) : null;
  const gameTheme = getGameTheme(title);

  return (
    <motion.div 
      className="group relative overflow-hidden backdrop-blur-sm bg-white/5 rounded-gaming-lg border border-gray-700/50 hover:border-[#8E1EFE]/60 transition-all duration-500 cursor-pointer shadow-gaming-card h-[420px] z-0 transform-gpu isolate"
      whileHover={{ 
        scale: 1.02,
        y: -4,
        boxShadow: "0 12px 32px rgba(142, 30, 254, 0.3), 0 0 20px rgba(142, 30, 254, 0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {/* Hero Image Section - Top 35% */}
      <div className="relative h-36 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url(${gameTheme.heroImage})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${gameTheme.gradient}`} />
        
        {/* Enhanced seamless transition gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="outline"
            className={`text-xs font-semibold px-3 py-1.5 flex items-center justify-center ${statusStyles[status]}`}
          >
            {status === 'LIVE' && <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />}
            {status}
          </Badge>
        </div>

        {/* Game Icon with Tooltip */}
        <div className="absolute top-4 right-4 group/tooltip overflow-visible z-50">
          <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-[#8E1EFE]/30 to-[#30FFE6]/30 rounded-full border border-[#8E1EFE]/50 backdrop-blur-sm">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          {/* Tooltip */}
          <div className="absolute -top-8 right-0 bg-gray-800/95 border border-gray-600 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none backdrop-blur-sm" style={{zIndex: 9999}}>
            {gameTheme.gameName}
          </div>
        </div>
      </div>

      {/* Content Section - Bottom 65% with increased padding */}
      <div className="relative bg-gray-900 backdrop-blur-sm p-6 h-[276px] flex flex-col">
        {/* Challenge Title - PROMINENT DISPLAY */}
        <h3 className="text-xl font-bold text-white mb-4 leading-normal relative z-10 glow-text group-hover:glow-text-purple transition-all duration-300 overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </h3>
        
        {/* Prize Pool */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-[#30FFE6]">
            <Trophy className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Prize Pool</span>
          </div>
          <div className="flex items-center text-right">
            <span className="text-sm mr-1">{getTokenIcon(prizeInfo.symbol)}</span>
            <span className="text-white font-semibold">
              {prizeInfo.amount} {prizeInfo.symbol}
            </span>
            <span className="text-gray-400 text-xs ml-1">
              (${prizeInfo.usdValue.toFixed(0)})
            </span>
          </div>
        </div>
        
        {/* Players Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Players</span>
            </div>
            <span className="text-xs text-gray-400">
              {participants}/{maxParticipants}
            </span>
          </div>
          <ProgressBar
            current={participants}
            max={maxParticipants}
            showNumbers={false}
            size="sm"
            animated={status === 'LIVE'}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex items-center text-gray-300 mb-6">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {getTimeDisplay()}
          </span>
        </div>
        
        {/* Action Button - Bottom aligned with proper spacing */}
        <div className="mt-auto">
          {status !== 'ENDED' ? (
            <Button
              className="w-full btn-gaming-primary text-sm font-semibold py-2.5"
              size="sm"
            >
              JOIN
              {entryInfo && (
                <span className="ml-2 text-xs opacity-90">
                  - {entryInfo.amount} {entryInfo.symbol} (${entryInfo.usdValue.toFixed(2)})
                </span>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full text-sm font-semibold border-[#8E1EFE]/50 text-[#8E1EFE] bg-transparent hover:bg-[#8E1EFE]/10 hover:border-[#8E1EFE] py-2.5 transition-all duration-300"
              size="sm"
            >
              VIEW
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}