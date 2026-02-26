'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandHeart } from 'lucide-react';
import { useSocket } from '../SocketProvider';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export default function LikeButton({ teamId, teamColor }) {
  const [cooldown, setCooldown] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isPressing, setIsPressing] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVote = async () => {
    /* Bypass Auth Guard for Mock Preview
    if (!user) {
      toast.error('You must be logged in to vote!');
      return;
    }
    */
    if (cooldown > 0) return;

    // Trigger visual effects
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      angle: (i * 30) * (Math.PI / 180),
      color: teamColor || '#f59e0b'
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => setParticles([]), 1000);

    // Set 5s client cooldown immediately
    setCooldown(5);

    try {
      if (socket) {
        socket.emit('vote', {
          teamId,
          userId: user?.uid || 'anonymous_mock',
          type: 'organic',
          amount: 1
        });
      }
      
      toast.success('Vote counted!', { style: { background: teamColor, borderColor: teamColor, color: '#fff' } });
    } catch (error) {
      console.error(error);
      toast.error('Failed to register vote.');
    }
  };

  return (
    <div className="relative flex justify-center items-center py-8">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: Math.random() * 1.5 + 0.5, 
              x: Math.cos(p.angle) * 100, 
              y: Math.sin(p.angle) * 100 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-3 h-3 rounded-full z-0"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </AnimatePresence>

      <motion.button
        onPointerDown={() => setIsPressing(true)}
        onPointerUp={() => setIsPressing(false)}
        onPointerLeave={() => setIsPressing(false)}
        onClick={handleVote}
        disabled={cooldown > 0}
        animate={{ scale: isPressing && cooldown === 0 ? 0.95 : 1 }}
        style={{
          boxShadow: cooldown === 0 ? `0 0 40px ${teamColor}40` : 'none'
        }}
        className={`
          relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center gap-3 transition-colors disabled:opacity-50 overflow-hidden
          ${cooldown > 0 ? 'bg-zinc-800 text-zinc-500 border-zinc-700' : 'text-zinc-950'}
        `}
      >
        {/* Dynamic Background */}
        {cooldown === 0 && (
          <div className="absolute inset-0" style={{ backgroundColor: teamColor }}>
            <div className="absolute inset-0 bg-white/20" style={{ mixBlendMode: 'overlay' }} />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center">
          <HandHeart className={`w-12 h-12 mb-2 ${cooldown === 0 ? 'animate-bounce' : ''}`} />
          <span className="text-2xl font-black uppercase tracking-widest">
            {cooldown > 0 ? cooldown : 'VOTE'}
          </span>
          {cooldown === 0 && <span className="text-xs font-bold opacity-80 uppercase">Tap to Support</span>}
          {cooldown > 0 && <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Cooldown active</span>}
        </div>
      </motion.button>
    </div>
  );
}
