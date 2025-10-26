const Analytics = require('../models/analytics');
const Habit = require('../models/habit');
const HabitLog = require('../models/habitLog');
const Goal = require('../models/goal');

// Get user analytics
exports.getDetailedAnalytics = async (req, res) => {
    try {
      const userId = req.user.id;
      const { range = 'week' } = req.query;
      
      // Calculate date range based on query
      const today = new Date();
      let startDate;
      
      switch (range) {
        case 'week':
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          break;
        case 'year':
          startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
          break;
        default:
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
  
      // Get habits and logs for the date range
      const habits = await Habit.find({ userId });
      const habitLogs = await HabitLog.find({
        user: userId,
        date: { $gte: startDate, $lte: today }
      }).populate('habitId');
  
      // Calculate various metrics
      const totalHabits = habits.length;
      const completedHabits = habits.filter(habit => habit.completed).length;
      
      // Calculate daily completion rates
      const dailyCompletion = {};
      habitLogs.forEach(log => {
        const dateStr = log.date.toISOString().split('T')[0];
        if (!dailyCompletion[dateStr]) {
          dailyCompletion[dateStr] = { completed: 0, total: 0 };
        }
        dailyCompletion[dateStr].total++;
        if (log.completed) dailyCompletion[dateStr].completed++;
      });
  
      // Format for charts
      const weeklyTrend = Object.entries(dailyCompletion)
        .slice(-7) // Last 7 days
        .map(([date, data]) => ({
          day: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
          completion: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
          habits: data.total
        }));
  
      res.json({
        success: true,
        data: {
          overview: {
            totalHabits,
            completedHabits,
            completionRate: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0
          },
          weeklyTrend,
          dailyCompletion,
          habitLogs: habitLogs.slice(-10).reverse() // Recent activities
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
// Record daily analytics (for cron job)
exports.recordDailyAnalytics = async () => {
  try {
    console.log('Recording daily analytics...');
    
    const users = await User.find();
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (const user of users) {
      const habits = await Habit.countDocuments({ userId: user._id });
      const goals = await Goal.countDocuments({ userId: user._id });
      const completedGoals = await Goal.countDocuments({ userId: user._id, completed: true });

      const todayLogs = await HabitLog.find({
        user: user._id,
        date: { $gte: todayStart, $lt: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000) }
      });

      const habitsCompleted = todayLogs.filter(log => log.completed).length;

      const analytics = new Analytics({
        userId: user._id,
        habitsCompleted,
        totalHabits: habits,
        goalsCompleted,
        totalGoals: goals,
        currentStreak: user.streak
      });

      await analytics.save();
    }

    console.log(`Recorded analytics for ${users.length} users`);
  } catch (error) {
    console.error('Error recording analytics:', error);
  }
};