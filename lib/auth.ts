// ENGINEER HANDOFF: Authentication state management with PRD-compliant PulseUser
// MOCK: Replace with real Privy integration and API calls
// MOCK: Replace mockPulseUser with /api/profile endpoint
// MOCK: Replace login/logout with Privy authentication flows

'use client';

import { create } from 'zustand';
import { PulseUser, User, SigninMethod } from './types';
import { mockPulseUser, createMockUserForSigninMethod } from './mockData';

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
  hasPlatformLinked: (platform: string) => boolean;
  hasWalletConnected: (walletType: 'embedded' | 'external' | 'abstract') => boolean;
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
    
    const updatedPulseUser = { ...currentPulseUser, ...updates };
    
    // Update legacy user object as well
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser, pulseUser: updatedPulseUser });
    } else {
      set({ pulseUser: updatedPulseUser });
    }
  },
  
  // Helper functions for UI components
  hasUsername: () => {
    const pulseUser = get().pulseUser;
    return pulseUser?.eligibility.hasUsername || false;
  },
  
  hasPlatformLinked: (platform: string) => {
    const pulseUser = get().pulseUser;
    return pulseUser?.gamePlatforms.some(p => p.provider === platform.toUpperCase()) || false;
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