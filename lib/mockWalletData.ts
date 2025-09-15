// Mock wallet data and state management for realistic wallet connections
'use client';

export interface ConnectedWallet {
  id: string;
  name: string;
  address: string;
  type: 'embedded' | 'external';
  chainId?: number;
  isConnected: boolean;
  icon?: string;
  balance?: {
    eth: string;
    usd: string;
  };
}

// Dynamic connected wallets based on signin method
export function getConnectedWalletsForSigninMethod(signinMethod: string): ConnectedWallet[] {
  const baseWallets: ConnectedWallet[] = [];
  
  // Pulse wallet is ALWAYS connected for signed-in users
  const pulseWallet: ConnectedWallet = {
    id: 'pulse',
    name: 'Pulse Wallet',
    address: '0x742d35Cc6134C0532925a3b8D4C4405fAE4b38EF',
    type: 'embedded',
    isConnected: true,
    icon: '⚡',
    balance: {
      eth: '0.063',
      usd: '156.42'
    }
  };
  
  baseWallets.push(pulseWallet);
  
  // Add wallet-specific connections based on signin method
  if (signinMethod === 'metamask') {
    baseWallets.push({
      id: 'metamask',
      name: 'MetaMask',
      address: '0x1234567890123456789012345678901234567890',
      type: 'external',
      chainId: 1,
      isConnected: true,
      icon: '🦊',
      balance: {
        eth: '0.125',
        usd: '310.25'
      }
    });
  } else if (signinMethod === 'coinbase') {
    baseWallets.push({
      id: 'coinbase',
      name: 'Coinbase Wallet',
      address: '0x9876543210987654321098765432109876543210',
      type: 'external',
      chainId: 1,
      isConnected: true,
      icon: '🔵',
      balance: {
        eth: '0.089',
        usd: '220.15'
      }
    });
  } else if (signinMethod === 'phantom') {
    baseWallets.push({
      id: 'phantom',
      name: 'Phantom',
      address: 'PhantomWallet123456789012345678901234567890',
      type: 'external',
      isConnected: true,
      icon: '👻',
      balance: {
        eth: '2.5 SOL',
        usd: '425.75'
      }
    });
  } else if (signinMethod === 'rainbow') {
    baseWallets.push({
      id: 'rainbow',
      name: 'Rainbow',
      address: '0x5555666677778888999900001111222233334444',
      type: 'external',
      chainId: 1,
      isConnected: true,
      icon: '🌈',
      balance: {
        eth: '0.156',
        usd: '387.20'
      }
    });
  } else if (signinMethod === 'walletconnect') {
    baseWallets.push({
      id: 'walletconnect',
      name: 'WalletConnect',
      address: '0x7777888899990000111122223333444455556666',
      type: 'external',
      chainId: 1,
      isConnected: true,
      icon: '📱',
      balance: {
        eth: '0.078',
        usd: '193.45'
      }
    });
  }
  // For email/SMS/social signin: only Pulse wallet is connected
  
  return baseWallets;
}

// Keep existing mockConnectedWallets as default fallback
export const mockConnectedWallets: ConnectedWallet[] = getConnectedWalletsForSigninMethod('email');

export const availableWallets = [
  {
    id: 'abstract',
    name: 'Abstract Wallet',
    description: 'Sign with Abstract',
    icon: '🛡️',
    recommended: true,
    installed: false,
    type: 'external' as const
  },
  {
    id: 'pulse',
    name: 'Pulse Wallet',
    description: 'Use Pulse Wallet',
    icon: '⚡',
    recommended: false,
    installed: true,
    default: true,
    type: 'embedded' as const
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect MetaMask',
    icon: '🦊',
    recommended: false,
    installed: true,
    type: 'external' as const
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'WalletConnect',
    icon: '📱',
    recommended: false,
    installed: false,
    type: 'external' as const
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Coinbase Wallet',
    icon: '🔵',
    recommended: false,
    installed: false,
    type: 'external' as const
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Buy with Card',
    icon: '💳',
    recommended: false,
    installed: false,
    type: 'external' as const
  }
];

export const formatWalletAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getConnectedWallet = (walletId: string): ConnectedWallet | undefined => {
  return mockConnectedWallets.find(wallet => wallet.id === walletId && wallet.isConnected);
};

// Dynamic version that works with signin method
export const getConnectedWalletDynamic = (walletId: string, signinMethod: string): ConnectedWallet | undefined => {
  const connectedWallets = getConnectedWalletsForSigninMethod(signinMethod);
  return connectedWallets.find(wallet => wallet.id === walletId && wallet.isConnected);
};

export const isWalletConnected = (walletId: string): boolean => {
  return mockConnectedWallets.some(wallet => wallet.id === walletId && wallet.isConnected);
};

// Dynamic version for signin method
export const isWalletConnectedDynamic = (walletId: string, signinMethod: string): boolean => {
  const connectedWallets = getConnectedWalletsForSigninMethod(signinMethod);
  return connectedWallets.some(wallet => wallet.id === walletId && wallet.isConnected);
};

export const getWalletInfo = (walletId: string) => {
  return availableWallets.find(wallet => wallet.id === walletId);
};

// Mock function to simulate connecting a wallet
export const connectWallet = async (walletId: string): Promise<ConnectedWallet> => {
  const walletInfo = getWalletInfo(walletId);
  if (!walletInfo) {
    throw new Error('Wallet not found');
  }

  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const newWallet: ConnectedWallet = {
    id: walletId,
    name: walletInfo.name,
    address: `0x${Math.random().toString(16).substr(2, 40)}`,
    type: walletInfo.type,
    isConnected: true,
    icon: walletInfo.icon,
    balance: {
      eth: (Math.random() * 0.5).toFixed(3),
      usd: (Math.random() * 1000).toFixed(2)
    }
  };

  // Add to connected wallets (in real app, this would update global state)
  mockConnectedWallets.push(newWallet);
  
  return newWallet;
};

// Mock function to simulate disconnecting a wallet
export const disconnectWallet = async (walletId: string): Promise<void> => {
  const index = mockConnectedWallets.findIndex(wallet => wallet.id === walletId);
  if (index > -1) {
    mockConnectedWallets.splice(index, 1);
  }
};