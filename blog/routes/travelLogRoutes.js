

const express = require('express');
const router = express.Router();
const travelLogController = require('../controllers/travelLogController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.use(authMiddleware); 

router.get('/', travelLogController.getAllLogs);
router.post('/', travelLogController.createLog);
router.put('/:id', travelLogController.updateLog);
router.delete('/:id', travelLogController.deleteLog);

module.exports = router;


