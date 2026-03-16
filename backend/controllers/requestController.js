const Request  = require('../models/Request');
const Donation = require('../models/Donation');
const User     = require('../models/User');

exports.createRequest = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId);
    if (!donation || donation.status !== 'available')
      return res.status(400).json({ message: 'Not available' });
    const request = await Request.create({ donationId: donation._id, volunteerId: req.user._id });
    donation.status = 'requested';
    donation.assignedVolunteer = req.user._id;
    await donation.save();
    // Notify donor
    req.app.get('io').to(donation.donorId.toString()).emit('pickup_request', { request });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  const requests = await Request.find({ volunteerId: req.user._id })
    .populate({ path: 'donationId', populate: { path: 'donorId', select: 'name phone' } })
    .sort({ createdAt: -1 });
  res.json(requests);
};

exports.updateStatus = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    const { status, beneficiariesCount } = req.body;
    request.status = status;
    if (status === 'picked')    request.pickupTime   = new Date();
    if (status === 'delivered') {
      request.deliveryTime = new Date();
      request.beneficiariesCount = beneficiariesCount || 0;
      await Donation.findByIdAndUpdate(request.donationId, { status: 'delivered' });
      await User.findByIdAndUpdate(req.user._id, { $inc: { totalDeliveries: 1, reputationScore: 10 } });
    }
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};