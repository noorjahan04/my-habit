require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes');
const habitRoutes = require('./routes/habitRoutes');
const habitLogRoutes = require('./routes/logroutes');
const goalRoutes = require('./routes/goalRoutes');
const soulRoutes = require('./routes/soulFuelRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const scheduler = require('./utils/scheduler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/users', authRoutes);
app.use('/habit', habitRoutes);
app.use('/habitLog', habitLogRoutes);
app.use('/Goal', goalRoutes);
app.use('/soulfuel', soulRoutes);
app.use('/notifications', notificationRoutes);
app.use('/analytics', analyticsRoutes);

// Scheduler
scheduler.init();

// Connect to MongoDB
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4300;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB connection error:", err.message);
  });

// Fallback route
app.get('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
