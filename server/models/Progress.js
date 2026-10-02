const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    pandalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pandal',
      required: true,
      unique: true,
    },
    visited: { type: Boolean, default: false },
    note: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
