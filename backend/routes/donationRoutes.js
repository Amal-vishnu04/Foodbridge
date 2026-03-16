const router = require('express').Router();
const ctrl = require('../controllers/donationController');
const { protect, donorOnly } = require('../middleware/authMiddleware');
router.get('/',    protect, ctrl.getDonations);
router.get('/my',  protect, donorOnly, ctrl.getMyDonations);
router.post('/',   protect, donorOnly, ctrl.createDonation);
router.delete('/:id', protect, ctrl.cancelDonation);
module.exports = router;