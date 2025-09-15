import { Tournament, TournamentCardData, TournamentState } from './types';

// Mock tournament data using proper types with MYTH/PENGU token examples
export const mockTournaments: Tournament[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Fortnite Battle Royale Championship',
    slug: 'fortnite-battle-royale-championship',
    visibility: 'public',
    game: 'PUDGY_PARTY',
    mode: 'LEADERBOARD',
    leaderboard_config: {
      score_by: 'TOP1_COUNT',
      higher_is_better: true,
      time_window: {
        start_utc: '2025-01-15T18:00:00Z',
        end_utc: '2025-01-15T22:00:00Z'
      }
    },
    entry_and_prizes: {
      entry_token: {
        chain: 'ETHEREUM',
        symbol: 'MYTH',
        tokenAddr: '0x1234567890123456789012345678901234567890',
        decimals: 18
      },
      entry_fee: '50000000000000000000', // 50 MYTH tokens
      prize_token: {
        chain: 'ETHEREUM',
        symbol: 'MYTH',
        tokenAddr: '0x1234567890123456789012345678901234567890',
        decimals: 18
      },
      max_participants: 100
    },
    fees: {
      developer_fee_bps: 800, // 8%
      organizer_fee_bps: 200, // 2%
      dev_fee_wallet: '0xdev1234567890123456789012345678901234567890',
      organizer_fee_wallet: '0xorg1234567890123456789012345678901234567890'
    },
    state: 'LIVE',
    created_by: 'user_123',
    allow_user_generated: true,
    dispute_window_hours: 24,
    description: 'Epic Fortnite tournament with massive prize pool',
    participants: 87,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-15T17:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'Valorant Champions Series',
    slug: 'valorant-champions-series',
    visibility: 'public',
    game: 'PUDGY_PARTY',
    mode: 'LEADERBOARD',
    leaderboard_config: {
      score_by: 'TOP3_COUNT',
      higher_is_better: true,
      time_window: {
        start_utc: '2025-01-20T16:00:00Z',
        end_utc: '2025-01-20T20:00:00Z'
      }
    },
    entry_and_prizes: {
      entry_token: {
        chain: 'SOLANA',
        symbol: 'PENGU',
        tokenAddr: 'PENGUmint1234567890123456789012345678901234',
        decimals: 6
      },
      entry_fee: '100000000', // 100 PENGU tokens
      prize_token: {
        chain: 'SOLANA',
        symbol: 'PENGU',
        tokenAddr: 'PENGUmint1234567890123456789012345678901234',
        decimals: 6
      },
      max_participants: 64
    },
    fees: {
      developer_fee_bps: 800,
      organizer_fee_bps: 150,
      dev_fee_wallet: 'DevWallet1234567890123456789012345678901234',
      organizer_fee_wallet: 'OrgWallet1234567890123456789012345678901234'
    },
    state: 'UPCOMING',
    created_by: 'user_456',
    allow_user_generated: true,
    dispute_window_hours: 24,
    description: 'Competitive Valorant tournament for skilled players',
    participants: 32,
    created_at: '2025-01-12T14:00:00Z',
    updated_at: '2025-01-15T12:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'League of Legends World Cup',
    slug: 'league-of-legends-world-cup',
    visibility: 'public',
    game: 'PUDGY_PARTY',
    mode: 'LEADERBOARD',
    leaderboard_config: {
      score_by: 'COINS_EARNED',
      higher_is_better: true,
      time_window: {
        start_utc: '2025-01-25T12:00:00Z',
        end_utc: '2025-01-25T18:00:00Z'
      }
    },
    entry_and_prizes: {
      entry_token: {
        chain: 'ABSTRACT',
        symbol: 'MYTH',
        tokenAddr: '0xabstract1234567890123456789012345678901234',
        decimals: 18
      },
      entry_fee: '75000000000000000000', // 75 MYTH tokens
      prize_token: {
        chain: 'ABSTRACT',
        symbol: 'MYTH',
        tokenAddr: '0xabstract1234567890123456789012345678901234',
        decimals: 18
      },
      max_participants: 32
    },
    fees: {
      developer_fee_bps: 800,
      organizer_fee_bps: 300,
      dev_fee_wallet: '0xdevabs1234567890123456789012345678901234',
      organizer_fee_wallet: '0xorgabs1234567890123456789012345678901234'
    },
    state: 'UPCOMING',
    created_by: 'user_789',
    allow_user_generated: false,
    dispute_window_hours: 48,
    description: 'Premier League of Legends tournament with international players',
    participants: 16,
    created_at: '2025-01-08T09:00:00Z',
    updated_at: '2025-01-15T11:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'CS2 Major Championship',
    slug: 'cs2-major-championship',
    visibility: 'public',
    game: 'PUDGY_PARTY',
    mode: 'LEADERBOARD',
    leaderboard_config: {
      score_by: 'TOP1_COUNT',
      higher_is_better: true,
      time_window: {
        start_utc: '2025-01-15T14:00:00Z',
        end_utc: '2025-01-15T20:00:00Z'
      }
    },
    entry_and_prizes: {
      entry_token: {
        chain: 'ETHEREUM',
        symbol: 'PENGU',
        tokenAddr: '0xpengu567890123456789012345678901234567890',
        decimals: 8
      },
      entry_fee: '25000000000', // 250 PENGU tokens
      prize_token: {
        chain: 'ETHEREUM',
        symbol: 'PENGU',
        tokenAddr: '0xpengu567890123456789012345678901234567890',
        decimals: 8
      },
      max_participants: 24
    },
    fees: {
      developer_fee_bps: 800,
      organizer_fee_bps: 0,
      dev_fee_wallet: '0xdevpengu123456789012345678901234567890',
      organizer_fee_wallet: '0x0000000000000000000000000000000000000000'
    },
    state: 'LIVE',
    created_by: 'user_101',
    allow_user_generated: true,
    dispute_window_hours: 24,
    description: 'High-stakes CS2 tournament for professional teams',
    participants: 24,
    created_at: '2025-01-05T16:00:00Z',
    updated_at: '2025-01-15T14:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'Rocket League Championship',
    slug: 'rocket-league-championship',
    visibility: 'public',
    game: 'PUDGY_PARTY',
    mode: 'LEADERBOARD',
    leaderboard_config: {
      score_by: 'TOP10_COUNT',
      higher_is_better: true,
      time_window: {
        start_utc: '2025-01-10T10:00:00Z',
        end_utc: '2025-01-10T16:00:00Z'
      }
    },
    entry_and_prizes: {
      entry_token: {
        chain: 'SOLANA',
        symbol: 'MYTH',
        tokenAddr: 'MYTHmint567890123456789012345678901234567890',
        decimals: 9
      },
      entry_fee: '30000000000', // 30 MYTH tokens
      prize_token: {
        chain: 'SOLANA',
        symbol: 'MYTH',
        tokenAddr: 'MYTHmint567890123456789012345678901234567890',
        decimals: 9
      },
      max_participants: 48
    },
    fees: {
      developer_fee_bps: 800,
      organizer_fee_bps: 100,
      dev_fee_wallet: 'DevMythWallet123456789012345678901234567890',
      organizer_fee_wallet: 'OrgMythWallet123456789012345678901234567890'
    },
    state: 'ENDED',
    created_by: 'user_202',
    allow_user_generated: true,
    dispute_window_hours: 24,
    description: 'Fast-paced Rocket League tournament with amazing rewards',
    participants: 48,
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-01-10T17:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'Apex Legends Arena',
    slug: 'apex-legends-arena',
    visibility: 'public',
    game: 'PUDGY_PARTY',
    mode: 'LEADERBOARD',
    leaderboard_config: {
      score_by: 'CUSTOM_METRIC',
      higher_is_better: true,
      time_window: {
        start_utc: '2025-01-30T15:00:00Z',
        end_utc: '2025-01-30T21:00:00Z'
      }
    },
    entry_and_prizes: {
      entry_token: {
        chain: 'ABSTRACT',
        symbol: 'PENGU',
        tokenAddr: '0xabstractpengu12345678901234567890123456',
        decimals: 6
      },
      entry_fee: '80000000', // 80 PENGU tokens
      prize_token: {
        chain: 'ABSTRACT',
        symbol: 'PENGU',
        tokenAddr: '0xabstractpengu12345678901234567890123456',
        decimals: 6
      },
      max_participants: 60
    },
    fees: {
      developer_fee_bps: 800,
      organizer_fee_bps: 250,
      dev_fee_wallet: '0xdevapex1234567890123456789012345678901234',
      organizer_fee_wallet: '0xorgapex1234567890123456789012345678901234'
    },
    state: 'UPCOMING',
    created_by: 'user_303',
    allow_user_generated: true,
    dispute_window_hours: 24,
    description: 'Intense Apex Legends battle royale tournament',
    participants: 12,
    created_at: '2025-01-18T13:00:00Z',
    updated_at: '2025-01-19T10:00:00Z'
  }
];

// Utility function to convert Tournament to TournamentCardData for UI
export function tournamentToCardData(tournament: Tournament): TournamentCardData {
  // Convert state to simplified UI status
  let status: 'LIVE' | 'UPCOMING' | 'ENDED';
  switch (tournament.state) {
    case 'LIVE':
      status = 'LIVE';
      break;
    case 'ENDED':
    case 'SETTLED':
    case 'CANCELLED':
      status = 'ENDED';
      break;
    default:
      status = 'UPCOMING';
  }

  // Calculate total prize pool (simplified calculation)
  const entryFeeNum = parseFloat(tournament.entry_and_prizes.entry_fee);
  const decimals = tournament.entry_and_prizes.entry_token.decimals;
  const entryFeeFormatted = (entryFeeNum / Math.pow(10, decimals)).toFixed(2);
  
  // Estimate prize pool (entry fees minus platform fees)
  const totalEntryFees = entryFeeNum * tournament.participants;
  const totalFeeBps = tournament.fees.developer_fee_bps + tournament.fees.organizer_fee_bps;
  const prizePoolAmount = totalEntryFees * (1 - totalFeeBps / 10000);
  const prizePoolFormatted = (prizePoolAmount / Math.pow(10, decimals)).toFixed(0);

  return {
    id: tournament.id,
    title: tournament.title,
    status,
    prizePool: `${prizePoolFormatted} ${tournament.entry_and_prizes.prize_token.symbol}`,
    participants: tournament.participants,
    maxParticipants: tournament.entry_and_prizes.max_participants || 999,
    entryFee: `${entryFeeFormatted} ${tournament.entry_and_prizes.entry_token.symbol}`,
    tokenSymbol: tournament.entry_and_prizes.entry_token.symbol,
    timeRemaining: status === 'UPCOMING' ? 'Starts in 2 hours' : 
                   status === 'LIVE' ? 'In Progress' : 'Completed'
  };
}

// Export converted data for immediate use