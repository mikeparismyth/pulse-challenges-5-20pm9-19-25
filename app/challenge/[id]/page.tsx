'use client';

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

  // Mock tournament data - in real app this would come from API
  const tournaments = [
    {
      id: 'tournament-1',
      title: 'Fortnite Battle Royale Championship',
      status: 'LIVE' as const,
      prizePool: '4,350 MYTH',
      participants: 87,
      maxParticipants: 100,
      entryFee: '50 MYTH',
      timeRemaining: 'In Progress',
      description: 'Epic Fortnite tournament with massive prize pool. Battle against the best players in intense matches.',
      organizerFeeBps: 200, // 2% organizer fee
      developerFeeBps: 800, // 8% developer fee
      rules: [
        'Tournament runs for 4 hours with unlimited matches',
        'Top 1 finishes count towards leaderboard score',
        'Must maintain 60+ FPS and stable connection',
        'No teaming or stream sniping allowed',
        'Disputes handled within 24 hours'
      ],
      startTime: '2025-01-15T18:00:00Z',
      endTime: '2025-01-15T22:00:00Z'
    },
    {
      id: 'tournament-2',
      title: 'Valorant Champions Series',
      status: 'UPCOMING' as const,
      prizePool: '2,952 PENGU',
      participants: 32,
      maxParticipants: 64,
      entryFee: '100 PENGU',
      timeRemaining: 'Starts in 2 hours',
      description: 'Competitive Valorant tournament for skilled players. Prove your tactical prowess.',
      organizerFeeBps: 150, // 1.5% organizer fee
      developerFeeBps: 800, // 8% developer fee
      rules: [
        'Best of 3 matches in elimination format',
        'Standard competitive ruleset applies',
        'Team registration required 1 hour before start',
        'Anti-cheat software mandatory',
        'Prize distribution within 48 hours'
      ],
      startTime: '2025-01-20T16:00:00Z',
      endTime: '2025-01-20T20:00:00Z'
    },
    {
      id: 'tournament-3',
      title: 'League of Legends World Cup',
      status: 'UPCOMING' as const,
      prizePool: '1,080 MYTH',
      participants: 16,
      maxParticipants: 32,
      entryFee: '75 MYTH',
      timeRemaining: 'Starts in 1 day',
      description: 'Premier League of Legends tournament with international players.',
      organizerFeeBps: 300, // 3% organizer fee
      developerFeeBps: 800, // 8% developer fee
      rules: [
        'Draft pick mode with standard ban phase',
        '5v5 Summoner\'s Rift matches only',
        'Tournament realm required for all matches',
        'Professional referee oversight',
        'Coaching allowed between games'
      ],
      startTime: '2025-01-25T12:00:00Z',
      endTime: '2025-01-25T18:00:00Z'
    },
    {
      id: 'tournament-4',
      title: 'CS2 Major Championship',
      status: 'ENDED' as const,
      prizePool: '5,520 PENGU',
      participants: 24,
      maxParticipants: 24,
      entryFee: '250 PENGU',
      timeRemaining: 'Completed',
      description: 'Completed CS2 tournament with epic matches and skilled players.',
      organizerFeeBps: 0, // 0% organizer fee
      developerFeeBps: 800, // 8% developer fee
      rules: [
        'Tournament completed successfully',
        'All prizes have been distributed',
        'Final rankings are locked',
        'Replay footage available for review',
        'Post-tournament analysis published'
      ],
      startTime: '2025-01-10T14:00:00Z',
      endTime: '2025-01-10T18:00:00Z'
    },
    {
      id: 'tournament-5',
      title: 'Rocket League Championship',
      status: 'ENDED' as const,
      prizePool: '1,296 MYTH',
      participants: 48,
      maxParticipants: 48,
      entryFee: '30 MYTH',
      timeRemaining: 'Completed',
      description: 'Completed Rocket League tournament showcasing incredible aerial skills and teamwork.',
      organizerFeeBps: 100, // 1% organizer fee
      developerFeeBps: 800, // 8% developer fee
      rules: [
        'Tournament completed successfully',
        'All matches played in competitive 3v3 format',
        'Final standings are official and locked',
        'Prize distribution completed',
        'Replay files available for download'
      ],
      startTime: '2025-01-05T15:00:00Z',
      endTime: '2025-01-05T19:00:00Z'
    },
    {
      id: 'tournament-6',
      title: 'Apex Legends Arena',
      status: 'UPCOMING' as const,
      prizePool: '864 PENGU',
      participants: 12,
      maxParticipants: 60,
      entryFee: '80 PENGU',
      timeRemaining: 'Starts in 3 days',
      description: 'Intense battle royale competition in the Apex Games arena.',
      organizerFeeBps: 250, // 2.5% organizer fee
      developerFeeBps: 800, // 8% developer fee
      rules: [
        'Squad-based battle royale format',
        'Random team assignment available',
        'Standard Apex Legends competitive rules',
        'Anti-cheat monitoring active',
        'Communication via in-game voice chat recommended'
      ],
      startTime: '2025-01-28T20:00:00Z',
      endTime: '2025-01-29T00:00:00Z'
    }
  ];

  const tournament = tournaments.find(t => t.id === challengeId);

  if (!tournament) {
    notFound();
  }

  // Game-specific hero images and themes
  const getGameTheme = (title: string) => {
    if (title.toLowerCase().includes('fortnite')) {
      return {
        heroImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1600',
        gradient: 'from-purple-900/90 via-blue-900/70 to-gray-900/90',
        gameName: 'Fortnite',
        gameIcon: '🎮'
      };
    }
    if (title.toLowerCase().includes('valorant')) {
      return {
        heroImage: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1600',
        gradient: 'from-red-900/90 via-orange-900/70 to-gray-900/90',
        gameName: 'Valorant',
        gameIcon: '🔫'
      };
    }
    if (title.toLowerCase().includes('league')) {
      return {
        heroImage: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=1600',
        gradient: 'from-blue-900/90 via-cyan-900/70 to-gray-900/90',
        gameName: 'League of Legends',
        gameIcon: '⚔️'
      };
    }
    if (title.toLowerCase().includes('cs2') || title.toLowerCase().includes('counter')) {
      return {
        heroImage: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=1600',
        gradient: 'from-gray-900/90 via-slate-800/70 to-gray-900/90',
        gameName: 'Counter-Strike 2',
        gameIcon: '💥'
      };
    }
    if (title.toLowerCase().includes('rocket league')) {
      return {
        heroImage: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=1600',
        gradient: 'from-orange-900/90 via-yellow-900/70 to-gray-900/90',
        gameName: 'Rocket League',
        gameIcon: '🚗'
      };
    }
    if (title.toLowerCase().includes('apex')) {
      return {
        heroImage: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=1600',
        gradient: 'from-green-900/90 via-emerald-900/70 to-gray-900/90',
        gameName: 'Apex Legends',
        gameIcon: '🎯'
      };
    }
    // Default gaming theme
    return {
      heroImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1600',
      gradient: 'from-purple-900/90 via-indigo-900/70 to-gray-900/90',
      gameName: 'Gaming Tournament',
      gameIcon: '🎮'
    };
  };

  const gameTheme = getGameTheme(tournament.title);

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
