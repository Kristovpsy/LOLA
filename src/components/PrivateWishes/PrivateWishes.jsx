import { useState, useEffect } from 'react'
import { useWishes } from '../../hooks/useWishes'

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PrivateWishes() {
  const { wishes, loading } = useWishes()
  const [authed, setAuthed] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleUnlock = (e) => {
    e.preventDefault()
    // Use a separate private passcode — defaults to "LOLAPRIVATE" if not set
    const privateCode = import.meta.env.VITE_PRIVATE_PASSCODE || 'LOLAPRIVATE'
    if (code.trim().toUpperCase() === privateCode.toUpperCase()) {
      setAuthed(true)
      setError('')
    } else {
      setError('Wrong code, love. Try again.')
    }
  }

  if (!authed) {
    return (
      <div className="private-gate">
        <div className="private-gate-card">
          <div className="private-gate-icon">💌</div>
          <h1>Lola's Private Messages</h1>
          <p>This page is just for you. Enter your secret code to read your messages.</p>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter private code..."
              autoFocus
            />
            {error && <div className="private-gate-error">{error}</div>}
            <button type="submit">UNLOCK 🔓</button>
          </form>
          <a href="#/" className="private-gate-back">← Back to main site</a>
        </div>
      </div>
    )
  }

  return (
    <div className="private-wishes">
      <header className="private-wishes-header">
        <a href="#/" className="private-back-link">← Back</a>
        <h1>Your Messages 💌</h1>
        <p>{wishes.length} message{wishes.length !== 1 ? 's' : ''} from your people</p>
      </header>

      <div className="private-wishes-grid">
        {loading ? (
          <div className="private-loading">Loading your messages...</div>
        ) : wishes.length === 0 ? (
          <div className="private-empty">No messages yet — they're coming! 🖤</div>
        ) : (
          wishes.slice().reverse().map((wish) => (
            <div key={wish.id} className="private-wish-card">
              <div className="private-wish-card-top">
                <span className="private-wish-avatar">
                  {(wish.name || 'A').charAt(0).toUpperCase()}
                </span>
                <div>
                  <div className="private-wish-name">{wish.name || 'Anonymous'}</div>
                  <div className="private-wish-date">{formatDate(wish.timestamp)}</div>
                </div>
              </div>
              <p className="private-wish-message">{wish.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
