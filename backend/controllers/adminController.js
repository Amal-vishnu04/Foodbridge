const User     = require('../models/User');
const Donation = require('../models/Donation');

exports.getStats = async (req, res) => {
  const [totalDonors, totalVolunteers, totalDonations, delivered, active] = await Promise.all([
    User.countDocuments({ role: 'donor' }),
    User.countDocuments({ role: 'volunteer' }),
    Donation.countDocuments(),
    Donation.countDocuments({ status: 'delivered' }),
    Donation.countDocuments({ status: 'available' }),
  ]);

  const topVolunteers = await User.find({ role: 'volunteer' })
    .sort({ reputationScore: -1 }).limit(5)
    .select('name totalDeliveries reputationScore');

  res.json({ totalDonors, totalVolunteers, totalDonations, delivered, active, topVolunteers });
};

exports.getAllUsers     = async (req, res) => res.json(await User.find().select('-password'));
exports.getAllDonations = async (req, res) => res.json(await Donation.find().populate('donorId','name'));
exports.toggleUser     = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  res.json(user);
};
exports.markFake = async (req, res) => {
  await Donation.findByIdAndUpdate(req.params.id, { isFake: true, status: 'cancelled' });
  res.json({ message: 'Marked as fake' });
};