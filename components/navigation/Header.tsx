'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, mockUser } from '@/lib/auth';
import ProfileDropdown from './ProfileDropdown';
import NotificationsSidebar from './NotificationsSidebar';
import PrivySignInModal from '@/components/auth/PrivySignInModal';

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, login, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const navItems = [
    { name: 'Challenges', href: '/challenges' },
  ];

  const authenticatedNavItems = [
    { name: 'Challenges', href: '/challenges' },
    { name: 'Create', href: '/create' },
  ];

  const handleSignInClick = () => {
    console.log('🔐 Header sign-in clicked');
    setShowSignInModal(true);
  };

  const handleSignInSuccess = () => {
    console.log('✅ Header sign-in successful');
    setShowSignInModal(false);
  };

  const handleSignOut = () => {
    logout();
    setShowProfileDropdown(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-header border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Logo + Navigation */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-lg flex items-center justify-center mr-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-xl font-bold text-white group-hover:glow-text-purple transition-all duration-300">
                  Pulse
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6 ml-6">
                {(isAuthenticated ? authenticatedNavItems : navItems).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? 'text-[#8E1EFE] bg-[#8E1EFE]/10 glow-text-purple'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications Bell */}
                  <motion.button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-5 h-5" />
                    {/* Notification Badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">3</span>
                    </div>
                  </motion.button>

                  {/* Profile Avatar */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-full flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="hidden sm:block text-sm text-white font-medium">
                        {user?.username}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {showProfileDropdown && (
                        <ProfileDropdown
                          user={user!}
                          onClose={() => setShowProfileDropdown(false)}
                          onSignOut={handleSignOut}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* Sign In Button */
                <Button
                  onClick={handleSignInClick}
                  className="btn-gaming-primary flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Privy Sign-In Modal */}
      <PrivySignInModal
        isOpen={showSignInModal}
        onClose={() => {
          console.log('🔄 Closing header sign-in modal');
          setShowSignInModal(false);
        }}
        onSuccess={handleSignInSuccess}
      />

      {/* Notifications Sidebar */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationsSidebar
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}