const express = require('express');
const router = express.Router();
const nn = require('../utils/NeuralNetwork');

// POST /api/predict
router.post('/', (req, res) => {
  try {
    const { age, fitness, spo2, hr } = req.body;

    // Check required fields
    if (
      age === undefined ||
      fitness === undefined ||
      spo2 === undefined ||
      hr === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: 'Required inputs: age, fitness, spo2, hr'
      });
    }

    // Validate ranges
    if (
      age < 0 || age > 120 ||
      fitness < 1 || fitness > 5 ||
      spo2 < 0 || spo2 > 100 ||
      hr < 0 || hr > 250
    ) {
      return res.status(400).json({
        success: false,
        error: 'One or more inputs are outside valid physiological ranges.'
      });
    }

    // Normalize inputs
    const features = [
      age / 100,
      fitness / 5,
      spo2 / 100,
      hr / 200
    ];

    const prediction = nn.predict(features);

    res.status(200).json({
      success: true,
      inputs: {
        age,
        fitness,
        spo2,
        hr
      },
      prediction
    });

  } catch (err) {
    console.error('Prediction Error:', err);

    res.status(500).json({
      success: false,
      error: 'Prediction failed.',
      details: err.message
    });
  }
});

module.exports = router;