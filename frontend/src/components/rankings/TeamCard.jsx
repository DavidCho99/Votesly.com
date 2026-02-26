'use client';
import { motion } from 'framer-motion';
import { Trophy, HandHeart } from 'lucide-react';
import Link from 'next/link';

export default function TeamCard({ team, rank, showFeedLink = false }) {
  const isTop3 = rank <= 3;
  const organicPerc = ((team.organic_likes || 0) / (team.total_likes || 1)) * 100;
  const boostedPerc = ((team.boosted_likes || 0) / (team.total_likes || 1)) * 100;
  
  // Custom glow calculation based on primary color
  const rgb = hexToRgb(team.primary_color) || { r: 100, g: 100, b: 100 };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      style={{
        boxShadow: `0 0 40px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
      }}
      className="relative rounded-3xl bg-[#131521]/80 backdrop-blur-xl border border-slate-800/50 overflow-hidden flex flex-col p-4 gap-4"
    >
      {/* Background Gradient Wash */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top left, ${team.primary_color} 0%, transparent 70%)`
        }}
      />
      
      {/* Top Section */}
      <div className="relative flex items-center gap-4">
        {/* Rank Badge */}
        <div className={`
          absolute -top-4 -left-4 w-10 h-10 flex items-center justify-center rounded-br-2xl text-sm font-black text-white z-10
        `} style={{ backgroundColor: team.primary_color }}>
          #{rank}
        </div>

        {/* Team Square Logo Drop-in */}
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg mt-2 ml-2"
          style={{ backgroundColor: team.primary_color, color: team.secondary_color || '#fff' }}
        >
          {team.short_name}
        </div>

        {/* Team Info */}
        <div className="flex-1 min-w-0 mt-2">
          <h3 className="text-lg font-bold text-white leading-none mb-1">
            {team.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">{team.mascot}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${team.primary_color}20`, color: team.primary_color }}>
              {team.conference}
            </span>
          </div>
        </div>

        {/* Total Likes */}
        <div className="flex flex-col items-end mt-2 pr-2">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Trophy className="w-4 h-4" />
            <span className="text-xl font-black font-mono">
              {(team.total_likes >= 1000) ? (team.total_likes / 1000).toFixed(1) + 'K' : team.total_likes}
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500">total likes</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-1 relative z-10 px-2">
        <div className="flex h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${organicPerc}%` }}
            transition={{ duration: 1, delay: rank * 0.1 }}
            className="h-full" style={{ backgroundColor: team.primary_color }} 
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${boostedPerc}%` }}
            transition={{ duration: 1, delay: rank * 0.1 }}
            className="h-full bg-slate-700"
          />
        </div>
        <div className="flex justify-between text-[10px] font-medium text-slate-500">
          <span>Organic: {(team.organic_likes >= 1000) ? (team.organic_likes/1000).toFixed(1)+'K' : (team.organic_likes || 0)}</span>
          <span>Boosted: {(team.boosted_likes >= 1000) ? (team.boosted_likes/1000).toFixed(1)+'K' : (team.boosted_likes || 0)}</span>
        </div>
      </div>

      {/* View Live Feed Button */}
      {showFeedLink && (
        <Link href={`/team/${team._id}/feed`} className="relative z-10 w-full bg-[#1A1D2D]/60 hover:bg-[#1A1D2D] border border-white/5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs font-semibold text-slate-400">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          View Live Feed
        </Link>
      )}
    </motion.div>
  );
}

// Helper to convert hex to rgb for shadow glow
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
