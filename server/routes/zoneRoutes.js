const express = require('express');
const mongoose = require('mongoose');

const Zone = require('../models/Zone');
const Pandal = require('../models/Pandal');

const router = express.Router();

/**
 * GET all zones
 */
router.get('/', async (req, res) => {
  try {
    const zones = await Zone.find().sort({ name: 1 });

    res.json(zones);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * GET single zone
 */
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid zone ID',
      });
    }

    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        message: 'Zone not found',
      });
    }

    res.json(zone);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * CREATE zone
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Zone name is required',
      });
    }

    const existingZone = await Zone.findOne({
      name: name.trim(),
    });

    if (existingZone) {
      return res.status(409).json({
        message: 'Zone already exists',
      });
    }

    const zone = await Zone.create({
      name: name.trim(),
    });

    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * UPDATE zone
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid zone ID',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Zone name is required',
      });
    }

    const duplicateZone = await Zone.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });

    if (duplicateZone) {
      return res.status(409).json({
        message: 'Another zone with this name already exists',
      });
    }

    const zone = await Zone.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!zone) {
      return res.status(404).json({
        message: 'Zone not found',
      });
    }

    res.json(zone);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * DELETE zone
 *
 * A zone cannot be deleted while it contains pandals.
 * This prevents accidental deletion of all its pandals.
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid zone ID',
      });
    }

    const pandalCount = await Pandal.countDocuments({
      zone: id,
    });

    if (pandalCount > 0) {
      return res.status(409).json({
        message: `Cannot delete this zone because it contains ${pandalCount} pandal(s). Delete or move the pandals first.`,
      });
    }

    const zone = await Zone.findByIdAndDelete(id);

    if (!zone) {
      return res.status(404).json({
        message: 'Zone not found',
      });
    }

    res.json({
      message: 'Zone deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;