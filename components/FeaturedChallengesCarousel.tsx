'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Users, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FeaturedChallenge {
  id: string;
  title: string;
  game: string;
  status: 'LIVE' | 'UPCOMING';
  participants: number;
  maxParticipants: number;
  prizePool: string;
  timeRemaining: string;
  heroImage: string;
  gradient: string;
}

export default function FeaturedChallengesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Featured challenges - prioritize LIVE then UPCOMING by participant count
  const featuredChallenges: FeaturedChallenge[] = [
    {
      id: 'tournament-4',
      title: 'CS2 Major Championship',
      game: 'Counter-Strike 2',
      status: 'LIVE',
      participants: 24,
      maxParticipants: 24,
      prizePool: '5,520 PENGU',
      timeRemaining: 'In Progress',
      heroImage: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1200',
      gradient: 'from-gray-900/80 via-slate-900/60 to-transparent'
    },
    {
      id: 'tournament-1',
      title: 'Fortnite Battle Royale Championship',
      game: 'Fortnite',
      status: 'LIVE',
      participants: 87,
      maxParticipants: 100,
      prizePool: '4,350 MYTH',
      timeRemaining: 'In Progress',
      heroImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200',
      gradient: 'from-purple-900/80 via-blue-900/60 to-transparent'
    },
    {
      id: 'tournament-2',
      title: 'Valorant Champions Series',
      game: 'Valorant',
      status: 'UPCOMING',
      participants: 32,
      maxParticipants: 64,
      prizePool: '2,952 PENGU',
      timeRemaining: 'Starts in 2 hours',
      heroImage: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1200',
      gradient: 'from-red-900/80 via-orange-900/60 to-transparent'
    },
    {
      id: 'tournament-3',
      title: 'League of Legends World Cup',
      game: 'League of Legends',
      status: 'UPCOMING',
      participants: 16,
      maxParticipants: 32,
      prizePool: '1,080 MYTH',
      timeRemaining: 'Starts in 1 day',
      heroImage: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=1200',
      gradient: 'from-blue-900/80 via-cyan-900/60 to-transparent'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredChallenges.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredChallenges.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredChallenges.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredChallenges.length) % featuredChallenges.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentChallenge = featuredChallenges[currentSlide];

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden mb-16"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentChallenge.heroImage})` }}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${currentChallenge.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                {/* Status Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
                    currentChallenge.status === 'LIVE' 
                      ? 'bg-red-500/90 text-white border border-red-500/50 shadow-glow-red' 
                      : 'bg-yellow-500/90 text-white border border-yellow-500/50 shadow-glow-yellow'
                  }`}>
                    {currentChallenge.status === 'LIVE' && (
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                    )}
                    {currentChallenge.status}
                  </div>
                </motion.div>

                {/* Game Title */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#30FFE6] text-lg font-medium mb-2 glow-text-teal"
                >
                  {currentChallenge.game}
                </motion.p>

                {/* Challenge Title */}
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6 glow-text leading-tight"
                >
                  {currentChallenge.title}
                </motion.h1>

                {/* Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-6 mb-8 text-white"
                >
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-[#30FFE6]" />
                    <span className="font-semibold">{currentChallenge.prizePool}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[#8E1EFE]" />
                    <span>{currentChallenge.participants}/{currentChallenge.maxParticipants} Players</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-300" />
                    <span>{currentChallenge.timeRemaining}</span>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link href={`/challenge/${currentChallenge.id}`}>
                    <Button className="btn-gaming-primary text-lg px-8 py-4 flex items-center space-x-2 shadow-gaming-hover">
                      <Play className="w-5 h-5" />
                      <span>Join Challenge</span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dashes */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {featuredChallenges.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-8 h-0.5 transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white opacity-100'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}