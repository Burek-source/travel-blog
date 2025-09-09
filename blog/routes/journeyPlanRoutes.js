

const express = require('express');
const router = express.Router();
const journeyPlanController = require('../controllers/journeyPlanController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.use(authMiddleware);  

router.get('/', journeyPlanController.getAllPlans);
router.post('/', journeyPlanController.createPlan);
router.put('/:id', journeyPlanController.updatePlan);
router.delete('/:id', journeyPlanController.deletePlan);

module.exports = router;


