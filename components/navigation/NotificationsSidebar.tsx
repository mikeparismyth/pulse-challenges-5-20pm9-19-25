'use client';

import { motion } from 'framer-motion';
import { X, Trophy, Users, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsSidebar({ isOpen, onClose }: NotificationsSidebarProps) {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'tournament',
      icon: Trophy,
      title: 'Tournament Starting Soon',
      message: 'Fortnite Battle Royale Championship starts in 15 minutes',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'achievement',
      icon: Zap,
      title: 'New Achievement Unlocked',
      message: 'You earned the "First Victory" badge!',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'social',
      icon: Users,
      title: 'Friend Request',
      message: 'ProGamer2024 wants to be your friend',
      time: '3 hours ago',
      unread: false
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed right-0 top-0 h-full w-80 glass-card border-l border-gray-700/50 shadow-gaming-card z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:bg-gray-800/30 ${
                  notification.unread
                    ? 'bg-gray-800/20 border-[#8E1EFE]/30'
                    : 'bg-gray-800/10 border-gray-700/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'tournament' ? 'bg-yellow-500/20 text-yellow-400' :
                    notification.type === 'achievement' ? 'bg-[#8E1EFE]/20 text-[#8E1EFE]' :
                    'bg-[#30FFE6]/20 text-[#30FFE6]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-white truncate">
                        {notification.title}
                      </h3>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-[#8E1EFE] rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-300 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {notification.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700/50">
          <Button
            variant="outline"
            className="w-full text-sm border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50"
          >
            Mark All as Read
          </Button>
        </div>
      </motion.div>
    </>
  );
}