const express = require('express');
const router  = express.Router();
const { sessions } = require('../db');

router.get('/', (req, res) => {
  try {
    const date = req.query.date || new Date().toLocaleDateString('sv-SE');
    res.json(sessions.getByDate(date));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    res.json(sessions.add(req.body));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', (req, res) => {
  try {
    sessions.remove(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
