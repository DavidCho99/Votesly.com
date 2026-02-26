'use client';
import { motion } from 'framer-motion';

export default function ConferenceFilter({ selected, onChange }) {
  const tabs = [
    { id: 'all', label: 'All Teams' },
    { id: 'SEC', label: 'SEC' },
    { id: 'BIG 10', label: 'BIG 10' },
    { id: 'BIG 12', label: 'BIG 12' }
  ];

  return (
    <div className="flex justify-center gap-2 pb-2">
      <div className="flex bg-slate-950/40 p-1.5 rounded-2xl gap-1">
        {tabs.map(tab => {
          const isActive = selected === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative px-6 py-2 rounded-xl text-sm font-bold transition-all
                ${isActive ? 'text-slate-950 shadow-md' : 'text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="confFilterBubble"
                  className="absolute inset-0 bg-amber-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
