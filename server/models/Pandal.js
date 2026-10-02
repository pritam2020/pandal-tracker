const mongoose = require('mongoose');

const pandalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    zone: { type: String, required: true },
    maps: { type: String, default: '' },
    uncertain: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pandal', pandalSchema);
