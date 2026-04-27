import React, { useEffect, useState, useCallback } from 'react';
import { getStudyLogs, upsertStudyLog, getMood, setMood } from '../api';
import { today, SUBJECTS, getCurrentPhase } from '../utils/dates';

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
  const phase      = getCurrentPhase();

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
      {/* 현재 구간 진도 루틴 */}
      <div className="card mt-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-slate-800">
            {phase.emoji} {phase.name} 진도 루틴
          </h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">{phase.hours}</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">📅 {phase.start} ~ {phase.end}</p>

        {/* 하루 목표 강수 */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 max-sm:grid-cols-1">
          {phase.daily.map((d, i) => {
            const colors = [
              { bg:'bg-violet-50', tc:'text-violet-600', bc:'border-violet-200' },
              { bg:'bg-cyan-50',   tc:'text-cyan-600',   bc:'border-cyan-200'   },
              { bg:'bg-emerald-50',tc:'text-emerald-600',bc:'border-emerald-200'},
              { bg:'bg-amber-50',  tc:'text-amber-600',  bc:'border-amber-200'  },
            ];
            const c = colors[i % colors.length];
            return (
              <div key={i} className={`${c.bg} border ${c.bc} rounded-xl px-4 py-3`}>
                <div className="text-[13.5px] font-semibold text-slate-700">{d}</div>
              </div>
            );
          })}
        </div>

        {/* 핵심 운영 규칙 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-3">
          <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">⚡ 오늘의 규칙</div>
          <div className="text-[13px] font-semibold text-amber-800">{phase.rule || phase.tip}</div>
        </div>

        {/* 기출 병행 규칙 강조 */}
        {(phase.id === 2 || phase.id === 3) && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1">🔥 기출 병행 필수</div>
            <div className="flex gap-4 text-[13px] font-semibold text-red-700">
              <span>💻 컴일: 그날 범위 기출 5~10문제</span>
              <span>🔐 정보보호: 기출 5문제</span>
            </div>
            <div className="text-[11px] text-red-400 mt-1">인강만 듣고 끝내면 시험장에서 아무것도 안 떠오름!</div>
          </div>
        )}
      </div>

      {/* 운영 규칙 3개 */}
      <div className="card mt-4 bg-gradient-to-br from-slate-50 to-violet-50 border-violet-200">
        <h3 className="font-bold text-slate-800 mb-3">💣 절대 운영 규칙 3개</h3>
        <div className="flex flex-col gap-2">
          {[
            { num:'1', rule:'강의 밀리면 줄이지 말고 쌓기', desc:'다음날 +1강 추가. 줄이는 순간 진도 망함', color:'text-violet-700', bg:'bg-violet-50', border:'border-violet-200' },
            { num:'2', rule:'이해 안 돼도 진도 우선',       desc:'2회독 때 이해됨. 완벽주의 버리기',         color:'text-cyan-700',   bg:'bg-cyan-50',   border:'border-cyan-200'   },
            { num:'3', rule:'기출 무조건 병행',               desc:'하루 5문제라도. 이거 안 하면 인강 의미 없음', color:'text-amber-700', bg:'bg-amber-50',  border:'border-amber-200'  },
          ].map(r => (
            <div key={r.num} className={`flex items-start gap-3 ${r.bg} border ${r.border} rounded-xl px-4 py-3`}>
              <div className={`w-6 h-6 rounded-full bg-white border ${r.border} flex items-center justify-center text-xs font-extrabold ${r.color} flex-shrink-0 mt-0.5`}>
                {r.num}
              </div>
              <div>
                <div className={`font-bold text-[13.5px] ${r.color}`}>{r.rule}</div>
                <div className="text-[12px] text-slate-500 mt-0.5">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center text-[13px] font-bold text-violet-700 bg-violet-100 rounded-xl py-2.5">
          "하루 강의 수를 지키는 게 실력보다 중요하다" 🎯
        </div>
      </div>
    </div>
  );
}
