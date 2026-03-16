const router = require('express').Router();
const ctrl = require('../controllers/requestController');
const { protect, volunteerOnly } = require('../middleware/authMiddleware');
router.get('/my',          protect, volunteerOnly, ctrl.getMyRequests);
router.post('/:donationId',protect, volunteerOnly, ctrl.createRequest);
router.put('/:id/status',  protect, volunteerOnly, ctrl.updateStatus);
module.exports = router;