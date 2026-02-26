'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.endsWith('.edu')) {
      toast.error('Please use a valid .edu student email to verify your identity.');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email);
      toast.success('Magic link sent! Check your student email inbox.');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950">
      <div className="absolute inset-0 bg-blue-900/10 blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm glass-panel p-8 rounded-3xl relative z-10 text-center"
      >
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <GraduationCap className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Student Login</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Verify your student status with your official `<span className="text-amber-400 font-mono">.edu</span>` email to start voting.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">School Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500 placeholder-zinc-600 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.includes('@')}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-zinc-950 font-black py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Sending Link...' : 'Send Magic Link'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
          <ShieldCheck className="w-4 h-4 text-zinc-400" />
          <span>We never send spam. Secure passwordless login.</span>
        </div>
      </motion.div>
    </div>
  );
}
