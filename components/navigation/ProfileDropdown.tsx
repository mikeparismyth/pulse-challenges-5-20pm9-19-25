'use client';

import { motion } from 'framer-motion';
import { Settings, Wallet, Key, LogOut, Copy } from 'lucide-react';
import { User } from '@/lib/auth';
import { useWalletConnections } from '@/lib/useWalletConnections';

interface ProfileDropdownProps {
  user: User;
  onClose: () => void;
  onSignOut: () => void;
}

export default function ProfileDropdown({ user, onClose, onSignOut }: ProfileDropdownProps) {
  const { formatWalletAddress } = useWalletConnections();
  
  const copyWalletAddress = () => {
    const primaryWallet = user.connectedWallets.find(w => w.id === 'pulse') || user.connectedWallets[0];
    if (primaryWallet) {
      navigator.clipboard.writeText(primaryWallet.address);
      // In real app, show toast notification
    }
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Account Settings',
      onClick: () => {
        console.log('Account Settings');
        onClose();
      }
    },
    {
      icon: Wallet,
      label: 'Wallet Settings',
      onClick: () => {
        console.log('Wallet Settings');
        onClose();
      }
    },
    {
      icon: Key,
      label: 'Export Private Key',
      onClick: () => {
        console.log('Export Private Key');
        onClose();
      }
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: onSignOut,
      danger: true
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="absolute right-0 top-12 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-gaming-card z-50 rounded-lg"
      >
        {/* User Info Header */}
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm">
                {user.username}
              </div>
              <div className="text-gray-400 text-xs">
                {user.email}
              </div>
            </div>
          </div>
          
          {/* Wallet Address */}
          <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
            {user.connectedWallets.length > 0 ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Primary wallet</div>
                  <div className="text-white text-sm font-mono">
                    {formatWalletAddress(user.connectedWallets[0].address)}
                  </div>
                </div>
                <motion.button
                  onClick={copyWalletAddress}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm">
                No wallets connected
              </div>
            )}
            {user.connectedWallets.length > 0 && user.connectedWallets[0].balance && (
              <div className="text-right text-xs text-gray-500 mt-1">
                {user.connectedWallets[0].balance.eth} ETH (${user.connectedWallets[0].balance.usd})
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                item.danger
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700/50">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <span className="mr-1">🛡️</span>
            Protected by Privy
          </div>
        </div>
      </motion.div>
    </>
  );
}