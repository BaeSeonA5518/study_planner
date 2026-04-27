const fs   = require('fs');
const path = require('path');

const DB_DIR  = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

// ─── 기본 구조 ────────────────────────────────────────────
const DEFAULT = { study_logs: [], study_sessions: [], mood_logs: [], _seq: { study_logs: 1, study_sessions: 1, mood_logs: 1 } };

function load() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch { return JSON.parse(JSON.stringify(DEFAULT)); }
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// ─── 공통 헬퍼 ────────────────────────────────────────────
function nextId(data, table) {
  const id = data._seq[table]++;
  save(data);
  return id;
}

const todayStr = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD

// ─── study_logs ───────────────────────────────────────────
const studyLogs = {
  getByDate(date) {
    const d = load();
    return d.study_logs.filter(r => r.date === date);
  },

  upsert({ date, subject, completed, study_hours, notes }) {
    const d = load();
    const idx = d.study_logs.findIndex(r => r.date === date && r.subject === subject);
    if (idx >= 0) {
      d.study_logs[idx] = { ...d.study_logs[idx], completed: !!completed, study_hours: study_hours ?? 0, notes: notes ?? '' };
      save(d);
      return d.study_logs[idx];
    } else {
      const row = { id: nextId(d, 'study_logs'), date, subject, completed: !!completed, study_hours: study_hours ?? 0, notes: notes ?? '', created_at: new Date().toISOString() };
      d.study_logs.push(row);
      save(d);
      return row;
    }
  },

  getWeekly(weekStart) {
    const d = load();
    const start = new Date(weekStart);
    const end   = new Date(weekStart); end.setDate(end.getDate() + 6);
    const es = end.toLocaleDateString('sv-SE');
    return d.study_logs.filter(r => r.date >= weekStart && r.date <= es);
  },

  getRange(start, end) {
    const d = load();
    const rows = d.study_logs.filter(r => r.date >= start && r.date <= end);
    const byDate = {};
    rows.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = { date: r.date, total_hours: 0, subjects_done: 0 };
      byDate[r.date].total_hours   += parseFloat(r.study_hours || 0);
      if (r.completed) byDate[r.date].subjects_done += 1;
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  },

  stats() {
    const d = load();
    const logs = d.study_logs;
    const totalDays        = new Set(logs.map(r => r.date)).size;
    const totalHours       = logs.reduce((s, r) => s + parseFloat(r.study_hours || 0), 0);
    const totalCompletions = logs.filter(r => r.completed).length;

    // 과목별
    const subMap = {};
    logs.forEach(r => {
      if (!subMap[r.subject]) subMap[r.subject] = { subject: r.subject, completed_days: 0, total_hours: 0 };
      subMap[r.subject].total_hours += parseFloat(r.study_hours || 0);
      if (r.completed) subMap[r.subject].completed_days += 1;
    });
    const subjects = Object.values(subMap);

    // 연속 스트릭
    const doneByDate = {};
    logs.forEach(r => { if (r.completed) doneByDate[r.date] = true; });
    const sortedDates = Object.keys(doneByDate).sort().reverse();
    let streak = 0;
    let cursor = new Date(todayStr());
    for (const dt of sortedDates) {
      const curStr = cursor.toLocaleDateString('sv-SE');
      if (dt === curStr) { streak++; cursor.setDate(cursor.getDate() - 1); }
      else if (dt < curStr) break;
    }

    return { totalDays, totalHours, totalCompletions, subjects, streak };
  },

  monthly(month) {
    const d = load();
    const rows = d.study_logs.filter(r => r.date.startsWith(month));
    const byDate = {};
    rows.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = { date: r.date, total_hours: 0, subjects_done: 0 };
      byDate[r.date].total_hours += parseFloat(r.study_hours || 0);
      if (r.completed) byDate[r.date].subjects_done += 1;
    });
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  },
};

// ─── study_sessions ───────────────────────────────────────
const sessions = {
  getByDate(date) {
    return load().study_sessions.filter(r => r.date === date).reverse();
  },

  add({ date, subject, duration_minutes, session_type, notes }) {
    const d = load();
    const row = { id: nextId(d, 'study_sessions'), date, subject, duration_minutes, session_type: session_type ?? '복습', notes: notes ?? '', created_at: new Date().toISOString() };
    d.study_sessions.push(row);
    save(d);
    return row;
  },

  remove(id) {
    const d = load();
    d.study_sessions = d.study_sessions.filter(r => r.id !== parseInt(id));
    save(d);
  },
};

// ─── mood_logs ────────────────────────────────────────────
const moods = {
  getByDate(date) {
    return load().mood_logs.find(r => r.date === date) || null;
  },

  upsert({ date, mood, notes }) {
    const d = load();
    const idx = d.mood_logs.findIndex(r => r.date === date);
    if (idx >= 0) {
      d.mood_logs[idx] = { ...d.mood_logs[idx], mood, notes: notes ?? '' };
      save(d);
      return d.mood_logs[idx];
    } else {
      const row = { id: nextId(d, 'mood_logs'), date, mood, notes: notes ?? '', created_at: new Date().toISOString() };
      d.mood_logs.push(row);
      save(d);
      return row;
    }
  },
};

// ─── 초기화 ───────────────────────────────────────────────
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    save(JSON.parse(JSON.stringify(DEFAULT)));
  }
  console.log('✅ DB 초기화 완료 →', DB_PATH);
}

module.exports = { studyLogs, sessions, moods, initDB };
