const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');

const studyLogsRouter = require('./routes/studyLogs');
const sessionsRouter  = require('./routes/sessions');
const moodRouter      = require('./routes/mood');
const statsRouter     = require('./routes/stats');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/study-logs', studyLogsRouter);
app.use('/api/sessions',   sessionsRouter);
app.use('/api/mood',       moodRouter);
app.use('/api/stats',      statsRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// SQLite는 동기식 — 서버 시작 전에 바로 초기화
initDB();

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중 → http://localhost:${PORT}`);
});
