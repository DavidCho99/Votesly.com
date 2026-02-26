'use client';
import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft, Trophy, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LikeButton from '../components/support/LikeButton';

function TeamProfileContent({ teamId }) {
  // Using Mock Data since we bypassed backend in the previous step
  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const mockTeams = [
        { _id: '1', name: 'University of Texas', short_name: 'TEX', mascot: 'Longhorns', conference: 'SEC', primary_color: '#BF5700', secondary_color: '#FFFFFF', total_likes: 3650, organic_likes: 2900, boosted_likes: 750, founded: 1883, stadium: 'DKR Texas Memorial Stadium' },
        { _id: '2', name: 'University of Alabama', short_name: 'BAMA', mascot: 'Crimson Tide', conference: 'SEC', primary_color: '#9E1B32', secondary_color: '#FFFFFF', total_likes: 7120, organic_likes: 3800, boosted_likes: 3320, founded: 1831, stadium: 'Bryant-Denny Stadium' },
        { _id: '3', name: 'Ohio State University', short_name: 'OSU', mascot: 'Buckeyes', conference: 'BIG 10', primary_color: '#BB0000', secondary_color: '#666666', total_likes: 4100, organic_likes: 3500, boosted_likes: 600, founded: 1870, stadium: 'Ohio Stadium' },
        { _id: '4', name: 'Baylor University', short_name: 'BU', mascot: 'Bears', conference: 'BIG 12', primary_color: '#154734', secondary_color: '#FFB81C', total_likes: 1820, organic_likes: 1500, boosted_likes: 320, founded: 1845, stadium: 'McLane Stadium' },
      ];
      const found = mockTeams.find(t => t._id === teamId);
      if (!found) throw new Error('Team not found');
      return found;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="animate-pulse w-12 h-12 bg-slate-800 rounded-full" />
      </div>
    );
  }

  if (!team) return notFound();

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Dynamic Header Banner */}
      <div 
        className="pt-12 pb-8 px-6 relative overflow-hidden shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${team.primary_color}dd, ${team.primary_color}99)`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/20" />
        <Link href="/" className="relative z-10 inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Leaderboard</span>
        </Link>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full mb-4 flex items-center justify-center border-2 border-white/20 shadow-xl">
             <span className="text-3xl font-black text-white">{team.short_name}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-1">
            {team.name}
          </h1>
          <p className="text-white/80 font-bold uppercase tracking-widest text-sm">
            {team.mascot} • {team.conference}
          </p>
        </div>
      </div>

      <div className="px-4 py-8 max-w-sm mx-auto space-y-6">
        {/* Voting Action Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: team.primary_color }} />
          <h2 className="text-xl font-black text-white mb-2">Support Your School</h2>
          <p className="text-slate-400 text-sm mb-6">Every vote counts towards the live leaderboard.</p>
          <div className="flex justify-center">
            <LikeButton teamId={team._id} teamColor={team.primary_color} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Trophy className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-2xl font-black text-white font-mono">{(team.total_likes || 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Votes</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <span className="text-2xl font-black text-white font-mono">{(team.organic_likes || 0).toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Organic Votes</span>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">University Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-slate-400 text-sm">Founded</span>
              <span className="text-white font-medium text-sm">{team.founded || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="text-slate-400 text-sm">Stadium</span>
              <span className="text-white font-medium text-sm">{team.stadium || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Primary Color</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-xs">{team.primary_color}</span>
                <div className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: team.primary_color }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage({ params = {} }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <TeamProfileContent teamId={params?.teamId || '1'} />
    </Suspense>
  );
}
