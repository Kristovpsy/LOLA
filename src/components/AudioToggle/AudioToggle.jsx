import { useState, useRef, useEffect } from 'react'

const CassetteIcon = ({ playing }) => (
  <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cassette body */}
    <rect x="4" y="8" width="56" height="32" rx="3" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none"/>
    {/* Label area */}
    <rect x="12" y="14" width="40" height="16" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Left reel */}
    <circle cx="22" cy="22" r="6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"
      style={{
        transformOrigin: '22px 22px',
        animation: playing ? 'spin 1.2s linear infinite' : 'none'
      }}
    />
    <circle cx="22" cy="22" r="2" fill="rgba(255,255,255,0.4)" />
    {/* Right reel */}
    <circle cx="42" cy="22" r="6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"
      style={{
        transformOrigin: '42px 22px',
        animation: playing ? 'spin 1.8s linear infinite reverse' : 'none'
      }}
    />
    <circle cx="42" cy="22" r="2" fill="rgba(255,255,255,0.4)" />
    {/* Tape window */}
    <path d="M28 22 Q32 26 36 22" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
    {/* Bottom holes */}
    <rect x="14" y="34" width="8" height="4" rx="1" fill="rgba(255,255,255,0.15)"/>
    <rect x="42" y="34" width="8" height="4" rx="1" fill="rgba(255,255,255,0.15)"/>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </svg>
)

export default function AudioToggle() {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const readyRef = useRef(false)

  // Create the audio element once on mount (no autoplay)
  useEffect(() => {
    const audio = new Audio('/audio/ambient-loop.mp3')
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.6
    audioRef.current = audio

    const onCanPlay = () => { readyRef.current = true }
    const onError = () => {
      console.warn('[AudioToggle] Could not load ambient-loop.mp3')
    }

    audio.addEventListener('canplay', onCanPlay, { once: true })
    audio.addEventListener('error', onError, { once: true })

    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (!playing) {
      // Play — the user clicked, so browser will allow it
      audio.play().then(() => {
        setPlaying(true)
      }).catch(err => {
        console.warn('[AudioToggle] Playback failed:', err)
      })
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <div id="audio-toggle">
      <div className={`eq-bars ${playing ? '' : 'paused'}`} aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="eq-bar" style={{ height: playing ? undefined : '4px' }} />
        ))}
      </div>

      <button
        id="audio-toggle-btn"
        className="cassette-btn"
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause' : 'Play ambient track'}
      >
        <CassetteIcon playing={playing} />
      </button>
    </div>
  )
}
