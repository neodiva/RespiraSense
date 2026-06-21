import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/auth/login', { email, password })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('name', res.data.name)

      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.brand}>
          <div style={styles.pulse}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polyline
                points="2,14 7,14 9,6 12,22 15,10 18,18 21,14 26,14"
                stroke="#00d4ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <div>
            <h1 style={styles.title}>RespiraSense</h1>
            <p style={styles.subtitle}>Patient Monitoring Portal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@hospital.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={styles.btn}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '13px',
              marginBottom: '10px',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#00d4ff',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Create Account
            </Link>
          </p>

          <p style={styles.footer}>
            IEEE EMBS · Team MEDTECH
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'radial-gradient(ellipse at 50% 0%, #0d1f3c 0%, #0a0e1a 70%)',
  },

  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 0 60px #00d4ff10',
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '32px',
  },

  pulse: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#00d4ff15',
    border: '1px solid #00d4ff30',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#e2e8f0',
    letterSpacing: '-0.3px',
  },

  subtitle: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  input: {
    background: '#0a0e1a',
    border: '1px solid #1e2d45',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  error: {
    color: '#ef4444',
    fontSize: '13px',
    background: '#ef444415',
    border: '1px solid #ef444430',
    borderRadius: '6px',
    padding: '8px 12px',
  },

  btn: {
    marginTop: '8px',
    background: '#00d4ff',
    color: '#0a0e1a',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'opacity 0.2s',
    cursor: 'pointer',
  },

  footer: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#334155',
  },
}