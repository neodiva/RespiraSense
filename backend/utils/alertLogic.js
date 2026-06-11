function evaluateReading({ spo2, heart_rate, respiration_rate }) {
  const alerts = [];

  if (spo2 < 90)       alerts.push({ level: 'HIGH',   msg: `Critical SpO₂: ${spo2}%` });
  else if (spo2 < 94)  alerts.push({ level: 'MEDIUM', msg: `Low SpO₂: ${spo2}%` });

  if (heart_rate > 120)      alerts.push({ level: 'HIGH',   msg: `High heart rate: ${heart_rate} BPM` });
  else if (heart_rate < 50)  alerts.push({ level: 'HIGH',   msg: `Low heart rate: ${heart_rate} BPM` });

  if (respiration_rate > 25)      alerts.push({ level: 'MEDIUM', msg: `High respiration rate: ${respiration_rate} br/min` });
  else if (respiration_rate < 8)  alerts.push({ level: 'HIGH',   msg: `Low respiration rate: ${respiration_rate} br/min` });

  return alerts;
}

module.exports = { evaluateReading };