'use client';
import { useState, Suspense } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Zap, ShieldCheck, CreditCard, ChevronDown, HandHeart } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { redirect, useSearchParams } from 'next/navigation';

function ShopContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [selectedTeam, setSelectedTeam] = useState(searchParams.get('team') || '');
  const [loadingPkg, setLoadingPkg] = useState(null);

  const teams = [
    { _id: '1', name: 'University of Texas', short_name: 'TEX', mascot: 'Longhorns', conference: 'SEC', primary_color: '#BF5700', secondary_color: '#FFFFFF', total_likes: 3650 },
    { _id: '2', name: 'University of Alabama', short_name: 'BAMA', mascot: 'Crimson Tide', conference: 'SEC', primary_color: '#9E1B32', secondary_color: '#FFFFFF', total_likes: 7120 },
  ];

  const packages = {
    'pkg_100': { amount: 100, price: 499 },
    'pkg_1000': { amount: 1000, price: 3999 }
  };

  const handleCheckout = async (pkgId) => {
    if (!user) {
      toast.error('You must log in to purchase a boost.');
      return;
    }
    if (!selectedTeam) {
      toast.error('Please select a team to boost first.');
      return;
    }

    setLoadingPkg(pkgId);
    try {
      const token = await user.getIdToken();
      // Initialize Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_fake');
      
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payments/checkout`, {
        packageId: pkgId,
        teamId: selectedTeam
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      toast.error('Checkout failed. Please try again.');
      setLoadingPkg(null);
    }
  };

  const activeTeamInfo = teams.find(t => t._id === selectedTeam);

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Search Params Handlers */}
      {searchParams.get('success') && (
        <div className="bg-green-500/20 text-green-400 p-4 text-center text-sm font-bold border-b border-green-500/20 mb-4">
          Boost successful! Your votes have been added. Let&apos;s go! 🚀
        </div>
      )}

      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
          <Zap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Team <span className="text-gradient-fire">Boosts</span></h1>
        <p className="text-zinc-400 text-sm max-w-xs mx-auto">
          Skip the cooldown. Drop massive vote bombs to skyrocket your team up the leaderboard.
        </p>
      </div>

      <div className="px-6 max-w-sm mx-auto space-y-8 relative z-10">
        
        {/* Team Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Target Team</label>
          <div className="relative">
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full appearance-none bg-zinc-900 border border-zinc-700 rounded-xl py-4 pl-4 pr-12 text-white font-bold outline-none focus:border-amber-500 transition-all cursor-pointer"
            >
              <option value="" disabled>Choose a Team...</option>
              {teams.map(team => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
          </div>
          
          {activeTeamInfo && (
            <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black" style={{ backgroundColor: activeTeamInfo.primary_color, color: activeTeamInfo.secondary_color }}>
                {activeTeamInfo.short_name}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none mb-1">Boosting {activeTeamInfo.short_name}</p>
                <p className="text-xs text-zinc-400 font-medium">Currently at {activeTeamInfo.total_likes.toLocaleString()} votes</p>
              </div>
            </div>
          )}
        </div>

        {/* Packages Grid */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Select Boost Size</label>
          
          {Object.entries(packages).map(([pkgId, pkg]) => (
            <div key={pkgId} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative glass-panel rounded-2xl p-1 flex shadow-xl">
                <div className="flex-1 p-5 pr-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <HandHeart className="w-5 h-5 text-amber-500" />
                    <span className="text-2xl font-black text-white">{pkg.amount}</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Instant Votes</span>
                </div>
                
                <button
                  onClick={() => handleCheckout(pkgId)}
                  disabled={loadingPkg === pkgId || !selectedTeam}
                  className="flex flex-col items-center justify-center px-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:border-amber-500/50 transition-all disabled:opacity-50 group-hover:border-amber-500/30"
                >
                  {loadingPkg === pkgId ? (
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-1" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-amber-500 mb-1" />
                  )}
                  <span className="text-lg font-black text-white">${(pkg.price / 100).toFixed(2)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Secure Message */}
        <div className="flex items-center justify-center gap-2 pt-4 text-xs font-semibold text-zinc-600">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure payments via Stripe</span>
        </div>

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <ShopContent />
    </Suspense>
  );
}
