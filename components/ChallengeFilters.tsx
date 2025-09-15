'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface FilterState {
  status: string;
  game: string;
  token: string;
  entryFee: string;
  prizePool: string;
  sortBy: string;
}

interface ChallengeFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function ChallengeFilters({ filters, onFiltersChange }: ChallengeFiltersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'live', label: 'Live Now' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ended', label: 'Completed' },
  ];

  const gameOptions = [
    { value: 'all', label: 'All Games' },
    { value: 'fortnite', label: 'Fortnite' },
    { value: 'valorant', label: 'Valorant' },
    { value: 'league', label: 'League of Legends' },
    { value: 'cs2', label: 'Counter-Strike 2' },
    { value: 'rocket', label: 'Rocket League' },
    { value: 'apex', label: 'Apex Legends' },
  ];

  const tokenOptions = [
    { value: 'all', label: 'All Tokens' },
    { value: 'myth', label: 'MYTH' },
    { value: 'pengu', label: 'PENGU' },
    { value: 'sol', label: 'SOL' },
    { value: 'eth', label: 'ETH' },
    { value: 'usdc', label: 'USDC' },
  ];

  const entryFeeOptions = [
    { value: 'all', label: 'Any Entry Fee' },
    { value: 'free', label: 'Free' },
    { value: '1-10', label: '$1-$10' },
    { value: '10-50', label: '$10-$50' },
    { value: '50-100', label: '$50-$100' },
    { value: '100+', label: '$100+' },
  ];

  const prizePoolOptions = [
    { value: 'all', label: 'Any Prize Pool' },
    { value: 'under-1k', label: 'Under $1,000' },
    { value: '1k-5k', label: '$1,000 - $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: 'over-10k', label: 'Over $10,000' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'prize-pool', label: 'Prize Pool' },
    { value: 'participants', label: 'Most Participants' },
    { value: 'ending-soon', label: 'Ending Soon' },
  ];

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      status: 'all',
      game: 'all',
      token: 'all',
      entryFee: 'all',
      prizePool: 'all',
      sortBy: 'latest',
    });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const hasActiveFilters = 
    filters.status !== 'all' ||
    filters.game !== 'all' ||
    filters.token !== 'all' ||
    filters.entryFee !== 'all' ||
    filters.prizePool !== 'all' ||
    filters.sortBy !== 'latest';

  const filterItems = [
    {
      key: 'status',
      options: statusOptions,
      value: filters.status,
    },
    {
      key: 'game',
      options: gameOptions,
      value: filters.game,
    },
    {
      key: 'token',
      options: tokenOptions,
      value: filters.token,
    },
    {
      key: 'entryFee',
      options: entryFeeOptions,
      value: filters.entryFee,
    },
    {
      key: 'prizePool',
      options: prizePoolOptions,
      value: filters.prizePool,
    },
    {
      key: 'sortBy',
      options: sortOptions,
      value: filters.sortBy,
    },
  ];

  return (
    <div className="mb-8">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        {filterItems.map((filter) => (
          <DropdownMenu key={filter.key}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`bg-transparent border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-[#8E1EFE]/50 transition-all duration-300 min-w-[120px] justify-between ${
                  filter.value !== 'all' && filter.value !== 'latest' 
                    ? 'border-[#8E1EFE]/50 text-[#8E1EFE] bg-[#8E1EFE]/5' 
                    : ''
                }`}
              >
                {filter.options.find(opt => opt.value === filter.value)?.label}
                <ChevronDown className="w-3 h-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800/95 border-gray-700 backdrop-blur-sm text-white">
              {filter.options.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => updateFilter(filter.key as keyof FilterState, option.value)}
                  className="text-white hover:text-white hover:bg-gray-700 cursor-pointer focus:text-white focus:bg-gray-700"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-[#30FFE6] hover:text-white hover:bg-[#30FFE6]/10 ml-2 transition-colors duration-300"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Mobile Carousel Layout */}
      <div className="md:hidden">
        <div className="relative flex items-center">
        {/* Left Arrow */}
        <motion.button
          onClick={scrollLeft}
          className="flex-shrink-0 z-10 w-8 h-8 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-300 mr-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filterItems.map((filter) => (
            <DropdownMenu key={filter.key}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`bg-transparent border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-[#8E1EFE]/50 transition-all duration-300 min-w-[120px] justify-between flex-shrink-0 ${
                    filter.value !== 'all' && filter.value !== 'latest' 
                      ? 'border-[#8E1EFE]/50 text-[#8E1EFE] bg-[#8E1EFE]/5' 
                      : ''
                  }`}
                >
                  {filter.options.find(opt => opt.value === filter.value)?.label}
                  <ChevronDown className="w-3 h-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800/95 border-gray-700 backdrop-blur-sm text-white">
                {filter.options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => updateFilter(filter.key as keyof FilterState, option.value)}
                    className="text-white hover:text-white hover:bg-gray-700 cursor-pointer focus:text-white focus:bg-gray-700"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Right Arrow */}
        <motion.button
          onClick={scrollRight}
          className="flex-shrink-0 z-10 w-8 h-8 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-300 ml-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
        </div>

        {/* Clear All Button for Mobile */}
        {hasActiveFilters && (
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-[#30FFE6] hover:text-white hover:bg-[#30FFE6]/10 transition-colors duration-300"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Hide scrollbar globally for this component */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}