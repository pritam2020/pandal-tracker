const express = require('express');
const Progress = require('../models/Progress');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const progress = await Progress.find();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:pandalId', async (req, res) => {
  try {
    const { visited, note } = req.body;

    const updated = await Progress.findOneAndUpdate(
      { pandalId: req.params.pandalId },
      {
        pandalId: req.params.pandalId,
        visited: Boolean(visited),
        note: note || '',
        updatedAt: Date.now(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
