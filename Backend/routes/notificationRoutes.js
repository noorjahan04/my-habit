const express = require('express');
const router = express.Router()
const protect = require('../middlewares/authmiddleware');
const notification = require('../controllers/notificationController');

router.get('/', protect, notification.getUserNotifications);
router.patch('/:id/read', protect, notification.markAsRead);
router.patch('/read-all', protect, notification.markAllAsRead);

module.exports = router;