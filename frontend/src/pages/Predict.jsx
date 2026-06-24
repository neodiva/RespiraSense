import React, { useState } from 'react';
import axios from 'axios';
import './Predict.css'; // We'll create this for aesthetics

export default function Predict() {
  const [formData, setFormData] = useState({
    age: 40,
    fitness: 3,
    spo2: 98,
    hr: 75
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/predict', formData);
      setPrediction(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-container">
      <div className="glass-card">
        <h1 className="neon-text">Neural Predictor</h1>
        <p className="subtitle">Enter patient vitals to generate instant health predictions.</p>

        <div className="input-group">
          <label>Age: {formData.age}</label>
          <input type="range" name="age" min="1" max="100" value={formData.age} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Fitness Level (1-5): {formData.fitness}</label>
          <input type="range" name="fitness" min="1" max="5" value={formData.fitness} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>SpO2 (%): {formData.spo2}</label>
          <input type="range" name="spo2" min="50" max="100" value={formData.spo2} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Resting Heart Rate (bpm): {formData.hr}</label>
          <input type="range" name="hr" min="30" max="200" value={formData.hr} onChange={handleChange} />
        </div>

        <button className="predict-btn" onClick={handlePredict} disabled={loading}>
          {loading ? 'Processing...' : 'Run Neural Network'}
        </button>

        {prediction && (
          <div className="results-panel">
            <h2>Results</h2>
            <div className={`result-item ${prediction.hrAbnormal ? 'abnormal' : 'normal'}`}>
              <span>Heart Rate:</span> {prediction.hrAbnormal ? 'ABNORMAL' : 'NORMAL'}
            </div>
            <div className={`result-item ${prediction.spo2Abnormal ? 'abnormal' : 'normal'}`}>
              <span>SpO2 Level:</span> {prediction.spo2Abnormal ? 'ABNORMAL' : 'NORMAL'}
            </div>
            <div className={`result-item ${prediction.disease ? 'abnormal' : 'normal'}`}>
              <span>Disease Risk:</span> {prediction.disease ? 'DETECTED' : 'LOW RISK'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
