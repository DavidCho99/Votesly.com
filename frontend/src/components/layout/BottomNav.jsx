'use client';
import { Home, Trophy, HandHeart, Zap, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Rankings', path: '/rankings', icon: Trophy },
    { name: 'Vote', path: '/support', icon: HandHeart },
    { name: 'Boost', path: '/shop', icon: Zap },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0F131F]/90 backdrop-blur-3xl border-t border-white/5 select-none z-50">
      <div className="flex justify-around items-center h-16 w-full max-w-3xl mx-auto relative px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path} className="relative flex flex-col items-center justify-center flex-1 h-full pt-1">
              <motion.div whileTap={{ scale: 0.9 }} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}>
                {/* Top Active Bar Glow */}
                {isActive && (
                  <motion.div layoutId="activeTab" className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
