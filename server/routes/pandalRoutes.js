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

    const hasMapLink = Boolean(maps && maps.trim());

    const hasLatitude =
      latitude !== null &&
      latitude !== undefined &&
      latitude !== '';
    
    const hasLongitude =
      longitude !== null &&
      longitude !== undefined &&
      longitude !== '';
    
    if (!hasMapLink && !hasLatitude && !hasLongitude) {
      return res.status(400).json({
        message: 'Please provide either a map link or both latitude and longitude',
      });
    }
    
    if (hasLatitude !== hasLongitude) {
      return res.status(400).json({
        message: 'Both latitude and longitude are required',
      });
    }
    
    const parsedLatitude = hasLatitude ? Number(latitude) : null;
    const parsedLongitude = hasLongitude ? Number(longitude) : null;
    
    if (
      hasLatitude &&
      (!Number.isFinite(parsedLatitude) ||
        parsedLatitude < -90 ||
        parsedLatitude > 90)
    ) {
      return res.status(400).json({
        message: 'Latitude must be between -90 and 90',
      });
    }
    
    if (
      hasLongitude &&
      (!Number.isFinite(parsedLongitude) ||
        parsedLongitude < -180 ||
        parsedLongitude > 180)
    ) {
      return res.status(400).json({
        message: 'Longitude must be between -180 and 180',
      });
    }
    
    const pandal = await Pandal.create({
      name: name.trim(),
      zone,
      maps: maps.trim(),
      latitude: parsedLatitude,
      longitude: parsedLongitude,
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

    const hasMapLink = Boolean(maps && maps.trim());

    const hasLatitude =
      latitude !== null &&
      latitude !== undefined &&
      latitude !== '';
    
    const hasLongitude =
      longitude !== null &&
      longitude !== undefined &&
      longitude !== '';
    
    if (!hasMapLink && !hasLatitude && !hasLongitude) {
      return res.status(400).json({
        message: 'Please provide either a map link or both latitude and longitude',
      });
    }
    
    if (hasLatitude !== hasLongitude) {
      return res.status(400).json({
        message: 'Both latitude and longitude are required',
      });
    }
    
    const parsedLatitude = hasLatitude ? Number(latitude) : null;
    const parsedLongitude = hasLongitude ? Number(longitude) : null;
    
    if (
      hasLatitude &&
      (!Number.isFinite(parsedLatitude) ||
        parsedLatitude < -90 ||
        parsedLatitude > 90)
    ) {
      return res.status(400).json({
        message: 'Latitude must be between -90 and 90',
      });
    }
    
    if (
      hasLongitude &&
      (!Number.isFinite(parsedLongitude) ||
        parsedLongitude < -180 ||
        parsedLongitude > 180)
    ) {
      return res.status(400).json({
        message: 'Longitude must be between -180 and 180',
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
        latitude: parsedLatitude,
        longitude: parsedLongitude,
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