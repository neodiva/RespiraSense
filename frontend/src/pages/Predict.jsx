import { useState } from 'react';
import api from '../api';
import './Predict.css';

export default function Predict() {
  const [formData, setFormData] = useState({
    age: 20,
    fitness: 3,
    spo2: 98,
    hr: 72
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setPrediction(null);
    setError('');

    try {
      const res = await api.post('/predict', formData);

      if (res.data.success) {
        setPrediction(res.data.prediction);
      } else {
        setError('Prediction failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const confidence = (score) =>
    `${Math.round(Math.min(score * 100, 100))}%`;

 return (
  <div className="predict-page">

    <div className="predict-header">
      <h1>🧠 AI Clinical Insights</h1>
      <p>
        Analyze patient vitals using the integrated RespiraSense Neural Network.
      </p>
    </div>

    <div className="predict-card">

      <div className="form-grid">

        <div className="input-box">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="100"
          />
        </div>

        <div className="input-box">
          <label>Fitness Score (1-5)</label>
          <input
            type="number"
            name="fitness"
            value={formData.fitness}
            onChange={handleChange}
            min="1"
            max="5"
          />
        </div>

        <div className="input-box">
          <label>SpO₂ (%)</label>
          <input
            type="number"
            name="spo2"
            value={formData.spo2}
            onChange={handleChange}
            min="50"
            max="100"
          />
        </div>

        <div className="input-box">
          <label>Heart Rate (BPM)</label>
          <input
            type="number"
            name="hr"
            value={formData.hr}
            onChange={handleChange}
            min="30"
            max="200"
          />
        </div>

      </div>

      <button
        className="analyze-btn"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Patient'}
      </button>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {prediction && (

        <div className="results-grid">

          <div className="result-card">
            <h3>❤️ Heart Status</h3>

            <span className={
              prediction.hrAbnormal
                ? 'danger'
                : 'safe'
            }>
              {prediction.hrAbnormal
                ? 'Abnormal'
                : 'Normal'}
            </span>

            <p>
              Confidence: {confidence(prediction.hrScore)}
            </p>

          </div>

          <div className="result-card">

            <h3>🫁 Oxygen Status</h3>

            <span className={
              prediction.spo2Abnormal
                ? 'danger'
                : 'safe'
            }>
              {prediction.spo2Abnormal
                ? 'Abnormal'
                : 'Normal'}
            </span>

            <p>
              Confidence:
              {' '}
              {confidence(prediction.spo2Score)}
            </p>

          </div>

          <div className="result-card">

            <h3>⚠️ Respiratory Risk</h3>

            <span className={
              prediction.disease
                ? 'danger'
                : 'safe'
            }>
              {prediction.disease
                ? 'Elevated'
                : 'Low'}
            </span>

            <p>
              Confidence:
              {' '}
              {confidence(prediction.diseaseScore)}
            </p>

          </div>

        </div>

      )}

    </div>

  </div>
);
}