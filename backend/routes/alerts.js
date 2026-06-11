const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// GET /api/alerts?patient_id=P001
router.get('/', async (req, res) => {
  try {
    const { patient_id, resolved } = req.query;
    const filter = {};
    if (patient_id) filter.patient_id = patient_id;
    if (resolved !== undefined) filter.resolved = resolved === 'true';
    const alerts = await Alert.find(filter).sort({ timestamp: -1 }).limit(50);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;