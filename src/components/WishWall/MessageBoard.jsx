import { useEffect, useRef } from 'react'

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function MessageBoard({ wishes }) {
  const bottomRef = useRef(null)

  // Auto-scroll when new wishes arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [wishes.length])

  if (!wishes.length) {
    return (
      <div className="message-board">
        <div className="message-board-empty">
          <span className="message-board-empty-icon">💌</span>
          <p>No messages yet — be the first to leave one!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="message-board">
      <div className="message-board-scroll">
        {wishes.map((wish, i) => (
          <div
            key={wish.id}
            className="message-card"
            style={{ animationDelay: `${Math.min(i * 0.06, 1.2)}s` }}
          >
            <div className="message-card-header">
              <span className="message-card-avatar">
                {(wish.name || 'A').charAt(0).toUpperCase()}
              </span>
              <span className="message-card-name">{wish.name || 'Anonymous'}</span>
              <span className="message-card-time">{formatTime(wish.timestamp)}</span>
            </div>
            <p className="message-card-text">{wish.message}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
