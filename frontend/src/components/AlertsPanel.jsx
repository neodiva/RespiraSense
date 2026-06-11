import api from '../api'

export default function AlertsPanel({ alerts, onResolve }) {
  async function resolve(id) {
    try {
      await api.patch(`/alerts/${id}/resolve`)
      onResolve(id)
    } catch (e) {
      console.error(e)
    }
  }

  const levelColor = {
    HIGH:   '#ef4444',
    MEDIUM: '#f59e0b',
    LOW:    '#10b981',
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        Active Alerts
        {alerts.length > 0 && <span style={styles.badge}>{alerts.length}</span>}
      </h3>
      {alerts.length === 0 ? (
        <p style={styles.empty}>No active alerts — all vitals normal.</p>
      ) : (
        <div style={styles.list}>
          {alerts.map(a => (
            <div key={a._id} style={{ ...styles.item, borderLeft: `3px solid ${levelColor[a.risk_level] || '#64748b'}` }}>
              <div style={styles.itemTop}>
                <span style={{ ...styles.level, color: levelColor[a.risk_level] }}>{a.risk_level}</span>
                <span style={styles.time}>{new Date(a.timestamp).toLocaleTimeString()}</span>
              </div>
              <p style={styles.msg}>{a.message}</p>
              <div style={styles.meta}>
                <span style={styles.pid}>Patient: {a.patient_id}</span>
                <button onClick={() => resolve(a._id)} style={styles.resolveBtn}>
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    background: '#ef4444',
    color: 'white',
    borderRadius: '10px',
    padding: '1px 7px',
    fontSize: '11px',
    fontWeight: '700',
  },
  empty: {
    color: '#334155',
    fontSize: '13px',
    textAlign: 'center',
    padding: '24px 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  item: {
    background: '#0a0e1a',
    borderRadius: '8px',
    padding: '12px 14px',
  },
  itemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  level: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  time: {
    fontSize: '11px',
    color: '#475569',
  },
  msg: {
    fontSize: '13px',
    color: '#cbd5e1',
    marginBottom: '8px',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pid: {
    fontSize: '11px',
    color: '#475569',
  },
  resolveBtn: {
    background: 'transparent',
    border: '1px solid #1e2d45',
    borderRadius: '4px',
    color: '#64748b',
    padding: '3px 8px',
    fontSize: '11px',
    transition: 'all 0.2s',
  },
}
