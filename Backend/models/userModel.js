const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  contact: String,
  profilePicture: String,
  // password reset
  resetPasswordTokenHash: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

  // optional extras you might add later
  createdAt: { type: Date, default: Date.now },


  notificationSettings: {
    email: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true },
    soulfuel: { type: Boolean, default: true }
  },
  timezone: { type: String, default: 'UTC' },
  lastSoulFuelSent: Date,
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 }
})

module.exports = mongoose.model('User', UserSchema)