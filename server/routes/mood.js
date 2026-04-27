const express = require('express');
const router  = express.Router();
const { moods } = require('../db');

router.get('/', (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('sv-SE');
    res.json(moods.getByDate(date));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    res.json(moods.upsert(req.body));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
