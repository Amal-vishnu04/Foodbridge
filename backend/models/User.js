const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  password:         { type: String, required: true },
  role:             { type: String, enum: ['donor','volunteer','admin'], default: 'donor' },
  phone:            { type: String, required: true },
  organizationName: { type: String },
  address:          { type: String },
  isActive:         { type: Boolean, default: true },
  reputationScore:  { type: Number, default: 0 },
  totalDonations:   { type: Number, default: 0 },
  totalDeliveries:  { type: Number, default: 0 },
  ratings: [{
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score:   { type: Number },
    comment: { type: String }
  }]
}, { timestamps: true });

/* Password Hash Middleware */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/* Compare Password Method */
userSchema.methods.comparePassword = async function(pwd) {
  return await bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model('User', userSchema);