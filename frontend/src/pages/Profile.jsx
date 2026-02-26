'use client';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { LogOut, Award, Zap, HandHeart, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-white font-mono">{value}</p>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const profile = { user: { uid: 'mock-uid-123456' }, stats: { totalVotes: 512 } };

  const badges = [
    { _id: 'b1', badge_type: 'top_fan', earned_date: new Date().toISOString() },
    { _id: 'b2', badge_type: 'consistent_supporter', earned_date: new Date().toISOString() }
  ];

  // Skip auth guard for local preview mode
  /* 
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500 font-bold uppercase">Not Logged In</p>
      </div>
    );
  }
  */

  const dbUser = profile?.user || { uid: 'preview-uid' };
  const mockEmail = 'student@university.edu';
  const stats = profile?.stats || { totalVotes: 0 };

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">Fan Profile</h1>
            <p className="text-zinc-400 font-medium">#{dbUser?.uid?.slice(0,6) || user.uid.slice(0,6)}</p>
          </div>
          <button 
            onClick={logout}
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Verified Email</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{mockEmail}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-green-500/10 text-green-400 border border-green-500/20">
              Verified
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-sm mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          <StatCard 
            label="Total Votes Cast" 
            value={stats.totalVotes.toLocaleString()} 
            icon={HandHeart} 
            colorClass="bg-amber-500/10 text-amber-500 border border-amber-500/20" 
          />
          <StatCard 
            label="Badges Earned" 
            value={badges.length} 
            icon={Trophy} 
            colorClass="bg-blue-500/10 text-blue-500 border border-blue-500/20" 
          />
        </div>

        {/* Badges Section */}
        <div>
          <h2 className="text-lg font-black text-white mb-4">Your Badges</h2>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {badges.map(badge => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={badge._id} 
                  className="bg-zinc-900 border border-amber-500/20 rounded-xl p-3 text-center flex flex-col items-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Award className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-white uppercase">{badge.badge_type.replace('_', ' ')}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{new Date(badge.earned_date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 glass-panel rounded-2xl border-dashed border-zinc-700">
              <Award className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-500 font-bold text-sm">No badges yet.</p>
              <p className="text-zinc-600 text-xs mt-1">Start voting to earn recognition!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
