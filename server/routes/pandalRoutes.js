const express = require('express');
const Pandal = require('../models/Pandal');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pandals = await Pandal.find().sort({ zone: 1, name: 1 });
    res.json(pandals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
