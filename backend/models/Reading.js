const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  patient_id:       { type: String, required: true },
  spo2:             { type: Number, required: true },
  heart_rate:       { type: Number, required: true },
  respiration_rate: { type: Number, required: true },
  timestamp:        { type: Date, default: Date.now },
  risk_level:       { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  health_score:     { type: Number },
  ml_prediction:    { type: Object }
});

module.exports = mongoose.model('Reading', ReadingSchema);