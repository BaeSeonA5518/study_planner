import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',          label: '대시보드',  icon: '🏠' },
  { to: '/daily',     label: '오늘 루틴', icon: '✅' },
  { to: '/weekly',    label: '주간 체크', icon: '📅' },
  { to: '/log',       label: '학습 기록', icon: '⏱️' },
  { to: '/strategy',  label: '과목 전략', icon: '🧠' },
  { to: '/recovery',  label: '복구 플랜', icon: '🚨' },
  { to: '/timeline',  label: '타임라인',  icon: '🗺️' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 h-16 overflow-x-auto scrollbar-hide">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 mr-4 flex-shrink-0 no-underline">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-sm shadow-sm">
            🎯
          </div>
          <span className="font-extrabold text-base bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent whitespace-nowrap">
            군무원 합격 플래너
          </span>
        </NavLink>

        {/* Nav links */}
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13.5px] font-medium whitespace-nowrap no-underline transition-all duration-150
               ${isActive
                 ? 'bg-violet-50 text-violet-700 font-semibold'
                 : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`
            }
          >
            <span className="text-sm">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
