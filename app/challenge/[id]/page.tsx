'use client';

// MOCK: Replace mockTournaments with API call to /api/challenges/[id]
import { mockTournaments } from '@/lib/mockData';
import { GameType } from '@/lib/types';
import { useParams, notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { joinChallenge, hasUserJoinedChallenge } from '@/lib/mockChallengeParticipation';
import { useWalletConnections } from '@/lib/useWalletConnections';
import { TokenDisplay } from '@/components/ui/TokenDisplay';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { Trophy, Users, Clock, ArrowLeft, Crown, Medal, Award, Gamepad2, Zap } from 'lucide-react';
import Link from 'next/link';
import JoinChallengeModal from '@/components/JoinChallengeModal';
import WalletConnectionModals from '@/components/WalletConnectionModals';
import TransactionSigningModals from '@/components/TransactionSigningModals';
import PrivySignInModal from '@/components/auth/PrivySignInModal';

const GAME_THEMES = {
  'PUDGY_PARTY': {
    heroImage: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1600',
    gradient: 'from-purple-900/90 via-blue-900/70 to-gray-900/90',
    gameName: 'Pudgy Party',
    gameIcon: '🐧'
  },
  'NFL_RIVALS': {
    heroImage: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1600',
    gradient: 'from-red-900/90 via-orange-900/70 to-gray-900/90',
    gameName: 'NFL Rivals',
    gameIcon: '🏈'
  }
};

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.id as string;
  const { isAuthenticated, user } = useAuth();
  const { connectWallet, getConnectedWallet, formatWalletAddress } = useWalletConnections();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showWalletFlow, setShowWalletFlow] = useState(false);
  const [showTransactionFlow, setShowTransactionFlow] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState<string>('');

  // Initialize hasJoined state based on existing participation
  useEffect(() => {
    if (user && challengeId) {
      const alreadyJoined = hasUserJoinedChallenge(user.id, challengeId);
      setHasJoined(alreadyJoined);
    }
  }, [user, challengeId]);

  // Find tournament from centralized mock data
  const mockTournament = mockTournaments.find(t => t.id === challengeId);
  
  // Convert to display format for UI compatibility
  const tournament = mockTournament ? {
    id: mockTournament.id,
    title: mockTournament.title,
    status: mockTournament.state === 'LIVE' ? 'LIVE' as const : 
            mockTournament.state === 'ENDED' || mockTournament.state === 'SETTLED' ? 'ENDED' as const : 
            'UPCOMING' as const,
    prizePool: `${Math.floor(parseFloat(mockTournament.entry_and_prizes.entry_fee) * mockTournament.participants * (1 - (mockTournament.fees.developer_fee_bps + mockTournament.fees.organizer_fee_bps) / 10000) / Math.pow(10, mockTournament.entry_and_prizes.entry_token.decimals)).toLocaleString()} ${mockTournament.entry_and_prizes.prize_token.symbol}`,
    participants: mockTournament.participants,
    maxParticipants: mockTournament.entry_and_prizes.max_participants || 100,
    entryFee: `${(parseFloat(mockTournament.entry_and_prizes.entry_fee) / Math.pow(10, mockTournament.entry_and_prizes.entry_token.decimals)).toFixed(0)} ${mockTournament.entry_and_prizes.entry_token.symbol}`,
    timeRemaining: mockTournament.state === 'LIVE' ? 'In Progress' : 
                   mockTournament.state === 'ENDED' ? 'Completed' : 
                   'Starts in 2 hours',
    description: mockTournament.description || 'Join this exciting tournament and compete for amazing prizes!',
    organizerFeeBps: mockTournament.fees.organizer_fee_bps,
    developerFeeBps: mockTournament.fees.developer_fee_bps,
    rules: [
      'Tournament follows standard competitive rules',
      'All participants must maintain fair play standards',
      'Disputes will be handled by tournament officials',
      'Prize distribution occurs after tournament completion',
      'Anti-cheat measures are actively monitored'
    ],
    startTime: mockTournament.leaderboard_config.time_window.start_utc,
    endTime: mockTournament.leaderboard_config.time_window.end_utc,
    game: mockTournament.game
  } : null;

  if (!tournament) {
    notFound();
  }


  const gameTheme = GAME_THEMES[tournament.game] || GAME_THEMES['PUDGY_PARTY'];

  // Extract token info from prizePool string
  const extractTokenInfo = (tokenStr: string) => {
    const match = tokenStr.match(/^([\d,]+)\s+(\w+)$/);
    if (match) {
      const amount = match[1];
      const symbol = match[2];
      // Mock USD conversion rates
      const rates: { [key: string]: number } = {
        'MYTH': 0.02,
        'PENGU': 0.15
      };
      const numAmount = parseFloat(amount.replace(/,/g, ''));
      const usdValue = numAmount * (rates[symbol] || 0.01);
      return { amount, symbol, usdValue };
    }
    return { amount: tokenStr, symbol: '', usdValue: 0 };
  };

  const prizeInfo = extractTokenInfo(tournament.prizePool);
  const entryInfo = tournament.entryFee ? extractTokenInfo(tournament.entryFee) : null;

  const handleJoinClick = () => {
    if (tournament.status === 'ENDED') return;
    
    console.log('🎯 Join button clicked');
    console.log('🔐 Authentication status:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('🚪 User not authenticated, showing sign-in modal');
      setShowSignInModal(true);
    } else {
      console.log('✅ User authenticated, showing join modal');
      setShowJoinModal(true);
    }
  };

  const handleSignInSuccess = () => {
    console.log('✅ Sign-in successful, transitioning to join modal');
    setShowSignInModal(false);
    // Use setTimeout to ensure sign-in modal closes before join modal opens
    setTimeout(() => {
      setShowJoinModal(true);
    }, 100);
  };

  const handleWalletSuccess = (completedFlow?: 'connection' | 'transaction') => {
    console.log('✅ Wallet flow completed:', completedFlow);
    
    if (completedFlow === 'transaction') {
      // Transaction completed - user has joined challenge
      if (user) {
        // Add user to challenge participation
        const participation = joinChallenge(user.id, challengeId, `mock-tx-${Date.now()}`);
        console.log('📝 Added challenge participation:', participation);
      }
      
      setHasJoined(true);
      setShowWalletFlow(false);
      setShowTransactionFlow(false);
      setSelectedWalletType('');
      
      // Show success and update UI
      toast.success(`Successfully joined ${tournament?.title}!`);
    } else {
      // Wallet connected - proceed directly to transaction signing
      setShowWalletFlow(false);
      
      // Seamlessly transition to transaction flow
      setTimeout(() => {
        setShowTransactionFlow(true);
      }, 100);
    }
  };

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, player: 'ProGamer2024', score: 15, prize: '1,740 MYTH' },
    { rank: 2, player: 'EliteSniper', score: 12, prize: '1,305 MYTH' },
    { rank: 3, player: 'TacticalAce', score: 10, prize: '870 MYTH' },
    { rank: 4, player: 'GameMaster', score: 8, prize: '435 MYTH' },
    { rank: 5, player: 'SkillShot', score: 7, prize: '0 MYTH' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Full-Width Hero Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url(${gameTheme.heroImage})` }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gameTheme.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Back Navigation - Floating */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
          <Link 
            href="/challenges"
            className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/80 transition-all duration-300 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Challenges
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center pt-16 md:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="max-w-4xl">
              {/* Game Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-full">
                  <Gamepad2 className="w-4 h-4 mr-2 text-[#30FFE6]" />
                  <span className="text-[#30FFE6] text-xs md:text-sm font-medium glow-text-teal">
                    {gameTheme.gameName}
                  </span>
                </div>
                
                {/* Status Badge */}
                <Badge
                  variant="outline"
                  className={`text-xs md:text-sm font-semibold px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-sm ${
                    tournament.status === 'LIVE' 
                      ? 'bg-red-500/90 text-white border-red-500/50 shadow-glow-red' 
                      : tournament.status === 'UPCOMING'
                      ? 'bg-yellow-500/90 text-white border-yellow-500/50 shadow-glow-yellow'
                      : 'bg-gray-500/90 text-white border-gray-500/50'
                  }`}
                >
                  {tournament.status === 'LIVE' && (
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  )}
                  {tournament.status}
                </Badge>
              </motion.div>

              {/* Challenge Title */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-4 glow-text leading-tight"
              >
                {tournament.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl"
              >
                {tournament.description}
              </motion.p>

              {/* Stats Cards Row */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8"
              >
                {/* Prize Pool Card */}
                <div className="glass-card p-3 md:p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-2">
                    <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2 text-[#30FFE6]" />
                    <span className="text-xs md:text-sm text-gray-300 font-medium">Prize Pool</span>
                  </div>
                  <div className="text-lg md:text-2xl font-bold text-white mb-1">
                    {prizeInfo.amount} {prizeInfo.symbol}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">
                    ≈ ${prizeInfo.usdValue.toLocaleString()}
                  </div>
                </div>

                {/* Players Card */}
                <div className="glass-card p-3 md:p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-[#8E1EFE]" />
                    <span className="text-xs md:text-sm text-gray-300 font-medium">Players</span>
                  </div>
                  <div className="text-lg md:text-2xl font-bold text-white mb-2">
                    {tournament.participants}/{tournament.maxParticipants}
                  </div>
                  <ProgressBar
                    current={tournament.participants}
                    max={tournament.maxParticipants}
                    showNumbers={false}
                    size="sm"
                    animated={tournament.status === 'LIVE'}
                  />
                </div>

                {/* Time Card */}
                <div className="glass-card p-3 md:p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-400" />
                    <span className="text-xs md:text-sm text-gray-300 font-medium">
                      {tournament.status === 'UPCOMING' ? 'Starts In' : 
                       tournament.status === 'LIVE' ? 'Status' : 'Completed'}
                    </span>
                  </div>
                  <div className="text-base md:text-lg font-bold text-white">
                    {tournament.status === 'UPCOMING' ? (
                      <CountdownTimer 
                        targetDate={tournament.startTime}
                        size="sm"
                      />
                    ) : (
                      tournament.timeRemaining
                    )}
                  </div>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-start gap-4"
              >
                <Button
                  className="btn-gaming-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 flex items-center space-x-2 shadow-gaming-hover w-full sm:w-auto"
                  onClick={handleJoinClick}
                  disabled={tournament.status === 'ENDED' || hasJoined}
                >
                  <Zap className="w-5 h-5" />
                  <span>
                    {hasJoined ? 'JOINED' : 
                     tournament.status === 'LIVE' ? 'JOIN NOW' : 
                     tournament.status === 'UPCOMING' ? 'JOIN' : 'VIEW RESULTS'}
                    {entryInfo && tournament.status !== 'ENDED' && !hasJoined && (
                      <span className="ml-2 text-sm opacity-90">
                        - {entryInfo.amount} {entryInfo.symbol} (${entryInfo.usdValue.toFixed(2)})
                      </span>
                    )}
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 mobile-bottom-spacing">
        {/* Challenge Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-[#8E1EFE] data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className="data-[state=active]:bg-[#8E1EFE] data-[state=active]:text-white"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger 
              value="rules"
              className="data-[state=active]:bg-[#8E1EFE] data-[state=active]:text-white"
            >
              Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Tournament Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[#30FFE6] font-medium mb-2">Schedule</h4>
                  <p className="text-sm md:text-base text-gray-300">
                    Starts: {new Date(tournament.startTime).toLocaleString()}
                  </p>
                  <p className="text-sm md:text-base text-gray-300">
                    Ends: {new Date(tournament.endTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-[#30FFE6] font-medium mb-2">Format</h4>
                  <p className="text-sm md:text-base text-gray-300">Leaderboard-based scoring</p>
                  <p className="text-sm md:text-base text-gray-300">Real-time ranking updates</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-6">Current Rankings</h3>
              <div className="space-y-3">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between p-3 md:p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {player.rank === 1 && <Crown className="w-6 h-6 text-yellow-400" />}
                        {player.rank === 2 && <Medal className="w-6 h-6 text-gray-300" />}
                        {player.rank === 3 && <Award className="w-6 h-6 text-orange-400" />}
                        {player.rank > 3 && (
                          <span className="text-gray-400 font-semibold">#{player.rank}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm md:text-base text-white font-medium">{player.player}</div>
                        <div className="text-gray-400 text-xs md:text-sm">Score: {player.score}</div>
                      </div>
                    </div>
                    <div className="text-sm md:text-base text-[#30FFE6] font-semibold">
                      {player.prize}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-6">Tournament Rules</h3>
              <div className="space-y-4">
                {tournament.rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#8E1EFE] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-300">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Privy Sign-In Modal */}
      <PrivySignInModal
        isOpen={showSignInModal}
        onClose={() => {
          console.log('🔄 Closing sign-in modal');
          setShowSignInModal(false);
        }}
        onSuccess={handleSignInSuccess}
      />

      {/* Join Challenge Modal */}
      <JoinChallengeModal
        isOpen={showJoinModal}
        onClose={() => {
          console.log('🔄 Closing join modal');
          setShowJoinModal(false);
        }}
        getConnectedWallet={getConnectedWallet}
        formatWalletAddress={formatWalletAddress}
        challenge={{
          title: tournament.title,
          entryFee: tournament.entryFee || '0 MYTH',
          prizePool: tournament.prizePool,
          organizerFeeBps: tournament.organizerFeeBps,
          developerFeeBps: tournament.developerFeeBps
        }}
        onWalletFlowStart={(walletType: string) => {
          console.log('🚀 Starting wallet flow for:', walletType);
          setSelectedWalletType(walletType);
          setShowJoinModal(false);
          
          // Route to appropriate flow based on wallet connection status
          setTimeout(() => {
            if (walletType === 'card') {
              console.log('💳 Card payment, showing transaction flow directly');
              setShowTransactionFlow(true);
            } else {
              const connectedWallet = getConnectedWallet(walletType);
              if (connectedWallet) {
                console.log('✅ Wallet connected, showing transaction flow');
                setShowTransactionFlow(true);
              } else {
                console.log('🔗 Wallet not connected, showing connection flow');
                setShowWalletFlow(true);
              }
            }
          }, 100);
        }}
      />

      {/* Wallet Connection Modals */}
      <WalletConnectionModals
        isOpen={showWalletFlow}
        walletType={selectedWalletType}
        onClose={() => {
          console.log('🔄 Closing wallet modal');
          setShowWalletFlow(false);
          setSelectedWalletType('');
        }}
        onSuccess={() => handleWalletSuccess('connection')}
        onConnect={connectWallet}
        challenge={{
          title: tournament.title,
          entryFee: tournament.entryFee || '0 MYTH'
        }}
      />

      {/* Transaction Signing Modals */}
      <TransactionSigningModals
        isOpen={showTransactionFlow}
        walletType={selectedWalletType}
        onClose={() => {
          console.log('🔄 Closing transaction modal');
          setShowTransactionFlow(false);
          setSelectedWalletType('');
        }}
        onSuccess={() => handleWalletSuccess('transaction')}
        connectedWallet={getConnectedWallet(selectedWalletType)!}
        challenge={{
          title: tournament.title,
          entryFee: tournament.entryFee || '0 MYTH'
        }}
      />
    </div>
  );
}
