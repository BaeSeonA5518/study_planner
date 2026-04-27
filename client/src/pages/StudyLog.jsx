import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getSessions, addSession, deleteSession } from '../api';
import { today, SUBJECTS, SESSION_TYPES } from '../utils/dates';

const fmt = s => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

const DOT  = { 컴퓨터일반:'bg-violet-500', 정보보호론:'bg-cyan-500', 국어:'bg-emerald-500', 한국사:'bg-amber-500', 기출문제:'bg-pink-500' };
const TEXT = { 컴퓨터일반:'text-violet-700', 정보보호론:'text-cyan-700', 국어:'text-emerald-700', 한국사:'text-amber-700', 기출문제:'text-pink-700' };

export default function StudyLog() {
  const [date, setDate]        = useState(today());
  const [sessions, setSessions] = useState([]);
  const [subject, setSubject]   = useState(SUBJECTS[0].id);
  const [sType, setSType]       = useState(SESSION_TYPES[0]);
  const [mH, setMH]             = useState('');
  const [mM, setMM]             = useState('');
  const [notes, setNotes]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const timer = useRef(null);

  const load = useCallback(async () => {
    try { setSessions(await getSessions(date)); } catch(_) {}
  }, [date]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (running) { timer.current = setInterval(() => setElapsed(e => e+1), 1000); }
    else { clearInterval(timer.current); }
    return () => clearInterval(timer.current);
  }, [running]);

  const saveSession = async (mins) => {
    if (mins <= 0) return;
    setSaving(true);
    try {
      const res = await addSession({ date, subject, duration_minutes: mins, session_type: sType, notes });
      setSessions(s => [res, ...s]);
      setMH(''); setMM(''); setNotes('');
      setElapsed(0);
    } catch(_) {}
    setSaving(false);
  };

  const totalMins  = sessions.reduce((s,x) => s + parseInt(x.duration_minutes||0), 0);
  const bySubject  = SUBJECTS.map(s => ({
    ...s, mins: sessions.filter(x => x.subject===s.id).reduce((a,x)=>a+parseInt(x.duration_minutes||0),0)
  })).filter(s => s.mins > 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">⏱️ 학습 기록</h1>
          <p className="page-subtitle">공부 세션을 기록하고 시간을 추적하세요</p>
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input !w-auto" />
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-2">총 공부 시간</p>
          <p className="text-5xl font-black bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent leading-none">
            {Math.floor(totalMins/60)}h {String(totalMins%60).padStart(2,'0')}m
          </p>
          <p className="text-sm text-violet-500 mt-2 font-medium">{sessions.length}개 세션</p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">과목별 시간</p>
          {bySubject.length === 0 ? <p className="text-sm text-slate-400">기록 없음</p> : (
            <div className="flex flex-col gap-2">
              {bySubject.map(s => (
                <div key={s.id} className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${DOT[s.id]} flex-shrink-0`} />
                  <span className="flex-1 text-sm font-medium text-slate-600">{s.id}</span>
                  <span className={`text-sm font-bold ${TEXT[s.id]}`}>
                    {Math.floor(s.mins/60)>0?`${Math.floor(s.mins/60)}h `:''}
                    {String(s.mins%60).padStart(2,'0')}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 입력 카드 */}
      <div className="grid grid-cols-2 gap-5 mb-7 max-md:grid-cols-1">
        {/* 타이머 */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-1">⏱️ 스탑워치</h3>
          <div className="timer-display">{fmt(elapsed)}</div>
          <div className="timer-controls mb-4">
            {!running
              ? <button onClick={() => { setElapsed(0); setRunning(true); }} className="btn btn-primary">▶ 시작</button>
              : <button onClick={() => setRunning(false)} className="btn btn-danger">⏸ 정지</button>}
            <button onClick={() => { setRunning(false); setElapsed(0); }} className="btn btn-secondary" disabled={running}>🔄 초기화</button>
          </div>
          {elapsed >= 60 && !running && (
            <>
              <div className="h-px bg-slate-100 mb-4" />
              <div className="flex flex-col gap-3">
                <div className="form-group"><label className="form-label">과목</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} className="form-select">{SUBJECTS.map(s=><option key={s.id}>{s.id}</option>)}</select></div>
                <div className="form-group"><label className="form-label">세션 타입</label>
                  <select value={sType} onChange={e => setSType(e.target.value)} className="form-select">{SESSION_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                <div className="form-group"><label className="form-label">메모</label>
                  <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="공부 내용 메모" className="form-input" /></div>
                <button onClick={() => saveSession(Math.floor(elapsed/60))} disabled={saving} className="btn btn-success">
                  💾 {Math.floor(elapsed/60)}분 저장
                </button>
              </div>
            </>
          )}
        </div>

        {/* 수동 입력 */}
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-4">✍️ 수동 기록</h3>
          <div className="flex flex-col gap-3">
            <div className="form-group"><label className="form-label">과목</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="form-select">{SUBJECTS.map(s=><option key={s.id}>{s.id}</option>)}</select></div>
            <div className="form-group"><label className="form-label">세션 타입</label>
              <select value={sType} onChange={e => setSType(e.target.value)} className="form-select">{SESSION_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group"><label className="form-label">시간</label>
                <input type="number" min="0" max="12" placeholder="0" value={mH} onChange={e=>setMH(e.target.value)} className="form-input" /></div>
              <div className="form-group"><label className="form-label">분</label>
                <input type="number" min="0" max="59" placeholder="0" value={mM} onChange={e=>setMM(e.target.value)} className="form-input" /></div>
            </div>
            <div className="form-group"><label className="form-label">메모</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="공부 내용 메모" className="form-input" /></div>
            <button onClick={() => saveSession(Math.round(parseFloat(mH||0)*60)+parseInt(mM||0))} disabled={saving} className="btn btn-primary">
              💾 기록 저장
            </button>
          </div>
        </div>
      </div>

      {/* 세션 목록 */}
      <p className="section-label">오늘 세션 목록</p>
      {sessions.length === 0
        ? <div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-text">아직 기록된 세션이 없어. 공부하고 기록해봐!</div></div>
        : (
          <div className="flex flex-col gap-2.5">
            {sessions.map(sess => {
              const h = Math.floor(sess.duration_minutes/60);
              const m = sess.duration_minutes % 60;
              return (
                <div key={sess.id} className="session-item">
                  <div className={`w-2.5 h-2.5 rounded-full ${DOT[sess.subject]||'bg-violet-500'} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-800">{sess.subject}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {sess.session_type} · {h>0?`${h}시간 `:''}{m>0?`${m}분`:''}{sess.notes?` · ${sess.notes}`:''}
                    </div>
                  </div>
                  <span className={`font-extrabold text-base ${TEXT[sess.subject]||'text-violet-700'} mr-2`}>
                    {h>0?`${h}h `:''}
                    {String(m).padStart(2,'0')}m
                  </span>
                  <button onClick={async () => { try { await deleteSession(sess.id); setSessions(s=>s.filter(x=>x.id!==sess.id)); } catch(_){} }}
                    className="btn btn-danger btn-sm">삭제</button>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
