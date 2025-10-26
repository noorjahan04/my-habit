const Notification = require('../models/notificationmodel');
const Habit = require('../models/habit');
const Goal = require('../models/goal');
const User = require('../models/userModel');
const { sendEmail } = require('../utils/email');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { limit = 20, unreadOnly } = req.query;
    
    let query = { userId: req.user.id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ sentAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check for due habits and goals (for cron job)
exports.checkReminders = async () => {
  try {
    console.log('Checking for reminders...');
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check due goals
    const dueGoals = await Goal.find({
      targetDate: { $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000) }, // Tomorrow
      completed: false
    }).populate('userId');

    for (const goal of dueGoals) {
      const notification = new Notification({
        userId: goal.userId._id,
        type: 'goal_deadline',
        title: 'Goal Deadline Approaching 🎯',
        message: `Your goal "${goal.title}" is due soon!`,
        relatedId: goal._id
      });
      await notification.save();

      if (goal.userId.notificationSettings.email) {
        await sendEmail({
          to: goal.userId.email,
          subject: `Goal Reminder: ${goal.title}`,
          text: `Your goal "${goal.title}" is due soon! Don't forget to complete it.`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff3cd;">
              <h2 style="color: #856404;">🎯 Goal Reminder</h2>
              <p>Your goal "<strong>${goal.title}</strong>" is due soon!</p>
              <p>Due date: ${new Date(goal.targetDate).toLocaleDateString()}</p>
              <p>Keep up the great work! 💪</p>
            </div>
          `
        });
      }
    }

    // Check incomplete habits for today
    const users = await User.find({ 'notificationSettings.reminders': true });
    
    for (const user of users) {
      const habits = await Habit.find({ userId: user._id, active: true });
      const incompleteHabits = [];

      for (const habit of habits) {
        const todayLog = await HabitLog.findOne({
          habit: habit._id,
          date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        if (!todayLog || !todayLog.completed) {
          incompleteHabits.push(habit.name);
        }
      }

      if (incompleteHabits.length > 0 && incompleteHabits.length === habits.length) {
        const notification = new Notification({
          userId: user._id,
          type: 'habit_reminder',
          title: 'Habit Reminder 🔔',
          message: `Don't forget to complete your habits today!`
        });
        await notification.save();

        if (user.notificationSettings.email) {
          await sendEmail({
            to: user.email,
            subject: 'Daily Habit Reminder',
            text: `Remember to complete your habits today!`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #d1ecf1;">
                <h2 style="color: #0c5460;">🔔 Habit Reminder</h2>
                <p>Don't forget to complete your daily habits!</p>
                <p>Maintain your ${user.streak}-day streak! 🔥</p>
              </div>
            `
          });
        }
      }
    }

    console.log(`Sent ${dueGoals.length} goal reminders and habit reminders to ${users.length} users`);
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};