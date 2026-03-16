const Donation = require('../models/Donation');
const User     = require('../models/User');

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create({ ...req.body, donorId: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalDonations: 1 } });
    req.app.get('io').emit('new_donation', { donation });   // notify all volunteers
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDonations = async (req, res) => {
  const { status, category } = req.query;
  const filter = { isFake: false };
  if (status)   filter.status = status;
  if (category) filter.category = category;
  const donations = await Donation.find(filter)
    .populate('donorId','name organizationName phone')
    .sort({ createdAt: -1 });
  res.json(donations);
};

exports.getMyDonations = async (req, res) => {
  const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
  res.json(donations);
};

exports.cancelDonation = async (req, res) => {
  await Donation.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
  res.json({ message: 'Cancelled' });
};