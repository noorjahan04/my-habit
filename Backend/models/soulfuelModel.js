const mongoose = require('mongoose');

const soulFuelSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['motivation', 'inspiration', 'mindfulness', 'growth'],
    default: 'motivation'
  },
  author: {
    type: String,
    default: 'SoulFuel Team'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SoulFuel', soulFuelSchema);