import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import socket from '../socket'
import VitalCard from '../components/VitalCard'
import VitalsChart from '../components/VitalsChart'
import AlertsPanel from '../components/AlertsPanel'

export default function Dashboard() {
  const [patientId, setPatientId] = useState('P001')
  const [latest, setLatest] = useState(null)
  const [readings, setReadings] = useState([])
  const [alerts, setAlerts] = useState([])
  const [connected, setConnected] = useState(false)

  const navigate = useNavigate()

  const name = localStorage.getItem('name') || 'User'
  const role = localStorage.getItem('role') || 'doctor'

  // Load data when patient changes
  useEffect(() => {
    async function fetchData() {
      try {
        const [rRes, aRes] = await Promise.all([
          api.get(`/readings/history?patient_id=${patientId}&range=24h`),
          api.get(`/alerts?patient_id=${patientId}&resolved=false`)
        ])

        setReadings(rRes.data)
        setAlerts(aRes.data)

        if (rRes.data.length > 0) {
          setLatest(rRes.data[rRes.data.length - 1])
        } else {
          setLatest(null)
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      }
    }

    fetchData()
  }, [patientId])

  // Socket.IO live updates
  useEffect(() => {
    socket.connect()

    const handleConnect = () => {
      setConnected(true)
    }

    const handleDisconnect = () => {
      setConnected(false)
    }

    const handleNewReading = (reading) => {
      if (reading.patient_id !== patientId) return

      setLatest(reading)

      setReadings(prev => [
        ...prev.slice(-99),
        reading
      ])
    }

    const handleNewAlert = (alert) => {
      if (alert.patient_id !== patientId) return

      setAlerts(prev => [
        alert,
        ...prev
      ])
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('new_reading', handleNewReading)
    socket.on('new_alert', handleNewAlert)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('new_reading', handleNewReading)
      socket.off('new_alert', handleNewAlert)
      socket.disconnect()
    }
  }, [patientId])

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const getSpo2Status = (v) => {
    if (!v) return 'NORMAL'
    if (v < 90) return 'HIGH'
    if (v < 94) return 'MEDIUM'
    return 'LOW'
  }

  const getHrStatus = (v) => {
    if (!v) return 'NORMAL'
    if (v > 120 || v < 50) return 'HIGH'
    if (v > 100 || v < 60) return 'MEDIUM'
    return 'LOW'
  }

  const getRrStatus = (v) => {
    if (!v) return 'NORMAL'
    if (v > 25 || v < 8) return 'HIGH'
    if (v > 20 || v < 12) return 'MEDIUM'
    return 'LOW'
  }

  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <polyline
              points="2,14 7,14 9,6 12,22 15,10 18,18 21,14 26,14"
              stroke="#00d4ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          <span style={styles.brandName}>
            RespiraSense
          </span>
        </div>

        <div style={styles.headerCenter}>
          <label style={styles.pidLabel}>
            Patient ID
          </label>

          <input
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            style={styles.pidInput}
          />
        </div>

        <div style={styles.headerRight}>
          <div
            style={{
              ...styles.liveChip,
              background: connected
                ? '#10b98115'
                : '#ef444415',
              border: `1px solid ${
                connected
                  ? '#10b98130'
                  : '#ef444430'
              }`,
              color: connected
                ? '#10b981'
                : '#ef4444'
            }}
          >
            <span
              style={{
                ...styles.liveDot,
                background: connected
                  ? '#10b981'
                  : '#ef4444'
              }}
            />

            {connected ? 'Live' : 'Offline'}
          </div>

          <span style={styles.userName}>
            {name} · {role}
          </span>

          <button
            onClick={() => navigate('/predict')}
            style={styles.predictBtn}
          >
            Predictor
          </button>

          <button
            onClick={logout}
            style={styles.logoutBtn}
          >
            Sign out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.vitalsRow}>
          <VitalCard
            label="SpO₂"
            value={latest?.spo2}
            unit="%"
            status={getSpo2Status(latest?.spo2)}
          />

          <VitalCard
            label="Heart Rate"
            value={latest?.heart_rate}
            unit="BPM"
            status={getHrStatus(latest?.heart_rate)}
          />

          <VitalCard
            label="Respiration"
            value={latest?.respiration_rate}
            unit="br/min"
            status={getRrStatus(latest?.respiration_rate)}
          />

          <VitalCard
            label="Risk Level"
            value={latest?.risk_level || '—'}
            unit=""
            status={latest?.risk_level || 'NORMAL'}
          />
        </div>

        {latest && (
          <p style={styles.lastUpdated}>
            Last reading:{' '}
            {new Date(
              latest.timestamp
            ).toLocaleString()}
          </p>
        )}

        {latest?.ml_prediction && (
          <div style={styles.mlPanel}>
            <h3 style={styles.mlTitle}>🧠 Neural Network Analysis (Live ESP32 Feed)</h3>
            <div style={styles.mlGrid}>
              <div style={styles.mlCard}>
                <div style={styles.mlLabel}>Heart Rate Bound</div>
                <div style={{...styles.mlValue, color: latest.ml_prediction.hrAbnormal ? '#ff4757' : '#00ffaa'}}>
                  {latest.ml_prediction.hrAbnormal ? 'ABNORMAL' : 'NORMAL'}
                </div>
                <div style={styles.mlScore}>Confidence: {(latest.ml_prediction.hrScore * 100).toFixed(1)}%</div>
              </div>
              
              <div style={styles.mlCard}>
                <div style={styles.mlLabel}>SpO₂ Bound</div>
                <div style={{...styles.mlValue, color: latest.ml_prediction.spo2Abnormal ? '#ff4757' : '#00ffaa'}}>
                  {latest.ml_prediction.spo2Abnormal ? 'ABNORMAL' : 'NORMAL'}
                </div>
                <div style={styles.mlScore}>Confidence: {(latest.ml_prediction.spo2Score * 100).toFixed(1)}%</div>
              </div>

              <div style={styles.mlCard}>
                <div style={styles.mlLabel}>Disease Detection</div>
                <div style={{...styles.mlValue, color: latest.ml_prediction.disease ? '#ff4757' : '#00ffaa'}}>
                  {latest.ml_prediction.disease ? 'DETECTED' : 'CLEAR'}
                </div>
                <div style={styles.mlScore}>Confidence: {(latest.ml_prediction.diseaseScore * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.bottomRow}>
          <div style={{ flex: 2 }}>
            <VitalsChart data={readings} />
          </div>

          <div style={{ flex: 1 }}>
            <AlertsPanel
              alerts={alerts}
              onResolve={(id) =>
                setAlerts(prev =>
                  prev.filter(
                    alert => alert._id !== id
                  )
                )
              }
            />
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0a0e1a'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '60px',
    background: '#111827',
    borderBottom: '1px solid #1e2d45',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    gap: '16px'
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  brandName: {
    fontWeight: '700',
    fontSize: '15px',
    letterSpacing: '-0.3px'
  },

  headerCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },

  pidLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  pidInput: {
    background: '#0a0e1a',
    border: '1px solid #1e2d45',
    borderRadius: '6px',
    padding: '5px 10px',
    color: '#e2e8f0',
    fontSize: '13px',
    width: '90px',
    fontFamily: "'JetBrains Mono', monospace",
    outline: 'none'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  liveChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },

  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%'
  },

  userName: {
    fontSize: '12px',
    color: '#64748b'
  },

  logoutBtn: {
    background: 'transparent',
    border: '1px solid #1e2d45',
    borderRadius: '6px',
    color: '#64748b',
    padding: '5px 10px',
    fontSize: '12px',
    cursor: 'pointer'
  },

  predictBtn: {
    background: 'linear-gradient(90deg, #00ffaa, #00a2ff)',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0e1a',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },

  main: {
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto'
  },

  vitalsRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },

  lastUpdated: {
    fontSize: '11px',
    color: '#334155',
    marginTop: '-8px'
  },

  bottomRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },

  mlPanel: {
    background: 'rgba(0, 255, 170, 0.05)',
    border: '1px solid rgba(0, 255, 170, 0.2)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '10px',
    marginBottom: '10px'
  },

  mlTitle: {
    margin: '0 0 16px 0',
    color: '#00ffaa',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },

  mlGrid: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },

  mlCard: {
    flex: 1,
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '12px',
    borderRadius: '8px',
    minWidth: '200px'
  },

  mlLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: '8px'
  },

  mlValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },

  mlScore: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)'
  }
}