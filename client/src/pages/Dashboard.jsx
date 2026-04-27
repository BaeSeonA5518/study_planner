import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import PhaseInfo from '../components/PhaseInfo';
import { getStudyLogs, getStats, getMood } from '../api';
import { today, SUBJECTS, getCurrentPhase } from '../utils/dates';

const SUBJECT_COLORS = {
  컴퓨터일반: { bg:'bg-violet-100', text:'text-violet-700', bar:'bg-violet-500', hex:'#7c3aed' },
  정보보호론:  { bg:'bg-cyan-100',   text:'text-cyan-700',   bar:'bg-cyan-500',   hex:'#0891b2' },
  국어:        { bg:'bg-emerald-100',text:'text-emerald-700',bar:'bg-emerald-500',hex:'#059669' },
  한국사:      { bg:'bg-amber-100',  text:'text-amber-700',  bar:'bg-amber-500',  hex:'#d97706' },
  기출문제:    { bg:'bg-pink-100',   text:'text-pink-700',   bar:'bg-pink-500',   hex:'#db2777' },
};

const MOTIVATIONS = [
  '매일 한다. 안 하는 날만 없으면 됨.',
  '느리게 가도 괜찮아. 안 가는 것만 아니면.',
  '컴일 중심. 여기서 점수 차이가 남.',
  '완벽 이해 기다리지 말고 넘어가. 2회독에서 완성.',
  '지금 타이밍이면 충분히 경쟁 가능하다.',
  '인강은 빨리 소비, 기출은 느리게 반복.',
];

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const todayStr = today();

  const load = useCallback(async () => {
    try {
      const [l, s, m] = await Promise.all([getStudyLogs(todayStr), getStats(), getMood(todayStr)]);
      setLogs(l); setStats(s); setMood(m);
    } catch (_) {}
    finally { setLoading(false); }
  }, [todayStr]);

  useEffect(() => { load(); }, [load]);

  const phase = getCurrentPhase();
  const doneCount = logs.filter(l => l.completed).length;
  const todayHours = logs.reduce((s, l) => s + parseFloat(l.study_hours || 0), 0);
  const quote = MOTIVATIONS[new Date().getDate() % MOTIVATIONS.length];

  const moodMap = {
    좋음:   { emoji:'😄', label:'컨디션 최고!', cls:'text-emerald-600' },
    보통:   { emoji:'😐', label:'평범한 하루',  cls:'text-amber-600' },
    슬럼프: { emoji:'😔', label:'슬럼프 구간',  cls:'text-red-500' },
  };

  if (loading) return (
    <div className="empty-state"><div className="empty-state-icon">⏳</div><div>로딩 중...</div></div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="page-header flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">🏠 대시보드</h1>
          <p className="page-subtitle">{new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'long' })}</p>
        </div>
        {/* 동기부여 - 한 줄 고정 */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl px-4 py-2.5 max-w-xs flex-shrink-0">
          <span className="text-violet-400 flex-shrink-0">💬</span>
          <span className="text-[13px] font-medium text-violet-700 whitespace-nowrap overflow-hidden text-ellipsis">{quote}</span>
        </div>
      </div>

      <Countdown />
      <PhaseInfo />

      {/* 오늘 현황 스탯 */}
      <p className="section-label">오늘 현황</p>
      <div className="grid grid-cols-4 gap-4 mb-6 max-lg:grid-cols-2 max-sm:grid-cols-2">
        {[
          { icon:'✅', val:`${doneCount}/${SUBJECTS.length}`, label:'오늘 완료 과목', ibg:'bg-emerald-100', icolor:'text-emerald-600', vcolor:'text-emerald-600' },
          { icon:'⏱️', val:`${todayHours.toFixed(1)}h`,       label:'오늘 공부 시간', ibg:'bg-violet-100',  icolor:'text-violet-600',  vcolor:'text-violet-700'  },
          { icon:'🔥', val:`${stats?.streak||0}일`,           label:'연속 학습',      ibg:'bg-orange-100',  icolor:'text-orange-600',  vcolor:'text-orange-600'  },
          { icon:'📚', val:`${(stats?.totalHours||0).toFixed(0)}h`, label:'누적 시간', ibg:'bg-sky-100',  icolor:'text-sky-600',     vcolor:'text-sky-700'     },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.ibg}`}><span className={s.icolor}>{s.icon}</span></div>
            <div>
              <div className={`text-2xl font-extrabold leading-none mb-0.5 ${s.vcolor}`}>{s.val}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 체크리스트 + 루틴 */}
      <div className="grid grid-cols-2 gap-5 mb-5 max-md:grid-cols-1">
        {/* 오늘 체크리스트 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">✅ 오늘 체크리스트</h3>
            <Link to="/daily" className="btn btn-secondary btn-sm">전체 보기</Link>
          </div>
          <div className="flex flex-col gap-2">
            {SUBJECTS.map(sub => {
              const log = logs.find(l => l.subject === sub.id);
              const done = log?.completed;
              const c = SUBJECT_COLORS[sub.id] || SUBJECT_COLORS.컴퓨터일반;
              return (
                <div key={sub.id} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-150
                  ${done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center text-xs text-white flex-shrink-0 transition-all
                    ${done ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}>
                    {done && '✓'}
                  </div>
                  <span className={`flex-1 text-sm font-semibold ${done ? 'text-emerald-700 line-through decoration-emerald-400' : 'text-slate-700'}`}>
                    {sub.label}
                  </span>
                  {log?.study_hours > 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>{log.study_hours}h</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <div className="progress-wrap">
              <div className="progress-fill bg-gradient-to-r from-emerald-500 to-green-400"
                   style={{ width:`${(doneCount/SUBJECTS.length)*100}%` }} />
            </div>
            <div className="text-right text-xs text-slate-400 font-semibold mt-1">
              {Math.round((doneCount/SUBJECTS.length)*100)}% 완료
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* 하루 루틴 */}
          <div className="card flex-1">
            <h3 className="font-bold text-slate-800 mb-3.5">📋 오늘 하루 루틴</h3>
            <div className="flex flex-col gap-2">
              {[
                { time:'09:00', label:'컴일 인강 + 문제',     icon:'💻', bg:'bg-violet-50', tc:'text-violet-600' },
                { time:'13:00', label:'정보보호 인강 + 복습', icon:'🔐', bg:'bg-cyan-50',   tc:'text-cyan-600'   },
                { time:'16:30', label:'국어 독해 + 문법',     icon:'📖', bg:'bg-emerald-50',tc:'text-emerald-600'},
                { time:'19:30', label:'기출 문제풀이',         icon:'📝', bg:'bg-amber-50',  tc:'text-amber-600'  },
                { time:'자기전', label:'정보보호 암기 10분',  icon:'🌙', bg:'bg-pink-50',   tc:'text-pink-600'   },
              ].map(r => (
                <div key={r.time} className={`flex items-center gap-2.5 px-3 py-2 ${r.bg} rounded-lg`}>
                  <span className="text-sm">{r.icon}</span>
                  <span className="flex-1 text-[13px] font-semibold text-slate-700">{r.label}</span>
                  <span className={`text-[11px] font-bold ${r.tc}`}>{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 컨디션 */}
          <div className="card-sm flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-slate-700 mb-1">오늘 컨디션</div>
              {mood ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{moodMap[mood.mood]?.emoji}</span>
                  <span className={`text-sm font-semibold ${moodMap[mood.mood]?.cls}`}>{moodMap[mood.mood]?.label}</span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">기록 없음</span>
              )}
            </div>
            <Link to="/daily" className="btn btn-secondary btn-sm flex-shrink-0">기록하기</Link>
          </div>
        </div>
      </div>

      {/* 집중 포인트 */}
      <div className="card mb-5">
        <h3 className="font-bold text-slate-800 mb-4">{phase.emoji} {phase.name} — 집중 포인트</h3>
        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
          <div>
            <p className="section-label">하루 목표</p>
            <ul className="flex flex-col gap-2">
              {phase.daily.map((d, i) => (
                <li key={i} className="flex gap-2 text-[13.5px] text-slate-600">
                  <span className="text-violet-500 font-bold flex-shrink-0">→</span>{d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label">핵심 전략</p>
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3.5 text-[13.5px] text-violet-700 leading-relaxed font-medium">
              💡 {phase.tip}
            </div>
          </div>
          <div>
            <p className="section-label">빠른 메뉴</p>
            <div className="flex flex-col gap-2">
              {[
                { to:'/daily',    label:'✅ 오늘 루틴 체크',  cls:'btn-primary' },
                { to:'/log',      label:'⏱️ 공부 세션 기록',  cls:'btn-secondary' },
                { to:'/recovery', label:'🚨 진도 밀릴 때',   cls:'btn-secondary' },
                { to:'/strategy', label:'🧠 과목별 전략',    cls:'btn-secondary' },
              ].map(m => (
                <Link key={m.to} to={m.to} className={`btn ${m.cls} btn-sm justify-start`}>{m.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 과목별 누적 */}
      {stats?.subjects?.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-4">📊 과목별 누적 기록</h3>
          <div className="flex flex-col gap-3">
            {stats.subjects.map(sub => {
              const maxH = Math.max(...stats.subjects.map(s => parseFloat(s.total_hours)||0), 1);
              const pct  = Math.min(100, ((parseFloat(sub.total_hours)||0)/maxH)*100);
              const c    = SUBJECT_COLORS[sub.subject] || SUBJECT_COLORS.컴퓨터일반;
              return (
                <div key={sub.subject} className="flex items-center gap-3">
                  <span className="w-20 text-sm font-semibold text-slate-600 flex-shrink-0">{sub.subject}</span>
                  <div className="flex-1 progress-wrap">
                    <div className={`progress-fill ${c.bar}`} style={{ width:`${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 min-w-[70px] text-right">
                    {parseFloat(sub.total_hours||0).toFixed(1)}h / {sub.completed_days}일
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
