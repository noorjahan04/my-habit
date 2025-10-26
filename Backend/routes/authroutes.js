const express = require('express');
const router = express.Router();
const authController = require("../controllers/usercontrollers");

// routes/userRoutes.js - Add these routes

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/userModel');
const Goal = require('../models/goal');
const Habit = require('../models/habit');
const auth = require('../middlewares/authmiddleware');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/profile-pictures');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = 'profile-' + req.user.id + '-' + uniqueSuffix + fileExtension;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
    }
  }
});

// Upload profile picture
router.post('/:id/upload', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('Upload request received:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded or file type not supported' 
      });
    }

    // Check if file was actually saved
    if (!fs.existsSync(req.file.path)) {
      return res.status(500).json({
        success: false,
        message: 'File upload failed - file not saved properly'
      });
    }

    // Create relative path for database (without the Backend part)
    const relativePath = '/uploads/profile-pictures/' + req.file.filename;
    
    console.log('Updating user profile picture:', {
      userId: req.user.id,
      filePath: req.file.path,
      relativePath: relativePath
    });

    // Update user profile picture
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: relativePath },
      { new: true }
    );

    if (!user) {
      // Delete the uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Profile picture updated successfully for user:', user.email);
    
    res.json({
      success: true,
      profilePicture: user.profilePicture,
      message: 'Profile picture updated successfully'
    });
    
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    
    // Delete the uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + err.message 
    });
  }
});

// Get user wellness stats
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('Fetching stats for user:', userId);
    
    // Get goals stats
    const totalGoals = await Goal.countDocuments({ userId });
    const completedGoals = await Goal.countDocuments({ 
      userId, 
      completed: true 
    });
    
    // Get habits stats - using dummy data for now
    // Replace this with actual Habit model when you have it
    const totalHabits = 12; // Example data
    const completedHabits = 8; // Example data
    const currentStreak = 7; // Example data
    const longestStreak = 21; // Example data
    
    // If you have a Habit model, uncomment this:
    /*
    const totalHabits = await Habit.countDocuments({ userId });
    const completedHabits = await Habit.countDocuments({ 
      userId, 
      completed: true 
    });
    const currentStreak = await calculateCurrentStreak(userId);
    const longestStreak = await calculateLongestStreak(userId);
    */
    
    const stats = {
      totalHabits,
      completedHabits,
      currentStreak,
      longestStreak,
      totalGoals,
      completedGoals
    };
    
    console.log('Stats fetched:', stats);
    
    res.json(stats);
    
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + err.message 
    });
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, contact, goal } = req.body;
    
    console.log('Updating user profile:', { userId: req.user.id, updates: req.body });
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, contact, goal },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User profile updated successfully:', user.email);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        goal: user.goal,
        profilePicture: user.profilePicture
      },
      message: 'Profile updated successfully'
    });
    
  } catch (err) {
    console.error('Error updating profile:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        goal: user.goal,
        profilePicture: user.profilePicture
      }
    });
    
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
});

module.exports = router;

// register
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

// forgot password - sends reset email
router.post('/forgot-password', authController.forgotPassword);

// reset password - accepts token and new password
router.post('/reset-password', authController.resetPassword);


router.get('/:id', authController.getUserById)


module.exports = router;