'use client';
import { useState, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import LikeButton from '../components/support/LikeButton';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

function SupportContent() {
  const searchParams = useSearchParams();
  const initialTeamId = searchParams.get('team');
  const [selectedTeam, setSelectedTeam] = useState(initialTeamId || '');
  const { user } = useAuth();

  const teams = [
    { _id: '1', name: 'University of Texas', short_name: 'TEX', mascot: 'Longhorns', conference: 'SEC', primary_color: '#BF5700', secondary_color: '#FFFFFF', total_likes: 3650 },
    { _id: '2', name: 'University of Alabama', short_name: 'BAMA', mascot: 'Crimson Tide', conference: 'SEC', primary_color: '#9E1B32', secondary_color: '#FFFFFF', total_likes: 7120 },
    { _id: '3', name: 'Ohio State University', short_name: 'OSU', mascot: 'Buckeyes', conference: 'BIG 10', primary_color: '#BB0000', secondary_color: '#666666', total_likes: 4100 },
    { _id: '4', name: 'Baylor University', short_name: 'BU', mascot: 'Bears', conference: 'BIG 12', primary_color: '#154734', secondary_color: '#FFB81C', total_likes: 1820 },
  ];

  const activeTeamInfo = teams.find(t => t._id === selectedTeam);

  // Skipping auth guard for local preview mode

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Cast Your <span className="text-gradient-fire">Vote</span></h1>
        <p className="text-zinc-400 text-sm">Every vote drops immediately onto the live leaderboard.</p>
      </div>

      <div className="px-6 max-w-sm mx-auto w-full space-y-8 relative z-10">
        
        {/* Team Selector Placeholder */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Select Your School</label>
          <div className="relative">
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full appearance-none glass-panel border border-zinc-700 rounded-xl py-4 pl-4 pr-12 text-white font-bold outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
            >
              <option value="" disabled>Choose a Team...</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>
                  {team.name} ({team.short_name})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Action Button */}
        {activeTeamInfo ? (
          <div className="pt-8 flex flex-col items-center">
            <LikeButton teamId={activeTeamInfo._id} teamColor={activeTeamInfo.primary_color} />
          </div>
        ) : (
          <div className="pt-12 flex flex-col items-center justify-center opacity-50">
            <div className="w-48 h-48 rounded-full border-4 border-dashed border-zinc-800 flex items-center justify-center">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm text-center px-4">Select<br/>Team Above</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <SupportContent />
    </Suspense>
  );
}
