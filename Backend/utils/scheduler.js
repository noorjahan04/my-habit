const cron = require('node-cron');
const { sendDailySoulFuelToAll } = require("../controllers/soulFuelcontrollers");
const { checkReminders } = require('../controllers/notificationController');
const { recordDailyAnalytics } = require('../controllers/analyticsController');

class Scheduler {
  init() {
    // Send SoulFuel daily at 8 AM
    cron.schedule('0 8 * * *', () => {
      console.log('🕗 8 AM - Sending SoulFuel messages');
      sendDailySoulFuelToAll();
    });

    // Check reminders daily at 7 PM
    cron.schedule('0 19 * * *', () => {
      console.log('🕖 7 PM - Checking reminders');
      checkReminders();
    });

    // Record analytics daily at 11 PM
    cron.schedule('0 23 * * *', () => {
      console.log('🕚 11 PM - Recording analytics');
      recordDailyAnalytics();
    });

    console.log('✅ All schedulers initialized');
  }
}

module.exports = new Scheduler();