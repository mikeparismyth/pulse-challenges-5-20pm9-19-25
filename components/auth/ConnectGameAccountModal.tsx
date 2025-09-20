'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Gamepad2, Stamp as Steam, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { GamePlatformAccount, GameType } from '@/lib/types';
import { toast } from 'sonner';

interface ConnectGameAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSkip: () => void;
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export default function ConnectGameAccountModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onSkip 
}: ConnectGameAccountModalProps) {
  const { pulseUser, linkGamePlatform } = useAuth();
  const [mythicalState, setMythicalState] = useState<ConnectionState>('disconnected');

  // Reset state when modal closes
  useEffect(() => {
    if (isOpen) {
      // Always start in disconnected state for new users
      setMythicalState('disconnected');
    }
  }, [isOpen]);

  const handleConnectMythical = async () => {
    if (!pulseUser) return;
    
    setMythicalState('connecting');
    
    try {
      // ENGINEER HANDOFF: Replace with real OAuth integration
      // MOCK: Replace with FusionAuth/Mythical OAuth flow
      // Real implementation would redirect to:
      // window.location.href = `/api/auth/mythical/oauth?userId=${pulseUser.id}&redirect=${window.location.origin}/auth/callback`
      
      // Simulate OAuth flow delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // MOCK: Create mock Mythical account data
      const mockMythicalAccount: GamePlatformAccount = {
        provider: 'MYTHICAL',
        accountId: `myth_${Date.now()}`,
        displayName: 'GamerPro2024',
        games: ['PUDGY_PARTY', 'NFL_RIVALS'] as GameType[],
        linkedAt: new Date().toISOString()
      };
      
      // Link the platform using auth store
      await linkGamePlatform(mockMythicalAccount);
      
      setMythicalState('connected');
      toast.success('Mythical account connected successfully!');
      
    } catch (error) {
      console.error('Failed to connect Mythical account:', error);
      setMythicalState('disconnected');
      toast.error('Failed to connect Mythical account. Please try again.');
    }
  };

  const handleFinish = () => {
    onSuccess();
  };

  const handleSkip = () => {
    onSkip();
  };

  const isConnected = mythicalState === 'connected';
  const canFinish = isConnected;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-gaming-card overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Connect your Game Accounts
                </h2>
                <p className="text-gray-400 text-sm">
                  Link external gaming accounts to join challenges on Pulse Arena
                </p>
              </div>

              {/* Mythical Account Card */}
              <div className="px-6 mb-6">
                <motion.div
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    isConnected
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                  }`}
                  whileHover={!isConnected ? { scale: 1.02 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isConnected ? 'bg-green-500/20' : 'bg-purple-600/20'
                      }`}>
                        <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">M</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-medium">Mythical Account</div>
                        <div className="text-xs text-gray-400">
                          {isConnected 
                            ? 'Connect a Mythical Account with linked games (e.g. NFL Rivals)'
                            : 'Required for Pudgy Party and NFL Rivals challenges'
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-green-400 text-sm font-medium">Connected</span>
                        </div>
                      ) : mythicalState === 'connecting' ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                          <span className="text-purple-400 text-sm">Connecting...</span>
                        </div>
                      ) : (
                        <Button
                          onClick={handleConnectMythical}
                          disabled={mythicalState !== 'disconnected'}
                          className="bg-[#8E1EFE] hover:bg-[#8E1EFE]/90 text-white px-4 py-2 text-sm rounded-lg transition-colors"
                        >
                          CONNECT
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Coming Soon Section */}
              <div className="px-6 mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3">More accounts coming soon...</h3>
                <div className="space-y-3">
                  {/* Steam Placeholder */}
                  <div className="p-4 rounded-lg border border-gray-700/30 bg-gray-800/20 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-700/50">
                          <Steam className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="text-gray-500 font-medium">Steam</div>
                          <div className="text-xs text-gray-600">Coming soon</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gray-700/50 text-gray-500 text-xs rounded-md">
                        Soon
                      </div>
                    </div>
                  </div>

                  {/* PlayStation Placeholder */}
                  <div className="p-4 rounded-lg border border-gray-700/30 bg-gray-800/20 opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-700/50">
                          <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs font-bold">P</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 font-medium">PlayStation Network</div>
                          <div className="text-xs text-gray-600">Coming soon</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gray-700/50 text-gray-500 text-xs rounded-md">
                        Soon
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-700/50">
                {canFinish ? (
                  <Button
                    onClick={handleFinish}
                    className="w-full bg-gradient-to-r from-[#8E1EFE] to-[#30FFE6] hover:opacity-90 text-white py-3 rounded-lg font-medium transition-opacity"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    FINISH
                  </Button>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={handleSkip}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <span>Protected by</span>
                    <div className="w-3 h-3 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-sm"></div>
                    <span className="font-semibold text-white">pulse</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ENGINEER HANDOFF: OAuth Integration Points
// 1. Replace handleConnectMythical with real OAuth flow:
//    - Redirect to /api/auth/mythical/oauth?userId=${userId}&redirect=${callbackUrl}
//    - Handle OAuth callback at /auth/callback route
//    - Exchange authorization code for access token
//    - Fetch user's Mythical profile and linked games
//    - Store platform connection in database via API call
//
// 2. Platform expansion for Steam, PlayStation Network:
//    - Add OAuth providers for Steam OpenID, PlayStation Network
//    - Extend GamePlatformAccount interface for additional platforms
//    - Update GAME_PLATFORM_REQUIREMENTS mapping in types.ts
//    - Add platform-specific game detection logic
//
// 3. Real-time connection status:
//    - WebSocket or polling for OAuth completion status
//    - Handle OAuth errors and user cancellation
//    - Refresh user profile after successful connection