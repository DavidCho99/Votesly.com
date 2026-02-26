'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';
import TeamCard from '../components/rankings/TeamCard';
import ConferenceFilter from '../components/rankings/ConferenceFilter';

export default function Page() {
  const [selectedConference, setSelectedConference] = useState('all');
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);

  const [teams, setTeams] = useState([
    { _id: '1', name: 'University of Texas', short_name: 'TEX', mascot: 'Longhorns', conference: 'SEC', primary_color: '#BF5700', secondary_color: '#FFFFFF', total_likes: 3650 },
    { _id: '2', name: 'University of Alabama', short_name: 'BAMA', mascot: 'Crimson Tide', conference: 'SEC', primary_color: '#9E1B32', secondary_color: '#FFFFFF', total_likes: 7120 },
    { _id: '3', name: 'Ohio State University', short_name: 'OSU', mascot: 'Buckeyes', conference: 'BIG 10', primary_color: '#BB0000', secondary_color: '#666666', total_likes: 4100 },
    { _id: '4', name: 'Baylor University', short_name: 'BU', mascot: 'Bears', conference: 'BIG 12', primary_color: '#154734', secondary_color: '#FFB81C', total_likes: 1820 },
  ]);
  const isLoading = false;

  const filteredTeams = selectedConference === 'all'
    ? [...teams].sort((a, b) => b.total_likes - a.total_likes)
    : [...teams].filter(t => t.conference === selectedConference).sort((a, b) => b.total_likes - a.total_likes);

  const totalLikes = teams.reduce((sum, t) => sum + (t.total_likes || 0), 0);

  useEffect(() => {
    const handleTouchStart = (e) => { if (window.scrollY === 0) touchStartY.current = e.touches[0].clientY; };
    const handleTouchMove = (e) => {
      if (window.scrollY === 0 && !isRefreshing) {
        const distance = e.touches[0].clientY - touchStartY.current;
        if (distance > 0) { setPullDistance(Math.min(distance, 100)); if (distance > 10) e.preventDefault(); }
      }
    };
    const handleTouchEnd = async () => {
      if (pullDistance > 80 && !isRefreshing) {
        setIsRefreshing(true);
        setTimeout(() => { setIsRefreshing(false); setPullDistance(0); }, 1000);
      } else { setPullDistance(0); }
    };
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing]);

  return (
    <div className="pb-24">
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: pullDistance > 0 ? pullDistance - 40 : 10 }}
            exit={{ opacity: 0, y: -20 }} className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
            <div className="bg-zinc-800/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 border border-zinc-700 shadow-2xl">
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-white text-sm font-bold tracking-wider">
                {isRefreshing ? 'Refreshing...' : pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative overflow-hidden bg-slate-950 pb-8 pt-10">
        {/* Subtle top warm glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative px-4 text-center max-w-lg mx-auto flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#b48231]/20 border border-[#b48231]/30 rounded-full text-amber-500 text-xs font-bold tracking-wide mb-6">
            <Trophy className="w-3.5 h-3.5" /> Live Rankings
          </div>
          
          <h1 className="text-[40px] leading-[1.1] font-black text-white mb-4 tracking-tight">
            Fan Support <span className="text-[#FFC107]">Leaderboard</span>
          </h1>
          
          <p className="text-slate-400 text-[15px] leading-relaxed max-w-[280px] mx-auto mb-10 font-medium">
            See which teams have the most passionate fans. Tap to support your team!
          </p>

          <div className="flex justify-center items-center gap-8 w-full max-w-xs mx-auto">
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-white">{teams.length}</p>
              <p className="text-slate-400 text-xs font-medium mt-1">Teams</p>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-[#FFC107]">
                {totalLikes >= 1000000 ? (totalLikes/1000000).toFixed(1)+'M' : totalLikes >= 1000 ? (totalLikes/1000).toFixed(1)+'K' : totalLikes.toLocaleString()}
              </p>
              <p className="text-slate-400 text-xs font-medium mt-1">Total Likes</p>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center flex-1">
              <p className="text-2xl font-black text-white">3</p>
              <p className="text-slate-400 text-xs font-medium mt-1">Conferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-[#0A0F1A] px-4 py-5 flex justify-center border-b border-slate-800/50">
        <ConferenceFilter selected={selectedConference} onChange={setSelectedConference} />
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="space-y-4">{[...Array(10)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />)}</div>
        ) : (
          <div className="space-y-4">
            {filteredTeams.map((team, index) => (
              <TeamCard key={team._id} team={team} rank={index + 1} showFeedLink={true} />
            ))}
            {filteredTeams.length === 0 && <div className="text-center py-12 text-zinc-500 font-medium">No teams found in this conference</div>}
          </div>
        )}
      </div>
    </div>
  );
}
