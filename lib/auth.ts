// Authentication state management
'use client';

import { create } from 'zustand';
import { ConnectedWallet, mockConnectedWallets } from './mockWalletData';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  connectedWallets: ConnectedWallet[];
  createdAt: string;
  level: number;
  xp: number;
  totalEarnings: string;
  signinMethod?: 'email' | 'sms' | 'metamask' | 'coinbase' | 'rainbow' | 'walletconnect' | 'phantom' | 'google' | 'discord';
}

type SigninMethod = 'email' | 'sms' | 'metamask' | 'coinbase' | 'rainbow' | 'walletconnect' | 'phantom' | 'google' | 'discord';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  signinMethod: SigninMethod | null;
  login: (user: User, method?: SigninMethod) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  signinMethod: null,
  login: (user, method: SigninMethod = 'email') => set({ 
    isAuthenticated: true, 
    user: { ...user, signinMethod: method }, 
    signinMethod: method 
  }),
  logout: () => set({ 
    isAuthenticated: false, 
    user: null, 
    signinMethod: null 
  }),
}));

// Mock user data for demonstration
export const mockUser: User = {
  id: 'user_123',
  username: 'GameMaster2024',
  email: 'gamer@example.com',
  avatar: undefined,
  connectedWallets: mockConnectedWallets,
  createdAt: '2024-01-15T10:30:00Z',
  level: 12,
  xp: 2450,
  totalEarnings: '1,250 MYTH',
  signinMethod: 'email'
};