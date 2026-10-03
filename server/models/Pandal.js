const mongoose = require('mongoose');

const pandalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
      required: true,
    },

    maps: {
      type: String,
      default: '',
      trim: true,
    },

    adminNote: {
      type: String,
      default: '',
      trim: true,
    },

    uncertain: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pandal', pandalSchema);