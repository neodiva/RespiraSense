const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },

    fitness_score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Patient', PatientSchema);