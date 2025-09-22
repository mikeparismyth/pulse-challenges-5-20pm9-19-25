'use client';

// MOCK: Replace mockChallenges with API call to /api/challenges
import { mockChallenges, challengeToCardData } from '@/lib/mockData';
import { GameType } from '@/lib/types';
import ChallengeCard from '@/components/ChallengeCard';
import ChallengeFilters, { FilterState } from '@/components/ChallengeFilters';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle } from 'lucide-react';

export default function Challenges() {
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    game: 'all',
    token: 'all',
    entryFee: 'all',
    prizePool: 'all',
    sortBy: 'latest',
  });

  // Convert mock challenge data to display format
  const challenges = mockChallenges.map(challengeToCardData);

  // Filter and organize challenges
  const { liveChallenges, upcomingChallenges, completedChallenges } = useMemo(() => {
    let filtered = challenges.filter(challengeItem => {
      // Status filter
      if (filters.status !== 'all') {
        const statusMap = { live: 'LIVE', upcoming: 'UPCOMING', ended: 'ENDED' };
        if (challengeItem.status !== statusMap[filters.status as keyof typeof statusMap]) {
          return false;
        }
      }

      // Game filter
      if (filters.game !== 'all') {
        // MOCK: Replace with API filtering logic
        const gameMap: { [key: string]: GameType } = {
          'pudgy-party': 'PUDGY_PARTY',
          'nfl-rivals': 'NFL_RIVALS'
        };
        const expectedGameType = gameMap[filters.game];
        const challengeData = mockChallenges.find(t => challengeToCardData(t).id === challengeItem.id);
        if (!challengeData || challengeData.game !== expectedGameType) {
          return false;
        }
      }

      // Token filter
      if (filters.token !== 'all') {
        const tokenSymbol = challengeItem.prizePool.split(' ')[1];
        if (tokenSymbol.toLowerCase() !== filters.token.toLowerCase()) {
          return false;
        }
      }

      // Entry fee range filter
      if (filters.entryFee !== 'all') {
        const entryFeeAmount = parseFloat(challengeItem.entryFee?.split(' ')[0] || '0');
        switch (filters.entryFee) {
          case 'free':
            if (entryFeeAmount > 0) return false;
            break;
          case '1-10':
            if (entryFeeAmount < 1 || entryFeeAmount > 10) return false;
            break;
          case '10-50':
            if (entryFeeAmount < 10 || entryFeeAmount > 50) return false;
            break;
          case '50-100':
            if (entryFeeAmount < 50 || entryFeeAmount > 100) return false;
            break;
          case '100+':
            if (entryFeeAmount < 100) return false;
            break;
        }
      }

      return true;
    });

    // Sort challenges
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'prize-pool':
          const aPrize = parseFloat(a.prizePool.split(' ')[0].replace(/,/g, ''));
          const bPrize = parseFloat(b.prizePool.split(' ')[0].replace(/,/g, ''));
          return bPrize - aPrize;
        case 'participants':
          return b.participants - a.participants;
        case 'ending-soon':
          // Mock sorting by ending soon - in real app would use actual end times
          return a.status === 'LIVE' ? -1 : 1;
        default: // latest
          return 0; // Keep original order for mock data
      }
    });

    // Organize by status
    const live = filtered.filter(t => t.status === 'LIVE');
    const upcoming = filtered.filter(t => t.status === 'UPCOMING');
    const completed = filtered.filter(t => t.status === 'ENDED');

    return {
      liveChallenges: live,
      upcomingChallenges: upcoming,
      completedChallenges: completed,
    };
  }, [challenges, filters]);

  const renderChallengeSection = (
    title: string,
    challengeItems: Array<{
      id: string;
      title: string;
      status: 'LIVE' | 'UPCOMING' | 'ENDED';
      prizePool: string;
      participants: number;
      maxParticipants: number;
      entryFee?: string;
      timeRemaining?: string;
      startTime?: string;
    }>,
    icon: React.ReactNode,
    statusColor: string
  ) => {
    if (challengeItems.length === 0) return null;

    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <span className={`w-3 h-3 ${statusColor} rounded-full mr-3`}></span>
          {icon}
          <span className="ml-2">{title}</span>
          <span className="ml-3 text-sm text-gray-400 font-normal">
            ({challengeItems.length})
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challengeItems.map((challengeItem, index) => (
            <motion.div
              key={challengeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/challenge/${challengeItem.id}`}>
                <ChallengeCard 
                  {...challengeItem} 
                  gameType={mockChallenges.find(t => challengeToCardData(t).id === challengeItem.id)?.game}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mobile-bottom-spacing">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Browse Challenges
          </h1>
          <p className="text-lg text-gray-300">
            Discover and join gaming challenges across multiple platforms
          </p>
        </div>

        {/* Challenge Filters */}
        <ChallengeFilters filters={filters} onFiltersChange={setFilters} />

        {/* Challenge Sections */}
        {renderChallengeSection(
          'Live Now',
          liveChallenges,
          <Trophy className="w-6 h-6" />,
          'bg-red-500'
        )}

        {renderChallengeSection(
          'Upcoming',
          upcomingChallenges,
          <Clock className="w-6 h-6" />,
          'bg-yellow-500'
        )}

        {renderChallengeSection(
          'Completed',
          completedChallenges,
          <CheckCircle className="w-6 h-6" />,
          'bg-gray-500'
        )}

        {/* No Results State */}
        {liveChallenges.length === 0 && upcomingChallenges.length === 0 && completedChallenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No challenges found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters to see more results</p>
            <button
              onClick={() => setFilters({
                status: 'all',
                game: 'all',
                token: 'all',
                entryFee: 'all',
                prizePool: 'all',
                sortBy: 'latest',
              })}
              className="btn-gaming-secondary px-6 py-2"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}