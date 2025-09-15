'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Trophy, Plus, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Zap,
      label: 'Home'
    },
    {
      name: 'Challenges',
      href: '/challenges',
      icon: Trophy,
      label: 'Challenges'
    },
    {
      name: 'Create',
      href: '/create',
      icon: Plus,
      label: 'Create',
      requiresAuth: true
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      label: 'Profile',
      requiresAuth: true
    }
  ];

  // Filter items based on authentication state
  const visibleItems = navItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-gray-800/50">
      <div className="flex items-center justify-around px-4 py-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                className="flex flex-col items-center py-2 px-3 min-w-[60px]"
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: isActive ? -4 : 0,
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] shadow-glow-purple'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
                </motion.div>
                
                <motion.span
                  className={`text-xs font-medium mt-1 transition-all duration-300 ${
                    isActive
                      ? 'text-[#8E1EFE] glow-text-purple'
                      : 'text-gray-500'
                  }`}
                  animate={{
                    opacity: isActive ? 1 : 0.7,
                    scale: isActive ? 1 : 0.9,
                  }}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}