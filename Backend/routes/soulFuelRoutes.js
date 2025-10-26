const express = require('express');
const router = express.Router();
const  protect  = require('../middlewares/authmiddleware');
const soul = require("../controllers/soulFuelcontrollers")

router.get('/daily', protect, soul.getDailySoulFuel);
router.post('/', protect, soul.addSoulFuel); // Admin route
// In your soulFuelRoutes.js
router.post('/trigger-now', protect, soul.triggerSoulFuelNow);

module.exports = router;