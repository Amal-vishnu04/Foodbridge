const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  donationId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:      { type: String, enum: ['pending','accepted','picked','delivered','cancelled'], default: 'pending' },
  pickupTime:  { type: Date },
  deliveryTime:{ type: Date },
  notes:       { type: String },
  beneficiariesCount: { type: Number, default: 0 },
  rating: {
    score:   { type: Number },
    comment: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);