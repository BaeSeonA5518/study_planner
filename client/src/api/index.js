// ────────────────────────────────────────────────────────────
//  localStorage 기반 데이터 레이어
//  서버 없이 브라우저에 데이터를 저장합니다.
// ────────────────────────────────────────────────────────────

const KEYS = {
  logs:     'sp_study_logs',
  sessions: 'sp_sessions',
  moods:    'sp_moods',
  seq:      'sp_seq',
};

// ── 헬퍼 ──────────────────────────────────────────────────────
const load  = key => JSON.parse(localStorage.getItem(key) || '[]');
const save  = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const today = () => new Date().toLocaleDateString('sv-SE');

let _seq = JSON.parse(localStorage.getItem(KEYS.seq) || '{"logs":1,"sessions":1,"moods":1}');
const nextId = (table) => {
  const id = _seq[table]++;
  localStorage.setItem(KEYS.seq, JSON.stringify(_seq));
  return id;
};

// ── study_logs ────────────────────────────────────────────────
export const getStudyLogs = async (date) => {
  const d = date || today();
  return load(KEYS.logs).filter(r => r.date === d);
};

export const upsertStudyLog = async ({ date, subject, completed, study_hours, notes }) => {
  const logs = load(KEYS.logs);
  const idx  = logs.findIndex(r => r.date === date && r.subject === subject);
  const row  = idx >= 0
    ? { ...logs[idx], completed: !!completed, study_hours: study_hours ?? 0, notes: notes ?? '' }
    : { id: nextId('logs'), date, subject, completed: !!completed, study_hours: study_hours ?? 0, notes: notes ?? '', created_at: new Date().toISOString() };
  if (idx >= 0) logs[idx] = row; else logs.push(row);
  save(KEYS.logs, logs);
  return row;
};

export const getWeeklyLogs = async (weekStart) => {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const endStr = end.toLocaleDateString('sv-SE');
  return load(KEYS.logs).filter(r => r.date >= weekStart && r.date <= endStr);
};

export const getRangeLogs = async (start, end) => {
  const rows = load(KEYS.logs).filter(r => r.date >= start && r.date <= end);
  const byDate = {};
  rows.forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = { date: r.date, total_hours: 0, subjects_done: 0 };
    byDate[r.date].total_hours   += parseFloat(r.study_hours || 0);
    if (r.completed) byDate[r.date].subjects_done += 1;
  });
  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
};

// ── sessions ──────────────────────────────────────────────────
export const getSessions = async (date) => {
  const d = date || today();
  return load(KEYS.sessions).filter(r => r.date === d).reverse();
};

export const addSession = async ({ date, subject, duration_minutes, session_type, notes }) => {
  const sessions = load(KEYS.sessions);
  const row = { id: nextId('sessions'), date, subject, duration_minutes, session_type: session_type ?? '복습', notes: notes ?? '', created_at: new Date().toISOString() };
  sessions.push(row);
  save(KEYS.sessions, sessions);
  return row;
};

export const deleteSession = async (id) => {
  const sessions = load(KEYS.sessions).filter(r => r.id !== parseInt(id));
  save(KEYS.sessions, sessions);
  return { success: true };
};

// ── mood ──────────────────────────────────────────────────────
export const getMood = async (date) => {
  const d = date || today();
  return load(KEYS.moods).find(r => r.date === d) || null;
};

export const setMood = async ({ date, mood, notes }) => {
  const moods = load(KEYS.moods);
  const idx   = moods.findIndex(r => r.date === date);
  const row   = idx >= 0
    ? { ...moods[idx], mood, notes: notes ?? '' }
    : { id: nextId('moods'), date, mood, notes: notes ?? '', created_at: new Date().toISOString() };
  if (idx >= 0) moods[idx] = row; else moods.push(row);
  save(KEYS.moods, moods);
  return row;
};

// ── stats ─────────────────────────────────────────────────────
export const getStats = async () => {
  const logs = load(KEYS.logs);

  const totalDays        = new Set(logs.map(r => r.date)).size;
  const totalHours       = logs.reduce((s, r) => s + parseFloat(r.study_hours || 0), 0);
  const totalCompletions = logs.filter(r => r.completed).length;

  const subMap = {};
  logs.forEach(r => {
    if (!subMap[r.subject]) subMap[r.subject] = { subject: r.subject, completed_days: 0, total_hours: 0 };
    subMap[r.subject].total_hours += parseFloat(r.study_hours || 0);
    if (r.completed) subMap[r.subject].completed_days += 1;
  });

  // 연속 스트릭 계산
  const doneByDate = {};
  logs.forEach(r => { if (r.completed) doneByDate[r.date] = true; });
  let streak = 0;
  const cursor = new Date(today());
  while (true) {
    const ds = cursor.toLocaleDateString('sv-SE');
    if (doneByDate[ds]) { streak++; cursor.setDate(cursor.getDate() - 1); }
    else break;
  }

  return {
    totalDays,
    totalHours,
    totalCompletions,
    subjects: Object.values(subMap),
    streak,
  };
};

export const getMonthlyStats = async (month) => {
  const m    = month || today().slice(0, 7);
  const logs = load(KEYS.logs).filter(r => r.date.startsWith(m));
  const byDate = {};
  logs.forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = { date: r.date, total_hours: 0, subjects_done: 0 };
    byDate[r.date].total_hours += parseFloat(r.study_hours || 0);
    if (r.completed) byDate[r.date].subjects_done += 1;
  });
  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
};
