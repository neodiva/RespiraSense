const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  patient_id:  { type: String, required: true },
  message:     { type: String, required: true },
  risk_level:  { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  spo2:        { type: Number },
  heart_rate:  { type: Number },
  timestamp:   { type: Date, default: Date.now },
  resolved:    { type: Boolean, default: false }
});

module.exports = mongoose.model('Alert', AlertSchema);