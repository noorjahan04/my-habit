const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authmiddleware');
const ctrl = require('../controllers/habitLogcontrollers');


router.use(auth);
router.get('/:habitId', ctrl.getLogsForHabit);
router.get('/stats/weekly', ctrl.getStats);


module.exports = router;