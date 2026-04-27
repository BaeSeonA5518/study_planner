import React, { useState } from 'react';
import { STUDY_PHASES, today, daysUntil } from '../utils/dates';
import { parseISO, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const PC = {
  cyan:   { dot:'bg-cyan-500',   ring:'ring-cyan-200',   bg:'bg-cyan-50',   border:'border-cyan-200',   text:'text-cyan-700',   tip:'bg-cyan-100',    grad:'from-cyan-500 to-sky-400'     },
  amber:  { dot:'bg-amber-500',  ring:'ring-amber-200',  bg:'bg-amber-50',  border:'border-amber-200',  text:'text-amber-700',  tip:'bg-amber-100',   grad:'from-amber-500 to-yellow-400'  },
  green:  { dot:'bg-emerald-500',ring:'ring-emerald-200',bg:'bg-emerald-50',border:'border-emerald-200',text:'text-emerald-700',tip:'bg-emerald-100', grad:'from-emerald-500 to-green-400' },
  purple: { dot:'bg-violet-500', ring:'ring-violet-200', bg:'bg-violet-50', border:'border-violet-200', text:'text-violet-700', tip:'bg-violet-100',  grad:'from-violet-600 to-indigo-500' },
  pink:   { dot:'bg-pink-500',   ring:'ring-pink-200',   bg:'bg-pink-50',   border:'border-pink-200',   text:'text-pink-700',   tip:'bg-pink-100',    grad:'from-pink-500 to-rose-400'     },
  orange: { dot:'bg-orange-500', ring:'ring-orange-200', bg:'bg-orange-50', border:'border-orange-200', text:'text-orange-700', tip:'bg-orange-100',  grad:'from-orange-500 to-amber-400'  },
};

const getStatus = (phase) => {
  const t = today();
  if (t > phase.end) return 'done';
  if (t >= phase.start) return 'active';
  return 'future';
};

export default function Timeline() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">🗺️ 학습 타임라인</h1>
        <p className="page-subtitle">4/27 ~ 7/4 전체 학습 로드맵</p>
      </div>

      {/* 전체 현황 */}
      <div className="card bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-5 max-sm:grid-cols-2">
          {[
            { label:'전체 기간', value:'69일',  icon:'📅', color:'text-violet-700' },
            { label:'군무원까지', value:`D-${Math.max(0,daysUntil('2026-07-04'))}`, icon:'🏆', color:'text-violet-700' },
            { label:'한능검까지', value:`D-${Math.max(0,daysUntil('2026-05-23'))}`, icon:'📋', color:'text-sky-600' },
            { label:'학습 구간', value:`${STUDY_PHASES.length}개`, icon:'🗺️', color:'text-emerald-600' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="text-2xl mb-1.5">{item.icon}</div>
              <div className={`text-2xl font-extrabold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* 진행 바 */}
        <div className="flex rounded-lg overflow-hidden h-3 gap-0.5">
          {STUDY_PHASES.map(phase => {
            const s = parseISO(phase.start), e = parseISO(phase.end);
            const total = STUDY_PHASES.reduce((acc, p) => acc + Math.max(1, Math.round((parseISO(p.end)-parseISO(p.start))/86400000)+1), 0);
            const days  = Math.max(1, Math.round((e-s)/86400000)+1);
            const pct   = (days/total)*100;
            const st    = getStatus(phase);
            const c     = PC[phase.colorClass] || PC.purple;
            return (
              <div key={phase.id} title={phase.name}
                   className={`${st==='future'?'bg-slate-200':c.dot} rounded-sm transition-all`}
                   style={{ flex: pct, opacity: st==='done'?0.5:1 }} />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1.5">
          <span>4/27 시작</span><span>5/23 한능검</span><span>7/4 군무원 🏆</span>
        </div>
      </div>

      {/* 타임라인 */}
      <div className="timeline">
        {STUDY_PHASES.map(phase => {
          const status = getStatus(phase);
          const c      = PC[phase.colorClass] || PC.purple;
          const active = status === 'active';
          const done   = status === 'done';
          const open   = expanded === phase.id;

          return (
            <div key={phase.id} className="timeline-item">
              {/* 타임라인 점 */}
              <div className={`timeline-dot w-3.5 h-3.5 border-2 ${c.dot.replace('bg-','border-')}
                ${active ? `${c.dot} ring-4 ${c.ring} !w-4 !h-4` : done ? c.dot : 'bg-white'}`} />

              {/* 카드 */}
              <div
                onClick={() => setExpanded(open ? null : phase.id)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all duration-200 select-none
                  ${active ? `${c.bg} ${c.border} shadow-md` : done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-card hover:shadow-card-hover hover:border-slate-300'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 font-medium mb-1">
                      {format(parseISO(phase.start),'M/d',{locale:ko})}
                      {phase.start!==phase.end && ` ~ ${format(parseISO(phase.end),'M/d',{locale:ko})}`}
                      {' · '}{phase.hours}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{phase.emoji}</span>
                      <span className={`font-extrabold text-[15px] ${active ? c.text : done ? 'text-slate-400' : 'text-slate-800'}`}>
                        {phase.name}
                      </span>
                      {active && <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${c.dot} text-white`}>진행 중</span>}
                      {done   && <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">완료 ✓</span>}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">🎯 {phase.goal}</div>
                  </div>
                  <span className="text-slate-300 text-sm mt-1 flex-shrink-0">{open ? '▲' : '▼'}</span>
                </div>

                {open && (
                  <div className={`mt-4 pt-4 border-t ${c.border} grid grid-cols-2 gap-4 max-sm:grid-cols-1`}>
                    <div>
                      <p className="section-label">하루 할 것</p>
                      <ul className="flex flex-col gap-1.5">
                        {phase.daily.map((d, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-600">
                            <span className={`${c.text} font-bold flex-shrink-0`}>→</span>{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="section-label">핵심 팁</p>
                      <div className={`${c.tip} border ${c.border} rounded-xl p-3 text-sm ${c.text} leading-relaxed font-medium`}>
                        💡 {phase.tip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* D-DAY 전략 */}
      <div className="card mt-4 bg-gradient-to-br from-slate-50 to-violet-50 border-violet-200">
        <h3 className="font-extrabold text-xl text-slate-800 mb-4">🎯 D-DAY 시험 전략 (7월 4일)</h3>
        <div className="grid grid-cols-4 gap-3 mb-4 max-lg:grid-cols-2">
          {[
            { time:'시간 배분', items:['국어 20~25분','컴일 25~30분','정보보호 25~30분'], bg:'bg-violet-50', border:'border-violet-200', tc:'text-violet-700' },
            { time:'1회독 전략', items:['아는 문제 즉시 체크','헷갈리면 표시 후 넘기기','집착 금지!'], bg:'bg-cyan-50', border:'border-cyan-200', tc:'text-cyan-700' },
            { time:'2회독 전략', items:['표시한 문제만 재검토','30초~1분 후 찍기','미련 없이 제출'], bg:'bg-emerald-50', border:'border-emerald-200', tc:'text-emerald-700' },
            { time:'멘탈 관리', items:['어려운 건 남들도 어려워','아는 것만 다 맞추자','침착하게!'], bg:'bg-amber-50', border:'border-amber-200', tc:'text-amber-700' },
          ].map(s => (
            <div key={s.time} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
              <div className={`font-bold text-sm ${s.tc} mb-2.5`}>{s.time}</div>
              {s.items.map((item, i) => (
                <div key={i} className="flex gap-2 text-[13px] text-slate-600 mb-1">
                  <span className={`${s.tc} font-bold flex-shrink-0`}>→</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="alert alert-info !mb-0">
          🔥 시험은 "지식 싸움"이 아니라 <strong>"운영 싸움"</strong>이다! 마킹은 5~10문제 단위로, 찍을 땐 한 번호로 통일.
        </div>
      </div>
    </div>
  );
}
