// ENGINEER HANDOFF: Authentication state management with PRD-compliant PulseUser
// MOCK: Replace with real Privy integration and API calls
// MOCK: Replace mockPulseUser with /api/profile endpoint
// MOCK: Replace login/logout with Privy authentication flows

'use client';

import { create } from 'zustand';
import { PulseUser, User, SigninMethod } from './types';
import { mockPulseUser, createMockUserForSigninMethod } from './mockData';
import { GamePlatformAccount, GameType, hasRequiredPlatform } from './types';

// ENGINEER HANDOFF: localStorage structure for game platforms
// MOCK: Replace with API calls to /api/platforms/mythical/*
interface UserProfile {
  userId: string;
  gamePlatforms: GamePlatformAccount[];
  lastUpdated: string;
}

// Helper functions for localStorage persistence
const saveUserProfile = (userId: string, profile: Partial<UserProfile>) => {
  if (typeof window === 'undefined') return;
  try {
    const profiles = JSON.parse(localStorage.getItem('pulse_user_profiles') || '{}');
    profiles[userId] = {
      ...profiles[userId],
      ...profile,
      userId,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('pulse_user_profiles', JSON.stringify(profiles));
  } catch (error) {
    console.error('Failed to save user profile:', error);
  }
};

const loadUserProfile = (userId: string): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const profiles = JSON.parse(localStorage.getItem('pulse_user_profiles') || '{}');
    return profiles[userId] || null;
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return null;
  }
};

interface AuthState {
  isAuthenticated: boolean;
  user: User | null; // Keep User for backward compatibility
  pulseUser: PulseUser | null; // New PRD-compliant user object
  signinMethod: SigninMethod | null;
  login: (signinMethod: SigninMethod, username?: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<PulseUser>) => void;
  // Auth flow helpers
  hasUsername: () => boolean;
  hasPlatformLinked: (platform: 'MYTHICAL', game?: GameType) => boolean;
  hasWalletConnected: (walletType: 'embedded' | 'external' | 'abstract') => boolean;
  // Game platform management
  linkGamePlatform: (platform: GamePlatformAccount) => Promise<void>;
  unlinkGamePlatform: (platformId: string) => Promise<void>;
  hasRequiredPlatformForGame: (game: GameType) => boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  pulseUser: null,
  signinMethod: null,
  
  login: (signinMethod: SigninMethod, username?: string) => {
    // MOCK: Replace with real Privy authentication
    let pulseUser = createMockUserForSigninMethod(signinMethod);
    
    // If username is provided, update the user object
    if (username) {
      pulseUser = {
        ...pulseUser,
        username: username,
        usernameNormalized: username.toLowerCase(),
        eligibility: {
          ...pulseUser.eligibility,
          hasUsername: true
        }
      };
    }
    
    // Create backward compatible User object
    const legacyUser: User = {
      ...pulseUser,
      email: pulseUser.socialAccounts.linkedAccounts.find(acc => acc.email)?.email || 'user@example.com',
      avatar: undefined,
      connectedWallets: [], // Legacy field - deprecated
      level: 12,
      xp: 2450,
      totalEarnings: '1,250 MYTH',
      signinMethod
    };
    
    set({ 
      isAuthenticated: true, 
      user: legacyUser,
      pulseUser,
      signinMethod
    });
  },
  
  logout: () => {
    // MOCK: Replace with real Privy logout
    set({ 
      isAuthenticated: false, 
      user: null,
      pulseUser: null,
      signinMethod: null 
    });
  },
  
  updateUser: (updates: Partial<PulseUser>) => {
    const currentPulseUser = get().pulseUser;
    if (!currentPulseUser) return;
    
    // Load any persisted game platforms
    const profile = loadUserProfile(currentPulseUser.id);
    const persistedPlatforms = profile?.gamePlatforms || [];
    
    const updatedPulseUser = { ...currentPulseUser, ...updates };
    
    // Merge with persisted platforms if not explicitly updating platforms
    if (!updates.gamePlatforms && persistedPlatforms.length > 0) {
      updatedPulseUser.gamePlatforms = persistedPlatforms;
    }
    
    // Update legacy user object as well
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser, pulseUser: updatedPulseUser });
    } else {
      set({ pulseUser: updatedPulseUser });
    }
    
    // Persist game platforms to localStorage
    if (updates.gamePlatforms) {
      saveUserProfile(updatedPulseUser.id, { gamePlatforms: updates.gamePlatforms });
    }
  },
  
  // Helper functions for UI components
  hasUsername: () => {
    const pulseUser = get().pulseUser;
    return pulseUser?.eligibility.hasUsername || false;
  },
  
  hasPlatformLinked: (platform: 'MYTHICAL', game?: GameType) => {
    const pulseUser = get().pulseUser;
    if (!pulseUser) return false;
    
    return pulseUser.gamePlatforms.some(p => 
      p.provider === platform && 
      (game ? p.games.includes(game) : true)
    );
  },
  
  hasWalletConnected: (walletType: 'embedded' | 'external' | 'abstract') => {
    const pulseUser = get().pulseUser;
    if (!pulseUser) return false;
    
    switch (walletType) {
      case 'embedded':
        return !!(pulseUser.wallets.embeddedEvm || pulseUser.wallets.embeddedSol);
      case 'external':
        return pulseUser.wallets.externals.length > 0;
      case 'abstract':
        return !!pulseUser.wallets.abstract;
      default:
        return false;
    }
  },
  
  // ENGINEER HANDOFF: Game platform management
  // MOCK: Replace with OAuth integration to Mythical platform
  linkGamePlatform: async (platform: GamePlatformAccount) => {
    const pulseUser = get().pulseUser;
    if (!pulseUser) throw new Error('User not authenticated');
    
    // MOCK: Replace with API call to /api/platforms/mythical/link
    // This would initiate OAuth flow to Mythical platform
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedPlatforms = [
      ...pulseUser.gamePlatforms.filter(p => p.provider !== platform.provider),
      platform
    ];
    
    get().updateUser({ 
      gamePlatforms: updatedPlatforms,
      eligibility: {
        ...pulseUser.eligibility,
        hasRequiredPlatformForChallenge: true
      }
    });
  },
  
  unlinkGamePlatform: async (platformId: string) => {
    const pulseUser = get().pulseUser;
    if (!pulseUser) throw new Error('User not authenticated');
    
    // MOCK: Replace with API call to /api/platforms/mythical/unlink
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedPlatforms = pulseUser.gamePlatforms.filter(p => p.accountId !== platformId);
    
    get().updateUser({ 
      gamePlatforms: updatedPlatforms,
      eligibility: {
        ...pulseUser.eligibility,
        hasRequiredPlatformForChallenge: updatedPlatforms.length > 0
      }
    });
  },
  
  hasRequiredPlatformForGame: (game: GameType) => {
    const pulseUser = get().pulseUser;
    if (!pulseUser) return false;
    
    return hasRequiredPlatform(pulseUser.gamePlatforms, game);
  }
}));

// MOCK: Legacy mockUser for backward compatibility - DEPRECATED
export const mockUser: User = {
  ...mockPulseUser,
  email: 'gamer@example.com',
  avatar: undefined,
  connectedWallets: [], // Legacy field
  level: 12,
  xp: 2450,
  totalEarnings: '1,250 MYTH',
  signinMethod: 'email'
};

// Export legacy User type for components that haven't migrated yet
export type { User };

// MOCK: Replace useAuth with Privy useUser and useLogin hooks
// MOCK: Replace login() with Privy authentication flows
// MOCK: Replace mockUser with real user data from /api/profile
// MOCK: Replace updateUser() with API calls to /api/profile (PATCH)
// MOCK: Replace linkGamePlatform() with OAuth integration to /api/platforms/mythical/oauth
// MOCK: Replace unlinkGamePlatform() with API call to /api/platforms/mythical/unlink
// MOCK: Replace localStorage persistence with real user profile API