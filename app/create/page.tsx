'use client';

import { Plus, Zap, Users, Trophy, Settings, Calendar } from 'lucide-react';

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mobile-bottom-spacing">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8E1EFE]/20 rounded-full mb-6">
            <Plus className="w-8 h-8 text-[#8E1EFE]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Challenge
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Challenge creation interface coming in Phase 4
          </p>
        </div>

        {/* Coming Soon Features */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Planned Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="w-10 h-10 bg-[#30FFE6]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-[#30FFE6]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Tournament Setup</h3>
                <p className="text-gray-300 text-sm">
                  Configure game type, scoring rules, and tournament format with intuitive controls.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="w-10 h-10 bg-[#8E1EFE]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-[#8E1EFE]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Prize Configuration</h3>
                <p className="text-gray-300 text-sm">
                  Set entry fees, prize pools, and token distributions across multiple blockchain networks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="w-10 h-10 bg-[#30FFE6]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-[#30FFE6]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Participant Management</h3>
                <p className="text-gray-300 text-sm">
                  Control registration limits, eligibility requirements, and player verification systems.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="w-10 h-10 bg-[#8E1EFE]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[#8E1EFE]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Scheduling System</h3>
                <p className="text-gray-300 text-sm">
                  Plan tournament dates, set registration deadlines, and manage time zones automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="w-10 h-10 bg-[#30FFE6]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-[#30FFE6]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Advanced Settings</h3>
                <p className="text-gray-300 text-sm">
                  Configure dispute resolution, fee structures, and custom tournament rules.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="w-10 h-10 bg-[#8E1EFE]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-[#8E1EFE]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Template Library</h3>
                <p className="text-gray-300 text-sm">
                  Choose from pre-built tournament templates or create custom configurations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Access Notice */}
        <div className="glass-card p-6 text-center">
          <div className="inline-flex items-center gap-2 text-[#30FFE6] mb-3">
            <Settings className="w-5 h-5" />
            <span className="font-semibold">Admin Access Required</span>
          </div>
          <p className="text-gray-300">
            Tournament creation will be available to verified organizers and platform administrators.
            Contact support for early access to creation tools.
          </p>
        </div>
      </main>
    </div>
  );
}