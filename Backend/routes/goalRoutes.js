const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalControllers');
const auth = require("../middlewares/authmiddleware"); // ensure user is authenticated

router.post('/goalcreate', auth, goalController.createGoal);
router.get('/getgoal', auth, goalController.getGoals);
router.get('/:id', auth, goalController.getGoalById);
router.put('/:id', auth, goalController.updateGoal);
router.patch('/:id/complete', auth, goalController.markAsCompleted);
router.delete('/:id', auth, goalController.deleteGoal);

module.exports = router;