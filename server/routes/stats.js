const express = require('express');
const router  = express.Router();
const { studyLogs } = require('../db');

router.get('/', (req, res) => {
  try {
    res.json(studyLogs.stats());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/monthly', (req, res) => {
  try {
    const month = req.query.month || new Date().toLocaleDateString('sv-SE').slice(0, 7);
    res.json(studyLogs.monthly(month));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
