const express = require('express');
const router = express.Router();
const  protect  = require('../middlewares/authmiddleware');
const analytics = require("../controllers/analyticsController");

router.get('/', protect, analytics.getDetailedAnalytics);

module.exports = router;