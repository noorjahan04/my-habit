const mongoose = require('mongoose');
const habitLogSchema = new mongoose.Schema({
habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
date: { type: Date, required: true },
completed: { type: Boolean, default: true },
createdAt: { type: Date, default: Date.now }
});
habitLogSchema.index({ habitId: 1, date: 1, userId: 1 }, { unique: true });


module.exports = mongoose.model('HabitLog', habitLogSchema)