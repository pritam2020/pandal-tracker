const express = require('express');
const mongoose = require('mongoose');

const Pandal = require('../models/Pandal');
const Zone = require('../models/Zone');

const router = express.Router();

/**
 * GET all pandals
 */
router.get('/', async (req, res) => {
  try {
    const pandals = await Pandal.find()
      .populate('zone', 'name')
      .sort({ 'zone.name': 1, name: 1 });

    res.json(pandals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * GET single pandal
 */
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid pandal ID',
      });
    }

    const pandal = await Pandal.findById(req.params.id)
      .populate('zone', 'name');

    if (!pandal) {
      return res.status(404).json({
        message: 'Pandal not found',
      });
    }

    res.json(pandal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * CREATE pandal
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      zone,
      maps = '',
      latitude = null,
      longitude = null,
      adminNote = '',
      uncertain = false,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Pandal name is required',
      });
    }

    if (!zone) {
      return res.status(400).json({
        message: 'Zone is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(zone)) {
      return res.status(400).json({
        message: 'Invalid zone ID',
      });
    }

    const existingZone = await Zone.findById(zone);

    if (!existingZone) {
      return res.status(404).json({
        message: 'Zone not found',
      });
    }

    const pandal = await Pandal.create({
      name: name.trim(),
      zone,
      maps: maps.trim(),
      adminNote: adminNote.trim(),
      uncertain: Boolean(uncertain),
    });

    const populatedPandal = await pandal.populate('zone', 'name');

    res.status(201).json(populatedPandal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * UPDATE pandal
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid pandal ID',
      });
    }

    const {
      name,
      zone,
      maps = '',
      adminNote = '',
      uncertain = false,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Pandal name is required',
      });
    }

    if (!zone) {
      return res.status(400).json({
        message: 'Zone is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(zone)) {
      return res.status(400).json({
        message: 'Invalid zone ID',
      });
    }

    const existingZone = await Zone.findById(zone);

    if (!existingZone) {
      return res.status(404).json({
        message: 'Zone not found',
      });
    }

    const pandal = await Pandal.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        zone,
        maps: maps.trim(),
        adminNote: adminNote.trim(),
        uncertain: Boolean(uncertain),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('zone', 'name');

    if (!pandal) {
      return res.status(404).json({
        message: 'Pandal not found',
      });
    }

    res.json(pandal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * DELETE pandal
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid pandal ID',
      });
    }

    const pandal = await Pandal.findByIdAndDelete(id);

    if (!pandal) {
      return res.status(404).json({
        message: 'Pandal not found',
      });
    }

    res.json({
      message: 'Pandal deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;