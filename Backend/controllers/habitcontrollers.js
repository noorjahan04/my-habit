const Habit = require('../models/habit');
const HabitLog = require('../models/habitLog');


exports.createHabit = async (req, res) => {
    try {
        const { name, category, frequency, timesPerDay, reminderTime } = req.body;
        const habit = await Habit.create({ userId: req.user.id, name, category, frequency, timesPerDay, reminderTime });
        res.json({ ok: true, habit });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Mark habit complete for today
exports.completeHabit = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
        if (!habit) return res.status(404).json({ message: 'Habit not found' });


        const today = new Date();
        const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());


        // create or update HabitLog (unique index prevents duplicates)
        try {
            await HabitLog.create({ habitId: habit._id, userId: req.user.id, date: day, completed: true });
        } catch (e) {
            // already logged today
        }


        // update streak logic
        const last = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
        const yesterday = new Date(day);
        yesterday.setDate(yesterday.getDate() - 1);


        if (!last || new Date(last).toDateString() !== day.toDateString()) {
            // if last was yesterday, increment streak else reset to 1
            if (last && new Date(last).toDateString() === yesterday.toDateString()) {
                habit.streak = (habit.streak || 0) + 1;
            } else {
                habit.streak = 1;
            }
            habit.lastCompleted = day;
            if (habit.streak > (habit.longestStreak || 0)) habit.longestStreak = habit.streak;
            await habit.save();
        }


        res.json({ message: 'Completed', streak: habit.streak });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteHabit = async (req, res) => {
    try {
        await Habit.deleteOne({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};