const express = require('express');
const router = express.Router();
const nn = require('../utils/NeuralNetwork');

// POST /api/predict
router.post('/', (req, res) => {
    try {
        const { age, fitness, spo2, hr } = req.body;

        if (age == null || fitness == null || spo2 == null || hr == null) {
            return res.status(400).json({ error: "Missing required inputs (age, fitness, spo2, hr)" });
        }

        // Normalize inputs exactly as the C++ code did
        const features = [
            age / 100.0,
            fitness / 5.0,
            spo2 / 100.0,
            hr / 200.0
        ];

        const prediction = nn.predict(features);

        res.json({
            success: true,
            data: prediction
        });

    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
