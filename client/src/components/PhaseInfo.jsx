import React from 'react';
import { getCurrentPhase } from '../utils/dates';

const palette = {
  cyan:   { ring:'ring-cyan-200',   bg:'bg-cyan-50',   text:'text-cyan-700',   dot:'bg-cyan-500',   tip:'bg-cyan-100 text-cyan-700'   },
  amber:  { ring:'ring-amber-200',  bg:'bg-amber-50',  text:'text-amber-700',  dot:'bg-amber-500',  tip:'bg-amber-100 text-amber-700'  },
  green:  { ring:'ring-emerald-200',bg:'bg-emerald-50',text:'text-emerald-700',dot:'bg-emerald-500',tip:'bg-emerald-100 text-emerald-700'},
  purple: { ring:'ring-violet-200', bg:'bg-violet-50', text:'text-violet-700', dot:'bg-violet-500', tip:'bg-violet-100 text-violet-700' },
  pink:   { ring:'ring-pink-200',   bg:'bg-pink-50',   text:'text-pink-700',   dot:'bg-pink-500',   tip:'bg-pink-100 text-pink-700'    },
  orange: { ring:'ring-orange-200', bg:'bg-orange-50', text:'text-orange-700', dot:'bg-orange-500', tip:'bg-orange-100 text-orange-700' },
};

export default function PhaseInfo() {
  const phase = getCurrentPhase();
  const p = palette[phase.colorClass] || palette.purple;

  return (
    <div className={`flex items-center gap-4 ${p.bg} border ${p.ring.replace('ring-','border-')} rounded-2xl px-6 py-4 mb-6 shadow-sm flex-wrap`}>
      <span className="text-3xl flex-shrink-0">{phase.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-extrabold text-[16px] ${p.text}`}>현재 구간: {phase.name}</div>
        <div className="text-sm text-slate-600 mt-0.5">🎯 {phase.goal}</div>
        <div className="text-xs text-slate-400 mt-0.5">{phase.start} ~ {phase.end} · 하루 {phase.hours}</div>
      </div>
      <span className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full ${p.tip}`}>
        💡 {phase.tip}
      </span>
    </div>
  );
}
