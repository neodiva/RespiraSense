import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor'
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/auth/register', form)
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            style={styles.input}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="doctor">Doctor</option>
            <option value="caregiver">Caregiver</option>
            <option value="patient">Patient</option>
          </select>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button style={styles.btn} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: 20 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#0a0e1a"
  },
  card: {
    width: 400,
    background: "#111827",
    padding: 30,
    borderRadius: 12
  },
  title: {
    color: "white",
    marginBottom: 20
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #333",
    background: "#0a0e1a",
    color: "white"
  },
  btn: {
    padding: 12,
    border: "none",
    background: "#00d4ff",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer"
  }
}