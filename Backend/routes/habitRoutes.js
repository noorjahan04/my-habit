const express = require('express');
const router = express.Router()
const auth = require('../middlewares/authmiddleware');
const ctrl = require('../controllers/habitcontrollers');


router.use(auth);
router.post('/create', ctrl.createHabit);
router.get('/get', ctrl.getHabits);
router.get('/get/:id', ctrl.getHabits);
router.patch('/:id/complete', ctrl.completeHabit);
router.delete('/:id', ctrl.deleteHabit);


module.exports = router