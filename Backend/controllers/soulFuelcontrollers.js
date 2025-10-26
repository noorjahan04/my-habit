const SoulFuel = require("../models/soulfuelModel");
const Notification = require('../models/notificationmodel');
const User = require('../models/userModel');
const { sendEmail } = require('../utils/email');

// Get daily SoulFuel message
exports.getDailySoulFuel = async (req, res) => {
  try {
    // Get a random active message
    const messages = await SoulFuel.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 1 } }
    ]);

    if (messages.length === 0) {
      return res.json({
        success: true,
        data: {
          message: "You are capable of amazing things. Believe in yourself! 🌟",
          author: "SoulFuel Team",
          category: "motivation"
        }
      });
    }

    res.json({
      success: true,
      data: messages[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send SoulFuel to all users (for cron job)
const sendDailySoulFuelToAll = async () => {
  try {
    console.log('Sending daily SoulFuel messages...');
    
    const users = await User.find({ 'notificationSettings.soulfuel': true });
    const messages = await SoulFuel.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 3 } }
    ]);

    if (messages.length === 0) {
      messages.push({
        message: "Every small step counts. Keep moving forward! 🚶‍♂️💫",
        author: "SoulFuel Team",
        category: "motivation"
      });
    }

    for (const user of users) {
      // Create notification for each message
      for (const soulfuel of messages) {
        const notification = new Notification({
          userId: user._id,
          type: 'soulfuel',
          title: 'Daily SoulFuel 💫',
          message: soulfuel.message
        });
        await notification.save();
      }

      // Send email with all messages
      if (user.notificationSettings.email) {
        const emailContent = messages.map(msg => 
          `💫 ${msg.message} - ${msg.author}`
        ).join('\n\n');

        await sendEmail({
          to: user.email,
          subject: 'Your Daily SoulFuel 💫',
          text: `Your daily inspiration:\n\n${emailContent}\n\nHave a wonderful day!`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; text-align: center;">
                <h1 style="color: #764ba2; margin-bottom: 20px;">💫 Daily SoulFuel</h1>
                ${messages.map(msg => `
                  <div style="background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 10px; border-left: 4px solid #764ba2;">
                    <p style="font-size: 18px; color: #333; font-style: italic;">"${msg.message}"</p>
                    <p style="color: #666; margin-top: 10px;">- ${msg.author}</p>
                  </div>
                `).join('')}
                <p style="color: #888; margin-top: 25px;">Have an amazing day filled with positivity! 🌈</p>
              </div>
            </div>
          `
        });
      }

      user.lastSoulFuelSent = new Date();
      await user.save();
    }

    console.log(`Sent SoulFuel to ${users.length} users`);
  } catch (error) {
    console.error('Error sending SoulFuel:', error);
  }
};

// Add new SoulFuel message (admin)
exports.addSoulFuel = async (req, res) => {
  try {
    const { message, category, author } = req.body;

    const soulfuel = new SoulFuel({
      message,
      category: category || 'motivation',
      author: author || 'SoulFuel Team'
    });

    await soulfuel.save();

    res.json({
      success: true,
      message: 'SoulFuel message added successfully',
      data: soulfuel
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.triggerSoulFuelNow = async (req, res) => {
    try {
      await sendDailySoulFuelToAll();
      res.json({ success: true, message: 'SoulFuel sent to all users' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


  exports.sendDailySoulFuelToAll = sendDailySoulFuelToAll