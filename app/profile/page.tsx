import { Trophy, Users, Clock } from 'lucide-react';

export default function Profile() {
  const userStats = {
    tournamentsWon: 3,
    totalTournaments: 12,
    totalWinnings: '$2,350',
    currentRank: 'Gold',
  };

  const recentTournaments = [
    {
      name: 'Fortnite Battle Royale',
      placement: '2nd',
      prize: '$500',
      date: '2 days ago',
    },
    {
      name: 'Valorant Champions',
      placement: '1st',
      prize: '$1,000',
      date: '1 week ago',
    },
    {
      name: 'CS2 Major',
      placement: '5th',
      prize: '$100',
      date: '2 weeks ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mobile-bottom-spacing">
        {/* Profile Header */}
        <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-gray-700 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-[#8E1EFE] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">JD</span>
            </div>
            
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">John Doe</h1>
              <p className="text-gray-300 mb-2">Professional Gamer</p>
              <div className="flex items-center justify-center sm:justify-start">
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                  {userStats.currentRank} Rank
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-gray-700 p-6 text-center">
            <Trophy className="w-8 h-8 text-[#30FFE6] mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {userStats.tournamentsWon}
            </div>
            <div className="text-gray-300 text-sm">Tournaments Won</div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-gray-700 p-6 text-center">
            <Users className="w-8 h-8 text-[#8E1EFE] mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {userStats.totalTournaments}
            </div>
            <div className="text-gray-300 text-sm">Total Tournaments</div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-gray-700 p-6 text-center">
            <div className="text-2xl font-bold text-[#30FFE6] mb-1">
              {userStats.totalWinnings}
            </div>
            <div className="text-gray-300 text-sm">Total Winnings</div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-gray-700 p-6 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {Math.round((userStats.tournamentsWon / userStats.totalTournaments) * 100)}%
            </div>
            <div className="text-gray-300 text-sm">Win Rate</div>
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3" />
            Recent Tournaments
          </h2>
          
          <div className="space-y-4">
            {recentTournaments.map((tournament, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="mb-2 sm:mb-0">
                  <h3 className="text-white font-semibold">{tournament.name}</h3>
                  <p className="text-gray-300 text-sm">{tournament.date}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tournament.placement === '1st'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : tournament.placement === '2nd'
                        ? 'bg-gray-400/20 text-gray-300'
                        : tournament.placement === '3rd'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {tournament.placement} Place
                  </span>
                  <span className="text-[#30FFE6] font-semibold">
                    {tournament.prize}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}