import React, { useEffect, useState, useCallback } from 'react';
import { getStudyLogs, upsertStudyLog, getMood, setMood } from '../api';
import { today, SUBJECTS } from '../utils/dates';

const MOODS = [
  { id:'좋음',   emoji:'😄', bg:'bg-emerald-500', border:'border-emerald-500' },
  { id:'보통',   emoji:'😐', bg:'bg-amber-500',   border:'border-amber-500'   },
  { id:'슬럼프', emoji:'😔', bg:'bg-red-500',     border:'border-red-500'     },
];

const SC = {
  컴퓨터일반: { bg:'bg-violet-50',  border:'border-violet-200', dot:'bg-violet-500',  done:'bg-violet-100 border-violet-300' },
  정보보호론:  { bg:'bg-cyan-50',    border:'border-cyan-200',   dot:'bg-cyan-500',    done:'bg-cyan-100 border-cyan-300'     },
  국어:        { bg:'bg-emerald-50', border:'border-emerald-200',dot:'bg-emerald-500', done:'bg-emerald-100 border-emerald-300'},
  한국사:      { bg:'bg-amber-50',   border:'border-amber-200',  dot:'bg-amber-500',   done:'bg-amber-100 border-amber-300'   },
  기출문제:    { bg:'bg-pink-50',    border:'border-pink-200',   dot:'bg-pink-500',    done:'bg-pink-100 border-pink-300'     },
};

export default function DailyRoutine() {
  const [date, setDate] = useState(today());
  const [logs, setLogs] = useState({});
  const [mood, setMoodState] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [saving, setSaving] = useState({});

  const load = useCallback(async () => {
    try {
      const [l, m] = await Promise.all([getStudyLogs(date), getMood(date)]);
      const map = {};
      l.forEach(log => { map[log.subject] = log; });
      setLogs(map);
      if (m) { setMoodState(m.mood); setMoodNote(m.notes || ''); }
      else { setMoodState(null); setMoodNote(''); }
    } catch(_) {}
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (subject) => {
    const cur = logs[subject];
    setSaving(s => ({ ...s, [subject]: true }));
    try {
      const res = await upsertStudyLog({ date, subject, completed: !cur?.completed, study_hours: cur?.study_hours??0, notes: cur?.notes??'' });
      setLogs(l => ({ ...l, [subject]: res }));
    } catch(_) {}
    setSaving(s => ({ ...s, [subject]: false }));
  };

  const updateHours = async (subject, hours) => {
    const cur = logs[subject];
    try {
      const res = await upsertStudyLog({ date, subject, completed: cur?.completed??false, study_hours: parseFloat(hours)||0, notes: cur?.notes??'' });
      setLogs(l => ({ ...l, [subject]: res }));
    } catch(_) {}
  };

  const updateNotes = async (subject, notes) => {
    const cur = logs[subject];
    try {
      const res = await upsertStudyLog({ date, subject, completed: cur?.completed??false, study_hours: cur?.study_hours??0, notes });
      setLogs(l => ({ ...l, [subject]: res }));
    } catch(_) {}
  };

  const saveMood = async (m) => {
    setMoodState(m);
    try { await setMood({ date, mood: m, notes: moodNote }); } catch(_) {}
  };

  const doneCount  = SUBJECTS.filter(s => logs[s.id]?.completed).length;
  const totalHours = SUBJECTS.reduce((sum, s) => sum + parseFloat(logs[s.id]?.study_hours||0), 0);
  const pct        = Math.round((doneCount / SUBJECTS.length) * 100);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">✅ 오늘 루틴</h1>
          <p className="page-subtitle">과목별 공부 현황을 체크하세요</p>
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input !w-auto" />
      </div>

      {/* 진행률 배너 */}
      <div className={`rounded-2xl p-5 mb-6 border ${doneCount===SUBJECTS.length ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' : 'bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-extrabold text-slate-800">
              {doneCount===SUBJECTS.length ? '🎉 오늘 완벽 달성!' : `${doneCount} / ${SUBJECTS.length} 완료`}
            </div>
            <div className="text-sm text-slate-500 mt-0.5">
              총 공부 시간 <strong className="text-violet-700">{totalHours.toFixed(1)}시간</strong>
            </div>
          </div>
          <span className="text-4xl">{doneCount===0?'💤':doneCount<3?'💪':doneCount<5?'🔥':'🏆'}</span>
        </div>
        <div className="progress-wrap h-2.5">
          <div className={`progress-fill ${doneCount===SUBJECTS.length?'bg-gradient-to-r from-emerald-500 to-green-400':'bg-gradient-to-r from-violet-600 to-indigo-500'}`}
               style={{ width:`${pct}%` }} />
        </div>
      </div>

      {/* 과목 카드 */}
      <p className="section-label">과목별 체크</p>
      <div className="flex flex-col gap-3 mb-8">
        {SUBJECTS.map(sub => {
          const log  = logs[sub.id] || {};
          const done = !!log.completed;
          const c    = SC[sub.id] || SC.컴퓨터일반;
          return (
            <div key={sub.id} className={`bg-white border-2 rounded-2xl p-5 shadow-card transition-all duration-200 ${done ? c.done : c.border + ' hover:border-slate-300'}`}>
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => toggle(sub.id)}
                  disabled={saving[sub.id]}
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-white flex-shrink-0 transition-all cursor-pointer
                    ${done ? 'bg-emerald-500 border-emerald-500 shadow-sm' : 'bg-white border-slate-300 hover:border-emerald-400'}`}
                >
                  {done && <span className="text-xs font-bold">✓</span>}
                </button>
                <div className={`w-2.5 h-2.5 rounded-full ${c.dot} flex-shrink-0`} />
                <span className={`flex-1 font-bold text-[15px] ${done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{sub.label}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs text-slate-400 font-medium">공부시간</span>
                  <input
                    type="number" min="0" max="24" step="0.5"
                    value={log.study_hours || ''}
                    onChange={e => updateHours(sub.id, e.target.value)}
                    placeholder="0"
                    className="hours-input"
                  />
                  <span className="text-xs text-slate-400">h</span>
                </div>
              </div>
              <div className="mt-3 pl-[54px]">
                <input
                  type="text"
                  placeholder={`${sub.id} 공부 메모 (선택)`}
                  value={log.notes || ''}
                  onChange={e => updateNotes(sub.id, e.target.value)}
                  className="form-input text-[13px]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 컨디션 */}
      <p className="section-label">오늘 컨디션</p>
      <div className="card mb-4">
        <h3 className="font-bold text-slate-800 mb-4">지금 상태가 어때?</h3>
        <div className="flex gap-2 flex-wrap mb-4">
          {MOODS.map(m => (
            <button key={m.id} onClick={() => saveMood(m.id)}
              className={`mood-btn ${mood===m.id ? `${m.bg} ${m.border} !text-white selected` : ''}`}>
              {m.emoji} {m.id}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="오늘 한마디 (선택)" value={moodNote}
            onChange={e => setMoodNote(e.target.value)} className="form-input" />
          <button onClick={async () => { if(mood) try{ await setMood({date, mood, notes:moodNote}); }catch(_){} }}
            className="btn btn-secondary flex-shrink-0">저장</button>
        </div>
      </div>

      {mood === '슬럼프' && (
        <div className="alert alert-warning">
          <strong>슬럼프 모드 활성화!</strong> 지금은 최소 루틴으로 리듬을 유지하자.
          컴일 1강 → 정보보호 1강 → 국어 20분. 이거만 해도 충분해. 🔥
        </div>
      )}

      {/* 권장 루틴 */}
      <div className="card mt-4">
        <h3 className="font-bold text-slate-800 mb-1">📋 현재 구간 권장 루틴</h3>
        <p className="text-xs text-slate-400 mb-4">구간별로 자동으로 바뀌어요</p>
        <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
          {[
            { time:'저녁 19:00~20:00', label:'💻 컴일 인강 1~2강',    bg:'bg-violet-50',  tc:'text-violet-600',  bc:'border-violet-200', tip:'핵심 이해 70%면 넘어가기' },
            { time:'저녁 20:00~20:40', label:'🔐 정보보호 인강 1강',   bg:'bg-cyan-50',    tc:'text-cyan-600',    bc:'border-cyan-200',   tip:'다음날 10분 복습 필수' },
            { time:'저녁 20:40~21:00', label:'📖 국어 독해 2~3지문',   bg:'bg-emerald-50', tc:'text-emerald-600', bc:'border-emerald-200', tip:'시간 재고 풀기' },
            { time:'자기 전 10분',     label:'🔐 정보보호 암기 복습',  bg:'bg-pink-50',    tc:'text-pink-600',    bc:'border-pink-200',   tip:'안 하면 다 까먹음' },
          ].map(r => (
            <div key={r.time} className={`${r.bg} border ${r.bc} rounded-xl p-3.5`}>
              <div className={`text-[10px] font-bold ${r.tc} mb-1`}>{r.time}</div>
              <div className="text-[13.5px] font-semibold text-slate-700 mb-0.5">{r.label}</div>
              <div className="text-[11px] text-slate-400">{r.tip}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 font-medium">
          💡 <strong>"많이 하는 날"보다 "안 끊기는 날"이 합격 만든다.</strong> 오늘 1~2시간만 해도 충분!
        </div>
      </div>
    </div>
  );
}
