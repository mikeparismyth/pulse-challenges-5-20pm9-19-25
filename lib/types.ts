// Tournament Data Types - Based on PRD Specifications

export type ChainType = 'ABSTRACT' | 'SOLANA' | 'ETHEREUM';
export type GameType = 'PUDGY_PARTY'; // v0; enum allows future games
export type ModeType = 'LEADERBOARD';
export type VisibilityType = 'public' | 'private' | 'unlisted';
export type ScoreByType = 'TOP1_COUNT' | 'TOP3_COUNT' | 'TOP10_COUNT' | 'COINS_EARNED' | 'CUSTOM_METRIC';
export type TournamentState = 'DRAFT' | 'UPCOMING' | 'LIVE' | 'ENDED' | 'SETTLED' | 'CANCELLED' | 'DISPUTE';

export interface Token {
  chain: ChainType;
  symbol: string;
  tokenAddr: string; // tokenAddr for EVM chains, mint for Solana
  decimals: number;
}

export interface LeaderboardConfig {
  score_by: ScoreByType;
  higher_is_better: boolean;
  time_window: {
    start_utc: string; // ISO 8601 timestamp
    end_utc: string;   // ISO 8601 timestamp
  };
}

export interface EntryAndPrizes {
  entry_token: Token;
  entry_fee: string; // String to handle large numbers and decimals
  prize_token: Token; // MUST match entry_token
  max_participants?: number; // Optional
}

export interface Fees {
  developer_fee_bps: number; // Default 800 = 8%
  organizer_fee_bps: number; // 0-1000 basis points
  dev_fee_wallet: string;
  organizer_fee_wallet: string;
}

export interface Tournament {
  id: string; // UUID
  title: string;
  slug: string; // Derived from title
  visibility: VisibilityType;
  game: GameType;
  mode: ModeType;
  
  // Leaderboard Configuration
  leaderboard_config: LeaderboardConfig;
  
  // Entry & Prizes
  entry_and_prizes: EntryAndPrizes;
  
  // Fees
  fees: Fees;
  
  // State Management
  state: TournamentState;
  created_by: string; // userId
  allow_user_generated: boolean; // Feature flag
  dispute_window_hours: number; // Default 24
  
  // Additional metadata
  description?: string;
  participants: number; // Current participant count
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

// UI Display Types (derived from Tournament data)
export interface TournamentCardData {
  id: string;
  title: string;
  status: 'LIVE' | 'UPCOMING' | 'ENDED'; // Simplified for UI
  prizePool: string; // Formatted display string
  participants: number;
  maxParticipants: number;
  entryFee: string; // Formatted display string
  tokenSymbol: string;
  timeRemaining?: string; // Human readable time
}

// Utility type for tournament creation
export interface CreateTournamentRequest {
  title: string;
  visibility: VisibilityType;
  game: GameType;
  leaderboard_config: LeaderboardConfig;
  entry_and_prizes: EntryAndPrizes;
  organizer_fee_bps?: number;
  organizer_fee_wallet?: string;
  max_participants?: number;
  description?: string;
}