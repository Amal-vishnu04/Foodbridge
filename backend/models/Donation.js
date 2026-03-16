const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType:   { type: String, required: true },
  description:{ type: String },
  quantity:   { type: String, required: true },
  expiryTime: { type: Date, required: true },
  location: {
    address: { type: String, required: true },
    lat:     { type: Number },
    lng:     { type: Number }
  },
  image:    { type: String, default: '' },
  category: { type: String, enum: ['cooked','raw','packaged','bakery','fruits-vegetables','other'], default: 'cooked' },
  servings: { type: Number },
  status:   { type: String, enum: ['available','requested','picked','delivered','expired','cancelled'], default: 'available' },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deliveredAt: { type: Date },
  isFake: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);