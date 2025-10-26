const HabitLog = require('../models/habitLog');


exports.getLogsForHabit = async (req, res) => {
    console.log(req.user)
    try {
        const { habitId } = req.params;
        const logs = await HabitLog.find({ habitId, userId: req.user.id }).sort({ date: 1 });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getStats = async (req, res) => {
    try {
        // For simplicity return simple weekly average
        const sevenAgo = new Date();
        sevenAgo.setDate(sevenAgo.getDate() - 7);
        const logs = await HabitLog.find({ userId: req.user.id, date: { $gte: sevenAgo } });
        const completed = logs.filter(l => l.completed).length;
        res.json({ weeklyCompleted: completed, days: 7 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


