// ENGINEER HANDOFF: PRD-compliant Challenge model ready for API integration
// GameType enum supports PUDGY_PARTY and NFL_RIVALS with extensible architecture
// GAME_MODE_CONFIGS provides game-specific configuration for UI components
// All TypeScript interfaces match backend webhook schemas exactly

// Tournament Data Types - Based on PRD Specifications

export type ChainType = 'ABSTRACT' | 'SOLANA' | 'ETHEREUM';
export type GameType = 'PUDGY_PARTY' | 'NFL_RIVALS'; // v1; expanded game support
export type ModeType = 'LEADERBOARD';
export type VisibilityType = 'public' | 'private' | 'unlisted';
export type ScoreByType = 'TOP1_COUNT' | 'TOP3_COUNT' | 'TOP10_COUNT' | 'COINS_EARNED' | 'CUSTOM_METRIC' | 'POINTS_SCORED' | 'WINS' | 'TOUCHDOWNS';
export type TournamentState = 'DRAFT' | 'UPCOMING' | 'LIVE' | 'ENDED' | 'SETTLED' | 'CANCELLED' | 'DISPUTE';

// Game-specific mode configurations
export type PudgyPartyModeType = 'ALL_MODES' | 'BATTLE_ROYALE' | 'EVENT';
export type NFLRivalsModeType = 'SEASON' | 'PLAYOFFS' | 'TOURNAMENT';

// Game mode configuration interface
export interface GameModeConfig {
  game: GameType;
  availableModes: PudgyPartyModeType[] | NFLRivalsModeType[];
  availableScoring: ScoreByType[];
  defaultMode: string;
  defaultScoring: ScoreByType;
}

// Game mode configurations by game type
export const GAME_MODE_CONFIGS: Record<GameType, GameModeConfig> = {
  PUDGY_PARTY: {
    game: 'PUDGY_PARTY',
    availableModes: ['ALL_MODES', 'BATTLE_ROYALE', 'EVENT'] as PudgyPartyModeType[],
    availableScoring: ['TOP1_COUNT', 'TOP3_COUNT', 'TOP10_COUNT', 'COINS_EARNED', 'CUSTOM_METRIC'],
    defaultMode: 'ALL_MODES',
    defaultScoring: 'TOP1_COUNT'
  },
  NFL_RIVALS: {
    game: 'NFL_RIVALS',
    availableModes: ['SEASON', 'PLAYOFFS', 'TOURNAMENT'] as NFLRivalsModeType[],
    availableScoring: ['POINTS_SCORED', 'WINS', 'TOUCHDOWNS', 'CUSTOM_METRIC'],
    defaultMode: 'SEASON',
    defaultScoring: 'POINTS_SCORED'
  }
};

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
  game_mode: string; // Specific to selected game (e.g., 'BATTLE_ROYALE', 'SEASON')
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

// PRD-compliant Challenge model (extends Tournament with additional features)
export interface Challenge extends Tournament {
  // Challenge-specific fields
  challenge_type: 'TOURNAMENT' | 'LEADERBOARD' | 'BRACKET';
  registration_deadline?: string; // ISO 8601 timestamp
  start_date: string; // ISO 8601 timestamp  
  end_date: string; // ISO 8601 timestamp
  
  // Game-specific configuration
  game_config: {
    mode: string; // Game-specific mode (BATTLE_ROYALE, SEASON, etc.)
    scoring_type: ScoreByType;
    custom_rules?: Record<string, any>; // Flexible game-specific rules
  };
  
  // Enhanced metadata
  tags?: string[]; // For categorization and search
  featured?: boolean; // For homepage carousel
  skill_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';
  region?: string; // Geographic restriction if any
  
  // Social features
  team_size?: number; // 1 for solo, >1 for team tournaments
  allow_spectators?: boolean;
  stream_url?: string; // Official stream link
  
  // MOCK: Replace with API call to /api/challenges/[id]
  // MOCK: Replace with API call to /api/challenges (for list)
  // MOCK: Replace with API call to /api/challenges (POST for creation)
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

// Challenge display data (extends TournamentCardData)
export interface ChallengeCardData extends TournamentCardData {
  gameMode: string;
  skillLevel?: string;
  teamSize?: number;
  featured?: boolean;
  tags?: string[];
}

// Utility type for tournament creation
export interface CreateTournamentRequest {
  title: string;
  visibility: VisibilityType;
  game: GameType;
  game_mode: string; // Game-specific mode
  leaderboard_config: LeaderboardConfig;
  entry_and_prizes: EntryAndPrizes;
  organizer_fee_bps?: number;
  organizer_fee_wallet?: string;
  max_participants?: number;
  description?: string;
}
// Challenge creation request (extends tournament creation)
export interface CreateChallengeRequest extends CreateTournamentRequest {
  challenge_type: 'TOURNAMENT' | 'LEADERBOARD' | 'BRACKET';
  registration_deadline?: string;
  start_date: string;
  end_date: string;
  game_config: {
    mode: string;
    scoring_type: ScoreByType;
    custom_rules?: Record<string, any>;
  };
  tags?: string[];
  featured?: boolean;
  skill_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL';
  region?: string;
  team_size?: number;
  allow_spectators?: boolean;
  stream_url?: string;
  // MOCK: Replace with API call to /api/challenges (POST)
}

// Utility functions for game mode validation
export function getAvailableModesForGame(game: GameType): string[] {
  return GAME_MODE_CONFIGS[game].availableModes as string[];
}

export function getAvailableScoringForGame(game: GameType): ScoreByType[] {
  return GAME_MODE_CONFIGS[game].availableScoring;
}

export function isValidGameMode(game: GameType, mode: string): boolean {
  return getAvailableModesForGame(game).includes(mode);
}

export function isValidScoringForGame(game: GameType, scoring: ScoreByType): boolean {
  return getAvailableScoringForGame(game).includes(scoring);
}

// Type guards for game-specific modes
export function isPudgyPartyMode(mode: string): mode is PudgyPartyModeType {
  return ['ALL_MODES', 'BATTLE_ROYALE', 'EVENT'].includes(mode);
}

export function isNFLRivalsMode(mode: string): mode is NFLRivalsModeType {
  return ['SEASON', 'PLAYOFFS', 'TOURNAMENT'].includes(mode);
}

// Authentication and User Types - PRD Section 3.6 compliant
export type SigninMethod = 'email' | 'sms' | 'metamask' | 'coinbase' | 'rainbow' | 'walletconnect' | 'phantom' | 'google' | 'discord' | 'abstract';

export interface PulseUserWallet {
  address: string;
  label?: string;
}

export interface PulseUserExternalWallet {
  chain: "evm" | "solana";
  address: string;
  label?: string;
}

export interface GamePlatformAccount {
  provider: "MYTHICAL";
  accountId: string;
  displayName?: string;
  games: string[];
  linkedAt: string;
}

export interface PulseUserSocialAccounts {
  source: "privy";
  linkedAccounts: any[];
  hasAny: boolean;
}

export interface PulseUserEligibility {
  hasUsername: boolean;
  hasRequiredPlatformForChallenge?: boolean;
}

export interface PulseUserPreferences {
  notifications?: Record<string, boolean>;
}

export interface WalletPref {
  evmPayoutAddr?: string;
  solPayoutAddr?: string;
}

export interface PulseUser {
  id: string;
  createdAt: string;
  
  // Identity
  username: string;
  usernameNormalized: string;
  
  // Wallets
  wallets: {
    embeddedEvm?: PulseUserWallet;
    embeddedSol?: PulseUserWallet;
    abstract?: PulseUserWallet;
    externals: PulseUserExternalWallet[];
  };
  
  primaryWallets: {
    evmOrAbstract?: string;
    solana?: string;
  };
  
  // Game Platforms (Mythical v0)
  gamePlatforms: GamePlatformAccount[];
  
  // Social Accounts (Privy source of truth)
  socialAccounts: PulseUserSocialAccounts;
  
  // Eligibility helpers (derived flags used by UI flows)
  eligibility: PulseUserEligibility;
  
  // Preferences
  preferences: PulseUserPreferences;
  
  // Contract refs (challenge-level mapping lives on challenge rows)
  walletPref?: WalletPref;
}

// Backward compatibility interface - DEPRECATED, migrate to PulseUser
export interface User extends PulseUser {
  email: string;
  avatar?: string;
  connectedWallets: any[]; // Legacy field
  level: number;
  xp: number;
  totalEarnings: string;
  signinMethod?: SigninMethod;
}