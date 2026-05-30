import { useState } from 'react'

const PASSCODE = import.meta.env.VITE_PASSCODE || 'LOLA2026'

export default function LoginGate({ onSuccess }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please tell us your name.')
      return
    }
    if (!code.trim()) {
      setError('Enter the secret code, darling.')
      return
    }

    setLoading(true)
    setError('')

    // Small artificial delay for dramatic effect
    await new Promise(r => setTimeout(r, 600))

    if (code.trim().toUpperCase() === PASSCODE.toUpperCase()) {
      // Glitch flash transition
      const overlay = document.getElementById('flash-overlay')
      if (overlay) {
        overlay.style.opacity = '1'
        overlay.style.background = '#00FF41'
        setTimeout(() => {
          overlay.style.transition = 'opacity 0.8s'
          overlay.style.opacity = '0'
        }, 150)
      }
      setTimeout(() => onSuccess(name.trim()), 200)
    } else {
      setError('WRONG CODE. Try again.')
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }
    setLoading(false)
  }

  return (
    <div id="login-gate">
      <div
        className="ticket-stub"
        style={{
          animation: shaking ? 'shake 0.4s ease' : 'none'
        }}
      >
        <div className="ticket-header">
          <span>🎟</span>
          <span>BACKSTAGE PASS</span>
        </div>

        {/* Perforated divider */}
        <div className="ticket-divider">
          <div className="ticket-perforations" aria-hidden="true">
            <div className="perf-circle" />
            <div className="perf-circle" />
          </div>
        </div>

        <div className="ticket-body">
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            color: '#666',
            marginBottom: '24px',
            textTransform: 'uppercase'
          }}>
            All-Access · Lola's Birthday · 2026
          </p>

          <form onSubmit={handleSubmit}>
            <div className="ticket-field">
              <label htmlFor="login-name">Name</label>
              <input
                id="login-name"
                type="text"
                placeholder="Who are you?"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={50}
                autoComplete="off"
              />
            </div>

            <div className="ticket-field">
              <label htmlFor="login-code">Secret Code</label>
              <input
                id="login-code"
                type="text"
                placeholder="••••••••"
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={20}
                autoComplete="off"
              />
            </div>

            <p className="ticket-error" role="alert" aria-live="polite">
              {error}
            </p>

            <button
              id="login-submit"
              type="submit"
              className="ticket-submit"
              disabled={loading}
            >
              {loading ? 'CHECKING...' : '[ ENTER THE PIT ]'}
            </button>
          </form>

          <p style={{
            marginTop: '16px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            color: '#bbb',
            letterSpacing: '0.1em',
            textAlign: 'center'
          }}>
            VIP ONLY · STRICTLY NO BORING PEOPLE
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%  { transform: translateX(-8px); }
          40%  { transform: translateX(8px); }
          60%  { transform: translateX(-6px); }
          80%  { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
