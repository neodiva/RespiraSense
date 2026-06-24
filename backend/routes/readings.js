const express = require('express');
const router = express.Router();
const nn = require('../utils/NeuralNetwork');
const Reading = require('../models/Reading');
const Alert = require('../models/Alert');

function getRiskLevel(spo2) {
  if (spo2 < 90) return 'HIGH';
  if (spo2 < 94) return 'MEDIUM';
  return 'LOW';
}

// POST /api/readings  — called by ESP32
router.post('/', async (req, res) => {
  try {
    const { patient_id, spo2, heart_rate, respiration_rate } = req.body;

    // Try ML prediction (optional — works without it)
    let mlResult = null;
    try {
      // Default to age 40, fitness 3 for ESP32 readings
      const features = [40 / 100.0, 3 / 5.0, spo2 / 100.0, heart_rate / 200.0];
      mlResult = nn.predict(features);
    } catch (e) {
      console.error("NN Prediction failed:", e);
    }

    let risk_level = getRiskLevel(spo2);
    if (mlResult && (mlResult.disease || mlResult.hrAbnormal || mlResult.spo2Abnormal)) {
       risk_level = 'HIGH';
    }
    const health_score = null;

    const reading = new Reading({
      patient_id, spo2, heart_rate, respiration_rate,
      risk_level, health_score, ml_prediction: mlResult
    });
    await reading.save();

    // Emit to React dashboard instantly
    const io = req.app.get('io');
    io.emit('new_reading', reading);

    // Create alert if dangerous
    if (spo2 < 90 || (mlResult && mlResult.disease)) {
      const alert = new Alert({
        patient_id,
        message: (mlResult && mlResult.disease) 
          ? `Neural Network detected abnormal disease state!` 
          : `SpO₂ dropped to ${spo2}%`,
        risk_level,
        spo2,
        heart_rate
      });
      await alert.save();
      io.emit('new_alert', alert);
    }

    res.status(201).json({ success: true, reading });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/readings?patient_id=P001
router.get('/', async (req, res) => {
  try {
    const { patient_id, limit = 100 } = req.query;
    const filter = patient_id ? { patient_id } : {};
    const readings = await Reading.find(filter)
      .sort({ timestamp: -1 })
      .limit(Number(limit));
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/readings/history?patient_id=P001&range=7d
router.get('/history', async (req, res) => {
  try {
    const { patient_id, range = '24h' } = req.query;
    const rangeMap = { '24h': 1, '7d': 7, '30d': 30 };
    const days = rangeMap[range] || 1;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const readings = await Reading.find({
      patient_id,
      timestamp: { $gte: since }
    }).sort({ timestamp: 1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;