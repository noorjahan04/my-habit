const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
name: { type: String, required: true },
category: { type: String, default: 'General' },
frequency: { type: String, default: 'Daily' },
timesPerDay: { type: Number, default: 1 },
reminderTime: String,
streak: { type: Number, default: 0 },
longestStreak: { type: Number, default: 0 },
lastCompleted: Date,
active: { type: Boolean, default: true },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Habit', habitSchema)