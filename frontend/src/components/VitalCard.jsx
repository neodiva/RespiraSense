export default function VitalCard({ label, value, unit, status }) {
  const colors = {
    LOW:    { accent: '#10b981', bg: '#10b98115', border: '#10b98130' },
    MEDIUM: { accent: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b30' },
    HIGH:   { accent: '#ef4444', bg: '#ef444415', border: '#ef444430' },
    NORMAL: { accent: '#00d4ff', bg: '#00d4ff15', border: '#00d4ff30' },
  }
  const c = colors[status] || colors.NORMAL

  return (
    <div style={{ ...styles.card, background: c.bg, border: `1px solid ${c.border}` }}>
      <div style={styles.top}>
        <span style={styles.label}>{label}</span>
        <span style={{ ...styles.dot, background: c.accent, boxShadow: `0 0 8px ${c.accent}` }} />
      </div>
      <div style={styles.valueRow}>
        <span style={{ ...styles.value, color: c.accent }}>{value ?? '—'}</span>
        <span style={styles.unit}>{unit}</span>
      </div>
      <div style={{ ...styles.status, color: c.accent }}>{status || 'WAITING'}</div>
    </div>
  )
}

const styles = {
  card: {
    borderRadius: '12px',
    padding: '20px',
    flex: '1 1 160px',
    minWidth: '160px',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '6px',
  },
  value: {
    fontSize: '36px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1,
  },
  unit: {
    fontSize: '13px',
    color: '#64748b',
  },
  status: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
}
