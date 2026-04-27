import React, { useEffect, useState, useCallback } from 'react';
import { getWeeklyLogs, upsertStudyLog } from '../api';
import { getMonday, getWeekDates, SUBJECTS } from '../utils/dates';
import { format, addWeeks, subWeeks, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const GOALS = { 컴퓨터일반:5, 정보보호론:5, 국어:5, 한국사:3, 기출문제:4 };
const DOT   = { 컴퓨터일반:'bg-violet-500', 정보보호론:'bg-cyan-500', 국어:'bg-emerald-500', 한국사:'bg-amber-500', 기출문제:'bg-pink-500' };
const BAR   = { 컴퓨터일반:'bg-violet-500', 정보보호론:'bg-cyan-500', 국어:'bg-emerald-500', 한국사:'bg-amber-500', 기출문제:'bg-pink-500' };

export default function WeeklyCheck() {
  const [weekStart, setWeekStart] = useState(getMonday());
  const [logs, setLogs] = useState({});
  const [saving, setSaving] = useState({});

  const load = useCallback(async () => {
    try {
      const data = await getWeeklyLogs(weekStart);
      const map = {};
      data.forEach(r => {
        if (!map[r.subject]) map[r.subject] = {};
        map[r.subject][r.date] = r;
      });
      setLogs(map);
    } catch(_) {}
  }, [weekStart]);

  useEffect(() => { load(); }, [load]);

  const dates = getWeekDates(weekStart);

  const toggleCheck = async (subject, date) => {
    const cur = logs[subject]?.[date];
    const key = `${subject}_${date}`;
    setSaving(s => ({ ...s, [key]: true }));
    try {
      const res = await upsertStudyLog({ date, subject, completed:!cur?.completed, study_hours:cur?.study_hours??0, notes:cur?.notes??'' });
      setLogs(l => ({ ...l, [subject]: { ...l[subject], [date]: res } }));
    } catch(_) {}
    setSaving(s => ({ ...s, [key]: false }));
  };

  const getDayInfo = d => {
    const dt     = parseISO(d);
    const isToday = d === format(new Date(), 'yyyy-MM-dd');
    const dow    = dt.getDay();
    return { day: format(dt,'EEE',{locale:ko}), date: format(dt,'d'), isToday, isWeekend: dow===0||dow===6 };
  };

  const weekStats = SUBJECTS.map(sub => {
    const sl = logs[sub.id] || {};
    const doneDays   = dates.filter(d => sl[d]?.completed).length;
    const totalHours = dates.reduce((s,d) => s + parseFloat(sl[d]?.study_hours||0), 0);
    const goal = GOALS[sub.id] || 5;
    return { ...sub, doneDays, totalHours, goal, rate: Math.min(100,(doneDays/goal)*100) };
  });

  const totalDone = dates.filter(d => SUBJECTS.some(s => logs[s.id]?.[d]?.completed)).length;
  const weekLabel = () => `${format(parseISO(weekStart),'M월 d일',{locale:ko})} ~ ${format(parseISO(dates[6]),'M월 d일 (EEE)',{locale:ko})}`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">📅 주간 체크표</h1>
        <p className="page-subtitle">과목별 주간 목표 달성 현황</p>
      </div>

      {/* 주 네비게이션 */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setWeekStart(format(subWeeks(parseISO(weekStart),1),'yyyy-MM-dd'))} className="btn btn-secondary btn-sm">← 이전</button>
        <div className="flex-1 text-center font-bold text-slate-700">{weekLabel()}</div>
        <button onClick={() => setWeekStart(format(addWeeks(parseISO(weekStart),1),'yyyy-MM-dd'))} className="btn btn-secondary btn-sm">다음 →</button>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-4 gap-4 mb-6 max-sm:grid-cols-2">
        <div className="card-sm text-center bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200">
          <div className="text-2xl font-extrabold text-violet-700">{totalDone}/7</div>
          <div className="text-xs text-violet-500 font-semibold mt-0.5">공부한 날</div>
        </div>
        {weekStats.slice(0,3).map(s => (
          <div key={s.id} className="card-sm text-center">
            <div className={`text-xl font-extrabold ${s.doneDays>=s.goal?'text-emerald-600':'text-slate-700'}`}>{s.doneDays}/{s.goal}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5 mb-1.5">{s.id}</div>
            <div className="progress-wrap"><div className={`progress-fill ${BAR[s.id]}`} style={{width:`${s.rate}%`}} /></div>
          </div>
        ))}
      </div>

      {/* 체크 테이블 */}
      <div className="card !p-0 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="weekly-table">
            <thead>
              <tr>
                <th className="!pl-5 min-w-[110px]">과목</th>
                {dates.map(d => {
                  const { day, date: dt, isToday, isWeekend } = getDayInfo(d);
                  return (
                    <th key={d} className={`${isToday?'!bg-violet-50 !text-violet-600':isWeekend?'text-slate-400':''}`}>
                      <div className="text-[10px]">{day}</div>
                      <div className={`text-lg font-extrabold ${isToday?'text-violet-600':''}`}>{dt}</div>
                      {isToday && <div className="text-[9px] text-violet-500 font-bold tracking-wide">TODAY</div>}
                    </th>
                  );
                })}
                <th>달성</th>
                <th>시간</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map(sub => {
                const stat = weekStats.find(s => s.id === sub.id);
                const met  = stat.doneDays >= stat.goal;
                return (
                  <tr key={sub.id}>
                    <td className="!pl-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${DOT[sub.id]} flex-shrink-0`} />
                        <span className="text-[13px]">{sub.id}</span>
                      </div>
                    </td>
                    {dates.map(d => {
                      const log  = logs[sub.id]?.[d];
                      const done = !!log?.completed;
                      const key  = `${sub.id}_${d}`;
                      const { isToday } = getDayInfo(d);
                      return (
                        <td key={d} className={isToday?'bg-violet-50/40':''}>
                          <button onClick={() => toggleCheck(sub.id, d)} disabled={saving[key]}
                            className={`check-btn ${done?'checked':''}`}>
                            {done && <span className="text-xs font-bold">✓</span>}
                          </button>
                        </td>
                      );
                    })}
                    <td>
                      <span className={`text-sm font-bold ${met?'text-emerald-600':stat.doneDays>=Math.floor(stat.goal*0.6)?'text-amber-600':'text-red-500'}`}>
                        {stat.doneDays}/{stat.goal}
                      </span>
                    </td>
                    <td><span className="text-xs text-slate-400 font-medium">{stat.totalHours.toFixed(1)}h</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 목표 기준 */}
      <div className="card">
        <h3 className="font-bold text-slate-800 mb-4">📊 주간 목표 기준</h3>
        <div className="grid grid-cols-5 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2">
          {weekStats.map(s => {
            const met = s.doneDays >= s.goal;
            return (
              <div key={s.id} className={`p-3.5 rounded-xl border transition-all duration-150 ${met?'bg-emerald-50 border-emerald-200':'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-2 h-2 rounded-full ${DOT[s.id]}`} />
                  <span className="text-xs font-bold text-slate-600">{s.id}</span>
                  {met && <span className="ml-auto text-emerald-500 text-sm">✅</span>}
                </div>
                <div className={`text-lg font-extrabold ${met?'text-emerald-700':'text-violet-600'}`}>주 {s.goal}일</div>
                <div className="progress-wrap mt-2">
                  <div className={`progress-fill ${met?'bg-emerald-500':BAR[s.id]}`} style={{width:`${s.rate}%`}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="alert alert-info mt-4">
        <strong>✅ 정상 진행 기준:</strong> 주간 체크 70% 이상이면 OK! 컴일/정보보호/국어 주 5일, 한국사 주 3일, 기출 주 4일 이상이 목표야.
      </div>
    </div>
  );
}
