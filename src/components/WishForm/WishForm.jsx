import { useState, useRef } from 'react'

const MAX_CHARS = 280

export default function WishForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const stampRef = useRef(null)

  const charsLeft = MAX_CHARS - message.length
  const isNearLimit = charsLeft < 40

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      setError('Both fields needed, babe.')
      return
    }
    setError('')
    setSubmitting(true)

    // Stamp animation
    if (stampRef.current) {
      stampRef.current.style.transform = 'scale(1.2) rotate(-3deg)'
      setTimeout(() => {
        if (stampRef.current) stampRef.current.style.transform = ''
      }, 300)
    }

    const result = await onSubmit({ name: name.trim(), message: message.trim() })

    if (result?.success) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setName('')
        setMessage('')
      }, 3000)
    } else {
      setError('Failed to send. Try again!')
    }
    setSubmitting(false)
  }

  return (
    <div className="wish-form-panel">
      <h2>Leave Your Mark</h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
        Words for Lola. Make them count.
      </p>

      {submitted ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          fontFamily: 'var(--font-display)', fontSize: '2rem',
          color: 'var(--era1-primary)', textShadow: '0 0 20px var(--era1-primary)',
          letterSpacing: '0.1em', animation: 'preloaderPulse 1s infinite'
        }}>
          DROPPED! 🖤
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="ticket-field" style={{ marginBottom: '16px' }}>
            <label htmlFor="wish-name" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              Your Name
            </label>
            <input
              id="wish-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
              placeholder="Who's speaking?"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', padding: '8px 0', fontFamily: 'var(--font-body)',
                fontSize: '0.95rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <textarea
              id="wish-message"
              className="wish-textarea"
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Happy birthday Lola, you absolute legend..."
              rows={5}
            />
            <div className={`wish-char-counter ${isNearLimit ? 'near-limit' : ''}`}>
              {charsLeft} / {MAX_CHARS}
            </div>
          </div>

          {error && (
            <p role="alert" style={{ color: '#C0152A', fontFamily: 'var(--font-body)', fontSize: '0.75rem', letterSpacing: '0.1em', marginTop: '8px' }}>
              {error}
            </p>
          )}

          <button
            id="wish-submit-btn"
            ref={stampRef}
            type="submit"
            className="wish-submit-btn"
            disabled={submitting}
            style={{ width: '100%', transition: 'all 0.2s, transform 0.15s' }}
          >
            <span>{submitting ? 'DROPPING...' : '[ DROP IT ]'}</span>
          </button>
        </form>
      )}
    </div>
  )
}
