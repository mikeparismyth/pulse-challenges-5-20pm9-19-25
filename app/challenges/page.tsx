'use client';

import TournamentCard from '@/components/TournamentCard';
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

  // Simple tournament data organized by status
  const tournaments = [
    {
      id: 'tournament-1',
      title: 'Fortnite Battle Royale Championship',
      status: 'LIVE' as const,
      prizePool: '4,350 MYTH',
      participants: 87,
      maxParticipants: 100,
      entryFee: '50 MYTH',
      timeRemaining: 'In Progress',
      startTime: '2025-01-15T18:00:00Z'
    },
    {
      id: 'tournament-4',
      title: 'CS2 Major Championship',
      status: 'LIVE' as const,
      prizePool: '5,520 PENGU',
      participants: 24,
      maxParticipants: 24,
      entryFee: '250 PENGU',
      timeRemaining: 'In Progress',
      startTime: '2025-01-15T14:00:00Z'
    },
    {
      id: 'tournament-2',
      title: 'Valorant Champions Series',
      status: 'UPCOMING' as const,
      prizePool: '2,952 PENGU',
      participants: 32,
      maxParticipants: 64,
      entryFee: '100 PENGU',
      timeRemaining: 'Starts in 2 hours',
      startTime: '2025-01-20T16:00:00Z'
    },
    {
      id: 'tournament-3',
      title: 'League of Legends World Cup',
      status: 'UPCOMING' as const,
      prizePool: '1,080 MYTH',
      participants: 16,
      maxParticipants: 32,
      entryFee: '75 MYTH',
      timeRemaining: 'Starts in 1 day',
      startTime: '2025-01-25T12:00:00Z'
    },
    {
      id: 'tournament-6',
      title: 'Apex Legends Arena',
      status: 'UPCOMING' as const,
      prizePool: '864 PENGU',
      participants: 12,
      maxParticipants: 60,
      entryFee: '80 PENGU',
      timeRemaining: 'Starts in 3 days',
      startTime: '2025-01-30T15:00:00Z'
    },
    {
      id: 'tournament-5',
      title: 'Rocket League Championship',
      status: 'ENDED' as const,
      prizePool: '1,296 MYTH',
      participants: 48,
      maxParticipants: 48,
      entryFee: '30 MYTH',
      timeRemaining: 'Completed',
      startTime: '2025-01-10T10:00:00Z'
    }
  ];

  // Filter and organize tournaments
  const { liveTournaments, upcomingTournaments, completedTournaments } = useMemo(() => {
    let filtered = tournaments.filter(tournament => {
      // Status filter
      if (filters.status !== 'all') {
        const statusMap = { live: 'LIVE', upcoming: 'UPCOMING', ended: 'ENDED' };
        if (tournament.status !== statusMap[filters.status as keyof typeof statusMap]) {
          return false;
        }
      }

      // Game filter
      if (filters.game !== 'all') {
        const gameInTitle = tournament.title.toLowerCase();
        const gameMap = {
          fortnite: 'fortnite',
          valorant: 'valorant',
          league: 'league',
          cs2: 'cs2',
          rocket: 'rocket',
          apex: 'apex'
        };
        if (!gameInTitle.includes(gameMap[filters.game as keyof typeof gameMap])) {
          return false;
        }
      }

      // Token filter
      if (filters.token !== 'all') {
        const tokenSymbol = tournament.prizePool.split(' ')[1];
        if (tokenSymbol.toLowerCase() !== filters.token.toLowerCase()) {
          return false;
        }
      }

      // Entry fee range filter
      if (filters.entryFee !== 'all') {
        const entryFeeAmount = parseFloat(tournament.entryFee?.split(' ')[0] || '0');
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

    // Sort tournaments
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
      liveTournaments: live,
      upcomingTournaments: upcoming,
      completedTournaments: completed,
    };
  }, [tournaments, filters]);

  const renderTournamentSection = (
    title: string,
    tournaments: Array<{
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
    if (tournaments.length === 0) return null;

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
            ({tournaments.length})
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/challenge/${tournament.id}`}>
                <TournamentCard {...tournament} />
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
            Discover and join gaming tournaments across multiple platforms
          </p>
        </div>

        {/* Challenge Filters */}
        <ChallengeFilters filters={filters} onFiltersChange={setFilters} />

        {/* Tournament Sections */}
        {renderTournamentSection(
          'Live Now',
          liveTournaments,
          <Trophy className="w-6 h-6" />,
          'bg-red-500'
        )}

        {renderTournamentSection(
          'Upcoming',
          upcomingTournaments,
          <Clock className="w-6 h-6" />,
          'bg-yellow-500'
        )}

        {renderTournamentSection(
          'Completed',
          completedTournaments,
          <CheckCircle className="w-6 h-6" />,
          'bg-gray-500'
        )}

        {/* No Results State */}
        {liveTournaments.length === 0 && upcomingTournaments.length === 0 && completedTournaments.length === 0 && (
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