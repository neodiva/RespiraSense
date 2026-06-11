import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function VitalsChart({ data }) {
  const formatted = data.map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    SpO2: r.spo2,
    HR:   r.heart_rate,
    RR:   r.respiration_rate,
  }))

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Vitals History</h3>
      {data.length === 0 ? (
        <p style={styles.empty}>No readings yet — data will appear here once the device sends readings.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            <Line type="monotone" dataKey="SpO2" stroke="#00d4ff" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="HR"   stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="RR"   stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '12px',
    padding: '20px',
  },
  title: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '16px',
  },
  empty: {
    color: '#334155',
    fontSize: '13px',
    textAlign: 'center',
    padding: '40px 0',
  },
}
