import React from 'react';
import { daysUntil, GUNMUWON_DATE, HANNEUNG_DATE } from '../utils/dates';

export default function Countdown() {
  const dGun = daysUntil(GUNMUWON_DATE);
  const dHan = daysUntil(HANNEUNG_DATE);

  const cards = [
    {
      label: '🏆 메인 목표',
      days:  dGun > 0 ? `D-${dGun}` : dGun === 0 ? 'D-DAY' : '완료',
      name:  '군무원 전산직 9급',
      date:  '2026년 7월 4일 (토)',
      from:  'from-violet-600',
      to:    'to-indigo-500',
      shadow:'rgba(124,58,237,0.35)',
    },
    {
      label: '📋 서브 목표',
      days:  dHan > 0 ? `D-${dHan}` : dHan === 0 ? 'D-DAY' : '완료',
      name:  '한국사능력검정 심화',
      date:  '2026년 5월 23일 (토) · 3급 목표',
      from:  'from-cyan-500',
      to:    'to-sky-400',
      shadow:'rgba(6,182,212,0.3)',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 max-sm:grid-cols-1">
      {cards.map(c => (
        <div
          key={c.name}
          className={`relative overflow-hidden rounded-3xl p-7 bg-gradient-to-br ${c.from} ${c.to}`}
          style={{ boxShadow: `0 8px 32px ${c.shadow}` }}
        >
          {/* 배경 원 장식 */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-6 w-52 h-52 rounded-full bg-white/[0.06]" />

          <p className="relative text-xs font-bold uppercase tracking-widest text-white/70 mb-2">{c.label}</p>
          <p className="relative text-6xl font-black leading-none text-white mb-3 max-sm:text-5xl">{c.days}</p>
          <p className="relative text-[15px] font-bold text-white">{c.name}</p>
          <p className="relative text-xs text-white/70 mt-1">{c.date}</p>
        </div>
      ))}
    </div>
  );
}
