'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check, Gamepad2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { GamePlatformAccount, GameType } from '@/lib/types';
import { toast } from 'sonner';

interface RequiredPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gameType: GameType;
  challengeTitle: string;
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected';

const GAME_PLATFORM_INFO = {
  'PUDGY_PARTY': {
    gameName: 'Pudgy Party',
    platformName: 'Mythical',
    description: 'This challenge requires a Mythical account to track your Pudgy Party gameplay and verify your scores.',
    icon: '🐧'
  },
  'NFL_RIVALS': {
    gameName: 'NFL Rivals', 
    platformName: 'Mythical',
    description: 'This challenge requires a Mythical account to track your NFL Rivals gameplay and verify your scores.',
    icon: '🏈'
  }
};

export default function RequiredPlatformModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  gameType,
  challengeTitle
}: RequiredPlatformModalProps) {
  const { pulseUser, linkGamePlatform } = useAuth();
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  const gameInfo = GAME_PLATFORM_INFO[gameType];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setConnectionState('disconnected');
    }
  }, [isOpen]);

  const handleConnectPlatform = async () => {
    if (!pulseUser) return;
    
    setConnectionState('connecting');
    
    try {
      // ENGINEER HANDOFF: Replace with real OAuth integration
      // MOCK: Replace with FusionAuth/Mythical OAuth flow
      // Real implementation would redirect to:
      // window.location.href = `/api/auth/mythical/oauth?userId=${pulseUser.id}&redirect=${window.location.origin}/auth/callback`
      
      // Simulate OAuth flow delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // MOCK: Create mock Mythical account data
      // MOCK: Create mock Mythical account data with ALL supported games
      const mockPlatformAccount: GamePlatformAccount = {
        provider: 'MYTHICAL',
        accountId: `myth_${Date.now()}`,
        displayName: `${gameInfo.gameName}Player`,
        games: ['PUDGY_PARTY', 'NFL_RIVALS'], // Include ALL games supported by Mythical
        linkedAt: new Date().toISOString()
      };
      
      // Link the platform using auth store
      await linkGamePlatform(mockPlatformAccount);
      
      setConnectionState('connected');
      toast.success(`${gameInfo.platformName} account connected successfully!`);
      
      // Auto-proceed after brief success display
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
    } catch (error) {
      console.error(`Failed to connect ${gameInfo.platformName} account:`, error);
      setConnectionState('disconnected');
      toast.error(`Failed to connect ${gameInfo.platformName} account. Please try again.`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-gaming-card overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              {connectionState !== 'connecting' && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Content based on connection state */}
              <AnimatePresence mode="wait">
                {connectionState === 'disconnected' && (
                  <motion.div
                    key="disconnected"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6"
                  >
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        Platform Connection Required
                      </h2>
                      <p className="text-gray-400 text-sm">
                        To join "{challengeTitle}"
                      </p>
                    </div>

                    {/* Game Info */}
                    <div className="bg-gray-800/30 rounded-lg p-4 mb-6 border border-gray-700/50">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">{gameInfo.icon}</div>
                        <div>
                          <div className="text-white font-medium">{gameInfo.gameName}</div>
                          <div className="text-gray-400 text-sm">Challenge Game</div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {gameInfo.description}
                      </p>
                    </div>

                    {/* Platform Connection Card */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-purple-600/20">
                            <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">M</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-white font-medium">{gameInfo.platformName} Account</div>
                            <div className="text-xs text-gray-400">
                              Required for {gameInfo.gameName} challenges
                            </div>
                          </div>
                        </div>
                        <div className="text-red-400 text-sm font-medium">
                          Not Connected
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={handleConnectPlatform}
                      className="w-full bg-[#8E1EFE] hover:bg-[#8E1EFE]/90 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Connect {gameInfo.platformName} Account
                    </Button>

                    {/* Note */}
                    <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <p className="text-blue-300 text-xs text-center">
                        You'll be redirected to {gameInfo.platformName} to authorize the connection
                      </p>
                    </div>
                  </motion.div>
                )}

                {connectionState === 'connecting' && (
                  <motion.div
                    key="connecting"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 text-center"
                  >
                    <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Connecting to {gameInfo.platformName}
                    </h2>
                    <p className="text-gray-400 mb-4">
                      Please complete the authorization in the popup window
                    </p>
                    <div className="text-sm text-gray-500">
                      This may take a few moments...
                    </div>
                  </motion.div>
                )}

                {connectionState === 'connected' && (
                  <motion.div
                    key="connected"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 text-center"
                  >
                    <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {gameInfo.platformName} Connected!
                    </h2>
                    <p className="text-gray-400 mb-4">
                      You can now join {gameInfo.gameName} challenges
                    </p>
                    <div className="text-sm text-gray-500">
                      Proceeding to tournament entry...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}