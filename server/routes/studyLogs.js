const express = require('express');
const router  = express.Router();
const { studyLogs } = require('../db');

router.get('/', (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('sv-SE');
    res.json(studyLogs.getByDate(date));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    res.json(studyLogs.upsert(req.body));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/weekly', (req, res) => {
  try {
    res.json(studyLogs.getWeekly(req.query.weekStart));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/range', (req, res) => {
  try {
    res.json(studyLogs.getRange(req.query.start, req.query.end));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
